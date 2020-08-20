<template>
  <div class="app-container">
    <el-form :model="query" :inline="true" class="demo-form-inline" @keyup.enter.native="handleSearch">
      <el-form-item label="搜索角色：">
        <el-input v-model="query.keyword" placeholder="请输入角色名或角色Key" clearable size="small" />
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
        <el-button type="primary" icon="el-icon-plus" size="small" @click="handleAdd">新增角色</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-delete" size="small" :disabled="deleteBatchDisable" @click="handleDeleteBatch">批量删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" icon="el-icon-refresh" size="small" @click="getTableData">重载数据</el-button>
      </el-col>
    </el-row>

    <el-table v-loading.body="loading" :data="roleTableData" style="width: 100%;margin-top:30px;" border @selection-change="handleOnSelectChange">
      <el-table-column type="selection" align="center" width="55" />
      <el-table-column align="left" label="角色Key" width="220">
        <template slot-scope="scope">{{ scope.row.role }}</template>
      </el-table-column>
      <el-table-column align="center" label="角色名称" width="220">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column align="center" label="最后修改" width="170">
        <template slot-scope="scope">{{ parseTime(scope.row.updateTime) }}</template>
      </el-table-column>
      <el-table-column align="header-center" label="操作人">
        <template slot-scope="scope">{{ scope.row.operator }}</template>
      </el-table-column>
      <el-table-column align="header-center" label="描述">
        <template slot-scope="scope">{{ scope.row.description }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="220">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination background layout="prev, pager, next, sizes, total, jumper" style="margin-top:20px;float:right;margin-right:20px;" :total="query.total" :current-page="query.page" :page-sizes="[10, 20, 50, 100, 500, 1000]" :page-size="query.limit" @size-change="handleSizeChange" @current-change="handleCurrentChange" />

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑角色':'新建角色'">
      <el-form ref="roleForm" v-loading="dialogLoading" :model="role" label-width="80px" label-position="right" :rules="rules">
        <el-form-item label="Key" prop="role">
          <el-input v-model="role.role" placeholder="角色 Key" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="role.name" placeholder="角色名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="role.description" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Role Description" />
        </el-form-item>
        <el-form-item label="权限">
          <el-tree ref="tree" accordion :data="permissionList" :props="defaultProps" show-checkbox node-key="id" :default-checked-keys="role.permissions">
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span>{{ node.label }}</span>
              <el-button v-if="data.method" :style="requestMethodStyle(data.method)" type="text" size="mini">{{ data.method }}</el-button>
              <span v-if="data.url" style="margin-left:1rem">{{ data.url }}</span>
            </span>
          </el-tree>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">Cancel</el-button>
        <el-button type="primary" :loading="confirmLoading" @click="confirmRole">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import {
  addRole,
  getRoleListByPage,
  updateRole,
  deleteRole,
  deleteRoleBatch
} from '@/api/role'
import { getPermissionListByTree, getPermissionByRid } from '@/api/permission'
import { parseTime } from '@/utils/index'

const defaultRole = {
  id: '',
  role: '',
  name: '',
  description: '',
  permissions: []
}

export default {
  data () {
    return {
      role: Object.assign({}, defaultRole),
      routes: [],
      roleTableData: [],
      permissionList: [],
      selectedList: [],
      loading: true,
      confirmLoading: false,
      dialogLoading: false,
      dialogVisible: false,
      rules: {
        role: [
          { required: true, message: '角色Key不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      },
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
    // Mock: get all routes and roles list from server
    this.getTableData()
    this.getPermissionList()
  },
  methods: {
    // 获取角色列表
    async getTableData () {
      this.loading = true
      const res = await getRoleListByPage(this.query)
      this.roleTableData = res.data.items
      this.query.total = res.data.total
      this.query.limit = res.data.limit
      this.query.page = res.data.page
      this.selectedList = []
      this.loading = false
    },

    // 获取权限列表
    async getPermissionList () {
      const res = await getPermissionListByTree()
      this.permissionList = res.data
    },

    // 计算请求方式样式
    requestMethodStyle (method) {
      let bgcolor = ''
      if (method === 'GET') {
        bgcolor = '#61affe'
      } else if (method === 'POST') {
        bgcolor = '#49cc90'
      } else if (method === 'PUT') {
        bgcolor = '#fca130'
      } else if (method === 'DELETE') {
        bgcolor = '#f93e3e'
      } else if (method === 'ALL') {
        bgcolor = '#cc26bf'
      } else {
        bgcolor = 'none'
      }
      return {
        marginLeft: '1.2rem',
        color: 'white',
        width: '4rem',
        backgroundColor: bgcolor,
        padding: '.2rem 0',
        fontWeight: 'bolder'
      }
    },

    handleSearch () {
      this.query.page = 1
      this.getTableData()
    },

    handleAdd () {
      this.role = Object.assign({}, defaultRole)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    async handleEdit (scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.dialogLoading = true
      this.role = deepClone(scope.row)
      const { data } = await getPermissionByRid(scope.row.id)
      this.$refs.tree.setCheckedNodes(data)
      this.dialogLoading = false
    },
    handleDelete ({ $index, row }) {
      this.$confirm('Confirm to remove the role?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async () => {
          deleteRole(row.id).then((res) => {
            this.roleTableData.splice($index, 1)
            this.$message({
              type: 'success',
              message: 'Delete succed!'
            })
          })
        })
        .catch((err) => {
          this.$message({
            type: 'error',
            message: 'Delete failed!'
          })
          console.error(err)
        })
    },

    async confirmRole () {
      this.$refs.roleForm.validate(async valid => {
        if (valid) {
          const isEdit = this.dialogType === 'edit'
          this.confirmLoading = true
          const checkedNodes = this.$refs.tree.getCheckedNodes(true)
          this.role.permissions = checkedNodes
          let successFlag = false
          if (isEdit) {
            await updateRole(this.role).then((res) => {
              successFlag = true
            })
          } else {
            await addRole(this.role).then((res) => {
              successFlag = true
            })
          }
          this.confirmLoading = false
          if (successFlag) {
            const { description, role, name } = this.role
            this.dialogVisible = false
            this.$notify({
              title: 'Success',
              dangerouslyUseHTMLString: true,
              message: `
            <div>Role Key: ${role}</div>
            <div>Role Name: ${name}</div>
            <div>Description: ${description}</div>
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
      this.$confirm('Confirm to remove the role?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async () => {
        deleteRoleBatch(this.selectedList).then((res) => {
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
