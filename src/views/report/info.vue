<template>
  <el-container>
    <el-header height="30px">
      <svg style="position:relative; top:7px;" t="1597283628286" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3032" width="32" height="32"><path d="M837.091556 64c35.84 0 64.995556 28.672 64.995555 64v768c0 35.271111-29.155556 64-64.995555 64H186.88c-35.811556 0-64.995556-28.728889-64.995556-64v-768c0-35.328 29.184-64 64.995556-64H837.12z m0-64H186.88C115.114667 0 56.888889 57.315556 56.888889 128v768C56.888889 966.684444 115.114667 1024 186.908444 1024H837.12C908.885333 1024 967.111111 966.684444 967.111111 896v-768C967.111111 57.315556 908.885333 0 837.091556 0z" fill="#108EE9" p-id="3033" /><path d="M512 654.222222H256v-65.024h256V654.222222z m256-130.019555H256v-65.024h512v65.024z m0-130.048H256v-65.024h512v65.024z m0-130.019556H256V199.111111h512v65.024z" fill="#108EE9" p-id="3034" /></svg>
      &nbsp;&nbsp;<b style="font-size:20px;">详细信息查询</b>
    </el-header>
    <el-divider />
    <el-main>
      <el-form :ref="form" :model="form" :inline="true" size="small" label-width="80px" style="margin-left:-20px;margin-top:-20px;">
        <el-form-item label="票据种类">
          <el-select v-model="search.type" placeholder="请选择" clearable>
            <el-option v-for="item in billType" :key="item.id" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="票据名称:">
          <el-input v-model="search.billName" placeholder="票据名称" clearable style="width:100px" />
        </el-form-item>
        <el-form-item label="生效日期">
          <el-date-picker
            v-model="search.dateList"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width:300px"
            format="yyyy/MM/dd"
            unlink-panels
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-button type="primary" size="small" @click="query">查询</el-button>
      </el-form>
      <el-table
        :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
        border
        stripe
        highlight-current-row
        size="mini"
        style="width: 100%;margin: 0 auto"
        :header-cell-style="{background:'rgb(102,153,255)',color:'white'}"
      >
        <el-table-column prop="fbillId" label="票据ID" width="180" />
        <el-table-column prop="fbillCode" label="票据编码" width="180" />
        <el-table-column prop="fbillName" label="票据名称" />
        <el-table-column prop="fbillPrecode" label="票据代码" width="100px" />
        <el-table-column prop="fwarehouseId" label="仓库ID" width="100px" />
        <el-table-column prop="fcreateTime" label="创建时间" />
        <el-table-column prop="feffDate" label="生效日期" />
        <el-table-column
          size="small"
          label="查看详情"
          width="70px"
          prop="fbillName"
        >
          <template slot-scope="scope">
            <el-button icon="el-icon-notebook-2" circle style="margin: auto auto" @click="$router.push({name:'PageLife',params:{data:scope.row.fbillCode}})" />
          </template>
        </el-table-column>

      </el-table>
      <div style="text-align: right;margin-top: 30px;">
        <el-pagination
          background
          layout="prev, pager, next,total"
          :total="tableData.length"
          :page-size="pagesize"
          @current-change="current_change"
        />
      </div>
    </el-main>
  </el-container>

</template>

<script>
import { getReportBill, selectSearch } from '@/api/report/report'
export default {
  data () {
    return {
      billType: [{ label: '中央非税收入票据', value: '00000120' }, { label: '非税收入通用票据', value: '00000121' },
        { label: '非税收入一般缴款书', value: '00000122' }, { label: '医疗收费票据', value: '00000123' }, { label: '医疗门诊票据', value: '00000124' }],
      form: {
        name: '',
        type: '',
        data1: '',
        data2: ''
      },
      search: {
        type: null,
        billName: null,
        dateList: []
      },
      tableData: [],
      pagesize: 10,
      currentPage: 1
    }
  },
  mounted () {
    this.getTableData()
  },
  methods: {
    async getTableData () {
      const res = await getReportBill()
      this.tableData = res.data
    },
    current_change (currentPage) {
      this.currentPage = currentPage
    },
    async query () {
      const res = await selectSearch(this.search)
      this.tableData = res.data
    }
  }
}
</script>

<style>

</style>
