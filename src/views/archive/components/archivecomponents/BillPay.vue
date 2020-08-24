<template>
  <div class="bill-pay-container">
    <el-table v-loading="listLoading" :data="billpay" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="汇总时间" width="220px">
        <template slot-scope="scope">
          <span>{{ scope.row.summaryTime | parseTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="票据使用数量" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.useNumber }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="应缴金额" min-width="250px">
        <template slot-scope="scope">
          <span>{{ scope.row.waitAccount }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="实缴金额" min-width="250px">
        <template slot-scope="scope">
          <span>{{ scope.row.account }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="是否缴清" width="200px">
        <template slot-scope="scope">
          <span v-if="scope.row.waitAccount === scope.row.account">已缴清</span>
          <span v-else style="color: red;">未缴清</span>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>
<script>
import { parseTime } from '@/utils/index'
export default {
  name: 'BillPay',
  // 日期格式转换
  filters: {
    parseTime (time) {
      var date = new Date(time)
      return parseTime(date, '{y}-{m}-{d} {h}:{i}:{s}')
    }
  },
  props: {
    billpay: {
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
