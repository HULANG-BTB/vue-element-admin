<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" placeholder="模糊搜索框" style="width: 200px; argin-left: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.accountType" placeholder="查询类别" clearable class="filter-item" style="width: 110px; margin-left: 10px;">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 110px; margin-left: 10px;" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleInsertAccount()">
        基础信息
      </el-button>
      <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleGetAccount()">
        代缴金额
      </el-button>
      <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-position" @click="handleUpdateAccount()">
        入账信息
      </el-button>
      <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-check" @click="handleGetStatus()">
        入账状态
      </el-button>
      <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-upload" @click="handleUpdateBillInfo()">
        票据信息
      </el-button>
      <el-checkbox v-model="showAccountId" style="margin-left: 10px;" class="filter-item" @change="tableKey=tableKey+1">
        入账凭证号
      </el-checkbox>
      <el-checkbox v-model="showCheckCode" class="filter-item" @change="tableKey=tableKey+2">
        票据校验码
      </el-checkbox>
      <el-checkbox v-model="showAccountTime" class="filter-item" @change="tableKey=tableKey+3">
        入账时间
      </el-checkbox>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
    >
      <!--复选框-->
      <el-table-column type="selection" align="center" />
      <!--主键ID-->
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="180px" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <!--单位名称+单位代码-->
      <el-table-column label="开票单位" width="180px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.agenName }}</span>
          <span> | </span>
          <!--单位代码-->
          <el-tag>{{ row.agenIdcode }}</el-tag>
        </template>
      </el-table-column>
      <!--开票点(id)-->
      <el-table-column label="开票点" width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.placeId }}</span>
        </template>
      </el-table-column>
      <!--开票时间-->
      <el-table-column label="开票时间" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.agenTime }}</span>
        </template>
      </el-table-column>
      <!--入账单位类型-->
      <el-table-column label="入账类型" align="center" width="80px">
        <template slot-scope="{row}">
          <span v-if="row.type.toString()==0">直缴</span>
          <span v-if="row.type.toString()==1">汇缴</span>
        </template>
      </el-table-column>
      <!--入账凭证号-->
      <el-table-column v-if="showAccountId" label="入账凭证号" align="center" width="180px">
        <template slot-scope="{row}">
          <span>{{ row.accountId }}</span>
        </template>
      </el-table-column>
      <!--票据号码-->
      <el-table-column label="票据号码" align="center" width="100px">
        <template slot-scope="{row}">
          <span>{{ row.billNo }}</span>
        </template>
      </el-table-column>
      <!--票据批次号-->
      <el-table-column label="票据批次号" align="center" width="100px">
        <template slot-scope="{row}">
          <span>{{ row.billBatchId }}</span>
        </template>
      </el-table-column>
      <!--票据校验码-->
      <el-table-column v-if="showCheckCode" label="票据校验码" align="center" width="100px">
        <template slot-scope="{row}">
          <span>{{ row.billSerialId }}</span>
        </template>
      </el-table-column>
      <!--应缴金额-->
      <el-table-column label="应缴金额" align="center" width="100px">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.waitAccount }}</span>
        </template>
      </el-table-column>
      <!--入账金额-->
      <el-table-column label="入账金额" align="center" width="100px">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.account }}</span>
        </template>
      </el-table-column>
      <!--入账方式-->
      <el-table-column label="入账方式" align="center" width="100px">
        <template slot-scope="{row}">
          <span v-if="row.accountType == 1">支付宝</span>
          <span v-if="row.accountType == 2">微信</span>
          <span v-if="row.accountType == 3">现金</span>
          <span v-if="row.accountType == 4">其它</span>
        </template>
      </el-table-column>
      <!--入账时间-->
      <el-table-column v-if="showAccountTime" label="入账时间" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.time }}</span>
        </template>
      </el-table-column>
      <!--备注-->
      <el-table-column label="备注" align="center" width="100px">
        <template slot-scope="{row}">
          <span>{{ row.note }}</span>
        </template>
      </el-table-column>
      <!--入账状态-->
      <el-table-column label="入账状态" class-name="status-col" width="80px">
        <template slot-scope="{row}">
          <el-tag :type="row.accountStatus | statusFilter">
            <span v-if="row.accountStatus == true">已入账</span>
            <span v-if="row.accountStatus == false">未入账</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="行为" align="center" width="230px" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button v-if="row.accountStatus=='0'" size="mini" type="success" @click="handleModifyStatus(row,row.accountStatus)">
            已入账
          </el-button>
          <el-button v-if="row.accountStatus=='1'" size="mini" @click="handleModifyStatus(row,row.accountStatus)">
            未入账
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!--开票前插入信息-->
    <el-dialog :title="'开票前插入信息(开票单位)'" :visible.sync="dialogInsertAccountFormVisible" width="30%">
      <el-form ref="insertAccountForm" :rules="rules" :model="insertAccount" label-position="left" label-width="100px" style="width: 400px; margin-left:30px;">
        <el-form-item label="开票单位" prop="agenName">
          <el-input v-model="insertAccount.agenName" placeholder="填写开票单位" />
        </el-form-item>
        <el-form-item label="单位编码" prop="agenIdcode">
          <el-input v-model="insertAccount.agenIdcode" placeholder="填写单位编码" />
        </el-form-item>
        <el-form-item label="票据校验码" prop="checkCode">
          <el-input v-model="insertAccount.checkCode" placeholder="填写票据校验码" />
        </el-form-item>
        <el-form-item label="开票地点" prop="placeId">
          <el-input v-model="insertAccount.placeId" placeholder="填写开票地点" />
        </el-form-item>
        <el-form-item label="应缴金额" prop="totalAmt">
          <el-input v-model="insertAccount.totalAmt" placeholder="请输入应缴金额" />
        </el-form-item>
        <el-form-item label="缴款人电话" prop="payerTel">
          <el-input v-model="insertAccount.payerTel" placeholder="请输入缴款人联系方式" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="dialogInsertAccountFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="insertAccountData()">
          确认
        </el-button>
      </div>
    </el-dialog>
    <!--缴费单位传值-->
    <el-dialog :title="'缴费单位传值(缴费单位)'" :visible.sync="dialogUpdateAccountFormVisible" width="30%">
      <el-form ref="updateAccountForm" :rules="rules" :model="updateAccount" label-position="left" label-width="100px" style="width: 400px; margin-left:30px;">
        <el-form-item label="票据校验码" prop="billSerialId">
          <el-input v-model="updateAccount.billSerialId" placeholder="填写票据校验码" />
        </el-form-item>
        <el-form-item label="入账时间" prop="time">
          <el-date-picker v-model="updateAccount.time" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择时间" />
        </el-form-item>
        <el-form-item label="入账金额" prop="account">
          <el-input v-model="updateAccount.account" placeholder="请输入应缴金额" />
        </el-form-item>
        <el-form-item label="缴款人电话" prop="payerTel">
          <el-input v-model="updateAccount.payerTel" placeholder="请输入缴款人联系方式" />
        </el-form-item>
        <el-form-item label="入账方式" prop="accountType">
          <el-select v-model="updateAccount.accountType" class="filter-item" placeholder="选择类型">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="dialogUpdateAccountFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateAccountData()">
          确认
        </el-button>
      </div>
    </el-dialog>
    <!--基本发票信息传值-->
    <el-dialog :title="'基本发票信息传值(开票单位)'" :visible.sync="dialogUpdateBillInfoFormVisible" width="30%">
      <el-form ref="updateBillInfoForm" :rules="rules" :model="updateBillInfo" label-position="left" label-width="100px" style="width: 400px; margin-left:30px;">
        <el-form-item label="票据校验码" prop="checkCode">
          <el-input v-model="updateBillInfo.checkCode" placeholder="填写票据校验码" />
        </el-form-item>
        <el-form-item label="开票时间" prop="date">
          <el-date-picker v-model="updateBillInfo.date" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择时间" />
        </el-form-item>
        <el-form-item label="票据号" prop="billNo">
          <el-input v-model="updateBillInfo.billNo" placeholder="请输入票据号" />
        </el-form-item>
        <el-form-item label="票据批次号" prop="billBatchId">
          <el-input v-model="updateBillInfo.billBatchId" placeholder="请输入票据批次号" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="dialogUpdateBillInfoFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateBillInfoData()">
          确认
        </el-button>
      </div>
    </el-dialog>
    <!--入账修改-->
    <el-dialog :title="'入账信息修改'" :visible.sync="dialogUpdateFormVisible" width="30%">
      <el-form ref="dataForm" :rules="rules" :model="update" label-position="left" label-width="100px" style="width: 300px; margin-left:30px;">
        <el-form-item label="开票单位" prop="agenName">
          <el-input v-model="update.agenName" placeholder="填写开票单位" />
        </el-form-item>
        <el-form-item label="单位编码" prop="agenIdcode">
          <el-input v-model="update.agenIdcode" placeholder="填写单位编码" />
        </el-form-item>
        <el-form-item label="票据校验码" prop="billSerialId">
          <el-input v-model="update.billSerialId" placeholder="填写票据校验码" />
        </el-form-item>
        <el-form-item label="开票地点" prop="placeId">
          <el-input v-model="update.placeId" placeholder="填写开票地点" />
        </el-form-item>
        <el-form-item label="入账类型" prop="type">
          <el-select v-model="update.type" class="filter-item" placeholder="选择入账类型">
            <el-option v-for="item in listOptions" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="票据号码" prop="billNo">
          <el-input v-model="update.billNo" placeholder="请填写票据号码" />
        </el-form-item>
        <el-form-item label="票据批次号" prop="billBatchId">
          <el-input v-model="update.billBatchId" placeholder="填写票据批次号" />
        </el-form-item>
        <el-form-item label="缴款人联系方式" prop="payerTel">
          <el-input v-model="update.payerTel" placeholder="请输入缴款人联系方式" />
        </el-form-item>
        <el-form-item label="入账方式" prop="accountType">
          <el-select v-model="update.accountType" class="filter-item" placeholder="选择类型">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="入账状态" prop="accountStatus">
          <el-select v-model="update.accountStatus" class="filter-item" placeholder="选择状态">
            <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="update.note" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUpdateFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listByPage, deleteById, update, updateStatus, insertAccount, getAccount, updateAccount, getStatus, updateBillInfo } from '@/api/cbillaccounting'
