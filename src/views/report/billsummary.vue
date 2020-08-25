<template>
  <el-container>
    <el-header class="header">
      <el-tabs v-model="activename" type="card" style="margin-left:-5px">
        <el-tab-pane label="今日开票" name="1" />
        <el-tab-pane label="项目占比" name="2" />
        <el-tab-pane label="一周概况" name="3" />
      </el-tabs>
    </el-header>
    <el-container>
      <el-main class="main">
        <div :is="chart" :style="{width: chartWidth,height: chartHeight}" @son-msg="getMsgFromSon" />
      </el-main>
      <el-aside class="aside">
        <BillSummaryCard class="card" :cardname="cardname" :items="items" />
      </el-aside>
    </el-container>
  </el-container>
</template>

<script>
import BillSummaryEchart1 from '@/components/report/billSummaryEchart1'
import BillSummaryEchart2 from '@/components/report/billSummaryEchart2'
import BillSummaryEchart3 from '@/components/report/billSummaryEchart3'
import BillSummaryCard from '@/components/report/billSummaryCard1'
export default {
  components: {
    BillSummaryEchart1, BillSummaryEchart2, BillSummaryEchart3, BillSummaryCard
  },
  data () {
    return {
      chart: 'BillSummaryEchart1',
      activename: '1',
      chartWidth: (window.innerWidth * 0.65) + 'px',
      chartHeight: (window.innerHeight * 0.7) + 'px',
      cardname: '',
      items: []
    }
  },
  watch: {
    'activename': function (name) {
      this.chartWidth = (window.innerWidth * 0.65) + 'px'
      this.chartHeight = (window.innerHeight * 0.7) + 'px'
      this.changechart(name)
    }
  },
  mounted () {
    this.getMsgFromSon()
  },
  methods: {
    changechart (name) {
      switch (name) {
        case '2':
          this.chart = 'BillSummaryEchart2'
          this.getMsgFromSon()
          break
        case '3':
          this.chart = 'BillSummaryEchart3'
          this.getMsgFromSon()
          break
        default:
          this.chart = 'BillSummaryEchart1'
          this.getMsgFromSon()
      }
    },
    getMsgFromSon (dataFromSon) {
      this.cardname = dataFromSon.cardName
      this.items = dataFromSon.items
    }
  }
}
</script>

<style>
 .aside{
  margin-right:50px;
  margin-left: 0px;
  margin-top:8%;
  width: 70%;
 }
 .main{
  margin-left:0px;
  margin-top:-10px;
  height: 100%;
  width: 100%;
 }
.card{
  box-sizing:border-box;
  -moz-box-sizing:border-box; /* Firefox */
  -webkit-box-sizing:border-box; /* Safari */
  width:100%;
  float:left;
}
</style>
