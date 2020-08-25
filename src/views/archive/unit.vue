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
  }
}
</script>

