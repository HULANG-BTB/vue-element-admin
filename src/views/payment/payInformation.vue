<template>
  <div class="bg">
    <div class="tab" style="text-align:center">
      <el-table
        :data="payment.slice((page-1)*limit,page*limit)"
        border
        stripe
        style="width: 50%;margin: 0 auto;height: 50%"
        :header-cell-style="{background:'rgb(85,214,249)'}"
      >
        <el-table-column prop="fnumber" label="序号" width="100%" />
        <el-table-column prop="fitemName" label="收费项目" width="100%" />
        <el-table-column prop="fnumber" label="数量" width="100%" />
        <el-table-column prop="famt" label="收费标准" width="100%" />
        <el-table-column prop="famt" label="应缴金额" width="100%" />
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
      <el-button type="primary" size="small" @click="Payment()">确认</el-button>
      <el-button type="info" size="small" @click="PayIndex()">返回</el-button>
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
      decodeURIComponent(this.$route.params.data)
    )
    this.payment = this.payInformation.payDto.uneCbillItems
    this.total = this.payInformation.total
  },
  methods: {
    Payment () {
      this.$router.push({
        name: 'Payment',
        params: { data: JSON.stringify(this.payInformation) }
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
.tab {
  padding-top: 200px;
}
.bg {
  background:rgb(196, 214, 247);
  background-size: 100%;
  width: 100%;
  height: 100%;
}
</style>>
