<template>
  <div class="bill-warn-container">
    <el-table v-loading="listLoading" :data="billwarn" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="预警时间" width="220px">
        <template slot-scope="scope">
          <span>{{ scope.row.mntTime | parseTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="监控事项" min-width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.evtName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="预警内容" min-width="250px">
        <template slot-scope="scope">
          <span>{{ scope.row.mntCont }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="处理状态" width="150px">
        <template slot-scope="scope">
          <span v-if="scope.row.isHndl === 1">已处理</span>
          <span v-else style="color: red;">未处理</span>
          <!-- <span>{{ scope.row.isHndl }}</span> -->
        </template>
      </el-table-column>

      <el-table-column align="center" label="经办人" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.hndlName }}</span>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>
<script>
import { parseTime } from '@/utils/index'
export default {
  name: 'BillWarn',
  // 日期格式转换
  filters: {
    parseTime (time) {
      var date = new Date(time)
      return parseTime(date, '{y}-{m}-{d} {h}:{i}:{s}')
    }
  },
  props: {
    billwarn: {
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
