<template>
  <div v-loading.body="loading" class="app-container">
    <el-form
      :model="query"
      :inline="true"
      class="demo-form-inline"
      @keyup.enter.native="handleSearch"
    >
      <el-form-item label="票据号码：">
        <el-input
          v-model="query.billId"
          placeholder="请输入票据号码"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label="校验码：">
        <el-input
          v-model="query.checkCode"
          placeholder="请输入校验码"
          clearable
          size="small"
        />
      </el-form-item>

      <el-form-item label>
        <div @mousemove="validator()">
          <el-tooltip class="item" effect="dark" :content="validatorMsg" placement="right">
            <el-button
              icon="el-icon-search"
              size="small"
              @click="handleSearch"
            >搜索</el-button>
          </el-tooltip></div>
      </el-form-item>
    </el-form>

    <el-image
      v-if="billImg !== null"
      :src="billImg"
    />
  </div>

</template>

<script>
import { billCheck } from '@/api/msg.js'

export default {
  data () {
    return {
      query: {
        billId: null,
        checkCode: null
      },
      billImg: null,
      loading: false,
      showTable: false,
      validatorMsg: ''
    }
  },
  created () {
  },
  methods: {
    async handleSearch () {
      this.billImg = null
      // 先进行前端参数校验
      if (!this.validator()) {
        this.openErrormsg()
        return
      }
      this.loading = true
      await billCheck(this.query).then(res => {
        if (res.status === 405) {
          this.openErrormsg('参数异常')
          this.loading = false
          return
        }
        if (res.status === 200) {
          console.log(res)
        }
        const { data } = res
        if (data) { this.billImg = res.data }
      }).catch(() => {
        this.loading = false
      })
      this.loading = false
    },

    // 前端参数校验
    validator () {
      return true
      // const tel = /^1\d{10}$/.test(this.query.tel)
      // const verifyCode = /^[A-Za-z0-9]{6}$/.test(this.query.verifyCode)
      // if (tel && verifyCode) {
      //   this.validatorMsg = '参数合法'
      //   return tel && verifyCode
      // } else {
      //   this.validatorMsg = '参数非法'
      //   return tel && verifyCode
      // }
    },
    // 参数校验失败弹窗
    openErrormsg (msg) {
      this.$message({
        showClose: true,
        message: msg,
        type: 'error'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  text-align:center
}
</style>
