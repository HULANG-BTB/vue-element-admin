<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true" size="small" style="margin-top:10px;">
      <el-form-item label="部门编码" prop="deptCode">
        <el-input
          v-model="queryParams.deptCode"
          placeholder="请输入部门编码"
          clearable
          style="width: 140px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="部门名称" prop="useType">
        <el-input
          v-model="queryParams.useType"
          placeholder="请输入部门名称"
          clearable
          style="width: 140px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否启用">
        <el-select v-model="queryParams.isEnable" placeholder="请选择部门状态" style="width: 150px">
          <el-option label="启用" value="doing" />
          <el-option label="停用" value="success" />
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
          <el-button slot="trigger" size="small" type="warning" icon="el-icon-check" @click="submitUpload">导入</el-button>
        </el-upload>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-message"
          size="small"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table :data="projectList" style="width: 100%;margin-top:30px;" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column align="center" label="部门编码" prop="deptCode" />
      <el-table-column align="center" label="部门名称" prop="deptName" :show-overflow-tooltip="true" />
      <el-table-column align="center" label="联系人" prop="linkMan" />
      <el-table-column align="center" label="联系电话" prop="linkTel" />
      <el-table-column align="center" label="经办人" prop="operator" />
      <el-table-column align="center" label="经办日期" prop="updateTime" />
      <el-table-column align="center" label="是否启用" prop="isEnable">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isEnable ? 'success' : 'info'"
            disable-transitions
          >{{ scope.row.isEnable ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="220">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope)">删除</el-button>
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
        <el-form-item label="部门名称" :label-width="formLabelWidth">
          <el-input v-model="project.deptName" placeholder="部门名称" />
        </el-form-item>
        <el-form-item label="联系人" :label-width="formLabelWidth" prop="deptName">
          <el-input v-model="project.linkMan" placeholder="联系人" />
        </el-form-item>
        <el-form-item label="联系电话" :label-width="formLabelWidth">
          <!-- <el-input v-model="project.linkTel" placeholder="失效日期" /> -->
          <el-input v-model="project.linkTel" placeholder="联系电话" />
        </el-form-item>
        <el-form-item label="经办人" :label-width="formLabelWidth" prop="mnen">
          <el-input v-model="project.operator" placeholder="经办人" />
        </el-form-item>
        <el-form-item label="经办日期" :label-width="formLabelWidth">
          <el-date-picker v-model="project.updateTime" type="date" placeholder="选择日期" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="是否启用" :label-width="formLabelWidth" prop="incomeSortCode">
          <!-- <el-input v-model="project.incomeSortCode" placeholder="收入类别" /> -->
          <el-select v-model="project.isEnable" placeholder="选择是否启用">
            <el-option label="直缴" value="直缴" />
            <el-option label="汇缴" value="汇缴" />
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
// import { listRole, addRole, updateRole } from '@/api/projectManager'

const defaultUser = {
  isEnable: '',
  deptCode: '',
  deptName: '',
  linkMan: '',
  linkTel: '',
  operator: ''
}

export default {
  data () {
    return {
    //   loading: true,
      queryParams: { // 查询参数
        deptCode: '',
        deptName: '',
        isEnable: '',
        page: 1,
        limit: 10,
        total: 0
      },
      projectList: [
        {
          isEnable: 1,
          deptCode: '1',
          deptName: '江西省财政厅',
          linkMan: '张珊',
          linkTel: '15224700207',
          operator: '系统管理员',
          updateTime: '2020-02-01'
        },
        {
          isEnable: 1,
          deptCode: '2',
          deptName: '江西省财政厅',
          linkMan: '张珊',
          linkTel: '15224700207',
          operator: '系统管理员',
          updateTime: '2020-02-01'
        },
        {
          isEnable: 1,
          deptCode: '3',
          deptName: '江西省财政厅',
          linkMan: '张珊',
          linkTel: '15224700207',
          operator: '系统管理员',
          updateTime: '2020-02-01'
        },
        {
          isEnable: 1,
          deptCode: '4',
          deptName: '江西省财政厅',
          linkMan: '张珊',
          linkTel: '15224700207',
          operator: '系统管理员',
          updateTime: '2020-02-01'
        }
      ],
      project: {},
      dialogVisible: false,
      dialogType: 'new',
      formLabelWidth: '100px',
      // multiple: true, // 非多个禁用
      // pagesize: 5,
      // currpage: 1,
      fileList: [],
      rules: {
        deptCode: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' }
        ],
        deptName: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' }
        ],
        mnen: [
          { required: true, message: '助记码不能为空', trigger: 'blur' }
        ],
        incomeSortCode: [
          { required: true, message: '收入类别不能为空', trigger: 'blur' }
        ],
        operator: [
          { required: true, message: '资金性质不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    // 获取资源列表
    async getTableData () {
      // this.loading = true
      // const res = await listRole(this.queryParams)
      // this.projectList = res.data.items
      // this.queryParams.total = res.data.total
      // this.queryParams.limit = res.data.limit
      // this.queryParams.page = res.data.page
      // this.selectedList = []
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
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.selectedList = selection
      // this.ids = selection.map(item => item.deptName)
      // console.log(this.ids)
      // this.single = selection.length !== 1
      // this.multiple = !selection.length
    },
    // 新增按钮
    handleAdd () {
      this.user = Object.assign({}, defaultUser)
      this.dialogType !== 'edit'
      this.dialogVisible = true
    },
    // 编辑按钮
    handleEdit (rowData) {
      this.dialogVisible = true
      this.dialogType = 'edit'
      this.project = Object.assign({}, rowData)
      // const { data } = await getOtherItem(rowData.id) // 模态框中需要的其他接口
      // this.project.roles = data
    },
    // 删除按钮
    handleDelete ({ $index, row }) {
      this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // deleteUser(row.id)
        //   .then((res) => {
        //     this.$message({
        //       type: 'success',
        //       message: '删除成功!'
        //     })
        //     this.getTableData()
        //   })
        //   .catch((err) => {
        //     this.$message({
        //       type: 'error',
        //       message: '删除失败!'
        //     })
        //     console.error(err)
        //   })
      })
    },
    // 批量删除
    async handleMultDelete () {
      this.$confirm('此操作将永久删除选中部门, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // deleteUserBatch(this.selectedList).then((res) => {
        //   this.$message({
        //     type: 'success',
        //     message: '删除成功!'
        //   })
        //   this.getTableData()
        // })
      })
    },
    // 模态框提交
    async confirmRole () {
    //   this.$refs['project'].validate(valid => {
    //     if (valid) {
    //       if (this.dialogType !== 'edit') { // 新增
    //         addRole(this.role).then(res => {
    //           this.role = res.data
    //           console.log(this.role)
    //           if (res.code === 200) {
    //             this.$set(this.role, {})
    //             this.getTableData() // 重新渲染数据列表
    //             this.dialogVisible = false // 关闭模态框
    //             // this.msgSuccess(res.message)
    //             this.$message({
    //               showClose: true,
    //               message: '添加成功',
    //               type: 'success'
    //             })
    //           } else {
    //             this.$message({
    //               showClose: true,
    //               message: '添加失败',
    //               type: 'error'
    //             }) // 或者弹出后台返回错误
    //           }
    //         })
    //       } else { // 变动
    //         this.role = {
    //           id: this.row.id,
    //           name: this.row.name
    //         }
    //         updateRole(this.role.id, this.role).then(res => {
    //           this.msgSuccess(res.message)
    //           this.getTableData()
    //           this.dialogVisible = false
    //         })
    //       }
    //     }
    //   })
    },
    // 模态框取消
    cancel () {
      this.dialogVisible = false
      this.resetForm('project')
    },
    // 分页
    // handleCurrentChange (cpage) {
    //   // userList.slice((currpage - 1) * pagesize, currpage * pagesize)
    //   this.currpage = cpage
    // },
    // handleSizeChange (psize) {
    //   this.pagesize = psize
    // }
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