import waves from './directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 1, display_name: '支付宝' },
  { key: 2, display_name: '微信' },
  { key: 3, display_name: '现金' },
  { key: 4, display_name: '其它' }
]

const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter (status) {
      const statusMap = {
        true: 'success',
        false: 'info'
      }
      return statusMap[status]
    },
    typeFilter (type) {
      return calendarTypeKeyValue[type]
    }
  },
  data () {
    return {
      // 不选择单个就禁用
      single: true,
      // 不选择多个就禁用
      multiple: true,
      // 选中数组
      Ids: [],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        keyword: undefined,
        accountType: undefined,
        sort: '-id'
      },
      calendarTypeOptions,
      sortOptions: [{ label: '升序', key: '+id' }, { label: '降序', key: '-id' }],
      listOptions: [{ label: '直缴', key: 0 }, { label: '汇缴', key: 1 }],
      statusOptions: [{ label: '未入账', key: false }, { label: '入账', key: true }],
      showAccountId: false,
      showAccountTime: false,
      showCheckCode: false,
      // 开票前插入信息
      insertAccount: {
        agenName: '',
        agenIdcode: '',
        placeId: '',
        totalAmt: undefined,
        checkCode: '',
        payerTel: ''
      },
      // 缴费单位传值
      updateAccount: {
        account: '',
        accountType: '',
        time: '',
        billSerialId: '',
        payerTel: ''
      },
      // 插入发票信息并生成入账凭证
      updateBillInfo: {
        billNo: '',
        checkCode: '',
        date: '',
        billBatchId: ''
      },
      // 暂存修改的表单数据
      update: {
        id: undefined,
        agenName: undefined,
        agenIdcode: undefined,
        placeId: undefined,
        type: undefined,
        billNo: undefined,
        billBatchId: undefined,
        accountType: undefined,
        billSerialId: undefined,
        accountStatus: undefined,
        note: undefined,
        payerTel: ''
      },
      voucher: {

      },
      dialogVoucherFormVisible: false,
      dialogInsertAccountFormVisible: false,
      dialogUpdateAccountFormVisible: false,
      dialogUpdateBillInfoFormVisible: false,
      dialogUpdateFormVisible: false,
      rules: {
        agenIdcode: [{ required: true, message: '必须填写单位代码', trigger: 'change' }],
        agenName: [{ required: true, message: '必须填写单位名称', trigger: 'change' }],
        placeId: [{ required: true, message: '必须填写开票地址', trigger: 'change' }],
        billSerialId: [{ required: true, message: '必须填写票据校验码', trigger: 'change' }],
        billNo: [{ required: true, message: '必须填写票号', trigger: 'change' }],
        billBatchId: [{ required: true, message: '必须填写票据批次号', trigger: 'change' }],
        accountType: [{ required: true, message: '必须选择入账类型', trigger: 'change' }],
        waitAccount: [{ required: true, message: '必须填写应缴金额', trigger: 'change' }],
        agenTime: [{ required: true, message: '必须选择时间', trigger: 'change' }],
        type: [{ required: true, message: '必须选择入账方式', trigger: 'change' }],
        time: [{ required: true, message: '必须选择时间', trigger: 'change' }],
        accountStatus: [{ required: true, message: '必须选择入账状态', trigger: 'change' }],
        account: [{ required: true, message: '必须填写入账金额', trigger: 'change' }],
        payerTel: [{ required: true, message: '必须填写缴款人联系方式', trigger: 'change' }],
        date: [{ required: true, message: '必须填写开票时间', trigger: 'change' }],
        checkCode: [{ required: true, message: '必须填写票据校验码', trigger: 'change' }],
        totalAmt: [{ required: true, message: '必须填写缴款金额', trigger: 'change' }]
      },
      downloadLoading: false
    }
  },
  created () {
    this.getList()
  },
  methods: {
    // 修改数值类型
    change (item) {
      return item.toString()
    },
    // 初始化页面数据
    getList () {
      this.listLoading = false
      listByPage(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter () {
      this.listQuery.page = 1
      this.getList()
    },
    // 单行删除
    handleDelete (row) {
      const deleteData = { id: row.id }
      this.$confirm('是否确认删除角色编号为"' + row.id + '"的数据项?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return deleteById(deleteData)
      }).then(response => {
        this.$message({
          message: response.message,
          type: 'success'
        })
      }).catch(function () {})
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.Ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 更改row的入账状态(不刷新页面即时更新)
    handleModifyStatus (row, accountStatus) {
      const id = { id: row.id }
      updateStatus(id).then(response => {
        this.$message({
          message: response.message,
          type: 'success'
        })
      })
      row.accountStatus = !accountStatus
    },
    // 开票前插入信息
    handleInsertAccount () {
      this.dialogInsertAccountFormVisible = true
      this.$nextTick(() => {
        this.$refs['insertAccountForm'].clearValidate()
      })
      // insertAccount(this.insert)
    },
    insertAccountData () {
      this.$refs['insertAccountForm'].validate((valid) => {
        if (valid) {
          insertAccount(this.insertAccount).then(response => {
            this.dialogInsertAccountFormVisible = false
            this.$notify({
              message: response.message,
              type: 'success',
              duration: 2000
            })
          })
          // 更新插入消息
          this.getList()
        }
      })
    },
    // 查询待缴金额
    handleGetAccount () {
      this.dialogGetAccountFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      // getAccount(this.insert)
    },
    getAccountData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          getAccount(this.getAccount)
        }
      })
    },
    // 缴费单位传值
    handleUpdateAccount () {
      this.dialogUpdateAccountFormVisible = true
      this.$nextTick(() => {
        this.$refs['updateAccountForm'].clearValidate()
      })
      // updateAccount(this.insert)
    },
    updateAccountData () {
      this.$refs['updateAccountForm'].validate((valid) => {
        if (valid) {
          updateAccount(this.updateAccount).then(response => {
            this.dialogUpdateAccountFormVisible = false
            this.$notify({
              message: response.message,
              type: 'success',
              duration: 2000
            })
          })
          // 更新插入消息
          this.getList()
        }
      })
    },
    // 查询入账状态
    handleGetStatus () {
      this.dialogGetStatusFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      // getStatus(this.insert)
    },
    getStatusData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          getStatus(this.getStatus)
        }
      })
    },
    // 插入发票信息并生成入账凭证
    handleUpdateBillInfo () {
      this.dialogUpdateBillInfoFormVisible = true
      this.$nextTick(() => {
        this.$refs['updateBillInfoForm'].clearValidate()
      })
      // updateBillInfo(this.insert)
    },
    updateBillInfoData () {
      this.$refs['updateBillInfoForm'].validate((valid) => {
        if (valid) {
          updateBillInfo(this.updateBillInfo).then(response => {
            this.dialogUpdateBillInfoFormVisible = false
            this.$notify({
              message: response.message,
              type: 'success',
              duration: 2000
            })
          })
          // 更新插入消息
          this.getList()
        }
      })
    },
    sortChange (data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID (order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    // 更新
    handleUpdate (row) {
      this.update = Object.assign({}, row)
      this.dialogUpdateFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.update)
          update(tempData).then(response => {
            this.dialogFormVisible = false
            this.$notify({
              message: response.message,
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    formatJson (filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'agenTime') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function (key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>

