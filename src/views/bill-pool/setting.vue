<template>

  <div>
    <el-header class="top">
      <el-row gutter="20">
        <el-col :span="2" :push="1">
          <svg-icon class="icon" icon-class="setting" />
        </el-col>
        <el-col :span="13" class="grid-content" push="1">
          <div><h3>票据池-设置</h3></div>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" icon="el-icon-circle-plus"> 创建共享池</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" icon="el-icon-success"> 保存</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" icon="el-icon-error"> 关闭</el-button>
        </el-col>
      </el-row>
    </el-header>

    <el-form ref="form" :model="form" label-width="120px" inline="true" class="form">

      <el-form-item hide-required-asterisk="true" label="票据池编码" class="form-item">
        <el-input v-model="form.code" type="text" size="15" placeholder="请输入票据编码" maxlength="6" class="input" />
      </el-form-item>
      <el-form-item class="form-item-button">
        <el-button type="primary" plain="">查询</el-button>
      </el-form-item>
      <br />
      <el-form-item label="票据池名称" class="form-item">
        <el-input v-model="form.code" :disabled="true" type="text" size="15" placeholder="票据编码" maxlength="6" class="input" />
      </el-form-item>
      <el-form-item label="票据池编码" class="form-item">
        <el-input v-model="form.code" :disabled="true" type="text" size="15" placeholder="票据编码" maxlength="6" class="input" />
      </el-form-item>

    </el-form>

    <el-form ref="form" :model="form" label-width="120px" inline="true">
      <el-form-item class="form-item"><h2>可用票据</h2></el-form-item>
    </el-form>
  </div>

</template>

<script>
export default {
  data () {
    return {
      form: {
        code: '',
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
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

<style scoped>
.form {
  margin-top: 30px;
}
.form-item {
  margin-left: 100px;
}
.form-item-button {
  margin-left: 50px;
}
.input {
  width: 350px;
}
.top {
  margin-top: 20px;
}
.icon {
  height: 50px;
  width: 50px;
  margin-left: 5px;
  margin-top: -5px;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
