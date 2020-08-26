<template>
  <el-tabs v-model="activeName" type="card">
    <el-tab-pane label="柱状图" name="first">
      <el-container>
        <el-main>
          <el-form :model="form" :inline="true" size="small">
            <el-form-item label="票据种类">
              <el-select v-model="type" placeholder="请选择" value-key="id">
                <el-option v-for="item in billType" :key="item.id" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="年份">
              <el-select v-model="year" placeholder="请选择" style="width:100px" @change="updateyear">
                <el-option v-for="item in nearyear" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-form>
          <div id="line" style="width:800px;height:500px;margin:0 auto" />
        </el-main>
      </el-container>
    </el-tab-pane>
    <el-tab-pane label="饼状图" name="second">
      <el-container>
        <el-main>
          <el-form>
            <el-form-item label="年份">
              <el-select v-model="pieyear" placeholder="请选择" style="width:100px" >
                <el-option v-for="item in nearyear" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-form>

          <div id="pie" style="width:800px;height:480px;margin:0 auto" />
        </el-main>
      </el-container>
    </el-tab-pane>
  </el-tabs>

</template>

<script>
import echarts from 'echarts'
import { getSevenYearNum1, getAllMonth1, getMultiBillNum1 } from '@/api/report/report'

export default {
  data () {
    return {
      type: '00000120',
      activeName: 'first',
      billType: [{ label: '中央非税收入票据', value: '00000120' }, { label: '非税收入通用票据', value: '00000121' },
        { label: '非税收入一般缴款书', value: '00000122' }, { label: '医疗收费票据', value: '00000123' }, { label: '医疗门诊票据', value: '00000124' }],
      form: {},
      year: null,
      pieyear: 2020,
      nearyear: [],
      nearmonth: [],
      date: new Date(),
      opinionData: [],
      pieData: [],
      search: {
        date: null,
        billType: null
      }
    }
  },
  watch: {
    'type': function () {
      this.year = null
      this.getSevenYearData(this.type)
    },
    'year': function () {
      this.search.date = new Date(this.year + '-10-10')
      this.search.billType = this.type
      this.getAllMonthData(this.search)
    },
    'pieyear': function () {
      this.getMultiBillNumData(this.pieyear + '-01-02')
    }
  },
  mounted () {
    this.getnearyear()
    this.getnearmonth()
    this.getSevenYearData(this.type)
    this.getMultiBillNumData(this.pieyear + '-01-02')
  },

  methods: {
    async getSevenYearData (type) {
      const res = await getSevenYearNum1(type)
      this.opinionData = res.data
      this.drawLine('line', this.nearyear)
    },
    async getAllMonthData (search) {
      const res = await getAllMonth1(search)
      this.opinionData = res.data
      this.drawLine('line', this.nearmonth)
    },
    async getMultiBillNumData (date) {
      const res = await getMultiBillNum1(date)
      this.pieData = res.data
      this.drawPie('pie')
    },

    drawLine (id, xData) {
      const charts = echarts.init(document.getElementById(id))
      charts.setOption({
        title: {
          text: '库存数量明细'
        },
        itemStyle: {
          color: '#ff3300'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          formatter: '{c}份'
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
          boundaryGap: true,
          data: xData
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
            type: 'bar',
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
            data: this.opinionData,
            itemStyle: { normal: { label: { show: true }}}
          // }
          }
        ]
      })
    },
    drawPie (id) {
      const charts = echarts.init(document.getElementById(id))
      charts.setOption({
        title: {
          text: '不同种类票据库存数量所占百分比',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['中央非税收入票据', '非税收入通用票据', '非税收入一般缴款书', '医疗收费票据', '医疗门诊票据']
        },
        series: [
          {
            name: '种类',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            label: {
              normal: {
                show: true,
                textStyle: {
                  fontWeight: 300,
                  fontSize: 16 // 文字的字体大小
                },
                formatter: '{b}:{c}({d}%)'
              }
            },
            labelLine: {
              show: true
            },

            data: this.pieData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    },
    getnearyear () {
      this.nearyear = []
      const toyear = this.date.getFullYear()
      for (let i = 0; i < 7; i++) {
        this.nearyear.push(toyear + i - 6)
      }
    },
    getnearmonth () {
      this.nearmonth = []
      if (this.year === this.date.getFullYear()) {
        for (let i = 1; i <= this.date.getMonth() + 1; i++) {
          this.nearmonth.push(i + '月')
        }
      } else {
        for (let i = 1; i <= 12; i++) {
          this.nearmonth.push(i + '月')
        }
      }
    },
    updateyear (index) {
      this.year = index
      this.getnearmonth()
    }
  }
}
</script>

<style>

</style>
