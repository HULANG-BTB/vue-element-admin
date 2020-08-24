<template>
  <div class="bill-available-container">
    <el-table v-loading="listLoading" :data="billavailable" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号" width="100px">
        <template slot-scope="scope">
          <!-- 前端序号如何生成 -->
          <span>{{ scope.$index+1 }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="票据编码" min-width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.billCode }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="票据名称" min-width="300px">
        <template slot-scope="scope">
          <span>{{ scope.row.billName }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="核定数量">
        <template slot-scope="scope">
          <span>{{ scope.row.number }}</span>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>
<script>
export default {
  name: 'BillAvailable',
  props: {
    billavailable: {
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
