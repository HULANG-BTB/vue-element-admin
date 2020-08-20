<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true" size="small" style="margin-top:10px;">
      <el-form-item label="部门编码" prop="keyword">
        <el-input
          v-model="queryParams.keyword"
          placeholder="请输入部门编码"
          clearable
          style="width: 140px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="部门名称" prop="keyword">
        <el-input
          v-model="queryParams.keyword"
          placeholder="请输入部门名称"
          clearable
          style="width: 140px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否启用">
        <el-select v-model="queryParams.isenable" placeholder="请选择部门状态" style="width: 150px">
          <el-option label="启用" value="success" />
          <el-option label="停用" value="stop" />
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
        >新增部门</el-button>
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
      <el-table-column align="center" label="部门编码" prop="deptCode" />
      <el-table-column align="center" label="部门名称" prop="deptName" :show-overflow-tooltip="true" />
      <el-table-column align="center" label="联系人" prop="linkMan" />
      <el-table-column align="center" label="联系电话" prop="linkTel" />
      <el-table-column align="center" label="经办人" prop="operator" />
      <el-table-column align="center" label="经办日期" prop="updateTime">
        <template slot-scope="scope">
          {{ parseTime(scope.row.updateTime) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否启用" prop="isenable">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isenable ? 'success' : 'info'"
            disable-transitions
          >{{ scope.row.isenable ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
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

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'部门变动':'新增部门'">
      <el-form ref="project" :model="project" :rules="rules" label-width="80px" label-position="right" style="padding-right:25px;">
        <el-form-item label="部门编码" :label-width="formLabelWidth" prop="deptCode">
          <el-input v-model="project.deptCode" placeholder="部门编码" />
        </el-form-item>
        <el-form-item label="部门名称" :label-width="formLabelWidth" prop="deptName">
          <el-input v-model="project.deptName" placeholder="部门名称" />
        </el-form-item>
        <el-form-item label="联系人" :label-width="formLabelWidth">
          <el-input v-model="project.linkMan" placeholder="联系人" />
        </el-form-item>
        <el-form-item label="联系电话" :label-width="formLabelWidth">
          <el-input v-model="project.linkTel" placeholder="联系电话" />
        </el-form-item>
        <el-form-item label="经办人" :label-width="formLabelWidth" prop="operator">
          <el-input v-model="project.operator" placeholder="经办人" />
        </el-form-item>
        <el-form-item label="经办日期" :label-width="formLabelWidth" prop="createTime">
          <el-date-picker v-model="project.createTime" type="date" placeholder="选择日期" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="是否启用" :label-width="formLabelWidth" prop="isenable">
          <el-select v-model="project.isenable" placeholder="选择是否启用">
            <el-option label="启用" :value="true" />
            <el-option label="停用" :value="false" />
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirmRole">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDapartListByPage, addDapart, updateDapart, deleteDapart, deleteDapartBatch } from '@/api/unitManager'
import { parseTime } from '@/utils/index'
import { validateDatePicker } from '@/utils/validate'

const defaultUser = {
  isenable: true,
  deptCode: '',
  deptName: '',
  linkMan: '',
  linkTel: '',
  operator: '',
  updateTime: '',
  createTime: '',
  note: '',
  rgnId: '12',
  logicDelete: false,
  addr: '',
  alterCode: '',
  operatorId: '',
  version: 1
}

export default {
  data () {
    return {
    //   loading: true,
      queryParams: { // 查询参数
        // deptCode: '',
        // deptName: '',
        // isEnable: '',
        keyword: '',
        page: 1,
        limit: 10
        // total: 0
      },
      projectList: [],
      project: {
        id: 1,
        deptCode: '',
        deptName: '',
        linkMan: '',
        linkTel: '',
        operator: '',
        updateTime: '',
        createTime: '',
        isenable: true,
        note: '',
        rgnId: '',
        logicDelete: false,
        addr: '',
        alterCode: '',
        operatorId: '',
        version: 1
      },
      dialogVisible: false,
      dialogType: 'new',
      formLabelWidth: '100px',
      selectedList: [],
      rules: {
        deptCode: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' }
        ],
        deptName: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' }
        ],
        operator: [
          { required: true, message: '经办人不能为空', trigger: 'blur' }
        ],
        operatorId: [
          { required: true, message: '经办人ID不能为空', trigger: 'blur' }
        ],
        createTime: [
          { trigger: 'blur', validator: validateDatePicker }
        ],
        version: [
          { required: true, message: '版本不能为空', trigger: 'blur' }
        ],
        isenable: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
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
    // parseTime (time, format) {
    //   return parseTime(time, '{y}-{m}-{d}')
    // },
    // 格式化时间
    parseTime (time) {
      return parseTime(new Date())
    },
    // 获取资源列表
    async getTableData () {
      // this.loading = true
      const res = await getDapartListByPage(this.queryParams)
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
      // this.queryParams = {}
      this.queryParams.keyword = ''
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
      this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        deleteDapart(deleData.id)
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
        deleteDapartBatch(this.selectedids).then((res) => {
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
            await addDapart(this.project).then(res => {
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
            await updateDapart(this.project).then(res => {
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
