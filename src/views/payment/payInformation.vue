<template>
  <div class="bk">
    <el-card class="bg">
      <el-table
        :data="payment.slice((page-1)*limit,page*limit)"
        border
        style="width: 60%;margin-top: 5%;margin-left: 20%;margin-bottom:2%"
      >
        <el-table-column prop="fitemCode" label="序号" width="100" />
        <el-table-column prop="fitemName" label="收费项目" width="140" />
        <el-table-column prop="fnumber" label="数量" width="140" />
        <el-table-column prop="famt" label="收费标准" width="140" />
        <el-table-column prop="famt" label="应缴费金额(元)" fixed="right" />
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next, sizes, total, jumper"
        :total="total"
        :current-page="page"
        :page-sizes="[1, 5, 8]"
        :page-size="limit"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <div style="margin-bottom:4%;margin-top:2%">
        <el-button type="primary" size="small" @click="Payment()">确认</el-button>
        <el-button type="danger" size="small" @click="PayIndex()">返回</el-button>
      </div>
    </el-card>
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
      this.$router.push({ name: 'PayIndex', params: {}})
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
.bg {
  text-align: center;
}
.bk {
  width: 100%;
  height: 100%;
  padding: 5%;
}
</style>
