<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true" size="small" style="margin-top:10px;">
      <el-form-item label="项目名称" prop="keyword">
        <el-input
          v-model="queryParams.keyword"
          placeholder="请输入项目名称"
          clearable
          style="width: 140px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="项目用途" prop="useType">
        <el-select v-model="queryParams.useType" placeholder="请选择项目用途" style="width: 150px">
          <el-option label="非税收入" value="非税收入" />
          <el-option label="医疗项目" value="医疗项目" />
          <el-option label="其他项目" value="其他项目" />
        </el-select>
      </el-form-item>
      <el-form-item label="项目状态" prop="isenable">
        <el-select v-model="queryParams.isenable" placeholder="请选择项目状态" style="width: 150px">
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
        >新增项目</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-message"
          size="small"
          @click="handleAddStand"
        >新增标准</el-button>
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
      <el-col :span="1.5">
        <!-- <el-button
          type="warning"
          icon="el-icon-check"
          size="small"
        >导入</el-button> -->
        <el-upload
          ref="upload"
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
        >
          <el-button slot="trigger" size="small" type="success" icon="el-icon-check" @click="submitUpload">导入</el-button>
        </el-upload>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-message"
          size="small"
        >导出</el-button>
      </el-col> -->
    </el-row>

    <el-table :data="projectList" style="width: 100%;margin-top:30px;" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column align="center" label="状态" prop="isenable">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isenable ? 'success' : 'info'"
            disable-transitions
          >{{ scope.row.isenable ? '已完成' : '待审核' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="项目编码" prop="itemId" />
      <el-table-column align="center" label="项目名称" prop="itemName" :show-overflow-tooltip="true" />
      <el-table-column align="center" label="项目生效日期" prop="itemEffdate">
        <template slot-scope="scope">
          {{ parseTime(scope.row.itemEffdate) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="项目失效日期" prop="itemExpdate">
        <template slot-scope="scope">
          {{ parseTime(scope.row.itemExpdate) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="资金性质" prop="fundsnatureCode" />
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

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'项目变动':'新增项目'">
      <el-form ref="project" :model="project" :rules="rules" label-width="80px" label-position="right" style="padding-right:25px;">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="区划id" :label-width="formLabelWidth" prop="rgnId">
              <el-input v-model="project.rgnId" placeholder="区划id" />
            </el-form-item>
            <el-form-item label="项目分类编码" :label-width="formLabelWidth" prop="itemSortId">
              <el-input v-model="project.itemSortId" placeholder="项目分类编码" />
            </el-form-item>
            <el-form-item label="项目生效日期" :label-width="formLabelWidth" prop="itemEffdate">
              <el-date-picker v-model="project.itemEffdate" type="date" placeholder="选择日期" style="width: 100%;" />
            </el-form-item>
            <el-form-item label="记录生效日期" :label-width="formLabelWidth" prop="effdate">
              <el-date-picker v-model="project.effdate" type="date" placeholder="选择日期" style="width: 100%;" />
            </el-form-item>
            <el-form-item label="收入类别" :label-width="formLabelWidth" prop="incomSortCode ">
              <!-- <el-input v-model="project.incomSortCode" placeholder="收入类别" /> -->
              <el-select v-model="project.incomSortCode " placeholder="根据实际情况选择">
                <el-option label="直缴" value="直缴" />
                <el-option label="汇缴" value="汇缴" />
                <el-option label="代缴" value="代缴" />
              </el-select>
            </el-form-item>
            <el-form-item label="收缴方式" :label-width="formLabelWidth">
              <el-select v-model="project.paymode" placeholder="请选择收缴方式">
                <el-option label="直缴" value="直缴" />
                <el-option label="汇缴" value="汇缴" />
                <el-option label="代缴" value="代缴" />
              </el-select>
            </el-form-item>
            <el-form-item label="资金性质" :label-width="formLabelWidth" prop="fundsnatureCode">
              <!-- <el-input v-model="project.fundsnatureCode" placeholder="资金性质" /> -->
              <el-select v-model="project.fundsnatureCode" placeholder="根据实际情况选择">
                <el-option label="直缴" value="直缴" />
                <el-option label="汇缴" value="汇缴" />
                <el-option label="代缴" value="代缴" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目编码" :label-width="formLabelWidth" prop="itemId">
              <el-input v-model="project.itemId" placeholder="项目编码" />
            </el-form-item>
            <el-form-item label="项目名称" :label-width="formLabelWidth" prop="itemName">
              <el-input v-model="project.itemName" placeholder="项目名称" />
            </el-form-item>
            <el-form-item label="项目失效日期" :label-width="formLabelWidth" prop="itemExpdate">
              <el-date-picker v-model="project.itemExpdate" type="date" placeholder="选择日期" style="width: 100%;" />
            </el-form-item>
            <el-form-item label="记录截止日期" :label-width="formLabelWidth" prop="expdate">
              <el-date-picker v-model="project.expdate" type="date" placeholder="选择日期" style="width: 100%;" />
            </el-form-item>
            <el-form-item label="助记码" :label-width="formLabelWidth" prop="mnen">
              <el-input v-model="project.mnen" placeholder="助记码" />
            </el-form-item>
            <el-form-item label="预算科目" :label-width="formLabelWidth">
              <el-input v-model="project.subject" placeholder="根据实际情况填写" />
            </el-form-item>
            <el-form-item label="备注" :label-width="formLabelWidth">
              <el-input v-model="project.note" placeholder="备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirmRole">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisibleTow" :title="dialogTypeTow">
      <el-form :model="standard" label-width="80px" label-position="right" style="padding-right:25px;">
        <el-form-item label="标准编码" :label-width="formLabelWidth">
          <el-input v-model="standard.itemstdCode" placeholder="标准编码" />
        </el-form-item>
        <el-form-item label="标准名称" :label-width="formLabelWidth">
          <el-input v-model="standard.itemstdName" placeholder="标准名称" />
        </el-form-item>
        <el-form-item label="助记码" :label-width="formLabelWidth">
          <el-input v-model="standard.mnem" placeholder="助记码" />
        </el-form-item>
        <el-form-item label="标准上限" :label-width="formLabelWidth">
          <el-input v-model="standard.maxCharge" placeholder="标准上限" />
        </el-form-item>
        <el-form-item label="标准下限" :label-width="formLabelWidth">
          <el-input v-model="standard.minCharge" placeholder="标准下限" />
        </el-form-item>
        <el-form-item label="计量单位" :label-width="formLabelWidth">
          <el-input v-model="standard.units" placeholder="计量单位" />
        </el-form-item>
        <el-form-item label="生效日期" :label-width="formLabelWidth">
          <el-date-picker v-model="standard.itemstdEffdate" type="date" placeholder="选择日期" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="失效日期" :label-width="formLabelWidth" prop="itemstdExpdate">
          <el-date-picker v-model="standard.itemstdExpdate" type="date" placeholder="选择日期" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="standard.note" placeholder="备注" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirmStand">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getProjectListByPage, addProject, updateProject, deleteProject, deleteProjectBatch, addStd } from '@/api/projectManager'
import { parseTime } from '@/utils/index'
const defaultUser = {
  // rgnId: '',
  itemId: '',
  itemName: '',
  itemSortId: '',
  itemEffdate: '',
  itemExpdate: '',
  effdate: '',
  expdate: '',
  subject: '',
  // note: '',
  mnen: '',
  incomSortCode: '',
  fundsnatureCode: '',
  paymode: ''
}

export default {
  data () {
    return {
    //   loading: true,
      queryParams: { // 查询参数
        keyword: '',
        // useType: '',
        // isenable: '',
        page: 1,
        limit: 10,
        total: 0
      },
      projectList: [],
      project: {
        id: 1,
        itemId: '',
        itemName: '',
        itemSortId: '',
        itemEffdate: '',
        itemExpdate: '',
        effdate: '',
        expdate: '',
        subject: '',
        // note: '',
        mnen: '',
        incomSortCode: '',
        fundsnatureCode: '',
        paymode: ''
      },
      standard: {
        itemstdCode: '',
        itemstdName: '',
        mnem: '',
        maxCharge: '',
        minCharge: '',
        units: '',
        itemstdEffdate: '',
        itemstdExpdate: '',
        note: '',
        id: '',
        isenable: '',
        itemCode: '',
        operator: '',
        operatorId: '',
        updateTime: '',
        createTime: ''
      },
      dialogVisible: false,
      dialogVisibleTow: false,
      dialogType: '',
      dialogTypeTow: '新增标准',
      formLabelWidth: '100px',
      // multiple: true, // 非多个禁用
      fileList: [],
      selectedList: [],
      selectedids: [],
      rules: {
        itemId: [
          { required: true, message: '项目编码不能为空', trigger: 'blur' }
        ],
        itemName: [
          { required: true, message: '项目名称不能为空', trigger: 'blur' }
        ],
        mnen: [
          { required: true, message: '助记码不能为空', trigger: 'blur' }
        ],
        incomSortCode: [
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
    // 格式化时间
    parseTime (time) {
      return parseTime(new Date())
    },
    // 获取资源列表
    async getTableData () {
      // this.loading = true
      const res = await getProjectListByPage(this.queryParams)
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
    // 上传下载
    submitUpload () {
      this.$refs.upload.submit()
    },
    handleRemove (file, fileList) {
      // console.log(file, fileList)
    },
    handlePreview (file) {
      // console.log(file)
    },
    // 新增按钮
    handleAdd () {
      this.project = Object.assign({}, defaultUser)
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
      this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        deleteProject(deleData.id)
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
    // 批量删除[{"id":2},{"id":3}]
    async handleMultDelete () {
      this.$confirm('此操作将永久删除选中项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: '提示'
      }).then(async () => {
        this.selectedids = this.selectedList.map(item => {
          return { id: item.id }
        })
        deleteProjectBatch(this.selectedids).then((res) => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getTableData()
        })
      })
    },
    // 模态框提交
    confirmRole () {
      this.$refs['project'].validate(async (valid) => {
        if (valid) {
          if (this.dialogType !== 'edit') { // 新增
            await addProject(this.project).then(res => {
              this.$set(this.project, {})
              this.getTableData() // 重新渲染数据列表
              this.dialogVisible = false // 关闭模态框
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
            await updateProject(this.project).then(res => {
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
    // 新增标准按钮
    handleAddStand () {
      this.standard = Object.assign({}, this.standard)
      this.dialogVisibleTow = true
    },
    // 新增标准模态框确定按钮
    async confirmStand () {
      await addStd(this.standard).then(res => {
        this.$set(this.standard, {})
        // this.getTableData()
        this.dialogVisibleTow = false
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
