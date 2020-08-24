<template>
  <div class="app-container">
    <el-row
      class="home"
      :gutter="20"
    >
      <el-col :span="24">
        <div class="graph">
          <el-card shadow="hover">
            <div style="height: 100px">
              <el-menu
                class="el-menu-demo"
                mode="horizontal"
              >
                <el-menu-item
                  index="3"
                  class="el-icon-printer"
                  @click="openFullScreen2"
                >打印缴款书</el-menu-item>
              </el-menu>
            </div>
            <el-card shadow>
              <div style="height: 90px">
                <div
                  class="subject"
                  size="small"
                >
                  <div>
                    <el-input slot="prefix" v-model="unitName" style="outline:none;" type="text" disabled prefix="开票单位" size="small" />
                  </div>
                  <div>
                    <el-input v-model="uneCbillDto.fBillId" style="outline:none;" disabled size="small" />
                    <el-input v-model="uneCbillDto.fBillNo" style="outline:none;" disabled size="small" />
                    <el-input v-model="uneCbillDto.checkCode" style="outline:none;" disabled size="small" />
                  </div>
                  <div>
                    <el-input v-model="payerDto.fPayerName" style="outline:none;" disabled size="small" />
                    <el-input v-model="payerDto.fPayerEmail" style="outline:none;" disabled size="small" />
                    <el-input v-model="payerDto.fPayerTel" style="outline:none;" disabled size="small" />
                  </div>
                </div>
              </div>
              <el-divider content-position="left" />
              <el-table
                :data="itemDtos"
                stripe
                style="width: 100%"
                size="small"
              >
                <el-table-column
                  prop="fItemCode"
                  label="项目编码"
                  width="180"
                />
                <el-table-column
                  prop="fItemName"
                  label="项目名称"
                />
                <el-table-column
                  prop="fUnits"
                  label="计量单位"
                />
                <el-table-column
                  prop="fNumber"
                  label="数量"
                />
                <el-table-column
                  prop="fAmt"
                  label="金额"
                />
              </el-table>
            </el-card>
            <div class="foot" size="small">
              <h7 style="font-family: PingFang SC">.</h7>
              <h7 v-model="fAmt" style="font-family: PingFang SC">合计：{{ fAmt }}</h7>
            </div>
          </el-card></div>
        <div class="foot">
          <i style="font-family: PingFang SC">编制人：{{ fAuthor }}</i>
          <i style="font-family: PingFang SC">编制日期：{{ dateTime }}</i>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>

export default {
  components: {
  },
  data () {
    return {
      unitName: '博思软件股份有限公司',
      payerDto: {},
      uneCbillDto: {},
      itemDtos: [],
      fAmt: '1000',
      dateTime: '',
      fAuthor: 'admin'
    }
  },
  created () {
    this.$root.eventBus.$on('batchPojo', (val) => {
      console.log(val)
      this.unitName = val.unitName
      console.log(val.unitName)
      this.payerDto = val.payerDto
      console.log(val.payerDto)
      this.fAmt = val.fAmt
      console.log(val.fAmt)
      this.uneCbillDto = val.uneCbillDto
      console.log(val.itemDtos)
      this.itemDtos = val.itemDtos
      console.log(this.itemDtos)
    })
    const date = new Date()
    this.dateTime = this.convertToDate(date)
  },
  methods: {
    openFullScreen2 () {
      const loading = this.$loading({
        lock: true,
        text: '打印中',
        spinner: 'el-icon-printer',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      setTimeout(() => {
        loading.close()
        this.$router.push({ name: 'voicingbill' })
      }, 2000)
    },
    // 对时间进行格式化
    convertToDate (date) {
      const dateTime = new Date(date)
      const y = dateTime.getFullYear()
      let m = dateTime.getMonth() + 1
      let d = dateTime.getDate()
      m = m < 10 ? '0' + m : m// 月份如果小于10，则在前面加一个0
      d = d < 10 ? '0' + d : d// day如果小于10，则在前面加一个0
      return y + '-' + m + '-' + d
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/home.scss";
.foot {
    margin-top: 20px;
    display: flex;
    justify-content: space-between
}
.subject {
  display: flex;
  justify-content: center;
}
</style>
