<template>
  <div class="app-container">
    <el-form :inline="true" :model="stockInPageQuery" class="demo-form-inline">
      <el-form-item label="业务单号">
        <el-input v-model="stockInPageQuery.no" placeholder="单号" />
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker
          v-model="date"
          type="daterange"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading.body="loading"
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column align="center" label="序号" width="165">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="no"
        label="业务单号"
        width="180"
      />
      <el-table-column
        align="center"
        prop="date"
        label="创建时间"
        width="180"
      />
      <el-table-column
        align="center"
        label="审核状态"
      >
        <template slot-scope="scope">{{ getStatusStr(scope.row.changeState) }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            :disabled="scope.row.changeState === 1"
            @click="change(scope.$index, scope.row)"
          >审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="stockInPageQuery.page"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="stockInPageQuery.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="stockInPageQuery.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { getStockListPage, deleteStockIn } from '@/api/stockIn.js'

export default {
  data () {
    return {
      tableData: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      date: [null, null],
      stockInPageQuery: {
        no: '',
        changeState: 0,
        start: '',
        end: '',
        limit: 10,
        page: 1,
        total: 0
      },
      deleteDto: {
        id: '',
        changeMan: ''
      }
    }
  },

  computed: {
    // 计算属性的 getter
    getStatusStr: function () {
      return function (status) {
        if (status === 0) {
          return '未审核'
        } else if (status === 1) {
          return '审核通过'
        } else {
          return '审核未通过'
        }
      }
    }
  },

  created () {
    this.getTableData()
  },

  methods: {
    async getTableData () {
      this.loading = true
      const res = await getStockListPage(this.stockInPageQuery).catch(() => { this.loading = false })
      this.tableData = res.data.row
      this.stockInPageQuery.total = res.data.total
      this.stockInPageQuery.limit = res.data.limit
      this.stockInPageQuery.page = res.data.page
      console.log(this.tableData)
      this.loading = false
    },
    onSubmit () {
      console.log(this.date)
      console.log(this.stockInPageQuery)
      this.stockInPageQuery.start = this.date[0]
      this.stockInPageQuery.end = this.date[1]
      this.getTableData()
    },
    async handleDelete (index, row) {
      this.loading = true
      this.deleteDto.id = row.no
      console.log(this.deleteDto.id)
      this.deleteDto.changeMan = 'test'
      await deleteStockIn(this.deleteDto).catch(() => { this.loading = false })
      this.loading = false
      this.getTableData()
    },
    handleCurrentChange (val) {
      console.log(val)
    },
    handleSizeChange (val) {
      console.log(val)
    }
  }

}

</script>
