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
                  :current-page="currentPage"
                  :total="20"
                  layout="total, sizes, prev, pager, next, jumper"
                  :page-size="10"
                  :page-sizes="[10, 15, 20]"
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
            <el-table-column fixed prop="no" label="序号" />
            <el-table-column prop="status" label="状态" />
            <el-table-column prop="type" label="审验类型" />
            <el-table-column prop="danwei" label="开票单位" />
            <el-table-column prop="time" label="审验期间" />
            <el-table-column prop="bill_number" label="开票份数" />
            <el-table-column prop="payment" label="开票金额" />
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
      tableData: [{
        no: 1,
        status: '未审验',
        type: '手工审核',
        danwei: '福州市boss软件',
        time: '20160101-20160131',
        bill_number: 100,
        payment: '888888.00',
        existWarn: '是'
      }
      ],
      visible: true
    }
  },
  methods: {
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
    handleClick (row) {
      if (row.status === '未审验') {
        console.log(this.visible)
        this.$root.eventBus.$emit('visible', this.visible)
      }
    },
    // ok
    handleSelectionChange () {

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
