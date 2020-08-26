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
  methods: {
    getUUid () {
      Axios({
        url: 'http://47.97.155.84/prod-api/pay/setUUid',
        params: {
          UUid: this.$route.query.UUid
        }
      }).then((response) => {
        if (response.data.code === 10000) {
          this.msg = response.data.data
          console.log(response)
        } else if (response.data.code === 111200) {
          this.msg = response.data.message
        } else {
          this.msg = response.data.data
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
