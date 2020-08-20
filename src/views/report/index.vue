<template>
  <el-container>
    <el-main>
      <el-carousel
        style="font-weight:bold "
        indicator-position="outside"
        height="500px"
        :autoplay="false"
        @change="current_change"
      >
        <el-carousel-item label="入库明细">
          <div
            id="main"
            style="width: 800px;height: 500px;margin: 0 auto"
          />
        </el-carousel-item>
        <el-carousel-item label="出库明细">
          <div
            id="main1"
            style="width: 800px;height: 500px;margin: 0 auto"
          />
        </el-carousel-item>
        <el-carousel-item label="库存明细">
          <div
            id="stockbill"
            style="width: 800px;height: 500px;margin: 0 auto"
          />
        </el-carousel-item>
        <el-carousel-item label="销毁明细">
          <div
            id="main"
            style="width: 700px;height: 400px;"
          />
        </el-carousel-item>
        <el-carousel-item label="缴费明细">
          <div
            id="main"
            style="width: 700px;height: 400px;"
          />
        </el-carousel-item>
        <el-carousel-item label="开票明细">
          <div
            id="main"
            style="width: 700px;height: 400px;"
          />
        </el-carousel-item>
      </el-carousel>
    </el-main>
    <el-aside
      width="200px"
      style="margin-right:50px"
    >
      <el-container direction="vertical">
        <el-button
          type="primary"
          style="margin-top:20px"
          @click="$router.push('/report/stockin')"
        >票据入库明细</el-button>
        <br />
        <el-button
          type="primary"
          @click="$router.push('/report/stockout')"
        >票据出库明细</el-button>
        <br />
        <el-button
          type="primary"
          @click="$router.push('/report/stockbill')"
        >票据库存明细</el-button>
        <br />
        <el-button type="primary">票据缴款明细</el-button>
        <br />
        <el-button
          type="primary"
          @click="$router.push('/report/stockdestroy')"
        >票据销毁明细</el-button>
        <br />
        <el-button type="primary">开票汇总明细</el-button>
      </el-container>
    </el-aside>
  </el-container>
</template>

