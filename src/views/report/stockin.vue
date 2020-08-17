<template>
  <div>
    <el-select v-model="opinionData" placeholder="请选择" value-key="opinionData">
      <el-option v-for="item in list" :key="item.id" :label="item.label" :value="item.value" />
    </el-select>
    <el-select v-model="num" placeholder="请选择">
      <el-option v-for="item in 50" :key="item" :label="item" :value="item" />
    </el-select>
    <div id="t" style="width:800px;height:500px" />
  </div>
</template>

<script>
import echarts from 'echarts'
import ecStat from 'echarts-stat'

export default {
  data () {
    return {
      charts: '',
      dataec: [],
      num: 1,
      list: [
        {
          value: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
          label: '1'
        },
        {
          value: ['5', '6', '7', '8', '9', '10', '11', '12', '1', '2', '3', '4'],
          label: '2'
        },
        {
          value: ['9', '10', '11', '12', '1', '2', '3', '4', '5', '6', '7', '8'],
          label: '3'
        }
      ],
      opinionData: ['3', '2', '4', '4', '5', '12', '23', '51', '15', '6', '25', '9']
    }
  },
  watch: {
    'opinionData': function () {
      this.dataEc()
      this.drawLine('t')
    },
    'num': function () {
      this.dataEc()
      this.drawLine('t')
    }
  },
  mounted () {
    this.opinionData = this.list[0].value
    this.dataEc()
    this.drawLine('t')
  },

  methods: {
    drawLine (id) {
      this.charts = echarts.init(document.getElementById(id))
      this.charts.setOption({
        title: {
          text: '图表'
        },
        itemStyle: {
          // 点的颜色。
          // color: ['#5f9dff', '#6be1c1', '#ffed79', '#ee5959', '#7d92d4']
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          data: ['近七日收益', '拟合']
        },
        grid: {
          left: '10%',
          right: '10%',
          bottom: '10%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {},
            restore: {},
            dataZoom: {},
            magicType: {
              type: ['bar', 'line']
            },
            dataView: {}

          }
        },
        xAxis: {
          name: '日期',
          type: 'category',
          // boundaryGap: false,
          data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
        },
        yAxis: {
          name: '销量',
          type: 'value'
        },
        series: [
          {
            name: '近七日收益',
            type: 'line',
            stack: '总量',
            data: this.opinionData,
            itemStyle: { normal: { label: { show: true }}}
          // }
          }, {
            name: '拟合',
            smooth: true,
            data: ecStat.regression('polynomial', this.dataec, this.num).points,
            // lineStyle: {
            //   color: '#f00'
            // },
            type: 'line'
          }
        ]
      })
    },
    dataEc () {
      this.dataec = []
      for (let i = 0; i < 12; i++) {
        this.dataec.push([i, this.opinionData[i]])
      }
      console.log('dataec:' + this.dataec)
    }
  }
}
</script>

<style>

</style>
