<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true" size="small" style="margin-top:10px;">
      <el-form-item label="单位名称" prop="keyword.agenName">
        <el-input v-model="queryParams.keyword.agenName" placeholder="请输入单位名称" clearable style="width: 140px" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="部门名称" prop="keyword.deptName">
        <el-select v-model="queryParams.keyword.deptName" placeholder="请选择部门名称">
          <el-option v-for="item in deptManag" :key="item.id" :label="item.deptName" :value="item.deptName" />
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
          type="success"
          :disabled="deleteBatchDisable"
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
      </el-table-column>
      <el-table-column align="center" label="单位编码" prop="agenCode" />
      <el-table-column align="center" label="单位名称" prop="agenName" :show-overflow-tooltip="true" />
      <el-table-column align="center" label="部门名称" prop="deptName" />
      <el-table-column align="center" label="所属行业" prop="indCode" />
      <el-table-column align="center" label="单位分类" prop="sortCode" />
      <el-table-column align="center" label="操作" width="220">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="handleLook(scope.row)">审核</el-button>
          <!-- <el-button type="success" size="mini" @click="handleCheck(scope.row)">审核</el-button> -->
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
      <el-form ref="project" :model="project" :rules="rules" label-width="80px" label-position="right" style="padding-right:25px;">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="单位编码" :label-width="formLabelWidth" prop="agenCode">
              <el-input v-model="project.agenCode" placeholder="单位编码" readonly />
            </el-form-item>
            <el-form-item label="部门编码" :label-width="formLabelWidth">
              <el-input v-model="project.deptCode" placeholder="部门编码" readonly />
            </el-form-item>
            <el-form-item label="部门名称" :label-width="formLabelWidth" prop="deptName">
              <el-input v-model="project.deptName" placeholder="部门名称" readonly />
            </el-form-item>
            <el-form-item label="单位用途" :label-width="formLabelWidth">
              <el-input v-model="project.typeCode" placeholder="单位用途" readonly />
            </el-form-item>
            <el-form-item label="所属行业" :label-width="formLabelWidth">
              <el-input v-model="project.indCode" placeholder="所属行业" readonly />
            </el-form-item>
            <el-form-item label="生效日期" :label-width="formLabelWidth" prop="effDate">
              <el-date-picker v-model="project.effDate" type="date" placeholder="选择日期" style="width: 100%;" readonly />
            </el-form-item>
            <el-form-item label="单位负责人" :label-width="formLabelWidth">
              <el-input v-model="project.linkMan" placeholder="单位负责人" readonly />
            </el-form-item>
            <el-form-item label="财务负责人" :label-width="formLabelWidth">
              <el-input v-model="project.finMgr" placeholder="财务负责人" readonly />
            </el-form-item>
            <el-form-item label="联系地址" :label-width="formLabelWidth">
              <el-input v-model="project.addr" placeholder="联系地址" readonly />
            </el-form-item>
            <el-form-item label="备注" :label-width="formLabelWidth">
              <el-input v-model="project.note" placeholder="备注" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位名称" :label-width="formLabelWidth" prop="agenName">
              <el-input v-model="project.agenName" placeholder="单位名称" readonly />
            </el-form-item>
            <el-form-item label="助记码" :label-width="formLabelWidth" prop="mnem">
              <el-input v-model="project.mnem" placeholder="助记码" readonly />
            </el-form-item>
            <el-form-item label="归口财政部门" :label-width="formLabelWidth">
              <el-input v-model="project.findeptId" placeholder="归口财政部门" readonly />
            </el-form-item>
            <el-form-item label="单位分类" :label-width="formLabelWidth">
              <el-input v-model="project.sortCode" placeholder="单位分类" readonly />
            </el-form-item>
            <el-form-item label="级次" :label-width="formLabelWidth">
              <el-input v-model="project.level" placeholder="级次" readonly />
            </el-form-item>
            <el-form-item label="失效日期" :label-width="formLabelWidth" prop="expDate">
              <el-date-picker v-model="project.expDate" type="date" placeholder="选择日期" style="width: 100%;" readonly />
            </el-form-item>
            <el-form-item label="单位联系人电话" :label-width="formLabelWidth">
              <el-input v-model="project.itemName" placeholder="单位联系人电话" readonly />
            </el-form-item>
            <el-form-item label="财务负责人电话" :label-width="formLabelWidth">
              <el-input v-model="project.itemName" placeholder="财务负责人电话" readonly />
            </el-form-item>
            <el-form-item label="邮政编码" :label-width="formLabelWidth">
              <el-input v-model="project.itemName" placeholder="邮政编码" readonly />
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
import { getCheckList, getCheckBatch, updateUnit, getDapartListAll } from '@/api/base/unitManager/unitManager'
import { parseTime } from '@/utils/index'

export default {
  data () {
    return {
    //   loading: true,
      queryParams: { // 查询参数
        keyword: {
          deptName: '',
          agenName: ''
        },
        page: 1,
        limit: 10,
        total: 0
      },
      deptManag: [],
      projectList: [],
      project: {
        note: '',
        finMgr: '',
        isalarmAgen: true,
        cityId: '',
        linkTel: '',
        linkMan: '',
        expDate: '',
        operator: '',
        pidCode: '',
        effDate: '',
        orgCode: '',
        countyId: '',
        addr: '',
        finMgrTel: '',
        operatorId: '',
        zip: '',
        rgnId: '',
        logicDelete: true,
        level: '',
        agenCode: '',
        indCode: '',
        updateTime: '',
        sortCode: '',
        provinceId: '1',
        version: '',
        typeCode: '',
        isenable: false,
        istickAgen: true,
        createTime: '',
        agenName: '',
        mnem: '',
        isleaf: false,
        findeptId: '',
        isunpaid: true,
        deptCode: '',
        deptName: ''
      },
      dialogVisible: false,
      dialogType: '单位审核',
      formLabelWidth: '120px',
      selectedList: [],
      selectedids: [],
      rules: {
        agenCode: [
          { required: true, message: '单位编码不能为空', trigger: 'blur' }
        ],
        deptName: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' }
        ],
        effDate: [
          { required: true, message: '生效时间不能为空', trigger: 'blur' }
        ],
        expDate: [
          { required: true, message: '失效时间不能为空', trigger: 'blur' }
        ],
        agenName: [
          { required: true, message: '单位名称不能为空', trigger: 'blur' }
        ],
        mnem: [
          { required: true, message: '助记码不能为空', trigger: 'blur' }
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
    this.getDapartName()
  },
  methods: {
    // 格式化时间
    parseTime (time) {
      return parseTime(new Date())
    },
    // 获取资源列表
    async getTableData () {
      // this.loading = true
      const res = await getCheckList(this.queryParams)
      this.projectList = res.data.items
      this.queryParams.total = res.data.total
      this.queryParams.limit = res.data.limit
      this.queryParams.page = res.data.page
      this.selectedList = []
      // this.loading = false
    },
    // 获取部门列表
    async getDapartName () {
      const { data } = await getDapartListAll() // 无参查询部门列表
      this.deptManag = data
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
      this.queryParams.keyword = {}
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
      await getCheckBatch(this.selectedids).then(res => {
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
    // 审核按钮
    handleLook (rowData) {
      this.dialogVisible = true
      this.project = Object.assign({}, rowData)
    },
    // 审核模态框提交
    async confirmRole () {
      this.project.isenable = true // 单击审核就相当于让状态变为true
      await updateUnit(this.project).then(res => {
        this.getTableData()
        this.dialogVisible = false
        this.$message({
          showClose: true,
          message: '审核成功',
          type: 'success'
        })
      })
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
