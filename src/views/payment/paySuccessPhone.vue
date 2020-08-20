<template>
  <div style="text-align:center" class="box">
    <el-header>
      <div class="word">{{ msg }}</div>
    </el-header>
  </div>
</template>
<script>
import Axios from 'axios'
export default {

  name: 'PaySuccessPhone',

  data () {
    return {
      UUid: '',
      msg: ''
    }
  },

  created () {
    this.getUUid()
  },
  destroyed () {
    clearInterval(this.timer) // 在Vue实例销毁前，清除当前日期定时器
  },
  methods: {
    getUUid () {
      Axios({
        url: 'http://192.168.110.158:8080/pay/setUUid',
        params: {
          UUid: this.$route.query.UUid
        }
      }).then((response) => {
        if (response.status === 200) {
          this.msg = response.data.msg
          console.log(response)
        } else {
          this.msg = '服务暂时离线'
        }
      })
    }
  }
}
</script>

<style scoped>
.word {
  font-size: 30px;
  color: yellow;
}
.box {
  width: 50%;
  height: 80%;
  margin-left: 100px;
  padding-top: 50%;
}
</style>
