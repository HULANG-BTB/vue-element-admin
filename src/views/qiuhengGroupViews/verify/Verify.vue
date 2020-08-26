<template>
  <el-row class="home" :gutter="20">
    <el-col :span="24">
      <el-card shadow="hover">
        <div>
          <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
            <el-form-item label="业务单号">
              <el-input v-model="formInline.f_no" placeholder="业务单号" />
            </el-form-item>
            <el-form-item label="单位名称">
              <el-input v-model="formInline.f_agen_id_code" placeholder="单位名称" />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="formInline.region" placeholder="状态">
                <el-option label="已审核" value="0" />
                <el-option label="未审核" value="1" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>

            <el-form-item>
              <!--分页区域-->
              <div class="block">
                <el-pagination
                  :current-page="page.currentPage"
                  :total="page.total"
                  layout="total, sizes, prev, pager, next, jumper"
                  :page-size="page.pageSize"
                  :page-sizes="[10, 20, 30]"
                  size="small"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                />
              </div>
            </el-form-item>
          </el-form>
          <verify-dialog />
          <el-divider>
            <i class="el-icon-mobile-phone" />
          </el-divider>
          <!--审核票据查询列表-->
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            class="infinite-list-wrapper"
            size="small"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="60" />
            <el-table-column fixed prop="fbillId" label="票据 ID" />
            <el-table-column prop="fbillNo" label="票据编码" />
            <el-table-column prop="fCreateTime" label="开票时间" />
            <el-table-column prop="fstate" label="票据状态" />
            <el-table-column prop="fplaceName" label="开票单位" />
            <el-table-column prop="ftotalAmt" label="开票金额" />
            <el-table-column prop="existWarn" label="是否存在预警记录" />
            <el-table-column
              fixed="right"
              label="操作"
              width="100"
            >
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="handleClick(scope.row)">查看<i class="el-icon-tickets" /></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import {
  getPassBillList,
  getImageUrl,
  pdfSign
} from '@/api/qiuhengGroupApi/billInvoicing/bill'
import {

} from '@/api/qiuhengGroupApi/billInvoicing/bill'
import VerifyDialog from '@/views/qiuhengGroupViews/verify/Dialog'
export default {
  components: {
    'verify-dialog': VerifyDialog
  },
  data () {
    return {
      currentPage: 1,
      formInline: {
        f_no: '',
        f_agen_id_code: ''
      },
      tableData: [],
      visible: true,
      // 分页
      page: {
        currentPage: 1,
        pageSize: 1,
        total: 0,
        keyword: ''
      },
      query: {
        currentPage: 1,
        pageSize: 1
      }
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    async getTableData () {
      this.query.currentPage = this.page.currentPage
      this.query.pageSize = this.page.pageSize
      const res = await getPassBillList(this.query)
      this.tableData = res.data.records
      // 通过slice方法获取数组中的一段
      console.log(res.data.total)
      this.page.total = res.data.total
    },
    // 提交查询条件
    onSubmit () {
      console.log()
    },
    // 调整每页显示条数
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    // 修改当前页数
    handleCurrentChange (val) {
      console.log(`每页 ${val} 条`)
    },
    // 点击查看详情
    async handleClick (row) {
      this.$root.eventBus.$emit('verifydata', row)
      const billId = row.fbillId
      const billNo = row.fbillNo
      const res = await pdfSign(billId, billNo)
      if (res.success) {
        this.$message('财政签名审核通过')
        this.$root.eventBus.$emit('visible', this.visible)
        this.getUrl(billId, billNo)
      } else {
        this.$message('出现预警问题')
      }
    },
    // ok
    handleSelectionChange () {

    },
    // 获取票据模板img的url
    async getUrl (billId, billNo) {
      const res = await getImageUrl(billId, billNo)
      console.log(res)
      if (res.success) {
        this.imgUrl = res.data
        this.$root.eventBus.$emit('imgurl', this.imgUrl)
      } else {
        this.$message('出现预警问题')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/home.scss";
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
