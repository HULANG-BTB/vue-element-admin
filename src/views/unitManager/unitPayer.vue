<template>
  <div class="app-container">
    <el-form
      ref="queryForm"
      :model="queryParams"
      :inline="true"
      class="demo-form-inline"
      @keyup.enter.native="handleSearch"
    >
      <el-form-item label="缴款人：">
        <el-input v-model="queryParams.keyword" placeholder="姓名、手机号或EMAIL" clearable size="small" />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" size="small" @click="handleSearch">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh" type="default" size="small" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="handleAdd"
        >新增缴款人</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="small"
          @click="handleMultDelete"
        >批量删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="tableLoading" :data="payerList" border style="width: 100%;margin-top:15px;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编码" prop="payerId" width="120" />
      <el-table-column label="名称" prop="payerName" />
      <el-table-column label="电话" prop="tel" width="120" align="center" />
      <el-table-column label="邮箱" prop="email" align="header-center" />
      <el-table-column label="最后修改" prop="updateTime" align="center">
        <template slot-scope="scope">
          {{ parseTime(scope.row.updateTime) }}
        </template>
      </el-table-column>
      <el-table-column label="经办人" prop="operator" />
      <el-table-column label="备注" prop="note" />
      <el-table-column align="center" label="操作" width="220">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'缴款人变动':'新增缴款人'">
      <el-form ref="payer" :model="payer" :rules="rules" label-width="80px" label-position="right" style="padding-right:25px;">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="编码" :label-width="formLabelWidth" prop="payerId">
              <el-input v-model="payer.payerId" placeholder="编码" size="small" />
            </el-form-item>
            <el-form-item label="简码" :label-width="formLabelWidth" prop="mnen">
              <el-input v-model="payer.mnen" placeholder="简码" size="small" />
            </el-form-item>
            <el-form-item label="划缴协议号" :label-width="formLabelWidth" prop="payAgreeno">
              <el-input v-model="payer.payAgreeno" placeholder="划缴协议号" size="small" />
            </el-form-item>
            <el-form-item label="缴款人证件号" :label-width="formLabelWidth" prop="payerCertno">
              <el-input v-model="payer.payerCertno" placeholder="缴款人证件号" size="small" />
            </el-form-item>
            <el-form-item label="开户行名称" :label-width="formLabelWidth" prop="payerBankname">
              <el-input v-model="payer.payerBankname" placeholder="开户行名称" size="small" />
            </el-form-item>
            <el-form-item label="电话" :label-width="formLabelWidth" prop="tel">
              <el-input v-model="payer.tel" placeholder="电话" size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称" :label-width="formLabelWidth" prop="payerName">
              <el-input v-model="payer.payerName" placeholder="名称" size="small" />
            </el-form-item>
            <el-form-item label="户名" :label-width="formLabelWidth" prop="payerUsername">
              <el-input v-model="payer.payerUsername" placeholder="户名" size="small" />
            </el-form-item>
            <el-form-item label="类型" :label-width="formLabelWidth" prop="payerType">
              <el-select v-model="payer.payerType" placeholder="请选择" size="small" style="width: 100%">
                <el-option label="个人" value="个人" />
                <el-option label="单位" value="单位" />
              </el-select>
            </el-form-item>
            <el-form-item label="所属银行" :label-width="formLabelWidth" prop="payerBank">
              <el-input v-model="payer.payerBank" placeholder="所属银行" size="small" />
            </el-form-item>
            <el-form-item label="账号" :label-width="formLabelWidth" prop="payerAcctname">
              <el-input v-model="payer.payerAcctname" placeholder="账号" size="small" />
            </el-form-item>
            <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
              <el-input v-model="payer.email" placeholder="邮箱" size="small" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="备注" :label-width="formLabelWidth" prop="note">
            <el-input
              v-model="payer.note"
              type="textarea"
              :rows="2"
              placeholder="备注"
              size="small"
            />
          </el-form-item>
        </el-row>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" :loading="confirmLoading" @click="handleConfirm">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

