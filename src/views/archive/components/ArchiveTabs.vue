<template>
  <div class="tab-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="单位基础信息" name="first"><AgenInfo :agen-info="list[0]" /></el-tab-pane>
      <!-- 在组件中赋予属性 -->
      <el-tab-pane label="可用票据" name="second"><BillAvailable :billavailable.sync="billavailable" /></el-tab-pane>
      <el-tab-pane label="可用项目" name="third"><ItemAvailable :itemavailable.sync="itemavailable" /></el-tab-pane>
      <el-tab-pane label="领购记录" name="fourth"><BillApply :billapply.sync="billapply" />
      </el-tab-pane>
      <el-tab-pane label="预警记录" name="fifth"><BillWarn :billwarn.sync="billwarn" /></el-tab-pane>
      <el-tab-pane label="审验记录" name="six"><BillCheck :billcheck.sync="billcheck" /></el-tab-pane>
      <el-tab-pane label="缴销记录" name="seven"><BillPay :billpay.sync="billpay" /></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import BillAvailable from './archivecomponents/BillAvailable'
import { fetchBillAvailable } from '@/api/archive'
import AgenInfo from './archivecomponents/AgenInfo'
import ItemAvailable from './archivecomponents/ItemAvailable'
import { fetchItemAvailable } from '@/api/archive'
import BillApply from './archivecomponents/BillApply'
import { fetchBillApply } from '@/api/archive'
import BillWarn from './archivecomponents/BillWarn'
import { fetchBillWarn } from '@/api/archive'
import BillCheck from './archivecomponents/BillCheck'
import { fetchBillCheck } from '@/api/archive'
import BillPay from './archivecomponents/BillPay'
import { fetchBillPay } from '@/api/archive'

export default {
  name: 'ArchiveTabs',
  components: {
    // 组件中接收属性
    BillAvailable,
    AgenInfo,
    ItemAvailable,
    BillApply,
    BillWarn,
    BillCheck,
    BillPay
  },
  // 父子组件通信属性  父组件ArchiveBaseInfo
  // 所有子组件的值都必须由
  props: {
    list: {
      type: Array,
      required: true
    },
    agencode: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      activeName: 'first',
      query: {
        // agenCode: this.list[0].agenCode,
        agenCode: '',
        page: 1,
        limit: 5
      },
      billapply: [],
      billavailable: [],
      itemavailable: [],
      billwarn: [],
      billcheck: [],
      billpay: []
    }
  },
  created () {
    this.query.agenCode = this.agencode
  },
  methods: {
    handleClick (tab, event) {
      switch (tab.name) {
        case 'second':
          this.getBillAvailableInfo()
          break
        case 'third' :
          this.getItemAvailableInfo()
          break
        case 'fourth' :
          this.getBillApplyInfo()
          break
        case 'fifth' :
          this.getBillWarnInfo()
          break
        case 'six' :
          this.getBillCheckInfo()
          break
        case 'seven' :
          this.getBillPayInfo()
          break
        default :
          break
      }
    },

    // 获取票据的领购信息
    getBillApplyInfo () {
      this.listLoading = true
      // 按照时间升序排列
      // 需要传递给前端收据的数量

      fetchBillApply(this.query).then(response => {
        this.billapply = response.data
        // this.total = response.data.length
        this.listLoading = false
      })
    },

    // 获取票据可用信息
    getBillAvailableInfo () {
      this.listLoading = true
      // 按照时间升序排列
      // 需要传递给前端收据的数量
      fetchBillAvailable(this.query).then(response => {
        this.billavailable = response.data
        this.listLoading = false
      })
    },

    // 获取可用项目信息
    getItemAvailableInfo () {
      this.listLoading = true
      // 按照时间升序排列
      // 需要传递给前端收据的数量
      fetchItemAvailable(this.query).then(response => {
        this.itemavailable = response.data
        this.listLoading = false
      })
    },

    // 获取票据警告信息
    getBillWarnInfo () {
      this.listLoading = true
      // 按照时间升序排列
      // 需要传递给前端收据的数量
      fetchBillWarn(this.query).then(response => {
        this.billwarn = response.data
        this.listLoading = false
      })
    },

    // 获取票据审查信息
    getBillCheckInfo () {
      this.listLoading = true
      // 按照时间升序排列
      // 需要传递给前端收据的数量
      fetchBillCheck(this.query).then(response => {
        this.billcheck = response.data
        this.listLoading = false
      })
    },

    // 获取票据缴款信息
    getBillPayInfo () {
      this.listLoading = true
      // 按照时间升序排列
      // 需要传递给前端收据的数量
      console.log(this.query)
      fetchBillPay(this.query).then(response => {
        this.billpay = response.data
        this.listLoading = false
      })
    }

  }
}
</script>

<style>
  .tab-container {
    margin: 30px;
  }
</style>
