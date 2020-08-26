<template>
  <div class="app-container">
    <el-form :model="query" :inline="true" class="demo-form-inline" @keyup.enter.native="handleSearch">
      <el-form-item label="搜索权限：">
        <el-input v-model="query.keyword" placeholder="请输入权限名称或路径" clearable size="small" />
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
        <el-button type="primary" icon="el-icon-plus" size="small" @click="handleAdd">新增权限</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-delete" size="small" :disabled="deleteBatchDisable" @click="handleDeleteBatch">批量删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" icon="el-icon-refresh" size="small" @click="getTableData">重载数据</el-button>
      </el-col>
    </el-row>

    <el-table v-loading.body="loading" :data="permissionTableData" class="permissions-table" style="width: 100%; margin-top:30px;" border @selection-change="handleOnSelectChange">
      <el-table-column type="selection" align="center" width="55" />
      <el-table-column align="center" label="权限ID" width="80">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column align="left" label="权限名称" min-width="220" show-overflow-tooltip>
        <template slot-scope="scope">
          <span :style="{marginLeft: computedUrlMargin(scope.row)}">
            <span v-if="scope.row.parentId">|-- </span> {{ scope.row.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="请求方式" width="220">
        <template slot-scope="scope">
          <el-button :style="requestMethodStyle(scope.row.method)" type="text" size="mini">{{ scope.row.method }}</el-button>
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="请求路径" min-width="300px">
        <template slot-scope="scope">
          <span :style="{marginLeft: computedUrlMargin(scope.row)}">{{ scope.row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="最后修改" width="170">
        <template slot-scope="scope">{{ parseTime(scope.row.updateTime) }}</template>
      </el-table-column>
      <el-table-column align="header-center" label="操作人">
        <template slot-scope="scope">{{ scope.row.operator }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="220" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination background layout="prev, pager, next, sizes, total, jumper" style="margin-top:20px;float:right;margin-right:20px;" :total="query.total" :current-page="query.page" :page-sizes="[10, 20, 50, 100, 500, 1000]" :page-size="query.limit" @size-change="handleSizeChange" @current-change="handleCurrentChange" />

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑权限':'新建权限'">
      <el-form ref="permissionForm" v-loading="dialogLoading" :model="permission" label-width="120px" label-position="right" :rules="rules">
        <el-form-item label="父级权限" prop="parentId">
          <el-select v-model="permission.parentId" size="medium" filterable style="width: 100%" clearable placeholder="Request Method">
            <el-option v-for="(item, index) in permissionSelectList" :key="index" :label="item.name" :value="item.id">
              <span :style="{marginLeft: item.parentId === 0 ? '0px': '20px'}"><span v-if="item.parentId">|-- </span> {{ item.url }}</span>
              <span style="margin-left: 1.5rem; color: #8492a6; font-size: 13px">{{ item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="permission.name" placeholder="Permission Name" />
        </el-form-item>
        <el-form-item label="方式">
          <el-select v-model="permission.method" size="medium" filterable style="width: 100%" placeholder="Request Method">
            <el-option v-for="(item, index) in requestMethod" :key="index" :label="item" :value="item">
              <el-button :style="requestMethodStyle(item)" type="text" size="mini">{{ item }}</el-button>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Url" prop="url">
          <el-input v-model="permission.url" placeholder="Request Url" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">Cancel</el-button>
        <el-button type="primary" :loading="confirmLoading" @click="confirmPermission">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { parseTime } from '@/utils/index'
import {
  savePermission,
  updatePermission,
  removePermission,
  removePermissionBatch,
  getPermissionListByPage,
  getPermissionList
} from '@/api/userManager/permission'

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
      confirmLoading: false,
      dialogLoading: false,
      dialogVisible: false,
      dialogType: 'new',
      rules: {
        parentId: [
          { required: true, message: '父权限不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '权限名称不能为空', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '权限地址不能为空', trigger: 'blur' }
        ]
      },
      permission: {},
      requestMethod: ['GET', 'POST', 'PUT', 'DELETE', 'ALL'],
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
      }).then(async () => {
        removePermission(row.id)
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

    // 提交数据
    async confirmPermission () {
      this.$refs.permissionForm.validate(async valid => {
        if (valid) {
          const isEdit = this.dialogType === 'edit'
          this.confirmLoading = true
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
          this.confirmLoading = false
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
        }
      })
    },

    // 批量删除
    handleDeleteBatch () {
      this.$confirm('Confirm to remove the role?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async () => {
        removePermissionBatch(this.selectedList).then((res) => {
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
    },

    // 格式化时间
    parseTime (time) {
      return parseTime(new Date())
    },

    // 计算Url 偏移
    computedUrlMargin (row) {
      let count = 0
      let str1 = row.url
      while (str1.indexOf('/') !== -1) {
        str1 = str1.replace('/', '')
        count++
      }
      const hasParent = row.parentId === 0 ? 1 : 2
      count = count > hasParent ? count : hasParent
      return (count - 1) * 30 + 'px'
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
