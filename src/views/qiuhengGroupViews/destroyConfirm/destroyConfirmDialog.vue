<template>
  <el-dialog
    title='财政端票据销毁审核'
    :visible.sync="visible"
    width="70%"
  >
    <div class="verify">
      <span class="bill">票据销毁审核</span>
      <div>
        <el-button
          type="primary"
          size="small"
        >审核通过</el-button>
        <el-button
          type="primary"
          size="small"
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
    </el-form>
    <el-card shadow="always">
      <div style="height: 230px">
        <div
          class="subject"
          size="small"
        >
          <span>开票明细</span>
        </div>
        <el-divider content-position="left">开票审验</el-divider>
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          class="infinite-list-wrapper"
          size="small"
        >
          <el-table-column
            fixed
            prop="no"
            label="序号"
          />
          <el-table-column
            prop="status"
            label="状态"
          />
          <el-table-column
            prop="time"
            label="审验期间"
          />
          <el-table-column
            prop="bill_number"
            label="开票份数"
          />
          <el-table-column
            prop="payment"
            label="开票金额"
          />
          <el-table-column
            prop="existWarn"
            label="是否存在预警记录"
          />
        </el-table>
      </div>
    </el-card>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      visible: false,
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
      ruleForm: {
        date1: '',
        date2: '',
        desc: '',
        danwei: '博思软件股份有限公司'
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
    console.log(this.visible)
    this.$root.eventBus.$on('visible', (val) => {
      console.log(this.visible)
      this.visible = val
    })
  },
  methods: {
    getData () {
      var arr = this.multipleSelection
      const multis = []
      for (var i = 0; i < arr.length; i++) {
        multis.push(arr[i])
        this.$root.eventBus.$emit('data', multis)
        this.dialogVisible = false
        console.log(this.dialogVisible)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/home.scss";
</style>
