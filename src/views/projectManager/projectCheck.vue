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
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="success"
          :disabled="deleteBatchDisable"
          icon="el-icon-delete"
          size="small"
          @click="handleMultCheck"
        >批量审核</el-button>
      </el-col>
    </el-row>

    <el-table :data="projectList" style="width: 100%;margin-top:30px;" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" />
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
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleLook(scope.row)">查看</el-button>
          <el-button type="success" size="mini" @click="handleCheck(scope.row)">审核</el-button>
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
      <el-form ref="project" :model="project" label-width="80px" label-position="right" style="padding-right:25px;">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目编码" :label-width="formLabelWidth" prop="itemId">
              <el-input v-model="project.itemId" placeholder="项目编码" readonly />
            </el-form-item>
            <el-form-item label="项目生效日期" :label-width="formLabelWidth" prop="itemEffdate">
              <el-date-picker v-model="project.itemEffdate" type="date" placeholder="选择日期" style="width: 100%;" readonly />
            </el-form-item>
            <el-form-item label="记录生效日期" :label-width="formLabelWidth" prop="effdate">
              <el-date-picker v-model="project.effdate" type="date" placeholder="选择日期" style="width: 100%;" readonly />
            </el-form-item>
            <el-form-item label="收入类别" :label-width="formLabelWidth" prop="incomSortCode ">
              <el-input v-model="project.incomSortCode" placeholder="收入类别" readonly />
            </el-form-item>
            <el-form-item label="收缴方式" :label-width="formLabelWidth">
              <el-input v-model="project.paymode" placeholder="收入类别" readonly />
            </el-form-item>
            <el-form-item label="资金性质" :label-width="formLabelWidth" prop="fundsnatureCode">
              <el-input v-model="project.fundsnatureCode" placeholder="收入类别" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目名称" :label-width="formLabelWidth" prop="itemName">
              <el-input v-model="project.itemName" placeholder="项目名称" readonly />
            </el-form-item>
            <el-form-item label="项目失效日期" :label-width="formLabelWidth" prop="itemExpdate">
              <el-date-picker v-model="project.itemExpdate" type="date" placeholder="选择日期" style="width: 100%;" readonly />
            </el-form-item>
            <el-form-item label="记录截止日期" :label-width="formLabelWidth" prop="expdate">
              <el-date-picker v-model="project.expdate" type="date" placeholder="选择日期" style="width: 100%;" readonly />
            </el-form-item>
            <el-form-item label="助记码" :label-width="formLabelWidth" prop="mnen">
              <el-input v-model="project.mnen" placeholder="助记码" readonly />
            </el-form-item>
            <el-form-item label="预算科目" :label-width="formLabelWidth">
              <el-input v-model="project.subjectName" placeholder="根据实际情况填写" readonly />
            </el-form-item>
            <el-form-item label="备注" :label-width="formLabelWidth">
              <el-input v-model="project.note" placeholder="备注" readonly />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirmRole">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getProjectListByPage, projectCheck, updateProject, getIncomSortName } from '@/api/projectManager'
import { parseTime } from '@/utils/index'

export default {
  data () {
    return {
      //   loading: true,
      queryParams: { // 查询参数
        keyword: '',
        subjectCode: '',
        isenable: 0,
        page: 1,
        state: 2,
        limit: 10,
        total: 0
      },
      projectList: [],
      project: {
        isenable: 0,
        id: 1,
        itemId: '',
        itemName: '',
        itemSortId: '',
        itemEffdate: '',
        itemExpdate: '',
        effdate: '',
        expdate: '',
        subject: '',
        subjectName: '',
        // note: '',
        mnen: '',
        incomSortCode: '',
        fundsnatureCode: '',
        paymode: ''
      },
      dialogVisible: false,
      dialogType: '查看项目',
      formLabelWidth: '120px',
      selectedList: [],
      selectedids: []
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
    parseTime (time) {
      return parseTime(new Date(time), '{y}-{m}-{d}')
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
    },
    handleSelectionChange (selection) {
      this.selectedList = selection
    },
    async handleMultCheck (checkData) {
      this.selectedids = this.selectedList.map(item => {
        return { id: item.id }
      })
      await projectCheck(this.selectedids).then(res => {
        this.$set(this.project, {})
        this.getTableData()
        this.dialogVisible = false
        this.$message({
          showClose: true,
          message: '全部审核成功',
          type: 'success'
        })
      })
    },
    async handleCheck (simpData) {
      this.project = Object.assign({}, simpData)
      this.project.isenable = 1 // 单击审核就相当于让状态变为1
      await updateProject(this.project).then(res => {
        this.getTableData()
        this.dialogVisible = false
        this.$message({
          showClose: true,
          message: '审核成功',
          type: 'success'
        })
      })
    },
    async handleLook (rowData) {
      this.dialogVisible = true
      const res = await getIncomSortName(rowData.incomSortCode)
      this.project = Object.assign({}, rowData)
      this.project.incomSortCode = res.data.name
    },
    confirmRole () {
      this.dialogVisible = false
    },
    cancel () {
      this.dialogVisible = false
      this.resetForm('project')
    },
    handleSizeChange (val) {
      this.queryParams.limit = val
      this.getTableData()
    },
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
