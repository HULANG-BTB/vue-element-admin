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
      agenCode: '112233'
    }
  },
  // 获取当前登录的单位名
  created () {
    // this.agenCode = '112233'
  }
}
</script>

