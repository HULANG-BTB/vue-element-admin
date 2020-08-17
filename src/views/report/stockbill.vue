<template>
  <el-container>
    <el-header height="30px">
      <svg style="position:relative; top:7px;" t="1597283628286" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3032" width="32" height="32"><path d="M837.091556 64c35.84 0 64.995556 28.672 64.995555 64v768c0 35.271111-29.155556 64-64.995555 64H186.88c-35.811556 0-64.995556-28.728889-64.995556-64v-768c0-35.328 29.184-64 64.995556-64H837.12z m0-64H186.88C115.114667 0 56.888889 57.315556 56.888889 128v768C56.888889 966.684444 115.114667 1024 186.908444 1024H837.12C908.885333 1024 967.111111 966.684444 967.111111 896v-768C967.111111 57.315556 908.885333 0 837.091556 0z" fill="#108EE9" p-id="3033" /><path d="M512 654.222222H256v-65.024h256V654.222222z m256-130.019555H256v-65.024h512v65.024z m0-130.048H256v-65.024h512v65.024z m0-130.019556H256V199.111111h512v65.024z" fill="#108EE9" p-id="3034" /></svg>
      &nbsp;&nbsp;<b style="font-size:20px;">票据库存明细表</b>
    </el-header>
    <el-divider />
    <el-main>
      <el-form :ref="form" :model="form" :inline="true" size="small" label-width="80px" style="margin-left:-40px;margin-top:-20px;">
        <el-form-item label="机构:">
          <el-select v-model="form.jigou" placeholder="请选择" style="width:100px">
            <el-option label="A" value="A" />
            <el-option label="B" value="B" />
          </el-select>
        </el-form-item>
        <el-form-item label="票据:">
          <el-select v-model="search.billName" placeholder="请选择" style="width:100px">
            <el-option v-for="item in 3" :key="item" :label="item" :value="item" />
            <el-option label="bill1" value="bill1" />
            <el-option label="bill2" value="bill2" />
          </el-select>
        </el-form-item>
        <el-form-item label="显示票号:">
          <el-select v-model="form.piaohao" placeholder="请选择" style="width:100px">
            <el-option label="是" value="A" />
            <el-option label="否" value="B" />
          </el-select>
        </el-form-item>
        <el-form-item label="通知日期">
          <el-date-picker
            v-model="search.dateList"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width:300px"
            format="yyyy/MM/dd"
            value-format="yyyy:MM:dd HH:mm:ss"
          />
        </el-form-item>
        <el-button type="primary" size="small" @click="query">查询</el-button>
        <el-button type="text" @click="dialogVisible = true">高级查询</el-button>
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
        <el-table-column prop="fagenCode" label="票据编码" width="180" />
        <el-table-column prop="fbillName" label="票据名称" />
        <el-table-column prop="fbillPrecode" label="票据代码" />
        <el-table-column prop="fwarehouseId" label="仓库ID" />
        <el-table-column prop="fcreateTime" label="创建时间" />
        <el-table-column prop="feffDate" label="生效日期" />

      </el-table>
      <div style="text-align: center;margin-top: 30px;">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="tableData.length"
          :page-size="pagesize"
          @current-change="current_change"
        />
      </div>
      <el-dialog top="20vh" title="高级查询" :visible.sync="dialogVisible" :close-on-click-modal="false" width="40%">
        <el-form ref="form1" :model="form1" label-width="70px" style="margin-top:10px" size="mini">
          <el-form-item label="起止日期">
            <el-date-picker v-model="form1.date1" type="date" style="width:180px" format="yyyy/MM/dd" />
            至
            <el-date-picker v-model="form1.date2" type="date" style="width:180px" format="yyyy/MM/dd" />
          </el-form-item>
          <el-form-item label="分发机构">
            <el-select v-model="form1.danwei" placeholder="请选择">
              <el-option label="A单位" value="A" />
              <el-option label="B单位" value="B" />
            </el-select>
          </el-form-item>
          <el-form-item label="票据种类">
            <el-select v-model="form1.type" placeholder="请选择">
              <el-option label="A票据" value="A" />
              <el-option label="B票据" value="B" />
            </el-select>
          </el-form-item>
          <el-form-item label="开票方式">
            <el-select v-model="form1.kaipiao" placeholder="请选择">
              <el-option label="电子票据" value="A" />
              <el-option label="纸质票据" value="B" />
            </el-select>
          </el-form-item>
          <el-form-item label="显示票号">
            <el-select v-model="form1.xianshi" placeholder="请选择">
              <el-option label="是" value="A" />
              <el-option label="否" value="B" />
            </el-select>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">查 询</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>

    </el-main>
  </el-container>

</template>

<script>
import { getReportBill, selectSearch } from '@/api/report/report'
export default {
  data () {
    return {
      dialogVisible: false,
      form: {
        name: '',
        jigou: '',
        type: '',
        piaohao: '',
        data1: '',
        data2: ''
      },
      form1: {
        data1: '',
        data2: '',
        danwei: '',
        type: '',
        kaipiao: '',
        xianshi: ''

      },
      search: {
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
      this.tableData = res
    },
    current_change (currentPage) {
      this.currentPage = currentPage
    },
    async query () {
      console.log(this.search)
      const res = await selectSearch(this.search)
      console.log(res)
      this.tableData = res
    }
  }
}
</script>

<style>

</style>