const defaultPayer = {
  agenIdcode: '',
  createTime: '',
  email: '',
  id: '',
  isunpaid: false,
  logicDelete: false,
  mnen: '',
  note: '',
  operator: '',
  operatorId: 0,
  payAgreeno: '',
  payerAcctname: '',
  payerBank: '',
  payerBankname: '',
  payerCertno: '',
  payerId: '',
  payerName: '',
  payerType: '',
  payerUsername: '',
  rgncode: '',
  tel: '',
  updateTime: '',
  version: 0
}

import { addPayer, listPayerByPage, removePayerBatch, removePayer, updatePayer } from '@/api/base/unitManager/payer'
import { parseTime, deepClone } from '@/utils/index'

export default {
  data () {
    return {
      queryParams: {
        page: 1,
        limit: 10,
        keyword: ''
      },
      payerList: [],
      selectedList: [],
      dialogVisible: false,
      dialogType: 'new',
      tableLoading: true,
      confirmLoading: false,
      formLabelWidth: '100px',
      payer: Object.assign({}, defaultPayer),
      rules: {
        payerId: [
          { required: true, message: '编码不能为空', trigger: 'blur' }
        ],
        payerName: [
          { required: true, message: '缴款人名称不能为空', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '邮箱格式错误', trigger: 'blur' }
        ],
        tel: [
          { type: 'string', message: '电话格式错误', trigger: 'blur', pattern: /^1[3456789]\d{9}$/ }
        ]
      }
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    async getTableData () {
      this.tableLoading = true
      const { data } = await listPayerByPage(this.queryParams)
      this.payerList = data.items
      this.selectedList = []
      this.tableLoading = false
    },
    handleSearch () {
      this.queryParams.page = 1
      this.getTableData()
    },
    handleReset () {
      this.queryParams.keyword = ''
    },
    handleSelectionChange (selection) {
      this.selectedList = selection
    },
    handleAdd () {
      this.dialogType = 'new'
      this.dialogVisible = true
      this.payer = deepClone(defaultPayer)
      this.payer.agenIdcode = this.$store.state.user.agenCode
    },
    handleEdit (scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.payer = Object.assign(deepClone(defaultPayer), scope.row)
      this.payer.agenIdcode = this.$store.state.user.agenCode
    },
    handleDelete ({ $index, row }) {
      this.$confirm('Confirm to remove the role?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async () => {
          removePayer(row.id).then(res => {
            this.$message({
              type: 'success',
              message: 'Delete succed!'
            })
            this.getTableData()
          }).catch(err => {
            this.$message({
              type: 'error',
              message: 'Delete failed!'
            })
            console.error(err)
          })
        })
    },
    handleMultDelete () {
      this.$confirm('Confirm to remove the role?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async () => {
          removePayerBatch(this.selectedList).then(res => {
            this.$message({
              type: 'success',
              message: 'Delete succed!'
            })
            this.getTableData()
          })
        })
    },
    handleConfirm () {
      this.$refs.payer.validate(async (valid) => {
        if (valid) {
          const isEdit = this.dialogType === 'edit'
          let successFlag = false
          this.confirmLoading = true
          const data = Object.assign({}, this.payer)
          if (isEdit) {
            await updatePayer(data).then(res => {
              successFlag = true
            })
          } else {
            await addPayer(data).then(res => {
              successFlag = true
            })
          }
          this.confirmLoading = false
          this.dialogVisible = false
          if (successFlag) {
            const { payerId, payerName } = data
            this.$notify({
              title: 'Success',
              dangerouslyUseHTMLString: true,
              message: `
                <div>编码: ${payerId}</div>
                <div>名称: ${payerName}</div>
              `,
              type: 'success'
            })
            this.getTableData()
          }
        } else {
          this.$notify({
            title: 'Error',
            message: `信息不完整`,
            type: 'error'
          })
          return false
        }
      })
    },
    parseTime (time) {
      return parseTime(new Date(time), '{y}-{m}-{d}')
    }
  }
}
</script>

<style scoped>

</style>
