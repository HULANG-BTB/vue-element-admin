<template>
  <div v-loading.body="loading" class="app-container">
    <el-collapse accordion>
      <el-collapse-item>
        <template slot="title">
          电子票据详情查询入口<i class="header-icon el-icon-info" />
        </template>
        <div>输入短信中收到的验证码及手机号码，查询电子票据的具体信息。</div>
        <div>注意：校验码是6位由字母和数字组成。</div>
      </el-collapse-item>
    </el-collapse>

    <el-form
      :model="query"
      :inline="true"
      class="demo-form-inline"
      @keyup.enter.native="handleSearch"
    >
      <el-form-item label="手机号码：15651995937">
        <el-input
          v-model="query.tel"
          placeholder="请输入手机号码"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label="校验码：i7gxlo">
        <el-input
          v-model="query.verifyCode"
          placeholder="请输入校验码"
          clearable
          size="small"
        />
      </el-form-item>

      <el-form-item label>
        <div @mousemove="validator()">
          <el-tooltip class="item" effect="dark" :content="validatorMsg" placement="right">
            <el-button
              icon="el-icon-search"
              size="small"
              @click="handleSearch"
            >搜索</el-button>
          </el-tooltip></div>

      </el-form-item>

    </el-form>
    <el-button v-if="bill.fBillImgUrl !== undefine" type="button" @click="openImg">查看票据详情</el-button>

    <el-form :inline="true">

      <el-table
        v-show="showTable"
        :data="tableData"
        style="width: 30%"
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
    <el-dialog
      :visible.sync="dialogVisible"
      title="电子票据"
    >
      <el-image
        :src="bill.fBillImgUrl"
      /></el-dialog>
  </div>

</template>

<script>
import { getBill } from '@/api/msg.js'

export default {
  data () {
    return {
      dialogVisible: false,
      query: {
        tel: '',
        verifyCode: ''
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
      validatorMsg: null

    }
  },
  created () {
  },
  methods: {
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

    async handleSearch () {
      // 先进行前端参数校验
      if (!this.validator()) {
        this.clearTable()
        this.openErrormsg()
        return
      }
      this.loading = true
      const res = await getBill(this.query)
      if (res.status === 200) {
        this.bill = JSON.parse(res.data)
        this.loadTable()
        this.loading = false
        return
      } else if (res.status === 405) {
        this.openErrormsg()
      }
      this.clearTable()
      this.loading = false
    },

    // 前端参数校验
    validator () {
      const tel = /^1\d{10}$/.test(this.query.tel)
      const verifyCode = /^[A-Za-z0-9]{6}$/.test(this.query.verifyCode)
      if (tel && verifyCode) {
        this.validatorMsg = '参数合法'
        return tel && verifyCode
      } else {
        this.validatorMsg = '参数非法'
        return tel && verifyCode
      }
    },
    // 参数校验失败弹窗
    openErrormsg () {
      this.$message({
        showClose: true,
        message: '请输入正确的11位手机号码及6位校验码',
        type: 'error'
      })
    },
    openImg () {
      this.dialogVisible = true
    }
  }
}
</script>
