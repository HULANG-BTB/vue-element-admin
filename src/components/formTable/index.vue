<!--
 * @Author: Raiz
 * @since: Do not edit
 * @lastTime: 2020-08-09 23:45:21
 * @LastEditors: Raiz
 * @Description:
-->
<template>
  <div class="formTable">
    <head-form
      :search-form-data="searchFormData"
      @sumbitSearch="searchTableData"
    />
    <table-body
      :table-data="tableData"
      :table-column-data="tableColumnData"
      :total="total"
      @tableHeadButtonClick="tableHeadButtonClick"
      @tableSelectionChange="tableSelectionChange"
      @pageNumChange="pageNumChange"
      @pageSizeChange="pageSizeChange"
      @tableButtonClick="tableButtonClick"
    /></div>
</template>

<script>
import headForm from './head-form'
import tableBody from './table-body'
export default {
  components: {
    headForm,
    tableBody
  },
  props: {
    searchFormData: {
      type: Array,
      default () {
        return {}
      }
    },
    tableData: {
      type: Object,
      default () {
        return {}
      }
    },
    tableColumnData: {
      type: Object,
      default () {
        return {}
      }
    },
    total: {
      type: Number,
      default () {
        return 0
      }
    }
  },
  data () {
    return {
      pageParam: {
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  methods: {
    requestTableData (param) {
      this.$emit('requestTableData', param)
    },
    searchTableData (searchParam) {
      const param = { ...searchParam, ...this.pageParam }
      this.requestTableData(param)
    },
    tableHeadButtonClick (name) {
      this.$emit('tableHeadButtonClick', name)
    },
    tableSelectionChange (rows) {
      this.selectRows = rows
      this.$emit('tableSelectionChange', rows)
    },
    pageNumChange (num) {
      this.pageParam.pageNum = num
      this.requestTableData(this.pageParam)
    },
    pageSizeChange (size) {
      this.pageParam.pageSize = size
      this.requestTableData(this.pageParam)
    },
    tableButtonClick (name, row) {
      this.$emit('tableButtonClick', name, row)
    }
  }
}
</script>
<style scoped>
.formTable{
  position: relative;
  margin-top:20px;
  margin-left:10px;
}
</style>
