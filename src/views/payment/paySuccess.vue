<template>
  <div style="text-align:center" class="box">
    <el-header>
      <div class="word">支付成功!</div>
    </el-header>
    <div class="mini_word">请点击跳转或等待{{ time }}s后跳转</div>
    <br />
    <el-footer>
      <el-button type="primary" @click="router">完成支付</el-button>
    </el-footer>
  </div>
</template>
<script>
export default {
  name: 'PaySuccess',
  data () {
    return {
      timer: '',
      time: 10
    }
  },
  mounted () {
    const _this = this
    this.timer = setInterval(function () {
      _this.time--
      if (_this.time === 0) {
        clearInterval(_this.timer)
        _this.router()
      }
    }, 1000)
  },
  methods: {
    router () {
      this.$router.push({ path: '/pay', query: {}})
      this.time = 10
      clearInterval(this.timer)
    },
    destroyed () {
      clearInterval(this.timer)
    }
  }
}
</script>

<style scoped>
.word {
  font-size: 100px;
  color: yellow;
}
.box {
  width: 40%;
  height: 30%;
  margin-left: 400px;
  margin-top: 200px;
}
.mini_word {
  margin-top: 100px;
  color: red;
}
</style>
