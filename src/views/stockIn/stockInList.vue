<template>
  <div class="app-container">
    <el-form :inline="true" :model="stockInPageQuery" class="demo-form-inline">
      <div class="my-form-item">
        <el-form-item label="业务单号">
          <el-input v-model="stockInPageQuery.no" placeholder="单号" size="small" />
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker
            v-model="date"
            type="daterange"
            unlink-panels
            size="small"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="onSubmit"
          >查询</el-button>
        </el-form-item>
        <el-form-item label>
          <el-button
            type=""
            icon="el-icon-refresh"
            size="small"
            @click="getTableData"
          >重置</el-button>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="审核状态">
          <el-radio-group
            v-model="stockInPageQuery.changeState"
            size="medium"
            @change="onSubmit"
          >
            <el-radio-button label="0">未审核</el-radio-button>
            <el-radio-button label="1">审核通过</el-radio-button>
            <el-radio-button label="2">审核不通过</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="入库状态">
          <el-radio-group
            v-model="stockInPageQuery.status"
            size="medium"
            @change="onSubmit"
          >
            <el-radio-button label="0">未入库</el-radio-button>
            <el-radio-button label="1">已入库</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <router-link :to="'/stockIn/addStockIn'">
            <el-button
              size="small"
              type="primary"
            >新增</el-button>
          </router-link>
        </el-form-item>
      </div>
    </el-form>

    <el-table
      v-loading.body="loading"
      :data="tableData"
      style="width: 100%; margin-top: 30px;"
      border
    >
      <el-table-column align="center" label="序号" width="65">
        <template slot-scope="scope">{{ (stockInPageQuery.page - 1) * stockInPageQuery.limit + scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="no"
        label="业务单号"
      />
      <el-table-column
        align="center"
        prop="date"
        label="创建时间"
      />
      <el-table-column
        align="center"
        prop="author"
        label="创建人"
      />
      <el-table-column
        align="center"
        prop="memo"
        label="备注"
      />
      <el-table-column
        align="center"
        label="审核状态"
      >
        <template slot-scope="scope">{{ getChangeStr(scope.row.changeState) }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="入库状态"
      >
        <template slot-scope="scope">{{ getStatusStr(scope.row.status) }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
      >
        <template slot-scope="scope">
          <!-- 点击编辑按钮跳转到编辑页面 -->
          <router-link :to="'/stockIn/editStockIn/'+scope.row.no">
            <el-button
              size="mini"
              type="primary"
              :disabled="scope.row.changeState === 1"
            >编辑</el-button>
          </router-link>
          <el-button
            size="mini"
            type="danger"
            :disabled="!deleteable(scope.row.changeState)"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
          <el-button
            :disabled="!storeable(scope.row.changeState, scope.row.status)"
            type="primary"
            size="mini"
            @click="handleSubmit(scope)"
          >入库</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :current-page="stockInPageQuery.page"
      :page-sizes="[3, 5, 10, 15, 20]"
      :page-size="stockInPageQuery.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="stockInPageQuery.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { getStockListPage, deleteStockIn, store } from '@/api/stockIn.js'

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
        status: 0,
        start: '',
        end: '',
        limit: 10,
        page: 1,
        total: 0
      },
      deleteDto: {
        id: '',
        changeMan: ''
      },
      storeDto: {
        no: ''
      }
    }
  },

  computed: {
    getChangeStr: function () {
      return function (status) {
        if (status === 0) {
          return '未审核'
        } else if (status === 1) {
          return '审核通过'
        } else {
          return '审核未通过'
        }
      }
    },
    getStatusStr: function () {
      return function (status) {
        if (status === 0) {
          return '未入库'
        } else if (status === 1) {
          return '已入库'
        }
      }
    }
  },

  created () {
    this.getTableData()
  },

  methods: {
    deleteable (changeState) {
      return changeState === 0
    },
    storeable (changeState, status) {
      return (changeState === 1) && (status === 0)
    },
    async getTableData () {
      this.loading = true
      const res = await getStockListPage(this.stockInPageQuery).catch(() => { this.loading = false })
      this.tableData = res.data.row
      this.stockInPageQuery.total = res.data.total
      this.stockInPageQuery.limit = res.data.limit
      this.stockInPageQuery.page = res.data.page
      this.loading = false
    },
    onSubmit () {
      this.stockInPageQuery.start = this.date[0]
      this.stockInPageQuery.end = this.date[1]
      this.getTableData()
    },
    async handleDelete (index, row) {
      this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.deleteDto.id = row.no
        this.deleteDto.changeMan = 'test'
        deleteStockIn(this.deleteDto).catch(() => { this.loading = false })
        this.loading = false
        this.getTableData()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSubmit (scope) {
      this.$confirm('确定入库吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.storeDto.no = scope.row.no
        store(this.storeDto).then(response => {
          this.$message({
            type: 'success',
            message: '入库成功!'
          })
          this.loading = false
          this.getTableData()
        }).catch(() => {
          this.loading = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消入库'
        })
      })
    },
    handleCurrentChange (val) {
      this.stockInPageQuery.page = val
      this.getTableData()
    },
    handleSizeChange (val) {
      this.stockInPageQuery.limit = val
      this.getTableData()
    }
  }

}

</script>

<style lang="scss" scoped>
.app-container {
  .sentDate-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
.my-form-item {
  .el-form-item {
    margin-right: 15px;
  }
}
.my-dialog {
  .el-form-item {
    margin-left: 100px;
    margin-right: 200px;
  }
}
.el-col {
  min-height: 1px;
}
// 跳转页脚
.el-pagination {
  float: right;
  margin-right: 30px;
}
</style>

