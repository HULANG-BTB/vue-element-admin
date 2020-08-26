<template>
  <el-row
    class="home"
    :gutter="20"
  >
    <el-col :span="24">
      <el-card shadow="hover">
        <div>
          <el-form
            :inline="true"
            :model="page"
            :rules="rules"
            class="demo-form-inline"
            size="small"
          >
            <div class="search">
              <div>
                <el-form-item
                  label="票据编号"
                  prop="keyword"
                >
                  <el-input
                    v-model="page.keyword"
                    placeholder="票据编号"
                    @blur="getData"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    @click="onSubmit()"
                  >查询</el-button>
                </el-form-item>
              </div>
              <div>
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
              </div>

            </div>
          </el-form>
          <verify-dialog />
          <el-divider>
            <i class="el-icon-mobile-phone" />
          </el-divider>
          <!--开票记录列表-->
          <div class="bill-header">
            <div>
              <el-button
                type="primary"
                @click="addBill"
              >新增开票
              </el-button>
            </div>
            <div>
              <span>本单位开票记录</span>
            </div>
          </div>

          <el-table
            :data="billList"
            style="width: 100%"
            border
            stripe
            size="small"
            @row-click="getStep"
          >
            <el-table-column type="expand">
              <template>
                <el-form
                  label-position="left"
                  inline
                  class="demo-table-expand"
                >
                  <el-timeline>
                    <el-timeline-item>
                      <el-steps :active="active" finish-status="success">
                        <el-step title="开票请求" />
                        <el-step title="单位端审核通过" />
                        <el-step title="财政端审核通过" />
                        <el-step title="开票成功" />
                      </el-steps>
                    </el-timeline-item>
                  </el-timeline>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
              label="票据 ID"
              prop="fbillId"
            />
            <el-table-column
              label="票据代码"
              prop="fbillNo"
            />
            <el-table-column
              label="开票日期"
              prop="fcreateTime"
            />
            <el-table-column
              label="开票金额"
              prop="ftotalAmt"
            />
            <el-table-column
              label="开票单位"
              prop="fplaceName"
            />
            <el-table-column
              label="票据状态"
              prop="fstate"
            />
          </el-table>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import {
  getBillListByPage,
  getOneBill,
  addBillVerify
} from '@/api/qiuhengGroupApi/billInvoicing/bill'
import VerifyDialog from '@/views/qiuhengGroupViews/verify/Dialog'
export default {
  components: {
    'verify-dialog': VerifyDialog
  },
  data () {
    return {
      unitName: '博思软件股份有限公司',
      // 票据列表
      billList: [],
      // dialog显示
      visible: true,
      // 分页
      page: {
        currentPage: 1,
        pageSize: 1,
        total: 0,
        keyword: ''
      },
      rules: {
        keyword: { required: true, message: '请输入票据编号', blur }
      },
      // 查询条件
      query: {
        currentPage: 1,
        pageSize: 1
      },
      active: 1
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    // 获取票据信息列表，分页查询
    async getTableData () {
      this.query.currentPage = this.page.currentPage
      this.query.pageSize = this.page.pageSize
      const res = await getBillListByPage(this.query)
      this.billList = res.data.records
      // 通过slice方法获取数组中的一段
      this.page.total = res.data.total
    },
    getData () {
      if (this.page.keyword === '') {
        this.getTableData()
      }
    },
    // 提交查询条件
    async onSubmit () {
      const billId = this.page.keyword
      const res = await getOneBill(billId)
      if (res != null) {
        const newBillList = {
          list: []
        }
        newBillList.list.push(res.data)
        this.billList = newBillList.list
      }
    },
    // 调整每页显示条数
    handleSizeChange (val) {
      this.page.pageSize = val
    },
    // 修改当前页数
    handleCurrentChange (val) {
      this.page.currentPage = val
    },
    // ok
    handleSelectionChange () {

    },
    async addBill () {
      // 需要先验证单位是否欠缴/单位是否有可用票据/单位开票数是否已经达到最大限制
      await addBillVerify(this.unitName).then((res) => {
        if (res.success) {
        // 打印预警信息
          this.$router.push({ name: 'ticket' })
        } else {
          this.$message(res.msg)
        }
      })
    },
    // 获取状态
    getStep (row) {
      this.active = row.fstate
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
.bill-header {
  display: flex;
  justify-content: space-between;
}
.search {
  display: flex;
  justify-content: space-between;
}
</style>
