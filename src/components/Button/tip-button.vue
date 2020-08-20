<!--
 * @Author: Raiz
 * @Date: 2019-08-01 08:46:23
 * @LastEditors: Raiz
 * @lastTime: 2020-08-07 16:53:48
 * @description: 按钮组件
 -->
<template>
  <el-tooltip placement="top" effect="dark" :content="buttonData.name">
    <ByButton :button-data="buttonData" :button-show="buttonShow" @click="click" />
  </el-tooltip>
</template>

<script>
import ByButton from './index'
export default {
  name: 'TipButton',
  components: {
    ByButton
  },
  props: {
    buttonData: {
      type: Object,
      default () {
        return {
          permission: [''],
          type: 'primary',
          shape: 'circle',
          name: ''
        }
      }
    },
    buttonShow: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
    click (item, el) {
      this.$emit('click', item, el)
    },
    getBtnEl () {
      return this.$refs[this.buttonData.name].$el
    },
    returnIcon () {
      return this.buttonData.icon
    }
  }
}
</script>
<style scoped>

</style>
