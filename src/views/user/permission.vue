<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAdd">New Permission</el-button>
    <el-button :disabled="deleteBatchDisable" type="danger" @click="handleDeleteBatch">Delete Batch</el-button>

    <el-table
      :data="permissionList"
      style="width: 100%; margin-top:30px;"
      border
      @selection-change="handleOnSelectChange"
    >
      <el-table-column type="selection" align="center" width="55" />
      <el-table-column align="center" label="Permission id" width="120">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column align="center" label="Permission Name" width="220">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column align="center" label="Request Method" width="220">
        <template slot-scope="scope">
          <el-button
            :style="requestMethodStyle(scope.row.method)"
            type="text"
            size="mini"
          >{{ scope.row.method }}</el-button>
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="Request Url">
        <template slot-scope="scope">{{ scope.row.url }}</template>
      </el-table-column>
      <el-table-column align="center" label="Operations" width="220">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope)">Edit</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType==='edit'?'Edit Permission':'New Permission'"
    >
      <el-form :model="permission" label-width="120px" label-position="left">
        <el-form-item label="父级权限">
          <el-select
            v-model="permission.pid"
            size="medium"
            filterable
            style="width: 100%"
            clearable
            placeholder="Request Method"
          >
            <el-option
              v-for="(item, index) in permissionSelectList"
              :key="index"
              :label="item.name"
              :value="item.id"
            >
              <span>{{ item.name }}</span>
              <span style="margin-left: 1.5rem; color: #8492a6; font-size: 13px">{{ item.url }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="permission.name" placeholder="Permission Name" />
        </el-form-item>
        <el-form-item label="方式">
          <el-select
            v-model="permission.method"
            size="medium"
            filterable
            style="width: 100%"
            placeholder="Request Method"
          >
            <el-option
              v-for="(item, index) in requestMethod"
              :key="index"
              :label="item"
              :value="item"
            >
              <el-button :style="requestMethodStyle(item)" type="text" size="mini">{{ item }}</el-button>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Url">
          <el-input v-model="permission.url" placeholder="Request Url" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">Cancel</el-button>
        <el-button type="primary" @click="confirmPermission">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { getPermissionList, addPermission, updatePermission, deletePermission } from '@/api/permission'

const defaultPermission = {
  id: null,
  pid: 0,
  name: '',
  url: '',
  method: 'ALL'
}

export default {
  data () {
    return {
      permissionList: [],
      selectedList: [],
      dialogVisible: false,
      dialogType: 'new',
      permission: {},
      requestMethod: [
        'GET',
        'POST',
        'PUT',
        'DELETE',
        'ALL'
      ]
    }
  },
  computed: {
    permissionSelectList () {
      const selectList = deepClone(this.permissionList)
      const defaultItem = { ...defaultPermission }
      defaultItem.id = 0
      defaultItem.name = 'root'
      defaultItem.url = ''
      selectList.unshift(defaultItem)
      return selectList
    },

    deleteBatchDisable () {
      return this.selectedList.length === 0
    }
  },
  created () {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList () {
      const res = await getPermissionList()
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

    // 点击添加
    handleAdd () {
      this.dialogVisible = true
      this.dialogType = 'new'
      this.permission = deepClone(defaultPermission)
    },

    // 点击编辑
    handleEdit (scope) {
      this.dialogVisible = true
      this.dialogType = 'edit'
      this.permission = deepClone(scope.row)
    },

    // 点击删除
    handleDelete ({ $index, row }) {
      this.$confirm('Confirm to remove the role?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async () => {
          deletePermission(row.id).then(res => {
            this.permissionList.splice($index, 1)
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

    // 提交数据
    async confirmPermission () {
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        await updatePermission(this.permission)
      } else {
        await addPermission(this.permission).then(res => {
          this.permissionList.push(this.permission)
        })
      }
      const { method, name, url } = this.permission
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>Method: ${method}</div>
            <div>Name: ${name}</div>
            <div>Url: ${url}</div>
          `,
        type: 'success'
      })
      // 更新数据列表
      await this.getPermissionList()
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
  .permissions-table {
    margin-top: 30px;
  }
}
</style>
