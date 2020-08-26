<template>
  <div>
    <div id="billSummaryChart2" class="Echarts" />
  </div>
</template>

<script>
import echarts from 'echarts'
import { selectTodayBillKind } from '@/api/report/report'
export default {
  name: 'BillSummaryEchart2',
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
    selectTodayBillKind().then(res => {
      const tmpdata = this.genData(res.data)
      this.myEcharts2(tmpdata)
      this.setItem(res.data)
      console.log(this.msg)
      this.sendMsg()
    })
    window.onresize = function () {
      this.myChart.resize()
    }
  },
  methods: {
    myEcharts2 (data) {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.getElementById('billSummaryChart2'))
      // 指定图表的配置项和数据
      const option = {
        title: {
          text: '开票票据种类',
          subtext: '今日数据',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
          data: data.legendData,
          selected: data.selected
        },
        series: [
          {
            name: '票据种类',
            type: 'pie',
            radius: '65%',
            center: ['60%', '50%'],
            data: data.seriesData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },
    genData (chart2data) {
      const legendData = []
      const seriesData = []
      const selected = {}
      for (let i = 0; i < chart2data.length; i++) {
        const tmpname = chart2data[i].billname
        legendData.push(tmpname)
        seriesData.push({
          name: tmpname,
          value: chart2data[i].billnum
        })
        if (i < 4) {
          selected[tmpname] = true
        } else {
          selected[tmpname] = false
        }
      }
      return {
        legendData: legendData,
        seriesData: seriesData,
        selected: selected
      }
    },
    sendMsg () {
      // func: 是父组件指定的传数据绑定的函数，this.msg:子组件给父组件传递的数据
      this.$emit('son-msg', this.msg)
    },
    setItem (datatmp) {
      console.log(datatmp)
      let nameMax = datatmp[0].billname
      let numMax = datatmp[0].billnum
      let nameMin = datatmp[0].billname
      let numMin = datatmp[0].billnum
      let avg = datatmp[0].billnum
      let sum = datatmp[0].billnum
      for (let i = 0; i <= datatmp.length; i++) {
        const tmp1 = datatmp[0].billnum
        if (tmp1 > numMax) {
          nameMax = datatmp[i].billname
          numMax = datatmp[i].billnum
        }
        if (tmp1 < numMin) {
          nameMin = datatmp[i].billname
          numMin = datatmp[i].billnum
        }
        sum = sum + tmp1
      }
      avg = sum / datatmp.length
      this.msg.items = ['占比最多:' + nameMax + '共:' + numMax + '张票据 ', '占比最少:' + nameMin + '共:' + numMin + '张票据 ',
        '项目票据总值:' + sum, '项目票据数均值:' + avg]
      this.msg.cardName = '项目票据占比'
    }
  }
}
</script>

<style>
.Echarts{
  width: 0%;
  height: 100%;
}
</style>
