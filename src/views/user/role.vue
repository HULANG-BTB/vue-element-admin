<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">New Role</el-button>
    <el-button :disabled="deleteBatchDisable" type="danger" @click="handleDeleteBatch">Delete Batch</el-button>

    <el-table
      :data="rolesList"
      style="width: 100%;margin-top:30px;"
      border
      @selection-change="handleOnSelectChange"
    >
      <el-table-column type="selection" align="center" width="55" />
      <el-table-column align="left" label="Role Key" width="220">
        <template slot-scope="scope">{{ scope.row.role }}</template>
      </el-table-column>
      <el-table-column align="center" label="Role Name" width="220">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column align="header-center" label="Description">
        <template slot-scope="scope">{{ scope.row.description }}</template>
      </el-table-column>
      <el-table-column align="center" label="Operations" width="220">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope)">Edit</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'Edit Role':'New Role'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="Key">
          <el-input v-model="role.role" placeholder="Role Name" />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="role.name" placeholder="Role Name" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="role.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="Role Description"
          />
        </el-form-item>
        <el-form-item label="权限">
          <el-tree
            ref="tree"
            accordion
            :data="permissionList"
            :props="defaultProps"
            show-checkbox
            node-key="id"
            :default-checked-keys="role.permissions"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span>{{ node.label }}</span>
              <el-button
                v-if="data.method"
                :style="requestMethodStyle(data.method)"
                type="text"
                size="mini"
              >{{ data.method }}</el-button>
              <span v-if="data.url" style="margin-left:1rem">{{ data.url }}</span>
            </span>
          </el-tree>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">Cancel</el-button>
        <el-button type="primary" @click="confirmRole">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { addRole, getRoleList, updateRole, deleteRole } from '@/api/role'
import { getPermissionTreeList } from '@/api/permission'

const defaultRole = {
  id: '',
  role: '',
  name: '',
  description: '',
  permissions: null
}

export default {
  data () {
    return {
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      permissionList: [],
      selectedList: [],
      dialogVisible: false,
      dialogType: 'new',
      defaultProps: {
        children: 'children',
        label: 'name'
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
    this.getRoleList()
    this.getPermissionList()
  },
  methods: {

    // 获取角色列表
    async getRoleList () {
      const res = await getRoleList()
      this.rolesList = res.data
      this.selectedList = []
    },

    // 获取权限列表
    async getPermissionList () {
      const res = await getPermissionTreeList()
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

    handleAddRole () {
      this.role = Object.assign({}, defaultRole)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit (scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.role = deepClone(scope.row)
    },
    handleDelete ({ $index, row }) {
      this.$confirm('Confirm to remove the role?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async () => {
          deleteRole(row.id).then(res => {
            this.rolesList.splice($index, 1)
            this.$message({
              type: 'success',
              message: 'Delete succed!'
            })
          })
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: 'Delete failed!'
          })
          console.error(err)
        })
    },

    async confirmRole () {
      const isEdit = this.dialogType === 'edit'

      const checkedNodes = this.$refs.tree.getCheckedNodes(true)
      this.role.permissions = checkedNodes
      if (isEdit) {
        await updateRole(this.role)
      } else {
        await addRole(this.role).then(res => {
          this.rolesList.push(this.role)
        })
      }
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
      await this.getRoleList()
    },

    // 批量删除
    handleDeleteBatch () {
      this.$confirm('Confirm to remove the role?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async () => {
          // deleteRole(row.id).then(res => {
          //   this.rolesList.splice($index, 1)
          //   this.$message({
          //     type: 'success',
          //     message: 'Delete succed!'
          //   })
          // })
        })
    },

    handleOnSelectChange (selection) {
      this.selectedList = selection
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
