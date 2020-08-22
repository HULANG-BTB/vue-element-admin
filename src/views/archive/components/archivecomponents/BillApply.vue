<template>
  <div class="bill-apply-container">
    <el-table v-loading="listLoading" :data="billapply" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="领购时间" width="220px">
        <template slot-scope="scope">
          <span>{{ scope.row.applyTime | parseTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="票据编码" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.billCode }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="票据名称" min-width="250px">
        <template slot-scope="scope">
          <span>{{ scope.row.billName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="数量" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.batchNum }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="经办人" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.linkMan }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="电话" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.linkTel }}</span>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>
<script>
import { parseTime } from '@/utils/index'

export default {
  name: 'BillApply',
  // 日期格式转换
  filters: {
    parseTime (time) {
      var date = new Date(time)
      return parseTime(date, '{y}-{m}-{d} {h}:{i}:{s}')
    }
  },
  props: {
    billapply: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      total: 0,
      // true 开启等待框
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  }
}

</script>
