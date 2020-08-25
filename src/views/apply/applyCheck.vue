<template>
  <div class="app-container">
    审核意见：<el-input v-model="row.changeSitu" autosize :disabled="isChecked(row.status)" type="textarea" />
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
    <el-button :disabled="isDisabled(row.status)" @click="newItem()">新增</el-button>
    <el-table
      :data="row.items"
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
      <el-table-column class-name="status-col" label="操作" align="center" />
    </el-table>
    <div><span style="margin-right:18cm">编制人：{{ row.author }}</span>
      <span>编制日期：{{ row.updateTime }}</span></div>
    <div style="text-align:center">
      <el-button :disabled="isChecked(row.status)" type="primary" @click="onPass">审核通过</el-button>
      <el-button :disabled="isChecked(row.status)" type="danger" @click="onReturn">审核退回</el-button></div>
  </div>
</template>

<script>
import { passApply, returnApply } from '@/api/apply'
import { parseTime } from '@/utils'

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
    onPass () {
      this.row.status = 2
      passApply(this.row.id, this.row.changeSitu).then(
        this.$notify({
          message: '该申请已通过审核'
        })
      )
    },
    onReturn () {
      if (this.row.changeSitu != null) {
        this.row.status = 3
        returnApply(this.row.id, this.row.changeSitu).then(
          this.$notify({
            message: '该申请已被退回'
          })
        )
      } else {
        this.$notify({
          message: '退回必须填写审核意见！'
        })
      }
    },
    isDisabled (status) {
      return status > 0
    },
    isChecked (status) {
      return status > 1
    },
    parseTime (time) {
      return parseTime(new Date(time))
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

