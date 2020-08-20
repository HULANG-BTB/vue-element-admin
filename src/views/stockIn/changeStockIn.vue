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
      style="width: 100%; margin-top: 30px;"
      border
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
        label="创建人"
      >
        <template slot-scope="scope">{{ scope.row.author }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="备注"
      >
        <template slot-scope="scope">{{ scope.row.memo }}</template>
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
      background
      :current-page="stockInPageQuery.page"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="stockInPageQuery.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="stockInPageQuery.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!----------------查看入库单详情对话框------------------->

    <el-dialog title="入库单详情" :visible.sync="dialogFormVisible" width="60%">
      <el-form :model="stockChangeDTO" label-width="80px" class="demo-ruleForm" size="mini">
        <el-form-item label="审核意见">
          <el-input v-model="stockChangeDTO.changeSitu" type="textarea" />
        </el-form-item>
      </el-form>
      <div>
        <el-table
          :data="stockIn.addStockInItemDTOArray"
          style="width: 100%; margin-top: 30px;"
          border
        >
          <el-table-column
            type="index"
            width="50px"
            align="center"
          />
          <el-table-column
            label="票据编码"
            width="150%"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.billCode }}
            </template>
          </el-table-column>
          <el-table-column
            label="票据名称"
            width="150px"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.billName }}
            </template>
          </el-table-column>
          <el-table-column
            label="数量"
            width="100px"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.number }}
            </template>
          </el-table-column>
          <el-table-column
            label="起始号"
            width="180px"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.billNo1 }}
            </template>
          </el-table-column>
          <el-table-column
            label="终止号"
            width="180px"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.billNo2 }}
            </template>
          </el-table-column>
        </el-table></div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="reject">审核驳回</el-button>
        <el-button type="primary" @click="accept">审核通过</el-button>
      </div>
    </el-dialog>

    <!-------------------新增明细对话框结束---------------------->
  </div>
</template>

<script>
import { getStockListPage, getStockInInfo, change } from '@/api/stockIn.js'

export default {
  data () {
    return {
      tableData: [],
      // 对话框显示
      dialogFormVisible: false,
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
      date: ['', ''],
      stockInPageQuery: {
        no: '',
        changeState: 0,
        start: '',
        end: '',
        limit: 10,
        page: 1,
        total: 0
      },
      stockIn: {
        no: '',
        memo: '',
        author: 'test',
        changeMan: 'test',
        billSource: '',
        addStockInItemDTOArray: []
      },
      stockChangeDTO: {
        id: '',
        date: '',
        changeMan: '',
        changeState: '',
        changeSitu: ''
      }
    }
  },

  computed: {
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
      this.loading = false
    },
    onSubmit () {
      this.stockInPageQuery.start = this.date[0]
      this.stockInPageQuery.end = this.date[1]
      this.getTableData()
    },
    handleCurrentChange (val) {
      this.stockInPageQuery.page = val
      this.getTableData()
    },
    handleSizeChange (val) {
      this.stockInPageQuery.limit = val
      this.getTableData()
    },
    change (index, row) {
      getStockInInfo(row.no).then(response => {
        this.stockIn = response.data
      })
        .catch()
      this.dialogFormVisible = true
    },
    // 审核驳回操作
    reject () {
      // 审核驳回必须填写审核意见
      if (this.stockChangeDTO.changeSitu === '') {
        this.$message.error('需要填写审核意见')
        return
      }
      this.stockChangeDTO.changeState = 2
      this.stockChangeDTO.changeMan = 'test'
      this.stockChangeDTO.id = this.stockIn.no
      this.stockChangeDTO.date = new Date()
      change(this.stockChangeDTO).then(response => {
        this.$message({
          message: '审核操作成功',
          type: 'success'
        })
        this.dialogFormVisible = false
        this.getTableData()
      }).catch(response => {
        this.$message.error('失败了，请稍后再试')
      })
    },
    // 审核通过
    accept () {
      this.stockChangeDTO.changeState = 1
      this.stockChangeDTO.changeMan = 'test'
      this.stockChangeDTO.id = this.stockIn.no
      this.stockChangeDTO.date = new Date()
      change(this.stockChangeDTO).then(response => {
        this.$message({
          message: '审核操作成功',
          type: 'success'
        })
        this.dialogFormVisible = false
        this.getTableData()
      }).catch(response => {
        this.$message.error('失败了，请稍后再试')
      })
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

