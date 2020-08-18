<template>
  <div class="app-container">
    <el-form
      :model="query"
      label-width="80px"
      class="demo-for-inline"
      :inline="true"
      @keyup.enter.native="handleSearch"
    >
      <el-form-item label="业务单号:">
        <el-input
          v-model="query.no"
          placeholder="请输入业务单号"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label="日期:">
        <div class="block">
          <el-date-picker
            v-model="query.date"
            type="daterange"
            value-format="yyyy-MM-dd"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            size="small"
          />
        </div>
      </el-form-item>
      <el-form-item label>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="handleSearch"
        >搜索</el-button>
      </el-form-item>
      <el-form-item label>
        <el-button
          type="success"
          size="small"
          @click="getTableData"
        >重载数据</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading.body="loading" :data="tableData" style="width: 100%">
      <el-table-column label="序号" width="90">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.$index+1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">
            <el-tag v-if="scope.row.changeState==0" type="info" effect="dark" width="50px">未审核</el-tag>
            <el-tag v-if="scope.row.changeState==1" type="success" effect="dark" width="50px">审核通过</el-tag>
            <el-tag v-if="scope.row.changeState==2" type="warning" effect="dark" width="50px">审核未通过</el-tag>
            <el-tag v-if="scope.row.changeState==3" type="danger" effect="dark" width="50px">无需审核</el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="业务单号" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.no }}</span>
        </template>
      </el-table-column>
      <el-table-column label="编制日期" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="退票原因" width="540" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.returnReason }}</span>
        </template>
      </el-table-column>
      <el-table-column label="经办人" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.changeMan }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next, sizes, total, jumper"
      align="right"
      :total="query.total"
      :current-page="query.page"
      :page-sizes="[2, 10, 20, 50, 100, 500, 1000]"
      :page-size="query.limit"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { getStockReturnList, getListStockReturnByDateOrNo } from '@/api/stockreturn.js'

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
      // date: [0, 0],
      query: {
        page: 1,
        limit: 5,
        total: 0,

        no: '',
        date: [new Date(new Date().getTime() - 3600 * 1000 * 24 * 90), new Date()],
        startTime: '',
        endTime: ''
      }
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    async getTableData () {
      this.loading = true
      const res = await getStockReturnList(this.query).catch(() => { this.loading = false })
      console.log(res)
      this.query.limit = res.limit
      this.query.total = res.total
      this.query.page = res.page
      this.tableData = res.row
      console.log(this.query.limit, this.query.total, this.query.page)
      this.loading = false
    },
    async handleSearch () {
      this.query.page = 1
      this.loading = true
      this.query.startTime = this.query.date[0]
      this.query.endTime = this.query.date[1]
      // const res = await getListStockReturnByDateOrNo(this.query).catch(() => { this.loading = false })
      // this.tableData = res
      this.getTableData()
      this.loading = false
    },
    handleEdit (index, row) {
      console.log(index, row)
    },
    handleDelete (index, row) {
      console.log(index, row)
    },
    handleSizeChange (val) {
      this.query.limit = val
      this.getTableData()
    },
    handleCurrentChange (val) {
      this.query.page = val
      this.getTableData()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
