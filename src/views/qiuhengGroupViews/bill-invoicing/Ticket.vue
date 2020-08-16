<template>
  <div class="app-container">
    <el-row
      class="home"
      :gutter="20"
    >
      <el-col :span="24">
        <el-card shadow="hover">
          <div style="height: 100px">
            <el-menu
              class="el-menu-demo"
              mode="horizontal"
            >
              <el-menu-item index="1">
                <i class="el-icon-s-ticket" />
                开票
                <i>---</i>
                <el-select
                  v-model="uneCbillDto.fType"
                  placeholder="福州市非税收入票据（电子）"
                  size="small"
                >
                  <el-option
                    v-for="item in ticketType"
                    :key="item.label"
                    :label="item.label"
                    :value="item.label"
                  />
                </el-select>
              </el-menu-item>
              <el-menu-item
                index="3"
                class="el-icon-paperclip"
                @click="insertBill"
              >保存</el-menu-item>
              <el-submenu index="2">
                <template slot="title">开票通知</template>
                <el-menu-item
                  index="2-1"
                  icon="el-icon-message"
                >
                  <i class="el-icon-message" />
                  邮件
                </el-menu-item>
                <el-menu-item index="2-2">
                  <i class="el-icon-mobile-phone" />
                  短信
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </div>

          <div
            style="height: 40px; width:800px"
            class="txt"
          >
            <div
              style="width:400px"
              class="underTxt"
            >
              <i
                style="color: red; width:10px"
                class="i1"
              >*</i>
              <i style="width:100px">票据代码</i>
              <div>
                <el-input
                  v-model="uneCbillDto.fBillId"
                  placeholder="NO.36040117"
                  disabled
                  size="small"
                />
              </div>
            </div>
            <div
              style="width:400px"
              class="underTxt"
            >
              <i
                style="color: red; width:10px"
                class="i1"
              >*</i>
              <i style="width:80px">票号</i>
              <div>
                <el-input
                  v-model="uneCbillDto.fBillNo"
                  placeholder="0000000017"
                  disabled
                  size="small"
                />
              </div>
            </div>
          </div>

          <div style="width:1200px">
            <el-form
              :inline="true"
              :model="payerDto"
              required
              class="demo-form-inline"
              size="small"
            >
              <el-form-item label=" 缴款人">
                <el-input
                  v-model="payerDto.fPayerName"
                  placeholder="缴款人"
                />
              </el-form-item>
              <el-form-item label="缴款人类型">
                <el-select
                  v-model="payerDto.fPayerType"
                  placeholder="缴款人类型"
                >
                  <el-option
                    label="单位"
                    value="0"
                  />
                  <el-option
                    label="个人"
                    value="1"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="手机号" style="width: 400px">
                <el-input
                  v-model="payerDto.fPayerTel"
                  placeholder="15200006666"
                  required
                />
              </el-form-item>
            </el-form>
          </div>

          <div style="width:1200px">
            <el-form
              :inline="true"
              :model="payerDto"
              class="demo-form-inline"
              size="small"
            >
              <el-form-item label="校验码">
                <el-input
                  v-model="uneCbillDto.checkCode"
                  placeholder="校验码"
                  disabled
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  v-model="payerDto.fPayerEmail"
                  placeholder="samuel_o@sina.com"
                  required
                  @blur="validate"
                />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="payerDto.fMemo"
                  type="textarea"
                  :rows="1"
                  placeholder="请输入内容"
                />
              </el-form-item>
            </el-form>
          </div>

        </el-card>
        <project-dialog />
        <div class="graph">
          <el-card shadow="hover">
            <div style="height: 230px">
              <div
                class="subject"
                size="small"
              >
                <span>项目分组</span>
                <el-button
                  type="success"
                  icon="el-icon-plus"
                  circle
                  @click="getDialog"
                />
              </div>

              <el-divider content-position="left">项目分组</el-divider>
              <el-table
                :data="tableData"
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
                <el-table-column
                  fixed="right"
                  label="操作"
                  width="120"
                >
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      size="small"
                      @click.native.prevent="deleteRow(scope.$index, tableData)"
                    >移除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {
  addBill
} from '@/api/qiuhengGroupApi/billInvoicing/bill'
import projectDialog from '@/views/qiuhengGroupViews/bill-invoicing/ProjectDialog.vue'
export default {
  components: {
    'project-dialog': projectDialog
  },
  data () {
    return {
      ticketType: [
        {
          value: 0,
          lable: '福州市非税收入票据（电子)'
        }
      ],
      // 缴款人模块
      payerDto: {
        fPayerName: '',
        fPayerEmail: '',
        fPayerTel: '',
        fPayerType: '',
        fMemo: ''
      },
      // 票据模块
      uneCbillDto: {
        fBillId: '201700000001',
        fBillNo: 'NO.6666666',
        fType: '',
        checkCode: ''
      },
      // 项目组模块
      itemDtos: [],
      // 单位名称
      unitName: '',
      // 总金额
      amt: 0,
      tableData: [
        {
          fItemCode: '20001',
          fItemName: '学费',
          fUnits: '元',
          fNumber: 1,
          fAmt: 8888.00
        }
      ],
      value: '',
      dialogVisible: true
    }
  },
  created () {
    this.$root.eventBus.$on('data', (val) => {
      this.tableData = val
    })
    this.$root.eventBus.$on('amt', (val) => {
      this.amt = val
      console.log(val)
    })
    this.itemDtos = this.tableData
  },
  methods: {
    async insertBill () {
      const batchPojo = {
        unitName: '',
        payerDto: {},
        uneCbillDto: {},
        itemDtos: [],
        fAmt: 0
      }
      batchPojo.unitName = this.unitName
      batchPojo.payerDto = this.payerDto
      batchPojo.uneCbillDto = this.uneCbillDto
      batchPojo.itemDtos = this.itemDtos
      batchPojo.fAmt = this.amt
      console.log(batchPojo.fAmt)
      const res = await addBill(batchPojo)
      alert(res.msg)
      this.$router.push({ name: 'bill' })
    },
    // 移除项目
    deleteRow (index, rows) {
      rows.splice(index, 1)
      console.log(this.tableData)
    },
    // 打开弹窗
    getDialog () {
      console.log(this.dialogVisible)
      this.$root.eventBus.$emit('dialogvisible', this.dialogVisible)
    },
    // 验证
    validate () {
      const mail = this.payerDto.fPayerEmail
      if (this.validateMail(mail)) {
        this.$emit('input', 'true')
      } else {
        this.$emit('input', 'false')
      }
    },
    // 验证邮箱格式
    validateMail (mail) {
      return /^\w{3,15}\@\w+\.[a-z]{2,3}$/.test(mail)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/home.scss";
</style>
