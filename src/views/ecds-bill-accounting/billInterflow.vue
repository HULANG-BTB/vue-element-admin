<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" size="small" placeholder="模糊搜索" style="width: 200px; argin-left: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.accountType" size="small" placeholder="查询类别" clearable class="filter-item" style="width: 105px; margin-left: 10px;">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" size="small" style="width: 80px; margin-left: 10px;" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves size="small" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button size="small" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleInsertAccount">
        基础信息
      </el-button>
      <el-button v-waves size="small" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleGetAccount">
        待缴金额
      </el-button>
      <el-button v-waves size="small" class="filter-item" style="margin-left: 10px;margin-right: 400px" type="primary" icon="el-icon-edit" @click="handleUpdateAccount">
        入账信息
      </el-button>
      <el-input v-model="checkCode" size="small" placeholder="请输入校验码" style="width: 120px;margin: 10px;margin-left: 0px" class="filter-item" @keyup.enter.native="handleGetStatus" />
      <el-button v-waves size="small" class="filter-item" style="margin-left: 0px;" type="primary" icon="el-icon-check" @click="handleGetStatus">
        入账状态
      </el-button>
      <el-button v-waves size="small" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleUpdateBillInfo">
        票据信息
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      height="470px"
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
          <span>{{ row.agenName }}</span>
          <span> | </span>
          <!--单位代码-->
          <el-tag>{{ row.agenIdcode }}</el-tag>
        </template>
      </el-table-column>
      <!--开票点(id)-->
      <el-table-column label="开票点" width="70px" align="center">
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
      <el-table-column label="类型" align="center" width="60px">
        <template slot-scope="{row}">
          <span v-if="row.type.toString()==0">直缴</span>
          <span v-if="row.type.toString()==1">汇缴</span>
        </template>
      </el-table-column>
      <!--入账凭证号-->
      <el-table-column label="入账凭证号" align="center" width="180px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleVoucher(row)">{{ row.accountId }}</span>
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
      <el-table-column label="票据校验码" align="center" width="100px">
        <template slot-scope="{row}">
          <span>{{ row.billSerialId }}</span>
        </template>
      </el-table-column>
      <!--待缴金额-->
      <el-table-column label="待缴金额" align="center" width="100px">
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
      <el-table-column label="入账时间" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.time }}</span>
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
      <!--备注-->
      <el-table-column label="备注" align="center" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.note }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" style="padding: 0; position: absolute; right: 20px" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
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
    <!--查询待缴金额-->
    <el-dialog :title="'查询待缴金额(缴费单位)'" :visible.sync="dialogGetAccountFormVisible" width="30%">
      <el-form ref="getAccountForm" :rules="rules" :model="getAccount" label-position="left" label-width="100px" style="width: 400px; margin-left:30px;">
        <el-form-item label="票据校验码" prop="billSerialId">
          <el-input v-model="getAccount.billSerialId" placeholder="填写票据校验码" />
        </el-form-item>
        <el-form-item label="缴款人电话" prop="payerTel">
          <el-input v-model="getAccount.payerTel" placeholder="请输入缴款人联系方式" />
        </el-form-item>
        <el-form-item label="入账状态">
          <el-input v-model="getAccount.accountStatus" :disabled="getAccountStatus" placeholder="请输入校验码及电话查询" />
        </el-form-item>
        <el-form-item label="待缴金额">
          <el-input v-model="getAccount.waitAccount" :disabled="waitAccountChange" placeholder="请输入校验码及电话查询" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="dialogGetAccountFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" :disabled="closeForm" @click="getAccountData()">
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
    <!--入账凭证页-->
    <el-dialog :title="'入账凭证'" :visible.sync=" dialogVoucherFormVisible" align="center">
      <el-form ref="dataForm" :model="voucher" label-position="left" label-width="85px" style="margin-left:40px">
        <el-row>
          <el-col span="11">
            <el-form-item label="开票单位" prop="agenName">
              <el-input v-model="voucher.agenName" :disabled="voucherInput" />
            </el-form-item>
          </el-col>
          <el-col span="11" style="margin-left:30px">
            <el-form-item label="单位编码" prop="agenIdcode">
              <el-input v-model="voucher.agenIdcode" :disabled="voucherInput" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="11">
            <el-form-item label="票据校验码" prop="billSerialId">
              <el-input v-model="voucher.billSerialId" :disabled="voucherInput" />
            </el-form-item>
          </el-col>
          <el-col span="11" style="margin-left:30px">
            <el-form-item label="开票地点" prop="placeId">
              <el-input v-model="voucher.placeId" :disabled="voucherInput" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="11">
            <el-form-item label="开票时间" prop="agenTime">
              <el-date-picker v-model="voucher.agenTime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" align="left" :disabled="voucherInput" />
            </el-form-item>
          </el-col>
          <el-col span="11" style="margin-left:30px">
            <el-form-item label="入账类型" prop="type">
              <el-select v-model="voucher.type" class="filter-item" :disabled="voucherInput">
                <el-option v-for="item in listOptions" :key="item.key" :label="item.label" :value="item.key" align="left" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="11">
            <el-form-item label="票据号码" prop="billNo">
              <el-input v-model="voucher.billNo" :disabled="voucherInput" />
            </el-form-item>
          </el-col>
          <el-col span="11" style="margin-left:30px">
            <el-form-item label="票据批次号" prop="billBatchId">
              <el-input v-model="voucher.billBatchId" :disabled="voucherInput" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="11">
            <el-form-item label="应缴金额" prop="waitAccount">
              <el-input v-model="voucher.waitAccount" :disabled="voucherInput" />
            </el-form-item>
          </el-col>
          <el-col span="11" style="margin-left:30px">
            <el-form-item label="入账凭证号" prop="accountId">
              <el-input v-model="voucher.accountId" :disabled="voucherInput" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="11">
            <el-form-item label="入账金额" prop="account">
              <el-input v-model="voucher.account" :disabled="voucherInput" />
            </el-form-item>
          </el-col>
          <el-col span="11" style="margin-left:30px">
            <el-form-item label="入账方式" prop="accountType">
              <el-select v-model="voucher.accountType" class="filter-item" :disabled="voucherInput">
                <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" align="left" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="11">
            <el-form-item label="入账时间" prop="time">
              <el-date-picker v-model="voucher.time" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" align="left" :disabled="voucherInput" />
            </el-form-item>
          </el-col>
          <el-col span="11" style="margin-left:30px">
            <el-form-item label="缴款人电话" prop="payerTel">
              <el-input v-model="voucher.payerTel" :disabled="voucherInput" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="23">
            <el-form-item label="备注">
              <el-input v-model="voucher.note" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" :disabled="voucherInput" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
