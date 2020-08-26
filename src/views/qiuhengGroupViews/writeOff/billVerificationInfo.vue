<template>
  <el-dialog
    custom-class="dialog-container"
    width="65%"
    :visible.sync="dialogVisible"
    :show-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :destroy-on-close="true"
  >
    <div
      slot="title"
      class="title"
    >
      <!-- 标题区 -->
      <div style="float: left; padding-top: 10px">
        <span>审验申请—— </span>
        <span v-if="isNew">新增</span>
        <span v-if="!isNew">修改</span>
      </div>
      <!-- 按钮区 -->
      <div style="float: right;">
        <el-button
          v-if="row.fisUpload!=='已上报'"
          type="primary"
          size="small"
          icon="el-icon-document-checked"
          @click="save"
        >保 存</el-button>
        <el-button
          size="small"
          icon="el-icon-circle-close"
          @click="close"
        >关 闭</el-button>
      </div>
    </div>
    <div class="body">
      <el-row>
        <el-col
          :span="10"
          :offset="3"
        >NO.{{ unitCode }}</el-col>
        <el-col
          :span="2"
          :offset="9"
          style="color: red; font-size: 15px"
        >
          <span v-if="row.fChangeState==='已审验'">已审验</span>
          <span v-if="row.fChangeState!=='已审验'&&row.fIsUpload==='已上报'">已上报</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col
          :span="3"
          style="text-align: right;margin-top: 7px;padding-right: 10px"
        >
          <span style="color: red;font-size:14px">*</span>
          申请单位
        </el-col>
        <el-col :span="8">
          <el-input
            v-model="unitName"
            size="small"
            disabled
          />
        </el-col>
        <el-col
          v-if="row.fChangeState==='已审验'"
          :span="4"
          :offset="9"
          style="color: red; font-size: 15px; text-align: right; margin-top: 7px;"
        >审验结果： {{ row.fCheckResult }}</el-col>
      </el-row>
      <el-row>
        <el-col
          :span="3"
          style="text-align: right;margin-top: 7px;padding-right: 10px"
        >
          备注
        </el-col>
        <el-col :span="21">
          <el-input
            v-model="memo"
            size="small"
          />
        </el-col>
      </el-row>
      <el-row>
        <el-col
          :span="3"
          style="text-align: right;margin-top: 9px;padding-right: 10px"
        >
          核销截止日期
        </el-col>
        <el-col :span="8">
          <el-date-picker
            v-if="row.fIsUpload==='已上报'"
            v-model="endDate"
            type="date"
            placeholder="选择日期"
            size="small"
            disabled
          />
          <el-date-picker
            v-if="row.fIsUpload!=='已上报'"
            v-model="endDate"
            type="date"
            placeholder="选择日期"
            size="small"
            :picker-options="pickerOptions"
            :clearable="false"
            @focus="rememberOldDate"
          />
        </el-col>
        <el-col :span="3">
          <el-button
            type="primary"
            size="small"
            @click="getBill"
          >确定</el-button>
        </el-col>
      </el-row>
      <el-tabs
        value="1"
        type="border-card"
      >
        <el-tab-pane
          label="开票明细"
          name="1"
        >
          <div v-loading="loading1">
            <el-table
              :data="items.list"
              :header-cell-style="{'text-align':'center', 'background-color':'#EEF5FD'}"
              :cell-style="{'text-align':'center'}"
              height="220"
              stripe
              border
            >
              <el-table-column
                label="序号"
                type="index"
                :index="table_index1"
                width="60"
              />
              <el-table-column
                label="票据批次号"
                prop="fBatchNo"
              />
              <el-table-column
                label="票据名称"
                prop="fBillName"
              />
              <el-table-column
                label="份数"
                prop="fNumber"
              />
              <el-table-column
                label="起始号"
                prop="fBillNo1"
              />
              <el-table-column
                label="终止号"
                prop="fBillNo2"
              />
              <el-table-column
                label="金额"
                prop="fAmt"
              />
            </el-table>

            <el-row>
              <el-col
                :span="9"
                :offset="13"
              >
                <!-- 分页区域 -->
                <el-pagination
                  :current-page="itemQueryInfo.pageNum"
                  :page-sizes="[10, 15, 20, 30, 50]"
                  :page-size="itemQueryInfo.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="items.total"
                  @size-change="handleSizeChange1"
                  @current-change="handleCurrentChange1"
                />
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="收入情况"
          name="2"
        >
          <div v-loading="loading2">
            <el-table
              :data="incomes.list"
              :header-cell-style="{'text-align':'center', 'background-color':'#EEF5FD'}"
              :cell-style="{'text-align':'center'}"
              height="220"
              stripe
              border
            >
              <el-table-column
                label="序号"
                type="index"
                :index="table_index2"
                width="60"
              />
              <el-table-column
                label="项目编码"
                prop="fItemCode"
              />
              <el-table-column
                label="项目名称"
                prop="fItemName"
              />
              <el-table-column
                label="计量单位"
                prop="fUnits"
              />
              <el-table-column
                label="金额"
                prop="fAmt"
              />
            </el-table>

            <el-row>
              <el-col
                :span="9"
                :offset="13"
              >
                <!-- 分页区域 -->
                <el-pagination
                  :current-page="incomeQueryInfo.pageNum"
                  :page-sizes="[10, 15, 20, 30, 50]"
                  :page-size="incomeQueryInfo.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="incomes.total"
                  @size-change="handleSizeChange2"
                  @current-change="handleCurrentChange2"
                />
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div
      slot="footer"
      class="footer"
    >
      <span style="margin-left: 10px;">编制人: {{ author }}</span>
      <span style="margin-left: 100px;">编制日期：{{ date }}</span>
    </div>
  </el-dialog>