<script>
import { selectNum } from '@/api/report/report'
import echarts from 'echarts'
export default {
  name: 'Financial',
  data () {
    return {
      list: ['第一条', '第二条', '第三条', '第四条'],
      index: 0,
      opinionData: ['3', '2', '4', '4', '5', '12', '23'],
      stockbill: ['100', '210', '345', '330', '688', '516', '341'],
      date: new Date()

    }
  },
  mounted () {
    this.drawLine('main')
    this.drawLine('main1')
    this.getBillData()
  },
  beforeDestroy () {
  },
  methods: {
    current_change (index) {
      this.index = index
    },
    async getBillData () {
      const data = await selectNum()
      this.stockbill = data
      this.drawbill('stockbill')
    },
    drawLine (id) {
      this.charts = echarts.init(document.getElementById(id))
      this.charts.setOption({
        title: {
          // text: new Date().getFullYear() + '年' + (new Date().getMonth() + 1) + '月' + new Date().getDate() + '日' + '数量变动'
          text: this.date.getFullYear() + '年' + (this.date.getMonth() + 1) + '月' + '最近七天数量'
        },
        itemStyle: {
          // color: ['#2F4554']
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
          left: '1%',
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
          boundaryGap: false,
          data: [this.date.getDate() - 6, this.date.getDate() - 5, this.date.getDate() - 4, this.date.getDate() - 3, this.date.getDate() - 2, this.date.getDate() - 1, this.date.getDate()],
          axisLabel: {
            formatter: '{value}日'
          }

        },
        yAxis: {
          name: '数量',
          type: 'value',
          axisLabel: {
            formatter: '{value}份'
          }
        },
        series: [
          {
            name: '入库数量',
            type: 'line',
            stack: '总量',
            smooth: true,
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ],
              itemStyle: {
                color: ['#2F4554']
              }

            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' },
                [
                  {
                    symbol: 'none',
                    x: '90%',
                    yAxis: 'max'
                  },
                  {
                    symbol: 'circle',
                    label: {
                      position: 'start',
                      formatter: '最大值'
                    },
                    type: 'max',
                    name: '最高点'
                  }],
                [{
                  symbol: 'none',
                  x: '90%',
                  yAxis: 'min'
                }, {
                  symbol: 'circle',
                  label: {
                    position: 'start',
                    formatter: '最小值'
                  },
                  type: 'min',
                  name: '最低点'
                }]
              ]
            },
            data: this.opinionData,
            itemStyle: { normal: { label: { show: true }}}
          }
        ]
      })
    },
    drawbill (id) {
      const charts = echarts.init(document.getElementById(id))
      charts.setOption({
        title: {
          text: this.date.getFullYear() + '年' + (this.date.getMonth() + 1) + '月' + '最近七天库存数量'
        },
        itemStyle: {
          color: ['#2F4554']
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          formatter: '{b}日<br>{c}份'
        },
        legend: {
          data: ['库存数量']
        },
        grid: {
          left: '1%',
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
            dataView: {},
            myTool1: {
              show: true,
              title: '自定义扩展方法1',
              icon: 'path://M891.392 512c0-39.762 24.146-74.721 61.507-89.062l19.128-7.342-5.059-19.85a466.831 466.831 0 0 0-50.995-123.219l-10.455-17.612-18.714 8.32a95.933 95.933 0 0 1-39.219 8.325 94.326 94.326 0 0 1-67.24-27.904c-28.12-28.12-35.769-69.899-19.482-106.435l8.356-18.75-17.664-10.454a469.356 469.356 0 0 0-123.29-50.985l-19.814-5.049-7.363 19.077c-14.433 37.392-49.403 61.553-89.078 61.553-39.757 0-74.716-24.146-89.062-61.517l-7.342-19.118-19.85 5.054a466.586 466.586 0 0 0-123.218 51l-17.613 10.455 8.32 18.714c16.266 36.567 8.617 78.356-19.477 106.455-17.945 17.95-41.866 27.837-67.348 27.837-13.589 0-26.757-2.78-39.132-8.269l-18.668-8.279-10.46 17.547a464.138 464.138 0 0 0-51.113 123.253l-5.043 19.815 19.077 7.362c37.376 14.434 61.532 49.398 61.532 89.078 0 39.757-24.146 74.716-61.517 89.068l-19.123 7.347 5.054 19.85a466.995 466.995 0 0 0 50.995 123.213l10.455 17.618 18.719-8.33a95.877 95.877 0 0 1 39.214-8.326c25.41 0 49.28 9.902 67.235 27.9 28.125 28.123 35.769 69.903 19.487 106.439l-8.356 18.75 17.664 10.454a469.028 469.028 0 0 0 123.29 50.98l19.814 5.049 7.363-19.078c14.449-37.386 49.413-61.542 89.093-61.542 39.762 0 74.721 24.146 89.068 61.512l7.347 19.123 19.85-5.059a467.174 467.174 0 0 0 123.218-50.99l17.618-10.46-8.33-18.719c-16.267-36.567-8.628-78.351 19.476-106.455 17.946-17.95 41.861-27.837 67.338-27.837 13.589 0 26.763 2.785 39.138 8.269l18.672 8.284 10.455-17.552a464.256 464.256 0 0 0 51.113-123.248l5.049-19.85-19.119-7.348c-37.365-14.34-61.501-49.305-61.501-89.062z m-5.857 199.542a142.013 142.013 0 0 0-37.95-5.115c-37.796 0-73.282 14.679-99.932 41.334-36.66 36.67-49.879 88.975-36.162 137.871a421.565 421.565 0 0 1-76.39 31.61c-24.874-44.287-71.225-71.93-123.101-71.93-51.784 0-98.13 27.648-123.07 71.936a422.543 422.543 0 0 1-76.559-31.662c13.317-48.517-0.066-101.765-36.111-137.805-26.64-26.71-62.096-41.42-99.84-41.42-12.98 0-25.708 1.725-38.037 5.15a421.023 421.023 0 0 1-31.626-76.41c44.288-24.874 71.936-71.225 71.936-123.101 0-51.789-27.648-98.135-71.936-123.07a417.91 417.91 0 0 1 31.703-76.467c12.293 3.4 24.996 5.115 37.95 5.115 37.79 0 73.282-14.679 99.932-41.334 36.664-36.669 49.889-88.97 36.173-137.87a420.639 420.639 0 0 1 76.385-31.612c24.873 44.288 71.224 71.936 123.095 71.936 51.789 0 98.13-27.643 123.07-71.94a422.932 422.932 0 0 1 76.559 31.666c-13.323 48.512 0.066 101.76 36.106 137.805 26.644 26.711 62.106 41.42 99.845 41.42a141.773 141.773 0 0 0 38.042-5.15 421.345 421.345 0 0 1 31.62 76.411C872.95 413.773 845.313 460.12 845.313 512c0 51.876 27.638 98.227 71.926 123.1a418.627 418.627 0 0 1-31.703 76.442z',
              onclick: function () {
                alert('myToolHandler1')
              }
            }

          }
        },
        xAxis: {
          name: '日期',
          type: 'category',
          boundaryGap: false,
          // data: [this.getDayFromNow(-6).getDate(), this.getDayFromNow(-5).getDate(), this.getDayFromNow(-4).getDate(), this.getDayFromNow(-3).getDate(), this.getDayFromNow(-2).getDate(), this.getDayFromNow(-1).getDate(), this.date.getDate()],
          data: this.getLastDays(-7),
          axisLabel: {
            formatter: '{value}日'
          }

        },
        yAxis: {
          name: '数量',
          type: 'value',
          axisLabel: {
            formatter: '{value}份'
          }
        },
        series: [
          {
            name: '库存数量',
            type: 'line',
            // smooth: true,
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ],
              itemStyle: {
                color: ['#2F4554']
              }

            },
            markLine: {
              data: [
                { type: 'average', name: '平均值', label: { formatter: '平均值{c}' }},
                [
                  {
                    symbol: 'arrow',
                    x: '95%',
                    yAxis: 'max'
                  },
                  {
                    symbol: 'roundRect',
                    label: {
                      position: 'start',
                      formatter: '最大值'
                    },
                    type: 'max',
                    name: '最高点'
                  }],
                [{
                  symbol: 'arrow',
                  x: '95%',
                  yAxis: 'min'
                }, {
                  symbol: 'roundRect',
                  label: {
                    position: 'start',
                    formatter: '最小值'
                  },
                  type: 'min',
                  name: '最低点'
                }]
              ]
            },
            data: this.stockbill,
            itemStyle: { normal: { label: { show: true }}}
          }
        ]
      })
    },
    getDayFromNow (count) {
      var dd = new Date()
      dd.setDate(dd.getDate() + count)// 获取count天后的日期
      var y = dd.getFullYear()
      var m = dd.getMonth() + 1// 获取当前月份的日期
      if (m < 10) {
        m = '0' + m
      }
      var d = dd.getDate()
      if (d < 10) {
        d = '0' + d
      }
      return new Date(y + '-' + m + '-' + d)
    },
    getLastDays (count) {
      const lastday = []
      while (count < 0) {
        count++
        lastday.push(this.getDayFromNow(count).getDate())
      }
      return lastday
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

/* .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  } */

.el-carousel__indicators--labels .el-carousel__button {
  font-size: 20px;
  font-weight: bold;
  background-color: #87cefa;
}
</style>
