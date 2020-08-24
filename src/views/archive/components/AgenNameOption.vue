<template>
  <div style="display:inline-block;">
    <label class="radio-label" style="padding-left:0;">公司名称: </label>
    <el-input v-model="agenname" placeholder="请输入公司名称" style="width:400px;" prefix-icon="el-icon-search" />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  computed: {
    agenname: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>
