<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true" size="small" style="margin-top:10px;">
      <el-form-item label="单位用途" prop="typeCode">
        <el-select v-model="queryParams.typeCode" placeholder="请选择单位用途" style="width: 150px">
          <el-option label="非税收入" value="非税收入" />
          <el-option label="医疗项目" value="医疗项目" />
          <el-option label="其他项目" value="其他项目" />
        </el-select>
      </el-form-item>
      <el-form-item label="单位分类" prop="sortCode">
        <el-select v-model="queryParams.sortCode" placeholder="请选择单位分类" style="width: 150px">
          <el-option label="非税收入" value="非税收入" />
          <el-option label="医疗项目" value="医疗项目" />
          <el-option label="其他项目" value="其他项目" />
        </el-select>
      </el-form-item>
      <el-form-item label="单位名称" prop="agenName">
        <el-input
          v-model="queryParams.agenName"
          placeholder="请输入单位名称"
          clearable
          style="width: 140px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="isEnable">
        <el-select v-model="queryParams.isEnable" placeholder="请选择单位状态" style="width: 150px">
          <el-option label="待审核" value="doing" />
          <el-option label="已完成" value="success" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="handleAdd"
        >新增单位</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          :disabled="deleteBatchDisable"
          icon="el-icon-delete"
          size="small"
          @click="handleMultDelete"
        >批量删除</el-button>
      </el-col>
    </el-row>

    <el-table :data="projectList" style="width: 100%;margin-top:30px;" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column align="center" label="状态" prop="isEnable">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isEnable ? 'success' : 'info'"
            disable-transitions
          >{{ scope.row.isEnable ? '已完成' : '待审核' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="单位编码" prop="agenIdcode" />
      <el-table-column align="center" label="单位名称" prop="agenName" :show-overflow-tooltip="true" />
      <el-table-column align="center" label="部门名称" prop="deptName" />
      <el-table-column align="center" label="单位用途" prop="typeCode" />
      <el-table-column align="center" label="单位分类" prop="sortCode" />
      <el-table-column align="center" label="操作" width="220">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="margin-top:20px;float:right;margin-right:20px;"
      center
      background
      margin-top="10"
      layout="prev, pager, next, sizes, total, jumper"
      :page-sizes="[10,20,50,100]"
      :page-size="queryParams.limit"
      :total="queryParams.total"
      :current-page="queryParams.page"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'单位变动':'新增单位'">
      <el-form ref="project" :model="project" :rules="rules" label-width="80px" label-position="right" style="padding-right:25px;">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="单位编码" :label-width="formLabelWidth" prop="itemCode">
              <el-input v-model="project.itemCode" placeholder="单位编码" />
            </el-form-item>
            <el-form-item label="生效日期" :label-width="formLabelWidth">
              <el-date-picker v-model="project.itemEffdate" type="date" placeholder="选择日期" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目名称" :label-width="formLabelWidth" prop="itemName">
              <el-input v-model="project.itemName" placeholder="项目名称" />
            </el-form-item>
            <el-form-item label="失效日期" :label-width="formLabelWidth">
              <el-date-picker v-model="project.itemExpdate" type="date" placeholder="选择日期" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirmRole">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { listRole, addRole, updateRole } from '@/api/projectManager'
// import { getUnitListByPage } from '@/api/unitManager'
import { getUnitListByPage, addUnit, updateUnit, deleteUnit, deleteUnitBatch } from '@/api/unitManager'
// const defaultUser = {
//   note: '11',
//   finMgr: '1',
//   isalarmAgen: true,
//   cityId: '1',
//   linkTel: '1',
//   linkMan: '1',
//   expDate: 1597155373000,
//   operator: '1',
//   pidCode: '20',
//   effDate: 1597068970000,
//   orgCode: '20',
//   countyId: '1',
//   addr: '1',
//   finMgrTel: '1',
//   operatorId: 1,
//   zip: '1',
//   rgnId: 'aujdanjlsn',
//   logicDelete: true,
//   level: 2,
//   agenCode: '112233',
//   indCode: '2',
//   updateTime: 1597933074000,
//   sortCode: '2',
//   provinceId: '1',
//   version: 11,
//   typeCode: '2',
//   isenable: false,
//   istickAgen: true,
//   createTime: 1596550670000,
//   agenName: '单位名',
//   mnem: '1122',
//   isleaf: false,
//   deptCode: 'Ajanxsbxibs',
//   findeptId: 2,
//   isunpaid: true
// }

export default {
  data () {
    return {
    //   loading: true,
      queryParams: { // 查询参数
        // typeCode: '',
        // sortCode: '',
        // agenName: '',
        // isEnable: '',
        keyword: '',
        page: 1,
        limit: 10
        // total: 0
      },
      projectList: [
        {
          isEnable: 1,
          agenIdcode: '1',
          deptName: '江西省研究院',
          agenName: '江西省卫生厅',
          typeCode: '非税票据单位',
          sortCode: '事业'
        }
      ],
      project: {
        note: '11',
        finMgr: '1',
        isalarmAgen: true,
        cityId: '1',
        linkTel: '1',
        linkMan: '1',
        expDate: 1597155373000,
        operator: '1',
        pidCode: '20',
        effDate: 1597068970000,
        orgCode: '20',
        countyId: '1',
        addr: '1',
        finMgrTel: '1',
        operatorId: 1,
        zip: '1',
        rgnId: 'aujdanjlsn',
        logicDelete: true,
        level: 2,
        agenCode: '112233',
        indCode: '2',
        updateTime: 1597933074000,
        sortCode: '2',
        provinceId: '1',
        version: 11,
        typeCode: '2',
        isenable: false,
        istickAgen: true,
        createTime: 1596550670000,
        agenName: '单位名',
        mnem: '1122',
        isleaf: false,
        deptCode: 'Ajanxsbxibs',
        findeptId: 2,
        isunpaid: true
      },
      dialogVisible: false,
      dialogType: 'new',
      formLabelWidth: '100px',
      selectedList: [],
      // multiple: true, // 非多个禁用
      rules: {
        itemCode: [
          { required: true, message: '项目编码不能为空', trigger: 'blur' }
        ],
        itemName: [
          { required: true, message: '项目名称不能为空', trigger: 'blur' }
        ],
        mnen: [
          { required: true, message: '助记码不能为空', trigger: 'blur' }
        ],
        incomeSortCode: [
          { required: true, message: '收入类别不能为空', trigger: 'blur' }
        ],
        fundsnatureCode: [
          { required: true, message: '资金性质不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    deleteBatchDisable () {
      return this.selectedList.length === 0
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    // 获取资源列表
    async getTableData () {
      // this.loading = true
      const res = await getUnitListByPage(this.queryParams)
      this.projectList = res.data.items
      this.queryParams.total = res.data.total
      this.queryParams.limit = res.data.limit
      this.queryParams.page = res.data.page
      this.selectedList = []
      // this.loading = false
    },
    // 搜索
    handleQuery () {
      this.queryParams.page = 1
      this.getTableData()
    },
    // 表单重置封装
    resetForm (refName) {
      if (this.$refs[refName]) {
        this.$refs[refName].resetFields()
      }
    },
    // 重置
    resetQuery () {
      // this.resetForm('queryParams')
      this.queryParams = {}
    },
    // 新增按钮
    handleAdd () {
      this.project = Object.assign({}, this.project)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    // 编辑按钮
    handleEdit (rowData) {
      this.dialogVisible = true
      this.dialogType = 'edit'
      this.project = Object.assign({}, rowData)
    },
    // 删除按钮
    handleDelete (deleData) {
      this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        deleteUnit(deleData.id)
          .then((res) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getTableData()
          })
          .catch((err) => {
            this.$message({
              type: 'error',
              message: '删除失败!'
            })
            console.error(err)
          })
      })
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.selectedList = selection
    },
    // 批量删除
    async handleMultDelete () {
      this.$confirm('此操作将永久删除选中部门, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.selectedids = this.selectedList.map(item => {
          return { id: item.id }
        })
        deleteUnitBatch(this.selectedids).then((res) => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getTableData()
        })
      })
    },
    // 模态框提交
    async confirmRole () {
      this.$refs['project'].validate(async (valid) => {
        if (valid) {
          if (this.dialogType !== 'edit') { // 新增
            await addUnit(this.project).then(res => {
              this.$set(this.project, {})
              this.getTableData()
              this.dialogVisible = false
              // if (res.status === 200) {
              this.$message({
                showClose: true,
                message: '添加成功',
                type: 'success'
              })
              // } else {
              //   this.$message({
              //     showClose: true,
              //     message: '添加失败',
              //     type: 'error'
              //   })
              // }
            })
          } else { // 编辑
            await updateUnit(this.project).then(res => {
              this.getTableData()
              this.dialogVisible = false
              if (res.status === 200) {
              // this.$set(this.project, {})
                this.$message({
                  showClose: true,
                  message: '编辑成功',
                  type: 'success'
                })
              } else {
                this.$message({
                  showClose: true,
                  message: '编辑失败',
                  type: 'error'
                }) // 或者弹出后台返回错误
              }
            })
          }
        }
      })
    },
    // 模态框取消
    cancel () {
      this.dialogVisible = false
      this.resetForm('project')
    },
    // 分页，每页数目改变
    handleSizeChange (val) {
      this.queryParams.limit = val
      this.getTableData()
    },
    // 当前页码改变
    handleCurrentChange (val) {
      this.queryParams.page = val
      this.getTableData()
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
