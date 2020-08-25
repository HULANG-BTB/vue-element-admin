<template>
  <el-tabs type="border-card">
    <el-tab-pane label="柱状图">
      <el-container>
        <el-main style="padding: 10px">
          <div id="echarts" style="width: 800px;height:480px;" />
        </el-main>
      </el-container>
    </el-tab-pane>
    <el-tab-pane label="饼状图">
      <el-container>
        <el-main style="padding: 0">
          <div id="pie" style="width: 800px;height:500px;" />
        </el-main>
      </el-container>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import echarts from 'echarts'
import {
  getNumOut, getBarOut
} from '@/api/report/report'

export default {
  name: 'Echarts',
  data () {
    return {
      data: {
        legendData: [],
        seriesData: []
      },
      activeName: 'second',
      barData: {}
    }
  },
  mounted () {
    this.getList()
    this.getBar()
  },
  methods: {
    /* 饼状图的数据填入*/
    async getList () {
      const list = (await getNumOut()).data
      this.setPie(list)
      this.myPie()
    },
    /* 柱状图数据填入*/
    async getBar () {
      const barData = (await getBarOut()).data
      this.myBar(barData)
    },
    myBar (barData) {
      const myChart = echarts.init(document.getElementById('echarts'))
      this.barData = barData
      const option = {
        baseOption: {
          timeline: {
            // 时间轴
            axisType: 'category',
            autoPlay: true,
            playInterval: 1000,
            data: this.getYear(),
            label: {
              formatter: function (s) {
                return new Date(s).getFullYear()
              }
            }
          },
          tooltip: {},
          legend: {
            left: 'right',
            data: ['数量'],
            selected: true
          },
          calculable: true,
          grid: {
            top: 80,
            bottom: 100,
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow',
                label: {
                  show: true,
                  formatter: function (params) {
                    return params.value.replace('\n', '')
                  }
                }
              }
            }
          },
          xAxis: [{
            'type': 'category',
            'axisLabel': {
              'interval': 0
            },
            'data': [
              '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月',
              '9月', '10月', '11月', '12月'
            ],
            splitLine: {
              show: false
            }
          }],
          yAxis: [{
            type: 'value',
            name: '数量/份'
          }],
          series: [{
            name: '数量',
            type: 'bar'
          }]
        },
        options: [{
          // title是主标题
          title: {
            text: this.getYear()[0] + '出库票据'
          },
          series: [{
            data: this.barData['2014']
          }]
        },
        {
          title: {
            text: this.getYear()[1] + '出库票据'
          },
          series: [{
            data: this.barData['2015']
          }]
        },
        {
          title: {
            text: this.getYear()[2] + '出库票据'
          },
          series: [{
            data: this.barData['2016']
          }]
        },
        {
          title: {
            text: this.getYear()[3] + '出库票据'
          },
          series: [{
            data: this.barData['2017']
          }]
        },
        {
          title: {
            text: this.getYear()[4] + '出库票据'
          },
          series: [{
            data: this.barData['2018']
          }]
        },
        {
          title: {
            text: this.getYear()[5] + '出库票据'
          },
          series: [{
            data: this.barData['2019']
          }]
        },
        {
          title: {
            text: this.getYear()[6] + '出库票据'
          },
          series: [{
            data: this.barData['2020']
          }]
        }
        ]
      }
      myChart.setOption(option)
    },
    myPie () {
      const myPie = echarts.init(document.getElementById('pie'))
      const option = {
        title: {
          text: '票据种类占比',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a}: {b} <br/> {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 100,
          bottom: 20,
          data: this.data.legendData, /* 字符串数组，放的名字 [name1,name2]*/
          selected: true /* 对象数组，存放的对应名字是否被选中   {name1,name2}*/
        },
        series: [{
          name: '姓名',
          type: 'pie',
          radius: '55%',
          center: ['35%', '50%'],
          data: this.data.seriesData /* 对象数组，name对应legenddata的name,value是比重 [{name:'',value:''}]*/
        }]
      }
      myPie.setOption(option)
    },
    setPie (list) {
      console.log(list)
      for (let i = 0; i < list.length; i++) {
        // legendData是种类名称的字符串数组
        this.data.legendData[i] = list[i].fbillName
        // seriesData是对象数组，存放了某个种类的数量
        this.data.seriesData.push({
          name: list[i].fbillName,
          value: list[i].fnumber
        })
      }
    },
    getYear () {
      const year = []
      for (let i = 0; i < 7; i++) {
        year[i] = new Date().getFullYear() - 6 + i
      }
      return year
    }
  }
}
</script>

<style>

</style>
