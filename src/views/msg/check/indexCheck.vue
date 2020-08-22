<template>
  <div v-loading.body="loading" class="app-container">
    <el-button
      type="text"
      class="login-button"
      icon="el-icon-user"
      @click="login"
    >
      登录
    </el-button>
    <el-card class="index-check" style="width:400px;background-color: #3f5c6d2c;">
      <el-image class="titleImg" :src="titleImg" />
      <el-form
        :model="query"
        class="check-form"
        :rules="rules"
        :inline="true"
        @keyup.enter.native="handlerCheck"
      >

        <div v-if="requestType === 'tel'">
          <el-form-item prop="tel">
            <el-input
              v-model="query.tel"
              placeholder="请输入手机号码"
              clearable
              class="input-with-select"
              style="width: 350px;"
            >
              <el-select
                slot="prepend"
                v-model="requestType"
                class="el-select"
                placeholder="请选择"
                @change="selectChange"
              >
                <el-option label="手机号码" value="tel" />
                <el-option label="票据号码" value="billId" />
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item prop="verifyCode">
            <el-input
              v-model="query.verifyCode"
              placeholder="请输入校验码"
              clearable
              style="width: 350px;"
              class="input-with-select"
            >
              <template slot="prepend">校验码</template>
            </el-input>
          </el-form-item>
        </div>

        <div v-if="requestType === 'billId'">
          <el-form-item prop="billId">
            <el-input
              v-model="query.billId"
              placeholder="请输入票据号码"
              clearable
              class="input-with-select"
              style="width: 350px;"
            >
              <el-select
                slot="prepend"
                v-model="requestType"
                class="el-select"
                placeholder="请选择"
                @change="selectChange"
              >
                <el-option label="手机号码" value="tel" />
                <el-option label="票据号码" value="billId" />
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item prop="verifyCode">
            <el-input
              v-model="query.checkCode"
              placeholder="请输入校验码"
              clearable
              style="width: 350px;"
              class="input-with-select"
            >
              <template slot="prepend">校验码</template>
            </el-input>
          </el-form-item>
        </div>

        <el-form-item label>
          <el-button
            class="check-button"
            type="primary"
            icon="el-icon-search"
            @click="handlerCheck"
          >
            查验
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-dialog title="电子票据" :visible.sync="billDialogVisible">
      <el-form :inline="true">
        <el-table
          v-show="showTable"
          :stripe="true"
          :data="tableData"
        >
          <el-table-column
            prop="title"
            width="180"
          />
          <el-table-column
            prop="property"
          />
        </el-table>
      </el-form>

      <el-button v-if="bill.fBillImgUrl!==null" type="button" style=" margin-top: 15px;" @click="openImg">查看票据详情</el-button>

      <el-dialog
        :visible.sync="imgDialogVisible"
        title="电子票据"
        append-to-body
      >
        <el-image
          v-if="bill.fBillImgUrl!==null"
          :src="bill.fBillImgUrl"
        />
      </el-dialog>
    </el-dialog>
  </div>

</template>

<script>
import { getBill, billCheck } from '@/api/msg.js'
import titleImg from '@/assets/bg/title.png'

