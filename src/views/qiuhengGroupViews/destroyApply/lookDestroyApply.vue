<template>
  <el-dialog
    title="单位票据销毁申请信息"
    :visible.sync="lookDestroyApplyDialogVisible"
    width="70%"
  >
    <div class="look">
      <span class="bill">票据销毁申请查看</span>
    </div>
    <el-divider />
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      label-width="100px"
      size="small"
      class="demo-ruleForm"
      style="width: 800px"
    >
      <div class="look-header">
        <el-row>
          <el-col :span="10">
            <el-form-item
              label="申请单号"
              prop="fDetroyNo"
              style="width: 300px"
            >
              <el-input
                v-model="ruleForm.fDetroyNo"
                type="textarea"
                :rows="1"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              label="申请单位"
              prop="unitName"
              style="width: 300px"
            >
              <el-input
                v-model="ruleForm.unitName"
                type="textarea"
                :rows="1"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              label="申请人"
              prop="applyMan"
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
          <el-col :span="10">
            <el-form-item
              label="申请日期"
              prop="applyDate"
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
          <el-col :span="10">
            <el-form-item
              label="申请类型"
              prop="applyType"
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
          <el-col :span="10">
            <el-form-item
              label="申请状态"
              prop="applyStatus"
              style="width: 300px"
            >
              <el-input
                v-model="ruleForm.applyStatus"
                type="textarea"
                :rows="1"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>

      </div>
    </el-form>
    <el-card shadow="always">
      <div style="height: 230px">
        <div
          class="subject"
          size="small"
        >
          <span>票据销毁申请明细</span>
        </div>
        <el-divider content-position="left">票据销毁申请信息明细</el-divider>
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
  getItemListByDestroyNo
} from '@/api/qiuhengGroupApi/destroy/destroyConfirm'
export default {
  data () {
    return {
      visible: false,
      tableData: [],
      ruleForm: {
        date1: '',
        date2: '',
        unitName: '博思软件股份有限公司',
        fDetroyNo: '',
        applyMan: '',
        applyDate: '',
        applyType: '',
        applyStatus: ''
      },
      lookDestroyApplyDialogVisible: false
    }
  },
  mounted () {},
  created () {
    this.$root.eventBus.$on('lookDestroyApplyDialogVisible', (val) => {
      // console.log(this.visible)
      this.lookDestroyApplyDialogVisible = val
      console.log(this.lookDestroyApplyDialogVisible)
    })
    this.$root.eventBus.$on('lookDestroyApply', (val) => {
      this.getData(val)
      this.ruleForm.fDetroyNo = val
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
    this.$root.eventBus.$on('lookDestroyApplyStatus', (val) => {
      this.ruleForm.applyStatus = val
    })
  },
  methods: {
    async getData (val) {
      const res = await getItemListByDestroyNo(val)
      // console.log(res)
      this.tableData = res.data
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/home.scss";
</style>
