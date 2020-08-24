<template>
  <div>
    <el-dialog
      title="福州市Boss软件"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose"
    >
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        class="infinite-list-wrapper"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="60"
        />
        <el-table-column
          prop="fItemCode"
          label="项目编码"
          width="180"
        />
        <el-table-column
          prop="fItemName"
          label="项目名称"
        />
        <el-table-column
          prop="fUnits"
          label="计量单位"
        />
        <el-table-column
          prop="fNumber"
          label="数量"
        />
        <el-table-column
          prop="fAmt"
          label="金额"
        />
      </el-table>
      <div style="margin-top: 20px">
        <el-button @click="toggleSelection()">取消选择</el-button>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="getData"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getItemInfo
} from '@/api/qiuhengGroupApi/billInvoicing/bill'
export default {
  data () {
    return {
      dialogVisible: false,
      // eslint-disable-next-line no-sparse-arrays
      tableData: [
        {
          fItemCode: '1030101',
          fItemName: '农村网贷收入',
          fUnits: '元',
          fNumber: 1,
          fAmt: 44444.00
        },
        {
          fItemCode: '1030102',
          fItemName: '中央网贷收入',
          fUnits: '元',
          fNumber: 1,
          fAmt: 3333.00
        }
      ],
      multipleSelection: [],
      amt: 0
    }
  },
  mounted () {},
  created () {
    this.$root.eventBus.$on('dialogvisible', (val) => {
      this.dialogVisible = val
    })
  },
  methods: {
    // 获取单位收费项目
    async getItem () {
      // const unitName = '博思软件股份有限公司'
      // const res = await getItemInfo(unitName)
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },
    toggleSelection () {
      this.$refs.multipleTable.clearSelection()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 获取选中的收费项目
    getData () {
      const arr = this.multipleSelection
      const multis = []
      this.amt = 0
      for (let i = 0; i < arr.length; i++) {
        multis.push(arr[i])
        this.amt += arr[i].fAmt
      }
      this.dialogVisible = false
      this.$root.eventBus.$emit('data', multis)
      this.$root.eventBus.$emit('amt', this.amt)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
