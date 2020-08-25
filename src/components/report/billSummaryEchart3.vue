<template>
  <div>
    <div id="billSummaryChart3" class="Echarts" />
  </div>
</template>

<script>
import echarts from 'echarts'
import { selectWeekBillSummary } from '@/api/report/report'
export default {
  name: 'BillSummaryEchart3',
  data () {
    return {
      msg: {
        cardName: '',
        items: []
      }
    }
  },
  mounted () {
    // 后端传输的数据
    selectWeekBillSummary().then(res => {
      console.log(res)
      this.myEcharts3(res.data)
      this.setItem(res.data)
      this.sendMsg()
    })
    window.onresize = function () {
      this.myChart.resize()
    }
  },
  methods: {
    myEcharts3 (chartdata) {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.getElementById('billSummaryChart3'))
      const chart3seriesdata = []
      const legenddata = []
      for (let i = 0; i < chartdata.length; i++) {
        const tmp = {
          name: chartdata[i].agenname,
          type: 'bar',
          stack: '总量',
          label: {
            show: true,
            position: 'insideRight'
          },
          data: chartdata[i].billnum
        }
        legenddata.push(chartdata[i].agenname)
        chart3seriesdata.push(tmp)
      }
      // 指定图表的配置项和数据
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: legenddata
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: ['-6', '-5', '-4', '-3', '-2', '-1', '今日']
        },
        series: chart3seriesdata
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },
    sendMsg () {
      // func: 是父组件指定的传数据绑定的函数，this.msg:子组件给父组件传递的数据
      this.$emit('son-msg', this.msg)
    },
    setItem (datatmp) {
      this.msg.items = ['显示近七日开票汇总', '每日显示票据数由各单位开票汇总组成']
      this.msg.cardName = '一周开票汇总'
    }
  }
}
</script>

<style>
.Echarts{
  width: 100%;
  height: 100%;
}
</style>
