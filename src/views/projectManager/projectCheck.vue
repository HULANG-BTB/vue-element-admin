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
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column align="center" label="状态" prop="isenable">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isenable ? 'success' : 'info'"
            disable-transitions
          >{{ scope.row.isenable ? '已完成' : '待审核' }}
          </el-tag>
        </template>
        <!-- <el-switch
          active-color="#13ce66"
          inactive-color="#ff4949"
        /> -->
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
      <el-form ref="project" :disabled="true" :model="project" :rules="rules" label-width="80px" label-position="right" style="padding-right:25px;">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="区划id" :label-width="formLabelWidth" prop="rgnId">
              <el-input v-model="project.rgnId" placeholder="区划id" />
            </el-form-item>
            <el-form-item label="项目分类编码" :label-width="formLabelWidth" prop="itemSortId">
              <el-input v-model="project.itemSortId" placeholder="项目分类编码" />
            </el-form-item>
            <el-form-item label="项目生效日期" :label-width="formLabelWidth" prop="itemEffdate">
              <el-date-picker v-model="project.itemEffdate" type="date" placeholder="选择日期" style="width: 100%;" />
            </el-form-item>
            <el-form-item label="记录生效日期" :label-width="formLabelWidth" prop="effdate">
              <el-date-picker v-model="project.effdate" type="date" placeholder="选择日期" style="width: 100%;" />
            </el-form-item>
            <el-form-item label="收入类别" :label-width="formLabelWidth" prop="incomSortCode ">
              <el-select v-model="project.incomSortCode " placeholder="根据实际情况选择">
                <el-option label="直缴" value="直缴" />
              </el-select>
            </el-form-item>
            <el-form-item label="收缴方式" :label-width="formLabelWidth">
              <el-select v-model="project.paymode" placeholder="请选择收缴方式">
                <el-option label="直缴" value="直缴" />
              </el-select>
            </el-form-item>
            <el-form-item label="资金性质" :label-width="formLabelWidth" prop="fundsnatureCode">
              <el-select v-model="project.fundsnatureCode" placeholder="根据实际情况选择">
                <el-option label="直缴" value="直缴" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目编码" :label-width="formLabelWidth" prop="itemId">
              <el-input v-model="project.itemId" placeholder="项目编码" />
            </el-form-item>
            <el-form-item label="项目名称" :label-width="formLabelWidth" prop="itemName">
              <el-input v-model="project.itemName" placeholder="项目名称" />
            </el-form-item>
            <el-form-item label="项目失效日期" :label-width="formLabelWidth" prop="itemExpdate">
              <el-date-picker v-model="project.itemExpdate" type="date" placeholder="选择日期" style="width: 100%;" />
            </el-form-item>
            <el-form-item label="记录截止日期" :label-width="formLabelWidth" prop="expdate">
              <el-date-picker v-model="project.expdate" type="date" placeholder="选择日期" style="width: 100%;" />
            </el-form-item>
            <el-form-item label="助记码" :label-width="formLabelWidth" prop="mnen">
              <el-input v-model="project.mnen" placeholder="助记码" />
            </el-form-item>
            <el-form-item label="预算科目" :label-width="formLabelWidth">
              <el-input v-model="project.subject" placeholder="根据实际情况填写" />
            </el-form-item>
            <el-form-item label="备注" :label-width="formLabelWidth">
              <el-input v-model="project.note" placeholder="备注" />
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
import { getProjectListByPage, projectCheck, updateProject } from '@/api/projectManager'
import { parseTime } from '@/utils/index'

export default {
  data () {
    return {
    //   loading: true,
      queryParams: { // 查询参数
        keyword: '0',
        page: 1,
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
        // note: '',
        mnen: '',
        incomSortCode: '',
        fundsnatureCode: '',
        paymode: ''
      },
      dialogVisible: false,
      dialogType: '查看项目',
      formLabelWidth: '100px',
      selectedList: [],
      selectedids: [],
      rules: {
        itemId: [
          { required: true, message: '项目编码不能为空', trigger: 'blur' }
        ],
        itemName: [
          { required: true, message: '项目名称不能为空', trigger: 'blur' }
        ],
        mnen: [
          { required: true, message: '助记码不能为空', trigger: 'blur' }
        ],
        incomSortCode: [
          { required: true, message: '收入类别不能为空', trigger: 'blur' }
        ],
        fundsnatureCode: [
          { required: true, message: '资金性质不能为空', trigger: 'blur' }
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
    // 格式化时间
    parseTime (time) {
      return parseTime(new Date())
    },
    // 获取资源列表
    async getTableData () {
      // this.loading = true
      const res = await getProjectListByPage(this.queryParams)
      let arry = []
      arry = res.data.items.filter(item => {
        return item.isenable === 0
      })
      this.projectList = arry
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
      this.queryParams = {}
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.selectedList = selection
    },
    // 批量审核按钮
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
    // 单个审核
    async handleCheck (simpData) {
      this.project = Object.assign({}, simpData)
      this.project.isenable = 1 // 单击审核就相当于让状态变为1
      await updateProject(this.project).then(res => {
        // this.project.isenable = true
        console.log(res)
        this.getTableData()
        this.dialogVisible = false
        this.$message({
          showClose: true,
          message: '审核成功',
          type: 'success'
        })
      })
    },
    // 查看按钮
    handleLook (rowData) {
      this.dialogVisible = true
      this.project = Object.assign({}, rowData)
    },
    // 查看模态框提交
    confirmRole () {
      this.dialogVisible = false
    },
    //  查看模态框取消
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
