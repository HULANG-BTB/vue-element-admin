<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true" size="small" style="margin-top:10px;">
      <el-form-item label="分组名称" prop="groupName">
        <el-input
          v-model="queryParams.groupName"
          placeholder="请输入分组名称"
          clearable
          style="width: 140px"
          @keyup.enter.native="handleQuery"
        />
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
        >新建分组</el-button>
      </el-col>
    </el-row>

    <el-table :data="groupList" style="width: 100%;margin-top:30px;" border @selection-change="handleSelectionChange">
      <el-table-column align="center" label="分组编码" prop="groupCode" />
      <el-table-column align="center" label="分组名称" prop="groupName" :show-overflow-tooltip="true" />
      <el-table-column align="center" label="经办人" prop="operator" />
      <el-table-column align="center" label="创建时间" prop="updateTime">
        <template slot-scope="scope">
          {{ parseTime(scope.row.updateTime) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" prop="note" />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleLook(scope.row)">查看</el-button>
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

    <el-dialog :visible.sync="dialogVisible" :title="dialogType">
      <el-form ref="group" :disabled="false" :model="group" :rules="rules" label-width="80px" label-position="right" style="padding-right:25px;">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="分组编码" :label-width="formLabelWidth" prop="groupCode">
              <el-input v-model="group.groupCode" placeholder="分组编码" />
            </el-form-item>
            <el-form-item label="经办人编码" :label-width="formLabelWidth" prop="operatorId">
              <el-input v-model="group.operatorId" placeholder="经办人编码" />
            </el-form-item>
            <el-form-item label="备注" :label-width="formLabelWidth" prop="note">
              <el-input v-model="group.note" placeholder="备注" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分组名称" :label-width="formLabelWidth" prop="groupName">
              <el-input v-model="group.groupName" placeholder="分组名称" />
            </el-form-item>
            <el-form-item label="经办人" :label-width="formLabelWidth" prop="operator">
              <el-input v-model="group.operator" placeholder="经办人" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirmRole">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisibleTwo" :title="dialogTypeTwo" width="80%">
      <el-form ref="groupDetail" :disabled="true" :model="groupDetail" label-width="80px" label-position="right" style="padding-right:100px;">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="分组编码" :label-width="formLabelWidth" prop="groupCode">
              <el-input v-model="groupDetail.groupCode" placeholder="分组编码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分组名称" :label-width="formLabelWidth" prop="groupName">
              <el-input v-model="groupDetail.groupName" placeholder="分组名称" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="projectList" border>
        <el-table-column property="itemId" label="项目编码" align="center" />
        <el-table-column property="itemName" label="项目名称" align="center" />
        <el-table-column property="fundsnatureCode" label="资金性质" align="center" />
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handProjectleLook(scope.row)">查看</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleProjectDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:right;margin-top:20px;">
        <el-button type="primary" @click="cancel">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getGroupListByPage, addGroup, deleteGroup, getItemList, deleteItemFromGroup } from '@/api/projectManager'
import { parseTime } from '@/utils/index'

export default {
  data () {
    return {
      //   loading: true,
      queryParams: { // 查询参数
        page: 1,
        limit: 10,
        total: 0,
        agenCode: '',
        groupName: ''
      },
      groupList: [],
      projectList: [],
      groupId: 0,
      group: {
        groupCode: '',
        groupName: '',
        operator: '',
        operatorId: '',
        note: ''
      },
      groupDetail: {
        groupCode: '',
        groupName: '',
        operator: '',
        operatorId: '',
        note: ''
      },
      dialogVisible: false,
      dialogType: '新建分组',
      dialogVisibleTwo: false,
      dialogTypeTwo: '查看分组',
      formLabelWidth: '120px',
      selectedList: [],
      selectedids: [],
      rules: {
        groupCode: [
          { required: true, message: '分组编码不能为空', trigger: 'blur' }
        ],
        groupName: [
          { required: true, message: '分组名称不能为空', trigger: 'blur' }
        ],
        operatorId: [
          { required: true, message: '经办人编码不能为空', trigger: 'blur' }
        ],
        operator: [
          { required: true, message: '经办人不能为空', trigger: 'blur' }
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
    this.queryParams.agenCode = this.$store.state.user.agenCode
    this.getTableData()
  },
  methods: {
    parseTime (time) {
      return parseTime(new Date())
    },
    // 获取资源列表
    async getTableData () {
      // this.loading = true
      const res = await getGroupListByPage(this.queryParams)
      this.groupList = res.data.items
      this.queryParams.total = res.data.total
      this.queryParams.limit = res.data.limit
      this.queryParams.page = res.data.page
      this.selectedList = []
      // this.loading = false
    },
    handleQuery () {
      this.queryParams.page = 1
      this.getTableData()
    },
    resetForm (refName) {
      if (this.$refs[refName]) {
        this.$refs[refName].resetFields()
      }
    },
    resetQuery () {
      this.queryParams.keyword = ''
      this.getTableData()
    },
    handleSelectionChange (selection) {
      this.selectedList = selection
    },
    async handleLook (rowData) {
      this.dialogVisibleTwo = true
      this.groupDetail = Object.assign({}, rowData)
      this.groupId = rowData.groupCode
      this.getProjectList(rowData.groupCode)
    },
    async getProjectList (Data) {
      const res = await getItemList(Data)
      this.projectList = res.data
    },
    async confirmRole () {
      await addGroup(this.group).then(res => {
        this.$set(this.group, {})
        this.dialogVisible = false
        this.getTableData()
        this.$message({
          showClose: true,
          message: '新建成功',
          type: 'success'
        })
        this.clearData()
      })
    },
    cancel () {
      this.dialogVisible = false
      this.dialogVisibleTwo = false
      this.clearData()
      this.resetForm('group')
    },
    handleSizeChange (val) {
      this.queryParams.limit = val
      this.getTableData()
    },
    handleCurrentChange (val) {
      this.queryParams.page = val
      this.getTableData()
    },
    // 新增按钮
    handleAdd () {
      this.dialogVisible = true
    },
    // 删除按钮
    handleDelete (deleData) {
      this.$confirm('此操作将永久删除分组, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        deleteGroup(deleData.id)
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
    // 删除按钮
    handleProjectDelete (deleData) {
      this.$confirm('此操作将从分组中删除该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const datas = {
          groupCode: this.groupId,
          itemCode: deleData.itemId
        }
        deleteItemFromGroup(datas)
          .then((res) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getProjectList(this.groupId)
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
    async handProjectleLook (rowData) {
      console.log(rowData)
    },
    clearData () {
      this.group = {
        groupCode: '',
        groupName: '',
        operator: '',
        operatorId: '',
        note: ''
      }
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
