<template>
  <div class="bill-check-container">
    <el-table v-loading="listLoading" :data="billcheck" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="审验时间" width="220px">
        <template slot-scope="scope">
          <span>{{ scope.row.signTime | parseTime }}</span>
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
          <span>{{ scope.row.billNumber }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="审核结果" width="150px">
        <template slot-scope="scope">
          <span v-if="scope.row.signStatus === true">已处理</span>
          <span v-else style="color: red;">未处理</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="审核人" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.signName }}</span>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>
<script>
import { parseTime } from '@/utils/index'

export default {
  name: 'BillCheck',
  // 日期格式转换
  filters: {
    parseTime (time) {
      var date = new Date(time)
      return parseTime(date, '{y}-{m}-{d} {h}:{i}:{s}')
    }
  },
  props: {
    billcheck: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      list: null,
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
