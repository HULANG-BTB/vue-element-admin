<template>
  <el-dialog
    title="福州市Boss软件"
    :visible.sync="visible"
    width="70%"
  >
    <div class="verify">
      <span class="bill">开票审验</span>
      <div>
        <el-button
          type="primary"
          size="small"
        >审验通过</el-button>
        <el-button
          type="primary"
          size="small"
        >审验失败</el-button>
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
    <el-card shadow="always" style="height: 400px">
      <div style="height: 230px">
        <div
          class="subject"
          size="small"
        >
          <span>票据信息</span>
        </div>
        <el-divider content-position="left">开票审验</el-divider>
        <div class="img">
          <img :src="imgUrl" class="image" />
        </div>
      </div>
    </el-card>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      visible: false,
      tableData: {},
      ruleForm: {
        date1: '',
        date2: '',
        desc: '',
        danwei: '福州市BOSS软件'
      },
      rules: {
        date1: [
          { type: 'date', required: true, message: '请选择日期', triggr: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', triggr: 'change' }
        ]
      },
      imgUrl: ''
    }
  },
  mounted () {},
  created () {
    this.$root.eventBus.$on('visible', (val) => {
      this.visible = val
    })
    this.$root.eventBus.$on('verifydata', (val) => {
      this.tableData = val
    })
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/home.scss";
.img {
  align-content: center;
}
</style>
