<template>
  <ArchiveBaseInfo :agencode="agenCode" />
</template>

<script>
import ArchiveBaseInfo from './components/ArchiveBaseInfo'
export default {
  // 初始化时获取单位agenCode
  name: 'Unit',
  components: { ArchiveBaseInfo },
  data () {
    return {
      agenCode: ''
    }
  },
  // 获取当前登录的单位名
  created () {
    this.agenCode = this.$store.state.user.agenCode
    // 当单位代码为空时，使用默认值
    if (this.agenCode.length === 0) {
      this.agenCode = '360101000001'
    }
  }
}
</script>

