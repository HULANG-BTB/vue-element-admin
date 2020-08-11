<!--
 * @Author: Raiz
 * @Date: 2019-08-01 08:46:23
 * @LastEditors: Raiz
 * @lastTime: 2020-08-10 14:48:39
 * @description: 按钮组件
 -->
<template>
  <!-- 普通按钮 -->
  <span v-if="!buttonData.hideButton">
    <el-button
      :ref="buttonData.name"
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
