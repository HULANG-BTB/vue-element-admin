<template>
  <el-container>
    <el-main>
      <el-carousel
        style="font-weight:bold "
        indicator-position="outside"
        height="500px"
        :autoplay="false"
      >
        <el-carousel-item label="入库变动">
          <div
            id="stockin"
            style="width: 800px;height: 500px;margin: 0 auto"
          />
        </el-carousel-item>
        <el-carousel-item label="出库变动">
          <div
            id="stockout"
            style="width: 800px;height: 500px;margin: 0 auto"
          />
        </el-carousel-item>
        <el-carousel-item label="库存变动">
          <div
            id="stockbill"
            style="width: 800px;height: 500px;margin: 0 auto"
          />
        </el-carousel-item>
        <el-carousel-item label="销毁变动">
          <div
            id="stockdestroy"
            style="width: 800px;height: 500px;margin: 0 auto"
          />
        </el-carousel-item>
        <el-carousel-item label="缴费明细">
          <div
            id="stockpayIndex"
            style="width: 800px;height: 500px;margin: 0 auto"
          />
        </el-carousel-item>
        <el-carousel-item label="开票明细">
          <div
            id="main6"
            style="width: 800px;height: 500px;margin: 0 auto"
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
        <el-button
          type="primary"
          @click="$router.push('/report/stockdestroy')"
        >票据销毁明细</el-button>
        <br />
        <el-button type="primary" @click="$router.push('/report/stockpay')">票据缴款明细</el-button>
        <br />
        <el-button type="primary" @click="$router.push('/report/billsummary')">开票汇总明细</el-button>
      </el-container>
    </el-aside>
  </el-container>
</template>

<script>
import { selectNum, selectDestroyNum, getNumIndexIn, getNumIndexOut, getWeek, selectWeekBillSummary } from '@/api/report/report'
import echarts from 'echarts'
export default {
  name: 'Financial',
  data () {
    return {
      index: 0,
      stockbill: [],
      stockdestroy: [],
      xInOut: [],
      stockpay: [],
      billsummary: [],
      date: new Date()
    }
  },
  mounted () {
    this.getBillData()
    this.getDestroyBill()
    this.getData()
    this.getPayData()
    this.getBillSummary()
  },
  methods: {
    async getData () {
      const dataIn = (await getNumIndexIn()).data
      const dataOut = (await getNumIndexOut()).data
      for (let i = 0; i < 7; i++) {
        this.xInOut[i] = this.getDay(i - 6) + '号'
      }
      this.drawInOUt('stockin', dataIn)
      this.drawInOUt('stockout', dataOut)
    },
    async getBillData () {
      const data = await selectNum()
      this.stockbill = data.data
      this.drawbill('stockbill')
    },
    async getDestroyBill () {
      const data = await selectDestroyNum()
      this.stockdestroy = data.data
      this.drawdestroy('stockdestroy')
    },
    async getPayData () {
      const res = await getWeek()
      console.log(res.data)
      this.stockpay = res.data
      this.drawPay('stockpayIndex')
    },
    getBillSummary () {
      this.billsummary = [0, 0, 0, 0, 0, 0, 0]
      selectWeekBillSummary().then(res => {
        for (let i = 0; i < res.data.length; i++) {
          const nums = res.data[i].billnum
          for (let j = 0; j < 7; j++) {
            this.billsummary[j] = this.billsummary[j] + nums[j]
          }
          console.log(this.billsummary)
          this.drawbillsummary('main6')
        }
      })
    },
    drawLine (id) {
      const charts = echarts.init(document.getElementById(id))
      charts.setOption({
        title: {
          text: this.date.getFullYear() + '年' + (this.date.getMonth() + 1) + '月' + '最近七天数量'
        },
        itemStyle: {
          color: '#f20c00'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          data: ['数量']
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
            name: '数量',
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
            dataView: {}
          }
        },
        xAxis: {
          name: '日期',
          type: 'category',
          boundaryGap: false,
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
    drawdestroy (id) {
      const charts = echarts.init(document.getElementById(id))
      charts.setOption({
        title: {
          text: this.date.getFullYear() + '年' + (this.date.getMonth() + 1) + '月' + '最近七天库存销毁数量'
        },
        itemStyle: {
          color: ['#ff3300']
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          formatter: '{b}日<br>{c}份'
        },
        legend: {
          data: ['库存销毁数量']
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
            name: '库存销毁数量',
            type: 'line',
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ],
              itemStyle: {
                color: ['#ff3300']
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
            data: this.stockdestroy,
            itemStyle: { normal: { label: { show: true }}}
          }
        ]
      })
    },
    drawPay (id) {
      const charts = echarts.init(document.getElementById(id))
      charts.setOption({
        title: {
          // text: new Date().getFullYear() + '年' + (new Date().getMonth() + 1) + '月' + new Date().getDate() + '日' + '数量变动'
          text: this.date.getFullYear() + '年' + (this.date.getMonth() + 1) + '月' + '最近七天入缴金额'
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
          data: ['入缴金额']
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
          name: '金额',
          type: 'value',
          axisLabel: {
            formatter: '{value}元'
          }
        },
        series: [
          {
            name: '入缴金额',
            type: 'line',
            stack: '总金额',
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
            data: this.stockpay,
            itemStyle: { normal: { label: { show: true }}}
          }
        ]
      })
    },
    drawbillsummary (id) {
      const charts = echarts.init(document.getElementById(id))
      charts.setOption({
        title: {
          text: this.date.getFullYear() + '年' + (this.date.getMonth() + 1) + '月' + '最近七天开票数量'
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
          data: ['开票数量']
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
            name: '开票数量',
            type: 'line',
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
            data: this.billsummary,
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
    },
    drawInOUt (id, data) {
      const charts = echarts.init(document.getElementById(id))
      charts.setOption({
        title: {
          text: this.date.getFullYear() + '年' + (this.date.getMonth() + 1) + '月' + '最近七天数量变化'
        },
        itemStyle: {
          color: '#f20c00'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          formatter: '{b}<br>{c}份'
        },
        legend: {
          data: ['数量']
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
              type: ['bar', 'line'],
              top: '2%',
              right: '4%'
            },
            dataView: {}
          }
        },
        /* 横轴的数据 */
        xAxis: {
          name: '日期',
          type: 'category',
          boundaryGap: false,
          data: this.xInOut
        },
        yAxis: {
          name: '数量',
          type: 'value',
          axisLabel: {
            formatter: '{value}份'
          }
        },
        /* 纵轴的数据 */
        series: [{
          /* name需要跟legend的data对应 */
          name: '数量',
          type: 'line',
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
          data: data,
          itemStyle: {
            normal: {
              label: {
                show: true
              }
            }
          }
        }]
      })
    },
    getDay (day) {
      const today = new Date()
      const targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day
      today.setTime(targetday_milliseconds)
      return today.getDate()
    }
  }
}
</script>

<style>

.el-carousel__indicators--labels .el-carousel__button {
  font-size: 20px;
  font-weight: bold;
  background-color: #87cefa;
}
</style>
