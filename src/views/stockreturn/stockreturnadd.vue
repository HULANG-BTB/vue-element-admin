<template>
  <div class="app-container">
    <el-form ref="ruleForm" :model="query" :rules="rules" label-width="120px" input-wdith="250px" class="demo-ruleForm">
      <el-form-item label="业务单号:">
        <el-input
          v-model="query.no"
          placeholder="请输入业务单号"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label="编制日期" prop="date">
        <div class="block">
          <el-date-picker
            v-model="query.date"
            type="date"
            placeholder="选择日期"
          />
        </div>
      </el-form-item>
      <el-form-item label="经办人" prop="returner">
        <el-input v-model="query.returner" w />
      </el-form-item>
      <el-form-item label="编制人" prop="author">
        <el-input v-model="query.author" w />
      </el-form-item>
      <el-form-item label="退票单位码" prop="agenIdCode" width="150px">
        <el-input v-model="query.agenIdCode" w />
      </el-form-item>
      <el-form-item label="退票原因" prop="returnReason">
        <el-input v-model="query.returnReason" w />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      query: {
        no: '',
        date: '',
        returner: '',
        author: '',
        agenIdCode: false,
        returnReason: ''
      }
    }
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    }
  }
}
</script>
