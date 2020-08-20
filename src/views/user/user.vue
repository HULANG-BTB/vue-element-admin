<<<<<<< HEAD
<template>
  <div class="app-container">
    <el-form
      :model="query"
      :inline="true"
      class="demo-form-inline"
      @keyup.enter.native="handleSearch"
    >
      <el-form-item label="搜索用户：">
        <el-input
          v-model="query.keyword"
          placeholder="请输入用户ID或用户名"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label>
        <el-button
          icon="el-icon-search"
          size="small"
          @click="handleSearch"
        >搜索</el-button>
      </el-form-item>
      <el-form-item label>
        <el-button
          type="primary"
          size="small"
          @click="handleAdd"
        >创建用户</el-button>
      </el-form-item>
      <el-form-item label>
        <el-button
          :disabled="deleteBatchDisable"
          type="danger"
          size="small"
          @click="handleDeleteBatch"
        >批量删除</el-button>
      </el-form-item>
      <el-form-item label>
        <el-button
          type="success"
          size="small"
          @click="getTableData"
        >重载数据</el-button>
      </el-form-item>
    </el-form>

    <el-pagination
      background
      layout="prev, pager, next, sizes, total, jumper"
      :total="query.total"
      :current-page="query.page"
      :page-sizes="[10, 20, 50, 100, 500, 1000]"
      :page-size="query.limit"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-table
      v-loading.body="loading"
      :data="userTableData"
      style="width: 100%; margin-top: 30px;"
      border
      @selection-change="handleOnSelectChange"
    >
      <el-table-column
        type="selection"
        align="center"
        width="55"
      />
      <el-table-column
        align="left"
        label="用户Id"
        width="280"
      >
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="用户名"
        width="220"
      >
        <template slot-scope="scope">{{ scope.row.username }}</template>
      </el-table-column>
      <el-table-column
        align="header-center"
        label="昵称"
      >
        <template slot-scope="scope">{{ scope.row.nickname }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="Operations"
        width="260"
      >
        <template slot-scope="scope">
          <el-button
            type="success"
            size="mini"
            @click="handleReset(scope)"
          >重置密码</el-button>
          <el-button
            type="primary"
            size="mini"
            @click="handleEdit(scope)"
          >编辑</el-button>
          <el-button
            type="danger"
            size="mini"
            @click="handleDelete(scope)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType === 'edit' ? '编辑用户' : '新建用户'"
    >
      <el-form
        v-loading="dialogLoading"
        :model="user"
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="用户名">
          <el-input
            v-model="user.username"
            placeholder="User Name"
          />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input
            v-model="user.nickname"
            placeholder="Nick Name"
          />
        </el-form-item>
        <el-form-item label="Role">
          <el-select
            v-model="user.roles"
            multiple
            value-key="id"
            placeholder="Please select"
            size="medium"
            style="width: 100%;"
          >
            <el-option
              v-for="(item, index) in roleList"
              :key="index"
              :label="item.name"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align: right;">
        <el-button
          type="danger"
          @click="dialogVisible = false"
        >Cancel</el-button>
        <el-button
          type="primary"
          @click="confirmUser"
        >Confirm</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="resetPasswordDialogVisible"
      title="重置密码"
    >
      <el-form
        :model="user"
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="密码">
          <el-input
            v-model="user.password"
            type="password"
            placeholder="请输入新密码"
          />
        </el-form-item>
        <el-form-item label="重复密码">
          <el-input
            v-model="user.repassword"
            type="password"
            placeholder="请再次输入新密码"
          />
        </el-form-item>
      </el-form>
      <div style="text-align: right;">
        <el-button
          type="danger"
          @click="resetPasswordDialogVisible = false"
        >Cancel</el-button>
        <el-button
          type="primary"
          @click="confirmPasswordReset"
        >Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserListByPage,
  addUser,
  updateUser,
  deleteUser,
  deleteUserBatch,
  resetPassword
} from '@/api/user'
import { getRoleList, getRoleListByUserId } from '@/api/role'

const defaultUser = {
  id: '',
  username: '',
  nickaname: '',
  password: '',
  repassword: '',
  roles: []
}

