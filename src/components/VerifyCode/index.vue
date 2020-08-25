<template>
  <div>123</div>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    /** 生成一个随机数**/
    randomNum (min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },

    /** 生成一个随机色**/
    randomColor (min, max) {
      var r = this.randomNum(min, max)
      var g = this.randomNum(min, max)
      var b = this.randomNum(min, max)
      return 'rgb(' + r + ',' + g + ',' + b + ')'
    }
  }
}
</script>

<style scoped>

</style>
