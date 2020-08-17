<template>
  <el-container>
    <el-main>
      <!-- <p>{{ date }}</p> -->
      <el-carousel indicator-position="outside" height="400px" :autoplay="false" @change="current_change">
        <el-carousel-item label="入库明细">
          <div id="main" style="width: 800px;height: 400px;margin: 0 auto" />
        </el-carousel-item>
        <el-carousel-item label="出库明细">
          <div id="main1" style="width: 700px;height: 400px;border:1px solid black" />
        </el-carousel-item>
        <el-carousel-item label="库存明细">
          <div id="main" style="width: 700px;height: 400px;" />
        </el-carousel-item>
        <el-carousel-item label="销毁明细">
          <div id="main" style="width: 700px;height: 400px;" />
        </el-carousel-item>
        <el-carousel-item label="缴费明细">
          <div id="main" style="width: 700px;height: 400px;" />
        </el-carousel-item>
        <el-carousel-item label="开票明细">
          <div id="main" style="width: 700px;height: 400px;" />
        </el-carousel-item>
      </el-carousel>
    </el-main>
    <el-aside width="200px" style="margin-right:50px">
      <el-container direction="vertical">
        <el-button type="primary" style="margin-top:20px" @click="$router.push('/report/stockin')">票据入库明细</el-button>
        <br />
        <el-button type="primary" @click="$router.push('/report/stockout')">票据出库明细</el-button>
        <br />
        <el-button type="primary" @click="$router.push('/report/stockbill')">票据库存明细</el-button>
        <br />
        <el-button type="primary">票据缴款明细</el-button>
        <br />
        <el-button type="primary" @click="$router.push('/report/stockdestroy')">票据销毁明细</el-button>
        <br />
        <el-button type="primary">开票汇总明细</el-button>
      </el-container>
    </el-aside>
  </el-container>
</template>

<script>

import echarts from 'echarts'
export default {
  name: 'Financial',
  data () {
    return {
      list: ['第一条', '第二条', '第三条', '第四条'],
      index: 0,
      charts: '',
      opinionData: ['3', '2', '4', '4', '5', '12', '23', '51', '15', '6', '25', '9'],
      timer: '',
      date: new Date()
    }
  },
  mounted () {
    const _this = this
    this.timer = setInterval(() => {
      _this.date = new Date()
    }, 1000)
    this.drawLine('main')
    this.drawLine('main1')
  },
  beforeDestroy () {
    if (this.timer) {
      clearInterval(this.timer) // 在Vue实例销毁前，清除我们的定时器
    }
  },
  methods: {
    current_change (index) {
      this.index = index
    },
    drawLine (id) {
      this.charts = echarts.init(document.getElementById(id))
      this.charts.setOption({
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
          data: ['近七日收益']
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
          }
        ]
      })
    }
  }
}
</script>

<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  .el-carousel__indicators--labels .el-carousel__button{
    font-size: 20px;
    background-color: #87CEFA;
  }
</style>
