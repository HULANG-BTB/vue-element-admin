<template>
  <div class="app-container">
    <el-form
      :model="query"
      :inline="true"
      class="demo-form-inline"
      @keyup.enter.native="handleSearch"
    >
      <el-form-item label="搜索权限：">
        <el-input
          v-model="query.keyword"
          placeholder="请输入权限名称或路径"
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
        >创建权限</el-button>
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
      :data="permissionTableData"
      class="permissions-table"
      style="width: 100%; margin-top:30px;"
      border
      @selection-change="handleOnSelectChange"
    >
      <el-table-column
        type="selection"
        align="center"
        width="55"
      />
      <el-table-column
        align="center"
        label="权限ID"
        width="280"
      >
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column
        align="left"
        label="权限名称"
        width="220"
      >
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="请求方式"
        width="220"
      >
        <template slot-scope="scope">
          <el-button
            :style="requestMethodStyle(scope.row.method)"
            type="text"
            size="mini"
          >{{ scope.row.method }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        align="header-center"
        label="请求路径"
      >
        <template slot-scope="scope">{{ scope.row.url }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        width="220"
      >
        <template slot-scope="scope">
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
      :title="dialogType==='edit'?'编辑权限':'新建权限'"
    >
      <el-form
        v-loading="dialogLoading"
        :model="permission"
        label-width="120px"
        label-position="left"
      >
        <el-form-item label="父级权限">
          <el-select
            v-model="permission.parentId"
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
          <el-input
            v-model="permission.name"
            placeholder="Permission Name"
          />
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
              <el-button
                :style="requestMethodStyle(item)"
                type="text"
                size="mini"
              >{{ item }}</el-button>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Url">
          <el-input
            v-model="permission.url"
            placeholder="Request Url"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button
          type="danger"
          @click="dialogVisible=false"
        >Cancel</el-button>
        <el-button
          type="primary"
          @click="confirmPermission"
        >Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { savePermission, updatePermission, removePermission, removePermissionBatch, getPermissionListByPage, getPermissionList } from '@/api/permission'

const defaultPermission = {
  id: null,
  parentId: 0,
  name: '',
  url: '',
  method: 'ALL'
}

export default {
  data () {
    return {
      permissionTableData: [],
      permissionList: [],
      selectedList: [],
      loading: false,
      dialogLoading: false,
      dialogVisible: false,
      dialogType: 'new',
      permission: {},
      requestMethod: [
        'GET',
        'POST',
        'PUT',
        'DELETE',
        'ALL'
      ],
      query: {
        page: 1,
        limit: 10,
        total: 0,
        keyword: ''
      }
    }
  },
  computed: {
    permissionSelectList () {
      const selectList = deepClone(this.permissionList)
      const defaultItem = { ...defaultPermission }
      defaultItem.id = 0
      defaultItem.name = '顶级权限'
      defaultItem.url = '/'
      defaultItem.parentId = 0
      selectList.unshift(defaultItem)
      return selectList
    },

    deleteBatchDisable () {
      return this.selectedList.length === 0
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    // 获取表格数据
    async getTableData () {
      this.loading = true
      const res = await getPermissionListByPage(this.query)
      this.permissionTableData = res.data.items
      this.query.total = res.data.total
      this.query.limit = res.data.limit
      this.query.page = res.data.page
      this.selectedList = []
      this.loading = false
    },

    // 获取全部数据 增加界面和修改使用
    async getPermissionList (reload) {
      if (this.permissionList.length !== 0 && !reload) {
        return
      }
      this.dialogLoading = true
      const { data } = await getPermissionList()
      this.permissionList = data
      this.dialogLoading = false
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

    // 点击添加
    handleAdd () {
      this.dialogVisible = true
      this.dialogType = 'new'
      this.permission = deepClone(defaultPermission)
      this.getPermissionList()
    },

    // 点击编辑
    handleEdit (scope) {
      this.dialogVisible = true
      this.dialogType = 'edit'
      this.permission = deepClone(scope.row)
      this.getPermissionList()
    },

    // 点击删除
    handleDelete ({ $index, row }) {
      this.$confirm('Confirm to remove the role?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async () => {
          removePermission(row.id).then(res => {
            this.$message({
              type: 'success',
              message: 'Delete succed!'
            })
          }).catch(err => {
            this.$message({
              type: 'error',
              message: 'Delete failed!'
            })
            console.error(err)
          })
        })
    },

    // 提交数据
    async confirmPermission () {
      const isEdit = this.dialogType === 'edit'
      let successFlag = false
      if (isEdit) {
        await updatePermission(this.permission).then(res => {
          successFlag = true
        })
      } else {
        await savePermission(this.permission).then(res => {
          successFlag = true
        })
      }
      this.dialogVisible = false
      if (successFlag) {
        const { method, name, url } = this.permission
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
        this.getTableData()
        this.getPermissionList(true)
      }
    },

    // 批量删除
    handleDeleteBatch () {
      this.$confirm('Confirm to remove the role?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async () => {
          removePermissionBatch(this.selectedList).then(res => {
            this.$message({
              type: 'success',
              message: 'Delete succed!'
            })
            this.getTableData()
            this.getPermissionList(true)
          })
        })
    },

    // 批量选择改变
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
  .permissions-table {
    margin-top: 30px;
  }
}
</style>
