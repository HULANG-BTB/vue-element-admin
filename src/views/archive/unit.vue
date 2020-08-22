<template>
  <ArchiveBaseInfo />
</template>

<script>
import ArchiveBaseInfo from './components/ArchiveBaseInfo'
export default {
  // 初始化时获取单位agenCode
  name: 'Unit',
  components: { ArchiveBaseInfo },
  created () {
    // const agenCode = this.$route.params && this.$route.params.agenCode
    // this.fetchData(id)
    // alert(agenCode)
    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    // this.tempRoute = Object.assign({}, this.$route)
  }
}
</script>

