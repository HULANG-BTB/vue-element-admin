<template>
  <div class="bg">
    <div class="tab" style="text-align:center">
      <el-table
        :data="payment.slice((page-1)*limit,page*limit)"
        border
        stripe
        style="width: 50%;margin: 0 auto"
        :header-cell-style="{background:'rgb(85,214,249)'}"
      >
        <el-table-column prop="item" label="收费项目" width="180" />
        <el-table-column prop="shouldPay" label="收费标准" width="180" />
        <el-table-column prop="realPay" label="应缴金额" />
      </el-table>
      <br />
      <el-pagination
        background
        layout="prev, pager, next, sizes, total, jumper"
        :total="total"
        :current-page="page"
        :page-sizes="[1, 5, 10]"
        :page-size="limit"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <br />
      <el-button type="primary" class="button" @click="Payment()">确认</el-button>
      <el-button type="info" class="button" @click="PayIndex()">返回</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PayInformation',
  data () {
    return {
      loading: false,
      payInformation: '',
      payment: [],

      page: 1,
      limit: 5,
      total: '',
      keyword: ''
    }
  },
  created () {
    this.payInformation = JSON.parse(
      decodeURIComponent(this.$route.query.data)
    )
    this.payment = this.payInformation.PayList
    this.total = this.payInformation.total
  },
  methods: {
    Payment () {
      this.$router.push({
        path: '/payment',
        query: { data: JSON.stringify(this.payInformation) }
      })
    },

    PayIndex () {
      this.$router.push({ path: '/pay', query: {}})
    },

    // 每页数目改变
    handleSizeChange (val) {
      this.limit = val
    },

    // 当前页码改变
    handleCurrentChange (val) {
      this.page = val
    }
  }
}
</script>
<style scoped>
.button {
  height: 40px;
  width: 120px;
}
.tab {
  padding-top: 200px;
}
.bg {
  /* width: 100%;
  height: 100%;
  background:url(../../assets/payment/bg.jpg) no-repeat;
  background-size: 100%; */
  background:rgb(196, 214, 247);
  background-size: 100%;
  width: 100%;
  height: 100%;
}
</style>>
