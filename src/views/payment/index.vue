<template>
  <div class="login-container">
    <el-form
      ref="paySearchForm"
      :model="paySearchForm"
      :rules="paySearchRules"
      :v-text="responseMsg"
      class="pay-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">请输入缴费信息</h3>
      </div>

      <el-form-item prop="fpayerTel">
        <span class="svg-container">
          <svg-icon icon-class="phone" />
        </span>
        <el-input
          ref="fpayerTel"
          v-model="paySearchForm.fpayerTel"
          placeholder="手机号"
          name="fpayerTel"
          type="text"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleSubmit"
        />
      </el-form-item>

      <el-form-item prop="checkCode">
        <span class="svg-container">
          <svg-icon icon-class="code" />
        </span>
        <el-input
          ref="checkCode"
          v-model="paySearchForm.checkCode"
          placeholder="校验码"
          name="checkCode"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleSubmit"
      >查询缴费信息</el-button>

      <div class="tips">
        <span style="margin-right:20px;color:red">{{ responseMsg.msg }}</span>
      </div>

    </el-form></div>
</template>

<script>
import { payLogin } from '@/api/payment'
export default {
  name: 'PayIndex',
  data () {
    const validateCheckCode = (rule, value, callback) => {
      if (value.length !== 6) {
        callback(new Error('请输入6位校验码'))
      } else {
        callback()
      }
    }
    const validatefpayerTel = (rule, value, callback) => {
      if (value.length !== 11) {
        callback(new Error('请输入有效的手机号'))
      } else {
        callback()
      }
    }
    return {
      paySearchForm: {
        checkCode: '',
        fpayerTel: ''
      },
      paySearchRules: {
        checkCode: [{ required: true, trigger: 'blur', validator: validateCheckCode }],
        fpayerTel: [{ required: true, trigger: 'blur', validator: validatefpayerTel }]
      },
      responseMsg: {
        msg: ''
      },
      loading: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {

    handleSubmit () {
      this.$refs.paySearchForm.validate(valid => {
        if (valid) {
          this.loading = true
          console.log(this.paySearchForm)
          payLogin(this.paySearchForm).then(res => {
            if (res.code === 111110) {
              if (res.data.type === 0) {
                this.$router.push({ name: this.redirect || 'PayInformation', params: { data: JSON.stringify(res.data) }})
                this.loading = false
              } else {
                this.$router.push({ name: this.redirect || 'PayInformational', params: { data: JSON.stringify(res.data) }})
                this.loading = false
              }
            } else if (res.code === 111200) {
              this.responseMsg.msg = res.message
              this.loading = false
            } else {
              this.responseMsg.msg = '查询没有此缴款单,请检查手机号或验证码输入是否正确'
              this.loading = false
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .pay-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
