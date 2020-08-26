<!--
 * @Author: Raiz
 * @Date: 2019-08-01 08:46:23
 * @LastEditors: Raiz
 * @lastTime: 2020-08-25 17:28:04
 * @description: 按钮组件
 -->
<template>
  <!-- 普通按钮 -->
  <span v-if="!buttonData.hideButton">
    <el-button
      :ref="buttonData.name"
      v-permission="buttonData.permission ? buttonData.permission : ['admin', 'financial', 'financial_check', 'unit']"
      :type="buttonData.type"
      :circle="buttonData.circle"
      size="mini"
      style="margin-left:10px;"
      @click.stop="click(buttonData)"
    >
      <i v-if="buttonData.icon" :class="returnIcon()" />
      <span v-if="!buttonData.hideName">{{ buttonData.name }}</span>
    </el-button>
  </span>
</template>

<script>
export default {
  name: 'ByButton',
  props: {
    buttonData: {
      type: Object,
      default () {
        return {
          permission: [''],
          type: 'primary',
          shape: '',
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
    click (item) {
      const el = this.$refs[item.name].$el
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