</template>

<script>
import { getItems, getIncomes, getBillInfo, saveApply } from '@/api/qiuhengGroupApi/writeOff/wirteOffUnit'
export default {
  props: {
    dialogVisible: Boolean,
    isNew: Boolean,
    row: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      // 限定时间选择不超过今天
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now() - 86400000
        }
      },
      // 编制人
      author: '单位端',
      // 编制日期
      date: '',
      fDate: null,
      // 单位代码
      unitCode: '360102000000',
      // 单位名
      unitName: '',
      // 备注
      memo: '',
      // 截止日期
      endDate: '',
      // apply item
      items: {
        list: [],
        total: 0
      },
      // apply income
      incomes: {
        list: [],
        total: 0
      },
      // itemQueryInfo
      itemQueryInfo: {
        no: this.row.fNo,
        pageNum: 1,
        pageSize: 10
      },
      // incomeQueryInfo
      incomeQueryInfo: {
        no: this.row.fNo,
        pageNum: 1,
        pageSize: 10
      },
      // 加载
      loading1: true,
      loading2: true,
      // 票据相关信息
      billInfo: {
        items: [],
        incomes: []
      },
      // 前端分页
      pageInFront: false,
      oldDate: ''
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    close () {
      this.$parent.close()
      this.$parent.getWriteOffApplyList()
    },
    // 翻页序号连续
    table_index1 (index) {
      return (this.itemQueryInfo.pageNum - 1) * this.itemQueryInfo.pageSize + index + 1
    },
    // 翻页序号连续
    table_index2 (index) {
      return (this.incomeQueryInfo.pageNum - 1) * this.incomeQueryInfo.pageSize + index + 1
    },
    // 初始化数据
    initData () {
      this.author = '单位端'
      this.date = new Date().toLocaleDateString()
      this.fDate = new Date()
      this.unitName = '博思软件股份有限公司'
      this.memo = this.row.fMemo
      if (this.row.fEndDate !== '') {
        this.endDate = this.row.fEndDate
      }
      if (this.row.fAuthor !== '') {
        this.author = this.row.fAuthor
      }
      if (this.row.fDate !== '') {
        this.date = this.row.fDate
        this.fDate = this.row.fDate
      }
      if (this.row.fNo !== '') {
        this.getWriteOffItems()
        this.getWriteOffIncomes()
      } else {
        this.loading1 = false
        this.loading2 = false
      }
    },
    async getWriteOffItems () {
      const { data: res } = await getItems(this.itemQueryInfo)

      this.items.list = res.list
      this.items.total = res.total

      this.loading1 = false
    },
    async getWriteOffIncomes () {
      const { data: res } = await getIncomes(this.incomeQueryInfo)

      this.incomes.list = res.list
      this.incomes.total = res.total

      this.loading2 = false
    },
    // 监听 pagesize 改变的事件
    handleSizeChange1 (newSize) {
      this.loading1 = true
      this.itemQueryInfo.pageSize = newSize
      if (!this.pageInFront) {
        this.getWriteOffItems()
      } else {
        this.items.list = this.billInfo.items.slice((this.itemQueryInfo.pageNum - 1) * this.itemQueryInfo.pageSize, this.itemQueryInfo.pageNum * this.itemQueryInfo.pageSize)
        this.loading1 = false
      }
    },
    // 监听 页码值 改变的事件
    handleCurrentChange1 (newPage) {
      this.loading1 = true
      this.itemQueryInfo.pageNum = newPage
      if (!this.pageInFront) {
        this.getWriteOffItems()
      } else {
        this.items.list = this.billInfo.items.slice((this.itemQueryInfo.pageNum - 1) * this.itemQueryInfo.pageSize, this.itemQueryInfo.pageNum * this.itemQueryInfo.pageSize)
        this.loading1 = false
      }
    },
    // 监听 pagesize 改变的事件
    handleSizeChange2 (newSize) {
      this.loading2 = true
      this.incomeQueryInfo.pageSize = newSize
      if (!this.pageInFront) {
        this.getWriteOffIncomes()
      } else {
        this.incomes.list = this.billInfo.incomes.slice((this.incomeQueryInfo.pageNum - 1) * this.incomeQueryInfo.pageSize, this.incomeQueryInfo.pageNum * this.incomeQueryInfo.pageSize)
        this.loading2 = false
      }
    },
    // 监听 页码值 改变的事件
    handleCurrentChange2 (newPage) {
      this.loading2 = true
      this.incomeQueryInfo.pageNum = newPage
      if (!this.pageInFront) {
        this.getWriteOffIncomes()
      } else {
        this.incomes.list = this.billInfo.incomes.slice((this.incomeQueryInfo.pageNum - 1) * this.incomeQueryInfo.pageSize, this.incomeQueryInfo.pageNum * this.incomeQueryInfo.pageSize)
        this.laoding2 = false
      }
    },
    // 从接口中获取数据
    async getBill () {
      this.loading1 = true
      this.loading2 = true

      const queryInfo = {
        agenIdCode: 1,
        end: this.endDate
      }
      let res = await getBillInfo(queryInfo)
      if (res.code !== 10000) {
        this.$message({
          type: 'warning',
          message: '日期选择有误，在此日期之前没有需要核销的票'
        })
        this.loading1 = false
        this.loading2 = false
        this.endDate = this.oldDate
        return
      }
      res = res.data
      this.billInfo.items = res.applyItemVOS
      this.billInfo.incomes = res.applyIncomeVOS
      this.items.total = this.billInfo.items.length
      this.incomes.total = this.billInfo.incomes.length
      this.pageInFront = true
      this.itemQueryInfo.pageNum = 1
      this.itemQueryInfo.pageSize = 10
      this.incomeQueryInfo.pageNum = 1
      this.incomeQueryInfo.pageSize = 10
      this.items.list = this.billInfo.items.slice(0, this.itemQueryInfo.pageSize)
      this.incomes.list = this.billInfo.incomes.slice(0, this.incomeQueryInfo.pageSize)

      this.loading1 = false
      this.loading2 = false
    },
    rememberOldDate () {
      this.oldDate = this.endDate
    },
    // 添加明细到数据库
    async save () {
      const applyVO = {
        apply: {
          fNo: this.row.fNo,
          fAuthor: this.author,
          fDate: this.fDate,
          fEndDate: this.endDate,
          fMemo: this.memo
        },
        billInfo: {
          applyItemVOS: this.billInfo.items,
          applyIncomeVOS: this.billInfo.incomes
        }
      }

      saveApply(applyVO)
        .then((res) => {
          if (res.code === 10000) {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.close()
          } else {
            this.$message({
              type: 'info',
              message: '保存失败'
            })
          }
        })
        .catch((err) => {
          this.$message({
            type: 'info',
            message: '保存失败'
          })
          console.error(err)
        })
    }

  }
}
</script>

<style lang="scss" scoped>
.dialog-container {
  .title {
    .el-button {
      font-size: 15px;
    }
  }
  .body {
    .el-row {
      margin-top: 10px;
    }
    .el-tabs {
      margin-top: 12px;
      margin-bottom: 5px;
    }
  }
}
</style>

<style lang="scss">
.el-dialog__header {
  height: 65px;
  border-bottom: 1px solid #e8eaec;
}
.el-dialog__body {
  padding-top: 5px;
}
.el-dialog__footer {
  border-top: 1px solid #e8eaec;
  text-align: left;
}
</style>
