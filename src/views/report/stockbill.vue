<template>
  <el-tabs
    v-model="activeName"
    type="card"
    @tab-click="handleClick"
  >
    <el-tab-pane
      label="柱状图"
      name="first"
    >
      <el-container>
        <el-main>
          <div
            id="tar"
            style="width:700px;height:480px"
          />
        </el-main>
        <el-aside width="200px">
          h
        </el-aside>
      </el-container>
    </el-tab-pane>
    <el-tab-pane
      label="饼状图"
      name="second"
    >
      <el-container>
        <el-main>
          <div
            id="pie"
            style="width:700px;height:480px"
          />
        </el-main>
        <el-aside width="200px">
          n
        </el-aside>
      </el-container>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import echarts from 'echarts'
export default {
  data () {
    return {
      activeName: 'first',
      opinionData: ['3', '2', '4', '4', '5', '12', '23', '51', '15', '6', '25', '9'],
      option1: {
        title: {
          text: '折线图'
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
          data: ['入库数量']
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
          name: '数量',
          type: 'value'
        },
        series: [
          {
            name: '入库数量',
            type: 'line',
            stack: '总量',
            data: '',
            itemStyle: { normal: { label: { show: true }}}
          }
        ]
      },
      option2: {
        title: {
          text: '2019年每月库存量',
          subtext: '纯属虚构',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            selectedOffset: 30,
            selectedMode: 'single',
            clockwise: true,
            data: [
              { value: 335, name: '直接访问' },
              { value: 310, name: '邮件营销' },
              { value: 234, name: '联盟广告' },
              { value: 135, name: '视频广告' },
              { value: 1548, name: '搜索引擎' }
            ],
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
    }
  },
  mounted () {
    this.option1.series[0].data = this.opinionData
    this.drawLine('tar', this.option1)
    this.drawLine('pie', this.option2)
  },
  methods: {
    drawLine (id, option) {
      const charts = echarts.init(document.getElementById(id))
      charts.setOption(option)
    }
  }
}
</script>

<style>
</style>
