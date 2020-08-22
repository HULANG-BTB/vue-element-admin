<template>
  <div class="app-container">
    审核意见：<el-input v-model="row.changeSitu" autosize disabled type="textarea" />
    <div><el-tag type="danger" v-text="'No:'+row.no" /></div>
    <el-form ref="ruleForm" :rules="MyRules" style="text-align:center" :inline="true" :model="ruleForm" label-width="120px">
      <el-form-item label="申领单位" prop="agenName">
        <el-input v-model="row.agenName" disabled />
      </el-form-item>
      <el-form-item label="领购人" prop="linkMan">
        <el-input v-model="row.linkMan" :disabled="isDisabled(row.status)" />
      </el-form-item>
      <el-form-item label="申领单位地址" prop="linkAddr">
        <el-input v-model="row.linkAddr" :disabled="isDisabled(row.status)" />
      </el-form-item>
      <el-form-item label="联系电话" prop="linkTel">
        <el-input v-model="row.linkTel" :disabled="isDisabled(row.status)" />
      </el-form-item>
      <el-form-item label="摘要" prop="summary">
        <el-input v-model="row.summary" :disabled="isDisabled(row.status)" />
      </el-form-item>
      <el-form-item label="备注" prop="memo">
        <el-input v-model="row.memo" :disabled="isDisabled(row.status)" />
      </el-form-item>
    </el-form>
    <el-button required :disabled="isDisabled(row.status)" @click="newItem()">新增</el-button>
    <el-table
      v-loading="listLoading"
      :data="this.row.items"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      height="250"
    >
      <el-table-column align="center" prop="fId" label="序号" width="95">
        <template slot-scope="scope">
          <el-input v-model="scope.row.fSortNo" :disabled="isDisabled(row.status)" :value="scope.row.fSortNo" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="票据名称" width="110" prop="fBillName">
        <template slot-scope="scope">
          <el-input v-model="scope.row.fBillName" :disabled="isDisabled(row.status)" :value="scope.row.fBillName" />
        </template>
      </el-table-column>
      <el-table-column label="票据代码" width="160" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.fBillPrecode" :disabled="isDisabled(row.status)" :value="scope.row.fBillPrecode" />
        </template>
      </el-table-column>
      <el-table-column label="计量单位" width="160" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.fUnit" :disabled="isDisabled(row.status)" :value="scope.row.fUnit" />
        </template>
      </el-table-column>
      <el-table-column label="申领数量" width="160" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.fNumber" :disabled="isDisabled(row.status)" :value="scope.row.fNumber" />
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="操作" align="center">
        <template slot-scope="scope">
          <el-button :disabled="isDisabled(row.status)" @click="onSave(scope.row)">保存</el-button>
          <el-button :disabled="isDisabled(row.status)" @click="deleteItem(scope.row.fId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div><span style="margin-right:8cm">编制人：{{ row.author }}</span>
      <span style="margin-right:8cm">编制日期：{{ row.updateTime| dateFmt('YYYY-MM-DD') }}</span>
      <el-button :disabled="isDisabled(row.status)" type="primary" @click="onSubmit">提交</el-button></div>
  </div>
</template>

<script>
import { getItemList, deleteItemById, saveItem, updateItem, submitApply } from '@/api/apply'

export default {
  name: 'ApplyDetail',
  props: {
    row: Object
  },
  data () {
    return {
      ruleForm: {
        agenName: this.row.agenName,
        linkMan: this.row.linkMan,
        linkAddr: this.row.linkAddr,
        linkTel: this.row.linkTel,
        summary: this.row.summary,
        memo: this.row.memo
      },
      MyRules: {
        agenName: [
          { required: true, message: '请输入单位名称', trigger: 'blur' }
        ],
        linkMan: [
          { required: true, message: '请输入领购人', trigger: 'blur' }
        ],
        linkAddr: [
          { required: true, message: '请输入申领单位地址', trigger: 'blur' }
        ],
        linkTel: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    refreshItems () {
      var that = this
      getItemList(this.row.id).then(
        function (data) {
          that.row.items = data
        }
      )
    },
    onSubmit () {
      this.row.status = 1
      this.row.items = null
      this.row.updateTime = null
      var that = this
      submitApply(this.row).then(
        function (data) {
          that.$notify({
            message: '提交成功'
          })
          that.refreshItems()
        }
      )
    },
    onSave (row) {
      var that = this
      row.fPid = this.row.id
      if (row.fId != null) {
        updateItem(row).then(
          function (data) {
            that.$notify({
              message: '保存成功'
            })
            that.refreshItems()
          }
        )
      } else {
        saveItem(row).then(
          function (data) {
            that.$notify({
              message: '保存成功'
            })
            that.refreshItems()
          }
        )
      }
    },
    deleteItem (itemId) {
      var that = this
      deleteItemById(itemId).then(
        function (data) {
          that.$notify({
            message: '删除成功'
          })
          that.refreshItems()
        }
      )
    },
    newItem () {
      var items = this.row.items
      items.push({
        fSortNo: null,
        fBillName: null,
        fBillPrecode: null,
        fUnit: null,
        fNumber: null
      })
    },
    isDisabled (status) {
      return status > 0
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