export default {
  data () {
    return {
      titleImg: titleImg,
      billDialogVisible: false,
      imgDialogVisible: false,
      requestType: 'tel',
      query: {
        billId: null,
        checkCode: null,
        tel: null,
        verifyCode: null
      },
      bill: {},
      tableData: [{
        title: '开票时间',
        property: ''
      }, {
        title: '票据类型',
        property: ''
      }, {
        title: '票据号码',
        property: ''
      }, {
        title: '票据代码',
        property: ''
      }, {
        title: '校验位',
        property: ''
      }, {
        title: '交款人',
        property: ''
      }, {
        title: '合计金额',
        property: ''
      }, {
        title: '开票单位',
        property: ''
      }
      ],
      loading: false,
      showTable: false,
      rules: {
        tel: [{
          required: true,
          message: '请输入手机号码',
          trigger: ['blur', 'change']
        }, {
          pattern: /^1\d{10}$/,
          message: '无效手机号码'
        }
        ],
        verifyCode: [{
          required: true,
          message: '请输入校验码',
          trigger: ['blur', 'change']
        }, {
          pattern: /^[A-Za-z0-9]{6}$/,
          message: '无效校验码'
        }
        ],
        billId: [{
          required: true,
          message: '请输入票据号码',
          trigger: ['blur', 'change']
        }, {
          pattern: /^[A-Za-z0-9]{6}$/,
          message: '无效票据号码'
        }
        ]
      }
    }
  },
  created () {
  },
  methods: {
    jump () {
      this.$router.push({
        path: '/dashboard' })
    },
    clearTable () {
      this.showTable = false
      this.bill = {}
      for (const obj of this.tableData) {
        obj.property = ''
      }
    },

    loadTable () {
      this.showTable = true
      this.tableData[0].property = this.bill.fCreateTime
      this.tableData[1].property = this.bill.fBillType
      this.tableData[2].property = this.bill.fBillId
      this.tableData[3].property = this.bill.fBillNo
      this.tableData[4].property = this.bill.fCheckCode
      this.tableData[5].property = this.bill.fPlaceName
      this.tableData[6].property = this.bill.fPayerName
      this.tableData[7].property = this.bill.fTotalAmt
    },

    async handlerCheck () {
      this.loading = true
      this.clearTable()
      this.bill = {}
      if (this.requestType === 'tel') {
        await getBill(this.query).then(res => {
          this.billDialogVisible = true
          this.bill = JSON.parse(res.data)
          this.loadTable()
          this.loading = false
        }).catch(() => { this.loading = false })
      } else {
        await billCheck(this.query).then(res => {
          this.billDialogVisible = true
          this.bill = JSON.parse(res.data)
          this.loading = false
          this.loadTable()
          this.loading = false
        }).catch(() => { this.loading = false })
      }
      this.loading = false
    },
    // 前端手机号查询参数校验
    telValidator (tel) {
      return /^1\d{10}$/.test(tel)
    },
    // 前端校验码查询参数校验
    verifyCodeValidator (verifyCode) {
      return /^[A-Za-z0-9]{6}$/.test(verifyCode)
    },
    login () {
      this.$router.push({
        path: '/login' })
    },
    // 参数校验失败弹窗
    openErrormsg (msg) {
      this.$message({
        showClose: true,
        message: msg,
        type: 'error'
      })
    },
    openImg () {
      this.imgDialogVisible = true
    },
    selectChange () {
      this.query.billId = null
      this.query.checkCode = null
      this.query.tel = null
      this.query.verifyCode = null
    }
  }
}
</script>
<style scoped lang="scss">
.app-container {
    bottom: 0;
    left: 0;
    width:100%;
    height:100%;
    z-index:-10;
    zoom: 1;
    background-color: #fff;
    background: url('~@/assets/bg/bg.jpg');
    background-size: cover;
    -webkit-background-size: cover;
    -o-background-size: cover;
    background-position: left  bottom;
    text-align:center;

  }
  .index-check {
    margin: 0 auto;
    margin-top: 25%;
  }
  .input-with-select {
    float: left;
  }
  .titleImg {
    top: 10px;
    left:100px;
    position: absolute;
  }
  .check-form {
    margin-top: 15%;
  }
  .login-button {
    float: right;
    color: #fff;
  }

  ::v-deep .el-select .el-input {
    width: 110px;
    background-color: #3f5c6d2c;
  }
  ::v-deep .input-with-select .el-input-group__prepend {
    width: 110px;
    background-color: #3f5c6d2c;
  }::v-deep .input-with-select .el-scrollbar__view {
    background-color: #3f5c6d2c;
  }
  ::v-deep .el-form-item__error{
    float: right;
    font-size: 15px;
    font-weight: 800;
  }
</style>