// import { listByPage, deleteById, update, updateStatus, insertAccount, getAccount, updateAccount, getStatus, updateBillInfo } from '@/api/cbillaccounting'
import { listByPage, insertAccount, getAccount, updateAccount, getStatus, updateBillInfo } from '@/api/cbillaccounting'
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
      // 校验码
      checkCode: '',
      // 待缴金额查询状态
      getAccountStatus: true,
      // 获取待缴金额后可用
      waitAccountChange: true,
      // 确认按钮只能点击一次
      voucherInput: false,
      closeForm: false,
      calendarTypeOptions,
      sortOptions: [{ label: '升序', key: '+id' }, { label: '降序', key: '-id' }],
      listOptions: [{ label: '直缴', key: 0 }, { label: '汇缴', key: 1 }],
      statusOptions: [{ label: '未入账', key: false }, { label: '入账', key: true }],
      // 开票前插入信息
      insertAccount: {
        agenName: '',
        agenIdcode: '',
        placeId: '',
        totalAmt: '',
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
      // 查询待缴金额
      getAccount: {
        billSerialId: '',
        payerTel: '',
        waitAccount: '',
        accountStatus: ''
      },
      // 插入发票信息并生成入账凭证
      updateBillInfo: {
        billNo: '',
        checkCode: '',
        date: '',
        billBatchId: ''
      },
      voucher: {
        agenName: '',
        agenIdcode: '',
        placeId: '',
        agenTime: '',
        type: '',
        billNo: '',
        billBatchId: '',
        waitAccount: '',
        account: '',
        accountType: '',
        time: '',
        billSerialId: '',
        accountId: '',
        note: '',
        payerTel: ''
      },
      dialogVoucherFormVisible: false,
      dialogInsertAccountFormVisible: false,
      dialogUpdateAccountFormVisible: false,
      dialogUpdateBillInfoFormVisible: false,
      dialogGetAccountFormVisible: false,
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
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.Ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
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
        this.$refs['getAccountForm'].clearValidate()
      })
      // getAccount(this.insert)
    },
    getAccountData () {
      this.$refs['getAccountForm'].validate((valid) => {
        if (valid) {
          getAccount(this.getAccount).then(response => {
            // this.getAccountStatus = false
            this.getAccount.accountStatus = response.message
            this.getAccount.waitAccount = response.data.waitAccount
            this.waitAccountChange = false
            this.closeForm = true
          })
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
      if (this.checkCode === '' || this.checkCode === null) {
        this.$message({
          message: '校验码不能为空！',
          type: 'error'
        })
      } else {
        const serial = { checkCode: this.checkCode }
        getStatus(serial).then(response => {
          this.$notify({
            message: response.message,
            type: 'success',
            duration: 3000
          })
        })
      }
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
    // 查看入账凭证
    handleVoucher (row) {
      this.voucher = Object.assign({}, row)
      this.dialogVoucherFormVisible = true
      this.voucherInput = true
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

