<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 20px">
      <el-input v-model="listQuery.keyword" size="small" placeholder="模糊搜索框" style="width: 200px; argin-left: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.accountType" size="small" placeholder="查询类别" clearable class="filter-item" style="width: 110px; margin-left: 10px;">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" size="small" style="width: 110px; margin-left: 10px;" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves size="small" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button size="small" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleInsert()">
        添加
      </el-button>
      <el-button v-waves size="small" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-delete" :disabled="multiple" @click="handleBatchDelete">
        删除
      </el-button>
      <el-button v-waves size="small" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-upload" @click="handleUpload">
        导入
      </el-button>
      <el-button v-waves style="margin-right: 400px" size="small" :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:5px;" @change="tableKey=tableKey+1">
        操作人
      </el-checkbox>
      <el-checkbox v-model="showAccountId" class="filter-item" @change="tableKey=tableKey+2">
        入账凭证号
      </el-checkbox>
      <el-checkbox v-model="showCheckCode" class="filter-item" @change="tableKey=tableKey+3">
        票据校验码
      </el-checkbox>
      <el-checkbox v-model="showAccountTime" class="filter-item" @change="tableKey=tableKey+4">
        入账时间
      </el-checkbox>
      <el-button v-waves size="small" class="filter-item" style="margin-left: 20px; margin-top: 20px" type="primary" icon="el-icon-refresh" @click="handleFilter">
        刷新
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      height="455px"
      highlight-current-row
      style="width: 100%; overflow: auto"
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
          <span class="link-type" style="color: #409EFF" @click="handleUpdate(row)"><a>{{ row.agenName }}</a></span>
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
          <span class="link-type" style="color: #409EFF" @click="handleVoucher(row)"><a>{{ row.accountId }}</a></span>
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
      <!--操作人-->
      <el-table-column v-if="showReviewer" label="操作人" width="80px" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.operator }}</span>
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
      <el-table-column label="操作" align="center" fixed="right" width="252px" class-name="small-padding fixed-width">
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

    <pagination v-show="total>0" style="padding: 0; position: absolute; right: 20px" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
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
    <!--入账插入-->
    <el-dialog :title="'入账信息插入'" :visible.sync="dialogInsertFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="insert" label-position="left" label-width="100px" style="margin-left:40px">
        <el-row>
          <el-col span="11">
            <el-form-item label="开票单位" prop="agenName">
              <el-input v-model="insert.agenName" placeholder="填写开票单位" />
            </el-form-item>
          </el-col>
          <el-col span="11">
            <el-form-item label="单位编码" prop="agenIdcode">
              <el-input v-model="insert.agenIdcode" placeholder="填写单位编码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="11">
            <el-form-item label="票据校验码" prop="billSerialId">
              <el-input v-model="insert.billSerialId" placeholder="填写票据校验码" />
            </el-form-item>
          </el-col>
          <el-col span="11">
            <el-form-item label="开票地点" prop="placeId">
              <el-input v-model="insert.placeId" placeholder="填写开票地点" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="11">
            <el-form-item label="开票时间" prop="agenTime">
              <el-date-picker v-model="insert.agenTime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择开票时间" />
            </el-form-item>
          </el-col>
          <el-col span="11">
            <el-form-item label="入账类型" prop="type">
              <el-select v-model="insert.type" class="filter-item" placeholder="选择入账类型">
                <el-option v-for="item in listOptions" :key="item.key" :label="item.label" :value="item.key" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="11">
            <el-form-item label="票据号码" prop="billNo">
              <el-input v-model="insert.billNo" placeholder="请填写票据号码" />
            </el-form-item>
          </el-col>
          <el-col span="11">
            <el-form-item label="票据批次号" prop="billBatchId">
              <el-input v-model="insert.billBatchId" placeholder="填写票据批次号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="11">
            <el-form-item label="应缴金额" prop="waitAccount">
              <el-input v-model="insert.waitAccount" placeholder="请输入应缴金额" />
            </el-form-item>
          </el-col>
          <el-col span="11">
            <el-form-item label="缴款人电话" prop="payerTel">
              <el-input v-model="insert.payerTel" placeholder="请输入缴款人联系方式" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="11">
            <el-form-item label="入账金额" prop="account">
              <el-input v-model="insert.account" placeholder="请输入入账金额" />
            </el-form-item>
          </el-col>
          <el-col span="11">
            <el-form-item label="入账方式" prop="accountType">
              <el-select v-model="insert.accountType" class="filter-item" placeholder="选择类型">
                <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="11">
            <el-form-item label="入账时间" prop="time">
              <el-date-picker v-model="insert.time" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择时间" />
            </el-form-item>
          </el-col>
          <el-col span="11">
            <el-form-item label="入账状态" prop="accountStatus">
              <el-select v-model="insert.accountStatus" class="filter-item" placeholder="选择状态">
                <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.key" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="22">
            <el-form-item label="备注" span="">
              <el-input v-model="insert.note" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="dialogInsertFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createData()">
          确认
        </el-button>
      </div>
    </el-dialog>
    <!--入账修改-->
    <el-dialog :title="'入账信息修改'" :visible.sync="dialogUpdateFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="update" label-position="left" label-width="100px" style="margin-left:40px;">
        <el-row>
          <el-col span="11">
            <el-form-item label="开票单位" prop="agenName">
              <el-input v-model="update.agenName" placeholder="填写开票单位" />
            </el-form-item>
          </el-col>
          <el-col span="11">
            <el-form-item label="单位编码" prop="agenIdcode">
              <el-input v-model="update.agenIdcode" placeholder="填写单位编码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="11">
            <el-form-item label="票据校验码" prop="billSerialId">
              <el-input v-model="update.billSerialId" placeholder="填写票据校验码" />
            </el-form-item>
          </el-col>
          <el-col span="11">
            <el-form-item label="开票地点" prop="placeId">
              <el-input v-model="update.placeId" placeholder="填写开票地点" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="11">
            <el-form-item label="入账类型" prop="type">
              <el-select v-model="update.type" class="filter-item" placeholder="选择入账类型">
                <el-option v-for="item in listOptions" :key="item.key" :label="item.label" :value="item.key" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col span="11">
            <el-form-item label="票据号码" prop="billNo">
              <el-input v-model="update.billNo" placeholder="请填写票据号码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="11">
            <el-form-item label="票据批次号" prop="billBatchId">
              <el-input v-model="update.billBatchId" placeholder="填写票据批次号" />
            </el-form-item>
          </el-col>
          <el-col span="11">
            <el-form-item label="联系方式" prop="payerTel">
              <el-input v-model="update.payerTel" placeholder="请输入缴款人联系方式" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="11">
            <el-form-item label="入账方式" prop="accountType">
              <el-select v-model="update.accountType" class="filter-item" placeholder="选择类型">
                <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col span="11">
            <el-form-item label="入账状态" prop="accountStatus">
              <el-select v-model="update.accountStatus" class="filter-item" placeholder="选择状态">
                <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.key" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="22">
            <el-form-item label="备注">
              <el-input v-model="update.note" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
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
import { listByPage, deleteById, batchDelete, update, insert, updateStatus } from '@/api/cbillaccounting'
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
        limit: 11,
        keyword: undefined,
        accountType: undefined,
        sort: '+id'
      },
      calendarTypeOptions,
      sortOptions: [{ label: '升序', key: '+id' }, { label: '降序', key: '-id' }],
      listOptions: [{ label: '直缴', key: 0 }, { label: '汇缴', key: 1 }],
      statusOptions: [{ label: '未入账', key: false }, { label: '入账', key: true }],
      showReviewer: false,
      showAccountId: false,
      showAccountTime: false,
      showCheckCode: false,
      voucherInput: false,
      // 暂存插入的表单数据
      insert: {
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
        accountStatus: '',
        note: '',
        payerTel: ''
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
      dialogVoucherFormVisible: false,
      dialogInsertFormVisible: false,
      dialogUpdateFormVisible: false,
      dialogStatus: '',
      rules: {
        agenIdcode: [{ required: true, message: '必须填写单位代码', trigger: 'change' }],
        agenName: [{ required: true, message: '必须填写单位名称', trigger: 'change' }],
        placeId: [{ required: true, message: '必须填写开票地址', trigger: 'change' }],
        billSerialId: [{ required: true, message: '必须填写票据校验码', trigger: 'change' }],
        billNo: [{ required: true, message: '票号必须填写', trigger: 'change' }],
        billBatchId: [{ required: true, message: '票据批次号必须填写', trigger: 'change' }],
        accountType: [{ required: true, message: '必须选择入账类型', trigger: 'change' }],
        waitAccount: [{ required: true, message: '应缴金额必须填写', trigger: 'change' }],
        agenTime: [{ required: true, message: '必须选择时间', trigger: 'change' }],
        type: [{ required: true, message: '必须选择入账方式', trigger: 'change' }],
        time: [{ required: true, message: '必须选择时间', trigger: 'change' }],
        accountStatus: [{ required: true, message: '必须选择入账状态', trigger: 'change' }],
        account: [{ required: true, message: '必须填写入账金额', trigger: 'change' }],
        payerTel: [{ required: true, message: '必须填写缴款人联系方式', trigger: 'change' }]
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
    // 查看入账凭证
    handleVoucher (row) {
      this.voucher = Object.assign({}, row)
      this.dialogVoucherFormVisible = true
      this.voucherInput = true
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
    // 批量删除
    handleBatchDelete () {
      const Ids = this.Ids
      // 对象数组
      var Obj = []
      for (let index = 0; index < Ids.length; index++) {
        Obj.push({ id: Ids[index] })
      }
      // Obj = JSON.stringify(Obj)
      this.$confirm('是否确认删除角色编号为"' + Ids + '"的数据项?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return batchDelete(Obj)
      }).then(response => {
        this.$message({
          message: response.message,
          type: 'success'
        })
      }).catch(function () {})
    },
    // 导入(批量插入)
    handleUpload () {
    },
    // 导出(复选框)
    // handleDownload () {
    //   this.downloadLoading = true
    //   import('@/vendor/Export2Excel').then(excel => {
    //     const tHeader = ['ID', '入账凭证号', '票据号码', '票据批次号', '开票时间', '开票单位', '单位代码', '票据校验码', '开票点', '应缴金额', '入账类型', '入账金额', '入账方式', '入账时间', '入账状态', '操作人', '备注']
    //     const filterVal = ['id', 'accountId', 'billNo', 'billBatchId', 'agenTime', 'agenName', 'agenIdcode', 'billSerialId', 'placeId', 'waitAccount', 'type', 'account', 'accountType', 'time', 'accountStatus', 'operator', 'note']
    //     const data = this.formatJson(filterVal)
    //     excel.export_json_to_excel({
    //       header: tHeader,
    //       data,
    //       filename: 'table-list'
    //     })
    //     this.downloadLoading = false
    //   })
    // },
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
    // 插入
    handleInsert () {
      this.dialogInsertFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          insert(this.insert).then(response => {
            this.dialogFormVisible = false
            this.$notify({
              message: response.message,
              type: 'success',
              duration: 2000
            })
          })
          this.getList()
        }
      })
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

