<template>
  <el-container>
    <el-header height="30px">
      <svg
        style="position:relative; top:7px;"
        t="1597283628286"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="3032"
        width="32"
        height="32"
      >
        <path
          d="M837.091556 64c35.84 0 64.995556 28.672 64.995555 64v768c0 35.271111-29.155556 64-64.995555 64H186.88c-35.811556 0-64.995556-28.728889-64.995556-64v-768c0-35.328 29.184-64 64.995556-64H837.12z m0-64H186.88C115.114667 0 56.888889 57.315556 56.888889 128v768C56.888889 966.684444 115.114667 1024 186.908444 1024H837.12C908.885333 1024 967.111111 966.684444 967.111111 896v-768C967.111111 57.315556 908.885333 0 837.091556 0z"
          fill="#108EE9"
          p-id="3033"
        />
        <path
          d="M512 654.222222H256v-65.024h256V654.222222z m256-130.019555H256v-65.024h512v65.024z m0-130.048H256v-65.024h512v65.024z m0-130.019556H256V199.111111h512v65.024z"
          fill="#108EE9"
          p-id="3034"
        /></svg>
      &nbsp;&nbsp;<b style="font-size:20px;">缴费明细信息查询</b>
    </el-header>
    <el-divider />
    <el-main>
      <el-form
        :inline="true"
        size="small"
        label-width="120px"
        style="margin-top:-20px;"
      >
        <el-form-item label="缴款人电话号:">
          <el-input
            v-model="search.fpayerTel"
            placeholder="缴款人电话号"
            clearable
            style="width:150px"
          />
        </el-form-item>
        <el-form-item label="入账单位类型:">
          <el-select
            v-model="search.ftype"
            placeholder="请选择"
            style="width:100px"
          >
            <el-option
              label="开票单位"
              value="0"
            />
            <el-option
              label="缴款单位"
              value="1"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="单位名称:">
          <el-input
            v-model="search.fagenName"
            placeholder="单位名称"
            clearable
            style="width:120px"
          />
        </el-form-item>
        <el-form-item label="入账时间">
          <el-date-picker
            v-model="search.fTimeList"
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
        <el-button
          type="primary"
          size="small"
          @click="query"
        >查询</el-button>
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
        <el-table-column
          prop="fagenIdcode"
          label="单位代码"
          width="180"
        />
        <el-table-column
          prop="fagenName"
          label="单位名称"
          width="180"
        />
        <el-table-column
          prop="fagenTime"
          label="开票时间"
        />
        <el-table-column
          prop="ftype"
          label="入账单位类型"
          width="100px"
        />
        <el-table-column
          prop="fbillBatchId"
          label="票据批次号"
          width="100px"
        />
        <el-table-column
          prop="faccountId"
          label="入账凭证号"
        />
        <el-table-column
          prop="ftime"
          label="入账时间"
        />
        <el-table-column
          prop="faccount"
          label="入账金额"
        />
        <el-table-column
          prop="fwaitAccount"
          label="应缴费金额"
        />
        <el-table-column
          prop="fpayerTel"
          label="缴款人电话"
        />
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
import { getAll } from '@/api/report/report'
export default {
  data () {
    return {
      search: {
        fTimeList: [],
        fagenName: '',
        fpayerTel: '',
        ftype: ''
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
      const res = await getAll(this.search)
      this.tableData = res.data
    },
    current_change (currentPage) {
      this.currentPage = currentPage
    },
    async query () {
      console.log(this.search)
      const res = await getAll(this.search)
      console.log(res)
      this.tableData = res.data
    }
  }
}
</script>

<style>
</style>
