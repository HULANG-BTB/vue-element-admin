<template>
  <div class="app-container">
    <div><el-tag type="danger" v-text="'No:'+row.no" /></div>
    <el-form ref="ruleForm" :rules="MyRules" style="text-align:center" :inline="true" :model="ruleForm" label-width="120px">
      <el-form-item label="申领单位" prop="agenName">
        <el-input v-model="row.agenName" disabled />
      </el-form-item>
      <el-form-item label="领购人" prop="linkMan">
        <el-input v-model="row.linkMan" />
      </el-form-item>
      <el-form-item label="申领单位地址" prop="linkAddr">
        <el-input v-model="row.linkAddr" />
      </el-form-item>
      <el-form-item label="联系电话" prop="linkTel">
        <el-input v-model="row.linkTel" />
      </el-form-item>
      <el-form-item label="摘要" prop="summary">
        <el-input v-model="row.summary" />
      </el-form-item>
      <el-form-item label="备注" prop="memo">
        <el-input v-model="row.memo" />
      </el-form-item>
    </el-form>
    <div><span style="margin-right:8cm">编制人：{{ row.author }}</span>
      <span style="margin-right:8cm">编制日期：{{ row.updateTime| dateFmt('YYYY-MM-DD') }}</span>
      <el-button type="primary" @click="onCreate">创建</el-button></div>
  </div>
</template>

<script>
import { createApply } from '@/api/apply'

export default {
  name: 'ApplyDetail',
  props: {
    row: Object,
    visiable: Boolean
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
    onCreate () {
      var that = this
      createApply(this.row).then(
        res => {
          this.visiable = false
          that.$notify({
            message: '新增申请成功'
          })
        }
      )
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

