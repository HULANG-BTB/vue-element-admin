<template>
  <div>
    <div id="billSummaryChart1" class="Echarts" />
  </div>
</template>

<script>
import echarts from 'echarts'
import { selectTodayBillSummary } from '@/api/report/report'
export default {
  name: 'BillSummaryEchart1',
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
    selectTodayBillSummary().then(res => {
      console.log(res)
      const chartdata = {
        billnum: res.data.billnum,
        billmoney: res.data.billMoneys
      }
      console.log(chartdata)
      this.myEcharts1(chartdata)
      this.setItem(res.data)
      this.sendMsg()
    })
    const timer = setInterval(() => {
    // 后端传输的数据
      selectTodayBillSummary().then(res => {
        console.log(res)
        const chartdata = {
          billnum: res.data.billnum,
          billmoney: res.data.billmoney
        }
        console.log(chartdata)
        this.myEcharts1(chartdata)
      })
    }, 360000)
    this.$once('hook:beforeDestroy', () => {
      clearInterval(timer)
    })
  },
  methods: {
    myEcharts1 (chartdata) {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('billSummaryChart1'))
      // 指定图表的配置项和数据
      var option = {
        title: {
          text: '今日开票',
          subtext: '动态实时监控'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#283b56'
            }
          }
        },
        legend: {
          data: ['开票金额', '单位时间开票']
        },
        toolbox: {
          show: true,
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {}
          }
        },
        dataZoom: {
          show: false,
          start: 0,
          end: 100
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: true,
            data: (function () {
              var now = new Date()
              var res = []
              var len = 10
              while (len--) {
                res.unshift(now.toLocaleTimeString().replace(/^\D*/, ''))
                now = new Date(now - 360000)
              }
              return res
            })()
          },
          {
            type: 'category',
            boundaryGap: true,
            data: (function () {
              var res = []
              var len = 10
              while (len--) {
                res.push(10 - len - 1)
              }
              return res
            })()
          }
        ],
        yAxis: [
          {
            type: 'value',
            scale: true,
            name: '金额',
            max: 1000,
            min: 0,
            boundaryGap: [0.2, 0.2]
          },
          {
            type: 'value',
            scale: true,
            name: '开票数',
            max: 1200,
            min: 0,
            boundaryGap: [0.2, 0.2]
          }
        ],
        series: [
          {
            name: '开票数',
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: chartdata.billnum
          },
          {
            name: '收入',
            type: 'line',
            data: chartdata.billmoney
          }
        ]
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },
    sendMsg () {
      // func: 是父组件指定的传数据绑定的函数，this.msg:子组件给父组件传递的数据
      this.$emit('son-msg', this.msg)
    },
    setItem (datatmp) {
      this.msg.items = ['实时显示1小时内开票变得', '每6分钟自动刷新查询']
      this.msg.cardName = '今日开票明细'
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
