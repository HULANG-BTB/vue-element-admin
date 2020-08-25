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
              <div style="height: 80px">
                <el-footer class="dialog-footer">
                  <el-form label-width="80px" :data="payerDto">
                    <el-row style="height: 15px">
                      <el-col :span="20">
                        <el-form-item label="开票单位: ">{{ unitName }} </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row style="height: 15px">
                      <el-col :span="8">
                        <el-form-item label="票据ID: "> {{ uneCbillDto.fBillId }} </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="票据号码: ">{{ uneCbillDto.fBillNo }} </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="票据类型: ">{{ uneCbillDto.fType }} </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row style="height: 15px">
                      <el-col :span="8">
                        <el-form-item prop="fPayerName" label="缴款人: ">{{ payerDto.fPayerName }} </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item prop="fPayerTel" label="电话: ">{{ payerDto.fPayerTel }} </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item prop="fPayerEmail" label="邮箱: ">{{ payerDto.fPayerEmail }} </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </el-footer>
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
              <el-form label-width="80px">
                <el-row>
                  <el-col :span="20" />
                  <el-col :span="4">
                    <el-form-item label="合计: ">{{ fAmt }}</el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-card>
            <el-footer class="dialog-footer">
              <el-form label-width="80px">
                <el-row>
                  <el-col :span="20">
                    <el-form-item label="编制人: ">{{ fAuthor }}</el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="编制日期: ">{{ dateTime }}</el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-footer>
          </el-card></div>
      </el-col>
    </el-row>
  </div>
</template>
<script>

export default {
  components: {
  },
  props: {
    batchPojo: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      unitName: '',
      payerDto: {
        fPayerName: '',
        fPayerEmail: '',
        fPayerTel: '',
        fPayerType: '',
        fMemo: ''
      },
      uneCbillDto: {},
      itemDtos: [],
      fAmt: '',
      dateTime: '',
      fAuthor: 'admin'
    }
  },
  created () {
    this.unitName = this.batchPojo.unitName
    this.payerDto = this.batchPojo.payerDto
    this.fAmt = this.batchPojo.fAmt
    this.uneCbillDto = this.batchPojo.uneCbillDto
    this.itemDtos = this.batchPojo.itemDtos
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
.el-row {
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap
  }

</style>