export default {
  data () {
    return {
      user: {
        id: '',
        username: '',
        nickaname: '',
        password: '',
        repassword: '',
        roles: []
      },
      userTableData: [],
      roleList: [],
      selectedList: [],
      loading: true,
      dialogLoading: false,
      dialogVisible: false,
      resetPasswordDialogVisible: false,
      dialogType: 'new',
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      query: {
        page: 1,
        limit: 10,
        total: 0,
        keyword: ''
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
    this.getRoleList()
  },
  methods: {
    // 获取用户列表
    async getTableData () {
      this.loading = true
      const res = await getUserListByPage(this.query)
      this.userTableData = res.data.items
      this.query.total = res.data.total
      this.query.limit = res.data.limit
      this.query.page = res.data.page
      this.selectedList = []
      this.loading = false
    },

    // 获取角色列表
    async getRoleList (reload) {
      const res = await getRoleList()
      this.roleList = res.data
    },

    handleSearch () {
      this.query.page = 1
      this.getTableData()
    },

    handleAdd () {
      this.user = Object.assign({}, defaultUser)
      this.dialogType = 'new'
      this.dialogVisible = true
    },

    async handleEdit (scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.dialogLoading = true
      this.user = Object.assign(this.user, scope.row)
      const { data } = await getRoleListByUserId(scope.row.id)
      this.user.roles = data
      this.dialogLoading = false
    },

    handleReset (scope) {
      this.resetPasswordDialogVisible = true
      this.user = Object.assign(this.user, scope.row)
      this.user.password = ''
      this.user.repassword = ''
    },

    handleDelete ({ $index, row }) {
      this.$confirm('Confirm to remove the user?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async () => {
        deleteUser(row.id)
          .then((res) => {
            this.$message({
              type: 'success',
              message: 'Delete succed!'
            })
            this.getTableData()
          })
          .catch((err) => {
            this.$message({
              type: 'error',
              message: 'Delete failed!'
            })
            console.error(err)
          })
      })
    },

    async confirmPasswordReset () {
      await resetPassword(this.user).then((res) => {
        const { id, username } = this.user
        this.$notify({
          title: 'Success',
          dangerouslyUseHTMLString: true,
          message: `
            <div>Id: ${id}</div>
            <div>Name: ${username}</div>
          `,
          type: 'success'
        })
      })
      this.resetPasswordDialogVisible = false
    },

    async confirmUser () {
      const isEdit = this.dialogType === 'edit'
      let successFlag = false
      if (isEdit) {
        await updateUser(this.user).then((res) => {
          successFlag = true
        })
      } else {
        await addUser(this.user).then((res) => {
          successFlag = true
        })
      }
      if (successFlag) {
        const { id, username } = this.user
        this.dialogVisible = false
        this.$notify({
          title: 'Success',
          dangerouslyUseHTMLString: true,
          message: `
            <div>User Id: ${id}</div>
            <div>User Name: ${username}</div>
          `,
          type: 'success'
        })
        // 更新数据列表
        await this.getTableData()
      }
    },

    // 批量删除
    async handleDeleteBatch () {
      this.$confirm('Confirm to remove these users?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async () => {
        deleteUserBatch(this.selectedList).then((res) => {
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
          this.getTableData()
        })
      })
    },

    handleOnSelectChange (selection) {
      this.selectedList = selection
    },

    // 每页数目改变
    handleSizeChange (val) {
      this.query.limit = val
      this.getTableData()
    },

    // 当前页码改变
    handleCurrentChange (val) {
      this.query.page = val
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
=======
<template>
  <div class="app-container">
    <el-form :model="query" :inline="true" class="demo-form-inline" @keyup.enter.native="handleSearch">
      <el-form-item label="搜索用户：">
        <el-input v-model="query.keyword" placeholder="请输入用户ID或用户名" clearable size="small" />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" size="small" @click="handleSearch">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh" type="default" size="small" @click="query.keyword = ''">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="small" @click="handleAdd">新增用户</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-delete" size="small" :disabled="deleteBatchDisable" @click="handleDeleteBatch">批量删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" icon="el-icon-refresh" size="small" @click="getTableData">重载数据</el-button>
      </el-col>
    </el-row>

    <el-table v-loading.body="loading" :data="tableData" style="width: 100%; margin-top: 30px;" border @selection-change="handleOnSelectChange">
      <el-table-column type="selection" align="center" width="55" />
      <el-table-column align="center" label="用户Id" width="80">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column align="center" label="用户名" width="220">
        <template slot-scope="scope">{{ scope.row.username }}</template>
      </el-table-column>
      <el-table-column align="header-center" label="昵称">
        <template slot-scope="scope">{{ scope.row.nickname }}</template>
      </el-table-column>
      <el-table-column align="header-center" label="单位">
        <template slot-scope="scope">{{ scope.row.agenCode }}</template>
      </el-table-column>
      <el-table-column align="header-center" label="电话">
        <template slot-scope="scope">{{ scope.row.phone }}</template>
      </el-table-column>
      <el-table-column align="center" label="最后修改" width="170">
        <template slot-scope="scope">{{ parseTime(scope.row.updateTime) }}</template>
      </el-table-column>
      <el-table-column align="header-center" label="操作人">
        <template slot-scope="scope">{{ scope.row.operator }}</template>
      </el-table-column>
      <el-table-column align="center" label="Operations" width="260">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="handleReset(scope)">重置密码</el-button>
          <el-button type="primary" size="mini" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination background layout="prev, pager, next, sizes, total, jumper" style="margin-top:20px;float:right;margin-right:20px;" :total="query.total" :current-page="query.page" :page-sizes="[10, 20, 50, 100, 500, 1000]" :page-size="query.limit" @size-change="handleSizeChange" @current-change="handleCurrentChange" />

    <el-dialog :visible.sync="dialogVisible" :title="dialogType === 'edit' ? '编辑用户' : '新建用户'">
      <el-form ref="userForm" v-loading="dialogLoading" :model="user" label-width="80px" label-position="right" :rules="rules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="user.username" placeholder="User Name" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="user.nickname" placeholder="Nick Name" />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-select v-model="user.agenCode" placeholder="请选择" style="width: 100%">
            <el-option v-for="(item, index) in unitList" :key="index" :label="item.deptName" :value="item.agenCode" />
          </el-select>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="user.phone" placeholder="Phone Number" />
        </el-form-item>
        <el-form-item label="Role" prop="role">
          <el-select v-model="user.roles" multiple value-key="id" placeholder="Please select" size="medium" style="width: 100%;">
            <el-option v-for="(item, index) in roleList" :key="index" :label="item.name" :value="item" />
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align: right;">
        <el-button type="danger" @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" :loading="confirmLoading" @click="confirmUser">Confirm</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="resetPasswordDialogVisible" title="重置密码">
      <el-form :model="user" label-width="80px" label-position="right" :rules="rules">
        <el-form-item label="密码" prop="password">
          <el-input v-model="user.password" type="password" placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="重复密码" prop="repassword">
          <el-input v-model="user.repassword" type="password" placeholder="请再次输入新密码" />
        </el-form-item>
      </el-form>
      <div style="text-align: right;">
        <el-button type="danger" @click="resetPasswordDialogVisible = false">Cancel</el-button>
        <el-button type="primary" :loading="confirmLoading" @click="confirmPasswordReset">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserListByPage,
  addUser,
  updateUser,
  deleteUser,
  deleteUserBatch,
  resetPassword
} from '@/api/user'
import { getRoleList, getRoleListByUserId } from '@/api/role'
import { getUnitList } from '@/api/unitManager'
import { parseTime, deepClone } from '@/utils/index'
import { validatePhoneNumber } from '@/utils/validate'

const defaultUser = {
  id: '',
  username: '',
  nickname: '',
  password: '',
  repassword: '',
  agenCode: '',
  phone: '',
  roles: []
}

export default {
  data () {
    const validateRePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.user.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      user: {
        id: '',
        username: '',
        nickname: '',
        password: '',
        repassword: '',
        agenCode: '',
        phone: '',
        roles: []
      },
      userList: [],
      roleList: [],
      unitList: [],
      selectedList: [],
      loading: true,
      confirmLoading: false,
      dialogLoading: false,
      dialogVisible: false,
      rules: {
        username: [
          { required: true, message: '用户名不能为空!', trigger: 'blur' },
          { min: 5, max: 20, message: '用户名长度在5-20之间', trigger: 'blur' }
        ],
        nickname: [
          { require: true, message: '用户昵称不能为空!', trigger: 'blur' },
          { min: 2, max: 10, message: '昵称长度在2-10之间', trigger: 'blur' }
        ],
        unit: [
          { require: true, message: '单位不能为空!', trigger: 'blur' }
        ],
        phone: [
          { require: true, trigger: 'change', validator: validatePhoneNumber }
        ],
        role: [
          { require: true, message: '单位不能为空!', trigger: 'blur' }
        ],
        password: [
          { require: true, message: '密码不能为空！', trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度在6-15之间！', trigger: 'change' }
        ],
        repassword: [
          { require: true, message: '密码不能为空！', trigger: 'change' },
          { validator: validateRePassword, trigger: 'change' }
        ]
      },
      resetPasswordDialogVisible: false,
      dialogType: 'new',
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      query: {
        page: 1,
        limit: 10,
        total: 0,
        keyword: ''
      }
    }
  },
  computed: {
    deleteBatchDisable () {
      return this.selectedList.length === 0
    },

    tableData () {
      const data = deepClone(this.userList)
      data.forEach((element) => {
        element.agenCode = this.computedUnit(element.agenCode)
      })
      return data
    }
  },

  created () {
    this.getUnitList()
    this.getTableData()
    this.getRoleList()
  },

  methods: {
    // 获取用户列表
    async getTableData () {
      this.loading = true
      const res = await getUserListByPage(this.query)
      this.userList = res.data.items
      this.query.total = res.data.total
      this.query.limit = res.data.limit
      this.query.page = res.data.page
      this.selectedList = []
      this.loading = false
    },

    // 获取角色列表
    async getRoleList () {
      const res = await getRoleList()
      this.roleList = res.data
    },

    // 获取单位列表
    async getUnitList () {
      const { data } = await getUnitList()
      this.unitList = data
    },

    // 根据单位编码获得单位名
    computedUnit (agenCode) {
      const unit = this.unitList.filter((val) => val.agenCode === agenCode)
      // 避免数据计算的时候单位列表还未加载完成
      if (unit === undefined || unit.length === 0) {
        return ''
      }
      return unit[0].deptName
    },

    handleSearch () {
      this.query.page = 1
      this.getTableData()
    },

    handleAdd () {
      this.user = Object.assign({}, defaultUser)
      this.dialogType = 'new'
      this.dialogVisible = true
    },

    async handleEdit (scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.dialogLoading = true
      this.user = Object.assign(this.user, scope.row)
      const { data } = await getRoleListByUserId(scope.row.id)
      this.user.roles = data
      this.dialogLoading = false
    },

    handleReset (scope) {
      this.resetPasswordDialogVisible = true
      this.user = Object.assign(this.user, scope.row)
      this.user.password = ''
      this.user.repassword = ''
    },

    handleDelete ({ $index, row }) {
      this.$confirm('Confirm to remove the user?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async () => {
        deleteUser(row.id)
          .then((res) => {
            this.$message({
              type: 'success',
              message: 'Delete succed!'
            })
            this.getTableData()
          })
          .catch((err) => {
            this.$message({
              type: 'error',
              message: 'Delete failed!'
            })
            console.error(err)
          })
      })
    },

    async confirmPasswordReset () {
      this.confirmLoading = true
      await resetPassword(this.user).then((res) => {
        const { id, username } = this.user
        this.$notify({
          title: 'Success',
          dangerouslyUseHTMLString: true,
          message: `
            <div>Id: ${id}</div>
            <div>Name: ${username}</div>
          `,
          type: 'success'
        })
      })
      this.confirmLoading = false
      this.resetPasswordDialogVisible = false
    },

    async confirmUser () {
      this.$refs.userForm.validate(async valid => {
        if (valid) {
          const isEdit = this.dialogType === 'edit'
          let successFlag = false
          this.confirmLoading = true
          if (isEdit) {
            await updateUser(this.user).then((res) => {
              successFlag = true
            })
          } else {
            await addUser(this.user).then((res) => {
              successFlag = true
            })
          }
          this.confirmLoading = false
          if (successFlag) {
            const { id, username } = this.user
            this.dialogVisible = false
            this.$notify({
              title: 'Success',
              dangerouslyUseHTMLString: true,
              message: `
            <div>User Id: ${id}</div>
            <div>User Name: ${username}</div>
          `,
              type: 'success'
            })
            // 更新数据列表
            await this.getTableData()
          }
        }
      })
    },

    // 批量删除
    async handleDeleteBatch () {
      this.$confirm('Confirm to remove these users?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async () => {
        deleteUserBatch(this.selectedList).then((res) => {
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
          this.getTableData()
        })
      })
    },

    handleOnSelectChange (selection) {
      this.selectedList = selection
    },

    // 每页数目改变
    handleSizeChange (val) {
      this.query.limit = val
      this.getTableData()
    },

    // 当前页码改变
    handleCurrentChange (val) {
      this.query.page = val
      this.getTableData()
    },

    // 格式化时间
    parseTime (time) {
      return parseTime(new Date())
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
>>>>>>> 5f06ecde094555497a882281c07f1a5a18fb518f
