<template>
  <el-dialog
    title="财政端票据销毁审核"
    :visible.sync="visible"
    width="70%"
    top="6vh"
  >
    <div class="verify">
      <span class="bill">票据销毁审核</span>
      <div>
        <el-button
          type="primary"
          size="small"
          @click="confirmOK()"
        >审核通过</el-button>
        <el-button
          type="primary"
          size="small"
          @click="confirmNO()"
        >审核失败</el-button>
      </div>
    </div>
    <el-divider />
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
      size="small"
      class="demo-ruleForm"
      style="width: 800px"
    >
      <div class="verify-header">
        <el-form-item
          label="申请单位"
          prop="desc"
          style="width: 300px"
        >
          <el-input
            v-model="ruleForm.danwei"
            type="textarea"
            :rows="1"
            disabled
          />
        </el-form-item>
        <el-form-item
          label="审验期间"
          required
          style="width: 500px"
        >
          <el-col :span="11">
            <el-form-item prop="date1">
              <el-date-picker
                v-model="ruleForm.date1"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col
            class="line"
            :span="2"
          >-</el-col>
          <el-col :span="11">
            <el-form-item prop="date2">
              <el-time-picker
                v-model="ruleForm.date2"
                placeholder="选择时间"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-form-item>
      </div>
      <div>
        <el-row>
          <el-col :span="9">
            <el-form-item
              label="申请人"
              prop="desc"
              style="width: 300px"
            >
              <el-input
                v-model="ruleForm.applyMan"
                type="textarea"
                :rows="1"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item
              label="申请时间"
              prop="desc"
              style="width: 300px"
            >
              <el-input
                v-model="ruleForm.applyDate"
                type="textarea"
                :rows="1"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item
              label="审核人"
              prop="desc"
              style="width: 300px"
            >
              <el-input
                v-model="ruleForm.ConfirmMan"
                type="textarea"
                :rows="1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item
              label="申请类型"
              prop="desc"
              style="width: 300px"
            >
              <el-input
                v-model="ruleForm.applyType"
                type="textarea"
                :rows="1"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item
              label="备注"
              prop="desc"
            >
              <el-input
                v-model="ruleForm.desc"
                type="textarea"
                :rows="1"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <el-card shadow="always">
      <div style="height: 300px">
        <div
          class="subject"
          size="small"
        >
          <span>票据销毁申请明细</span>
        </div>
        <el-divider content-position="left">票据销毁审核</el-divider>
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          class="infinite-list-wrapper"
          size="small"
          border
        >
          <el-table-column
            type="index"
            prop="no"
            label="序号"
          />
          <el-table-column
            prop="fBillName"
            label="票据名称"
          />
          <el-table-column
            prop="fBillBatchCode"
            label="票据代码"
          />
          <el-table-column
            prop="fWarehouseId"
            label="仓库ID"
          />
          <el-table-column
            prop="fWarehouseName"
            label="仓库名"
          />
          <el-table-column
            prop="fNumber"
            label="数量"
          />
          <el-table-column
            prop="fBillNo1"
            label="起始号"
          />
          <el-table-column
            prop="fBillNo2"
            label="终止号"
          />
        </el-table>
      </div>
    </el-card>
  </el-dialog>
</template>
<script>
import {
  getItemListByDestroyNo, destroyStockBill
} from '@/api/qiuhengGroupApi/destroy/destroyConfirm'
import {
  updateApplyInfo
} from '@/api/qiuhengGroupApi/destroy/destroyApply'
export default {
  data () {
    return {
      visible: false,
      status: '',
      tableData: [],

      fAgenIdCode: '',
      fBillBatchCode: '',
      fWarehouseId: '',
      fBillNo1: '',
      fBillNo2: '',

      ruleForm: {
        date1: '',
        date2: '',
        desc: '',
        danwei: '博思软件股份有限公司',
        applyMan: '',
        applyDate: '',
        applyType: ''
      },
      resultVo: {
        fDestroyNo: '',
        fStatus: ''
      },
      rules: {
        date1: [
          { type: 'date', required: true, message: '请选择日期', triggr: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', triggr: 'change' }
        ]
      }
    }
  },
  mounted () {},
  created () {
    this.$root.eventBus.$on('fDestroyNoConfirm', (val) => {
      this.resultVo.fDestroyNo = val
      this.getData(val)
    })
    this.$root.eventBus.$on('visibleDestroyConfirm', (val) => {
      this.visible = val
    })
    this.$root.eventBus.$on('lookDestroyApplyMan', (val) => {
      this.ruleForm.applyMan = val
    })
    this.$root.eventBus.$on('lookDestroyApplyDate', (val) => {
      this.ruleForm.applyDate = val
    })
    this.$root.eventBus.$on('lookDestroyApplyType', (val) => {
      this.ruleForm.applyType = val
    })
  },
  methods: {
    async getData (val) {
      const res = await getItemListByDestroyNo(val)
      this.tableData = res.data
    },
    confirmOK () {
      this.$confirm('确认该票据销毁申请审核通过，并且立即销毁票据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.resultVo.fStatus = '已审核并通过'
        for (var k = 0; k < this.tableData.length; k++) {
          this.fAgenIdCode = '360102000000'
          this.fBillBatchCode = this.tableData[k].fBillBatchCode
          this.fWarehouseId = this.tableData[k].fWarehouseId
          this.fBillNo1 = this.tableData[k].fBillNo1
          this.fBillNo2 = this.tableData[k].fBillNo2
          destroyStockBill(this.fAgenIdCode, this.fBillBatchCode, this.fWarehouseId, this.fBillNo1, this.fBillNo2)
        }
        updateApplyInfo(this.resultVo)
        this.visible = false
        this.$router.push
        this.$message({
          type: 'success',
          message: '票据销毁申请审核通过，且票据销毁成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    confirmNO () {
      this.$confirm('确认该票据销毁申请审核不通过，退回给申请人?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.resultVo.fStatus = '已审核但未通过'
        updateApplyInfo(this.resultVo)
        this.visible = false
        this.$router.push
        this.$message({
          type: 'success',
          message: '票据销毁申请审核不通过，且票据销毁不成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/home.scss";
</style>
