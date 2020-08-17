<template>

  <el-collapse v-model="activeName" accordion>
    <el-collapse-item title="柱状图" name="1">
      <div id="echarts" style="width: 800px;height:400px;"/>
    </el-collapse-item>
    <el-collapse-item title="饼状图" name="2">
      <div id="pie" style="width: 800px;height:400px;"/>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
  import echarts from 'echarts'

  export default {
    name: 'Echarts',
    data() {
      return {
        arr: 'aa',
        data: this.genData(50)
      }
    },
    mounted() {
      this.myBar()
      this.myPie()
    },
    methods: {
      myBar() {
        const myChart = echarts.init(document.getElementById('echarts'))
        const dataMap = {}
        dataMap.dataGDP = {
          // 纵轴的数值
          2020: [16251.93, 11307.28, 24515.76, 11237.55, 14359.88, 22226.7, 10568.83, 12582, 19195.69, 49110.27, 32318.85,
            15300.65, 17560.18, 11702.82, 45361.85, 26931.03, 19632.26, 19669.56, 53210.28, 11720.87, 2522.66, 10011.37,
            21026.68, 5701.84, 8893.12, 605.83, 12512.3, 5020.37, 1670.44, 2102.21, 6610.05
          ],
          2019: [14113.58, 9224.46, 20394.26, 9200.86, 11672, 18457.27, 8667.58, 10368.6, 17165.98, 41425.48, 27722.31,
            12359.33, 14737.12, 9451.26, 39169.92, 23092.36, 15967.61, 16037.96, 46013.06, 9569.85, 2064.5, 7925.58,
            17185.48, 4602.16, 7224.18, 507.46, 10123.48, 4120.75, 1350.43, 1689.65, 5437.47
          ],
          2018: [12153.03, 7521.85, 17235.48, 7358.31, 9740.25, 15212.49, 7278.75, 8587, 15046.45, 34457.3, 22990.35,
            10062.82, 12236.53, 7655.18, 33896.65, 19480.46, 12961.1, 13059.69, 39482.56, 7759.16, 1654.21, 6530.01,
            14151.28, 3912.68, 6169.75, 441.36, 8169.8, 3387.56, 1081.27, 1353.31, 4277.05
          ],
          2017: [9846.81, 5252.76, 13607.32, 6024.45, 6423.18, 11164.3, 5284.69, 7104, 12494.01, 26018.48, 18753.73,
            7360.92, 9248.53, 5800.25, 25776.91, 15012.46, 9333.4, 9439.6, 31777.01, 5823.41, 1254.17, 4676.13, 10562.39,
            2884.11, 4772.52, 341.43, 5757.29, 2703.98, 797.35, 919.11, 3523.16
          ],
          2016: [8117.78, 4462.74, 11467.6, 4878.61, 4944.25, 9304.52, 4275.12, 6211.8, 10572.24, 21742.05, 15718.47,
            6112.5, 7583.85, 4820.53, 21900.19, 12362.79, 7617.47, 7688.67, 26587.76, 4746.16, 1065.67, 3907.23, 8690.24,
            2338.98, 3988.14, 290.76, 4743.61, 2277.35, 648.5, 725.9, 3045.26
          ],
          2015: [6969.52, 3905.64, 10012.11, 4230.53, 3905.03, 8047.26, 3620.27, 5513.7, 9247.66, 18598.69, 13417.68,
            5350.17, 6554.69, 4056.76, 18366.87, 10587.42, 6590.19, 6596.1, 22557.37, 3984.1, 918.75, 3467.72, 7385.1,
            2005.42, 3462.73, 248.8, 3933.72, 1933.98, 543.32, 612.61, 2604.19
          ],
          2014: [6033.21, 3110.97, 8477.63, 3571.37, 3041.07, 6672, 3122.01, 4750.6, 8072.83, 15003.6, 11648.7, 4759.3,
            5763.35, 3456.7, 15021.84, 8553.79, 5633.24, 5641.94, 18864.62, 3433.5, 819.66, 3034.58, 6379.63, 1677.8,
            3081.91, 220.34, 3175.58, 1688.49, 466.1, 537.11, 2209.09
          ],
          2013: [5007.21, 2578.03, 6921.29, 2855.23, 2388.38, 6002.54, 2662.08, 4057.4, 6694.23, 12442.87, 9705.02, 3923.11,
            4983.67, 2807.41, 12078.15, 6867.7, 4757.45, 4659.99, 15844.64, 2821.11, 713.96, 2555.72, 5333.09, 1426.34,
            2556.02, 185.09, 2587.72, 1399.83, 390.2, 445.36, 1886.35
          ]
        }
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
            title: {
              // 灰色副标题
              subtext: '数据来自国家统计局'
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
            xAxis: [
              {
                'type': 'category',
                'axisLabel': {'interval': 0},
                'data': [
                  '北京', '\n天津', '河北', '\n山西', '内蒙古', '\n辽宁', '吉林', '\n黑龙江',
                  '上海', '\n江苏', '浙江', '\n安徽', '福建', '\n江西', '山东', '\n河南',
                  '湖北', '\n湖南', '广东', '\n广西', '海南', '\n重庆', '四川', '\n贵州',
                  '云南', '\n西藏', '陕西', '\n甘肃', '青海', '\n宁夏', '新疆'
                ],
                splitLine: {show: false}
              }
            ],
            yAxis: [
              {
                type: 'value',
                name: 'GDP（亿元）'
              }
            ],
            series: [{
              name: '数量',
              type: 'bar'
            }
            ]
          },
          options: [
            {
              // title是主标题
              title: {text: this.getYear()[0] + '数量'},
              series: [
                {data: dataMap.dataGDP['2013']}
              ]
            },
            {
              title: {text: this.getYear()[1] + '数量'},
              series: [
                {data: dataMap.dataGDP['2014']}
              ]
            },
            {
              title: {text: this.getYear()[2] + '数量'},
              series: [
                {data: dataMap.dataGDP['2015']}
              ]
            },
            {
              title: {text: this.getYear()[3] + '数量'},
              series: [
                {data: dataMap.dataGDP['2016']}
              ]
            },
            {
              title: {text: this.getYear()[4] + '数量'},
              series: [
                {data: dataMap.dataGDP['2017']}
              ]
            },
            {
              title: {text: this.getYear()[5] + '数量'},
              series: [
                {data: dataMap.dataGDP['2018']}
              ]
            },
            {
              title: {text: this.getYear()[6] + '数量'},
              series: [
                {data: dataMap.dataGDP['2019']}
              ]
            },
            {
              title: {text: this.getYear()[7] + '数量'},
              series: [
                {data: dataMap.dataGDP['2020']}
              ]
            }
          ]
        }
        myChart.setOption(option)
      },
      myPie() {
        const myPie = echarts.init(document.getElementById('pie'))
        const option = {
          title: {
            text: '同名数量统计',
            subtext: '纯属虚构',
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
            data: this.data.legendData,

            selected: this.data.selected
          },
          series: [
            {
              name: '姓名',
              type: 'pie',
              radius: '55%',
              center: ['40%', '50%'],
              data: this.data.seriesData,
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
        myPie.setOption(option)
      },
      getYear() {
        const year = []
        for (let i = 0; i < 8; i++) {
          year[i] = new Date().getFullYear() - 7 + i
        }
        return year
      },
      genData(count) {
        const nameList = [
          '赵', '钱', '孙', '李', '周', '吴', '郑', '王', '冯', '陈', '褚', '卫', '蒋', '沈', '韩', '杨', '朱', '秦', '尤', '许', '何', '吕', '施', '张', '孔', '曹', '严', '华', '金', '魏', '陶', '姜', '戚', '谢', '邹', '喻', '柏', '水', '窦', '章', '云', '苏', '潘', '葛', '奚', '范', '彭', '郎', '鲁', '韦', '昌', '马', '苗', '凤', '花', '方', '俞', '任', '袁', '柳', '酆', '鲍', '史', '唐', '费', '廉', '岑', '薛', '雷', '贺', '倪', '汤', '滕', '殷', '罗', '毕', '郝', '邬', '安', '常', '乐', '于', '时', '傅', '皮', '卞', '齐', '康', '伍', '余', '元', '卜', '顾', '孟', '平', '黄', '和', '穆', '萧', '尹', '姚', '邵', '湛', '汪', '祁', '毛', '禹', '狄', '米', '贝', '明', '臧', '计', '伏', '成', '戴', '谈', '宋', '茅', '庞', '熊', '纪', '舒', '屈', '项', '祝', '董', '梁', '杜', '阮', '蓝', '闵', '席', '季', '麻', '强', '贾', '路', '娄', '危'
        ]
        const legendData = []
        const seriesData = []
        const selected = {}
        for (var i = 0; i < count; i++) {
          const name = Math.random() > 0.65
            ? makeWord(4, 1) + '·' + makeWord(3, 0)
            : makeWord(2, 1)
          legendData.push(name)
          seriesData.push({
            name: name,
            value: Math.round(Math.random() * 100000)
          })
          selected[name] = i < 6
        }

        return {
          legendData: legendData,
          seriesData: seriesData,
          selected: selected
        }

        function makeWord(max, min) {
          var nameLen = Math.ceil(Math.random() * max + min)
          var name = []
          for (var i = 0; i < nameLen; i++) {
            name.push(nameList[Math.round(Math.random() * nameList.length - 1)])
          }
          return name.join('')
        }
      }
    }
  }
</script>

<style>
</style>
