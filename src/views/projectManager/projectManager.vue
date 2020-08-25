<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-tree ref="tree" :data="treeList" node-key="id" :props="defaultProps" style="font-size:10px;" @node-click="handleNodeClick">
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span>{{ data.code }} {{ node.label }}</span>
          </span>
        </el-tree>
      </el-col>
      <el-col :span="18">
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
          <el-form-item label="项目状态" prop="isenable">
            <el-select v-model="queryParams.isenable" placeholder="请选择项目状态" style="width: 150px">
              <el-option label="待审核" value="0" />
              <el-option label="已完成" value="1" />
              <el-option label="全部" value="" />
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
              type="primary"
              icon="el-icon-plus"
              size="small"
              :disabled="isleaf"
              @click="handleAdd"
            >新增项目</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              :disabled="deleteBatchDisable"
              icon="el-icon-delete"
              size="small"
              @click="handleMultDelete"
            >批量删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-upload
              ref="upload"
              class="upload-demo"
              accept=".xlsx, .xls"
              action=""
              :on-success="onSuccess"
              :before-upload="beforeUpload"
            >
              <el-button slot="trigger" size="small" type="primary" icon="el-icon-check">导入</el-button>
            </el-upload>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-message"
              size="small"
              @click="oaganExport"
            >导出</el-button>
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
          <el-table-column align="center" label="项目编码" prop="itemId" />
          <el-table-column align="center" label="项目名称" prop="itemName" :show-overflow-tooltip="true" />
          <el-table-column align="center" label="项目生效日期" prop="itemEffdate" width="110">
            <template slot-scope="scope">
              {{ parseTime(scope.row.itemEffdate) }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="项目失效日期" prop="itemExpdate" width="110">
            <template slot-scope="scope">
              {{ parseTime(scope.row.itemExpdate) }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="资金性质" prop="fundsnatureCode" />
          <el-table-column align="center" label="项目操作" width="150" fixed="right">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handleEdit(scope.row)">修改</el-button>
              <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="标准管理" width="210" fixed="right">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handleAddStand(scope.row)">新增</el-button>
              <el-button type="primary" size="mini" @click="handleEditStand(scope.row)">修改</el-button>
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

        <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'项目变动':'新增项目'" @close="cancel">
          <el-form ref="project" :model="project" :rules="rules" label-width="80px" label-position="right" style="padding-right:25px;">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="项目编码" :label-width="formLabelWidth" prop="itemId">
                  <el-input v-model="project.itemId" placeholder="项目编码" readonly />
                </el-form-item>
                <el-form-item label="项目生效日期" :label-width="formLabelWidth" prop="itemEffdate">
                  <el-date-picker v-model="project.itemEffdate" type="date" placeholder="选择日期" style="width: 100%;" />
                </el-form-item>
                <el-form-item label="记录生效日期" :label-width="formLabelWidth" prop="effdate">
                  <el-date-picker v-model="project.effdate" type="date" placeholder="选择日期" style="width: 100%;" />
                </el-form-item>
                <el-form-item label="收入类别" :label-width="formLabelWidth" prop="name ">
                  <el-input v-model="incomeSort.name" placeholder="收入类别" readonly />
                </el-form-item>
                <el-form-item label="收缴方式" :label-width="formLabelWidth">
                  <el-select v-model="project.paymode" placeholder="请选择收缴方式">
                    <el-option label="直缴" value="直缴" />
                    <el-option label="汇缴" value="汇缴" />
                    <el-option label="代缴" value="代缴" />
                  </el-select>
                </el-form-item>
                <el-form-item label="资金性质" :label-width="formLabelWidth" prop="name">
                  <el-input v-model="fund" placeholder="资金性质" readonly />
                </el-form-item>
              </el-col>
              <el-col :span="12">
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
                  <el-input v-model="project.subjectName" placeholder="预算科目" readonly />
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

        <el-dialog :visible.sync="dialogVisibleTow" :title="dialogTypeTow==='edit'?'编辑标准':'新增标准'" @close="cancel">
          <el-form ref="standard" :model="standard" :rules="standRules" label-width="80px" label-position="right" style="padding-right:25px;">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="标准编码" :label-width="formLabelWidth" prop="itemstdCode">
                  <el-input v-model="standard.itemstdCode" placeholder="标准编码" readonly />
                </el-form-item>
                <el-form-item label="项目编码" :label-width="formLabelWidth" prop="itemCode ">
                  <el-input v-model="standard.itemCode " placeholder="项目编码" readonly />
                </el-form-item>
                <el-form-item label="标准下限" :label-width="formLabelWidth" prop="minCharge">
                  <el-input v-model="standard.minCharge" placeholder="标准下限" />
                </el-form-item>
                <el-form-item label="生效日期" :label-width="formLabelWidth" prop="itemstdEffdate">
                  <el-date-picker v-model="standard.itemstdEffdate" type="date" placeholder="选择日期" style="width: 100%;" />
                </el-form-item>
                <el-form-item label="计量单位" :label-width="formLabelWidth" prop="units">
                  <el-input v-model="standard.units" placeholder="计量单位" readonly />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="标准名称" :label-width="formLabelWidth" prop="itemstdName">
                  <el-input v-model="standard.itemstdName" placeholder="标准名称" />
                </el-form-item>
                <el-form-item label="助记码" :label-width="formLabelWidth" prop="mnem">
                  <el-input v-model="standard.mnem" placeholder="助记码" />
                </el-form-item>
                <el-form-item label="标准上限" :label-width="formLabelWidth" prop="maxCharge">
                  <el-input v-model="standard.maxCharge" placeholder="标准上限" />
                </el-form-item>
                <el-form-item label="失效日期" :label-width="formLabelWidth" prop="itemstdExpdate">
                  <el-date-picker v-model="standard.itemstdExpdate" type="date" placeholder="选择日期" style="width: 100%;" />
                </el-form-item>
                <el-form-item label="标准金额" :label-width="formLabelWidth" prop="charge">
                  <el-input v-model="standard.charge" placeholder="标准金额" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div style="text-align:right;">
            <el-button type="danger" @click="cancel">取消</el-button>
            <el-button type="primary" @click="confirmStand">确认</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getProjectListByPage, getBySubjectId, addProject, getSubjectTree, updateProject, deleteProject, deleteProjectBatch, addStd, updateStd, getItemStd, importExcel, exportExcel, getIncomeSortName } from '@/api/base/projectManager/projectManager'
import { parseTime } from '@/utils/index'

const defaultUser = {
  // rgnId: '',
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
}
const defaultStand = {
  itemstdCode: '',
  itemstdName: '',
  mnem: '',
  maxCharge: '',
  minCharge: '',
  chargr: '',
  units: '元',
  itemstdEffdate: '',
  itemstdExpdate: '',
  note: '',
  id: '',
  isenable: '',
  itemCode: '',
  operator: '',
  operatorId: '',
  updateTime: '',
  createTime: ''
}
export default {
  data () {
    const chargeMethod = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('金额不能为空'))
      } else if (value > this.standard.maxCharge) {
        callback(new Error('金额必须低于标准上限'))
      } else if (value < this.standard.minCharge) {
        callback(new Error('金额必须高于标准下限'))
      } else {
        callback()
      }
    }
    const validateDatePicker = (rule, value, callback, source, option, other) => {
      const thisZero = new Date().setHours(0, 0, 0, 0)
      const input = new Date(value).setHours(0, 0, 0, 0)
      if (input < thisZero && !other && this.dialogType !== 'edit' && this.dialogTypeTow !== 'edit') {
        callback(new Error('日期不能早于今天'))
      } else if (other || this.dialogType === 'edit') {
        const otherDate = new Date(this.project[other]).setHours(0, 0, 0, 0)
        const otherStdData = new Date(this.standard[other]).setHours(0, 0, 0, 0)
        if (otherDate > input || otherStdData > input) {
          callback(new Error('当前日期不能在开始日期之前'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      queryParams: { // 查询参数
        keyword: '',
        subjectCode: '',
        isenable: '',
        page: 1,
        limit: 10,
        state: 1,
        total: 0
      },
      isleaf: true,
      treeList: [],
      defaultProps: {
        children: 'subjectVOS',
        label: 'name',
        level: 'level'
      },
      incomeSort: {
        code: '',
        name: ''
      },
      fund: '',
      subjectList: {
        id: '',
        year: '',
        code: '',
        name: ''
      },
      projectList: [],
      project: {
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
        subjectName: '',
        mnen: '',
        incomSortCode: '',
        fundsnatureCode: '',
        paymode: ''
      },
      standard: {
        itemstdCode: '',
        itemstdName: '',
        mnem: '',
        maxCharge: '',
        minCharge: '',
        charge: '',
        units: '元',
        itemstdEffdate: '',
        itemstdExpdate: '',
        note: '',
        id: '',
        isenable: '',
        itemCode: '',
        operator: '',
        operatorId: '',
        updateTime: '',
        createTime: ''
      },
      standardList: {},
      dialogVisible: false,
      dialogVisibleTow: false,
      dialogType: 'new',
      dialogTypeTow: 'new',
      formLabelWidth: '120px',
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
        ],
        itemEffdate: [
          { required: true, trigger: 'blur', validator: validateDatePicker }
        ],
        itemExpdate: [
          { required: true, trigger: 'blur', validator: (rule, value, callback, source, option, other) => validateDatePicker(rule, value, callback, source, option, 'itemEffdate') }
        ],
        effdate: [
          { required: true, trigger: 'blur', validator: validateDatePicker }
        ],
        expdate: [
          { required: true, trigger: 'blur', validator: (rule, value, callback, source, option, other) => validateDatePicker(rule, value, callback, source, option, 'effdate') }
        ]

      },
      standRules: {
        charge: [
          { required: true, validator: chargeMethod, trigger: 'blur' }
        ],
        itemstdCode: [
          { required: true, message: '标准编码不能为空', trigger: 'blur' }
        ],
        itemstdName: [
          { required: true, message: '标准名称不能为空', trigger: 'blur' }
        ],
        maxCharge: [
          { required: true, message: '标准上限不能为空', trigger: 'blur' }
        ],
        minCharge: [
          { required: true, message: '标准下线不能为空', trigger: 'blur' }
        ],
        units: [
          { required: true, message: '计量单位不能修改', trigger: 'change' }
        ],
        itemstdEffdate: [
          { required: true, trigger: 'blur', validator: validateDatePicker }
        ],
        itemstdExpdate: [
          { required: true, trigger: 'blur', validator: (rule, value, callback, source, option, other) => validateDatePicker(rule, value, callback, source, option, 'itemstdEffdate') }
        ],
        createTime: [
          { required: true, trigger: 'blur', validator: validateDatePicker }
        ],
        updateTime: [
          { required: true, trigger: 'blur', validator: (rule, value, callback, source, option, other) => validateDatePicker(rule, value, callback, source, option, 'createTime') }
        ],
        itemCode: [
          { required: true, message: '项目编码不能为空', trigger: 'blur' }
        ],
        operator: [
          { required: true, message: '经办人不能为空', trigger: 'blur' }
        ],
        operatorId: [
          { required: true, message: '经办人ID不能为空', trigger: 'blur' }
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
    this.getTableTree()
    this.getTableData()
  },
  methods: {
    importExcel () {
      return ''
    },
    // 上传之前的回调
    beforeUpload (file) {
      // if (!/(?:xls|xlsx)$/.test(file.name)) {
      //   this.$message.error('请上传Excel文件')
      //   return false
      // }
      const loading = this.$loading({
        lock: true,
        text: '正在上传',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.6)'
      })
      const form = new FormData()
      form.append('file', file)
      importExcel(form)
        .then((res) => {
          loading.close()
        })
      return false
    },
    // 上传成功的回调
    onSuccess (res) {
      this.loading.close()
      if (res.code === '10000') {
        this.$message.success('操作成功')
      } else {
        this.$message.error(res.message)
      }
    },
    // 下载
    oaganExport (data) {
      this.selectedids = this.selectedList.map(item => {
        return { id: item.id }
      })
      exportExcel(this.selectedids).then(res => {
        const blob = new Blob([res])
        const fileName = '项目管理数据.xlsx'
        if ('download' in document.createElement('a')) {
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob) // 创建下载的链接
          link.download = fileName // 下载后文件名
          link.style.display = 'none'
          document.body.appendChild(link)
          link.click() // 点击下载
          window.URL.revokeObjectURL(link.href) // 释放掉blob对象
          document.body.removeChild(link) // 下载完成移除元素
        } else {
          // IE10+下载
          window.navigator.msSaveBlob(blob, fileName)
        }
      })
    },
    // 格式化时间
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
    // 获取树形菜单列表
    async getTableTree () {
      const res = await getSubjectTree()
      this.treeList = res.data
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
      this.queryParams.keyword = ''
      this.queryParams.isenable = ''
      // this.queryParams.subjectCode = ''
      this.getTableData()
    },
    // 新增按钮
    handleAdd () {
      this.project = Object.assign({}, defaultUser)
      this.project.subject = this.subjectList.code
      this.project.subjectName = this.subjectList.name
      this.project.incomSortCode = this.incomeSort.code
      this.project.fundsnatureCode = this.incomeSort.name + '收入'
      const val = parseInt(this.queryParams.total) + 1
      this.project.itemId = this.subjectList.code + val
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    // 编辑按钮
    async handleEdit (rowData) {
      this.dialogVisible = true
      this.dialogType = 'edit'
      this.project = Object.assign({}, rowData)
      this.fund = this.project.fundsnatureCode
      const res = await getIncomeSortName(this.project.incomSortCode)
      this.incomeSort.name = res.data.name
    },
    // 删除按钮
    handleDelete (deleData) {
      this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        deleteProject(deleData.id)
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
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.selectedList = selection
    },
    // 批量删除[{"id":2},{"id":3}]
    handleMultDelete () {
      this.$confirm('此操作将永久删除选中项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: '提示'
      }).then(async () => {
        this.selectedids = this.selectedList.map(item => {
          return { id: item.id }
        })
        await deleteProjectBatch(this.selectedids)
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
    // 模态框提交
    confirmRole () {
      this.$refs['project'].validate(async (valid) => {
        if (valid) {
          if (this.dialogType !== 'edit') { // 新增
            await addProject(this.project).then(res => {
              this.$set(this.project, {})
              this.getTableData() // 重新渲染数据列表
              this.dialogVisible = false // 关闭模态框
              this.$message({
                showClose: true,
                message: '添加成功',
                type: 'success'
              })
            }).catch((err) => {
              this.$message({
                type: 'error',
                message: '添加失败!'
              })
              console.error(err)
            })
          } else { // 编辑
            this.project.isenable = 0 // 有修改就需要重新审核
            await updateProject(this.project).then(res => {
              this.getTableData()
              this.dialogVisible = false
              this.$set(this.project, {})
              this.$message({
                showClose: true,
                message: '编辑成功',
                type: 'success'
              })
            }).catch((err) => {
              this.$message({
                type: 'error',
                message: '编辑失败!'
              })
              console.error(err)
            })
          }
        }
      })
    },
    async handleNodeClick (data) {
      if (data.level === 2) {
        this.isleaf = false
        this.queryParams.subjectCode = data.code
        this.subjectList = data
        const res = await getBySubjectId(data.id)
        this.incomeSort = res.data
        this.fund = this.incomeSort.name + '收入'
        this.getTableData()
      }
    },
    // 模态框取消
    cancel () {
      this.dialogVisible = false
      this.dialogVisibleTow = false
      this.resetForm('project')
      this.resetForm('standard')
    },
    // 新增标准按钮
    handleAddStand (standData) {
      defaultStand.itemCode = standData.itemId
      this.standard = Object.assign({}, defaultStand)
      this.standard.itemstdCode = standData.itemId + '01'
      this.dialogVisibleTow = true
      this.dialogTypeTow = 'new'
    },
    // 编辑标准按钮
    async handleEditStand (rowStdData) {
      const res = await getItemStd(rowStdData.itemId)
      this.standardList = res.data
      this.standard = Object.assign({}, this.standardList)
      if (this.standard.itemCode === null) {
        this.$message({
          showClose: true,
          message: '项目标准还未添加，没有需要修改的标准',
          type: 'error'
        })
      } else {
        this.dialogVisibleTow = true
        this.dialogTypeTow = 'edit'
      }
    },
    // 标准模态框确定按钮
    confirmStand () {
      this.$refs['standard'].validate(async (valid) => {
        if (valid) {
          if (this.dialogTypeTow !== 'edit') { // 新增
            await addStd(this.standard).then(res => {
              this.$set(this.standard, {}) // 更新视图
              this.dialogVisibleTow = false
              if (res.code === 5003) {
                this.$message({
                  showClose: true,
                  message: '项目标准已经存在，无法添加',
                  type: 'error'
                })
              } else {
                this.$message({
                  showClose: true,
                  message: '项目标准添加成功',
                  type: 'success'
                })
              }
            })
          } else { // 编辑
            this.standard.isenable = 0 // 有修改就需要重新审核
            await updateStd(this.standard).then(res => {
              this.getTableData()
              this.dialogVisibleTow = false
              this.$message({
                showClose: true,
                message: '修改标准成功',
                type: 'success'
              })
            })
          }
        }
      })
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
