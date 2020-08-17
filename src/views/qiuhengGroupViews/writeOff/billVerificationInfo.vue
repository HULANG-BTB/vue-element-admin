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
          v-if="row.fIsUpload!=='已上报'"
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
      <el-row
        v-if="row.fIsUpload!=='已上报'"
        :gutter="20"
        style="margin-left:5px"
      >
        <el-col
          :span="11"
          :offset="1"
        >
          <span style="margin-right:8px">编制日期</span>
          <el-date-picker
            size="small"
            type="daterange"
            range-separator="至"
            start-placeholder="输入编制日期查询"
            end-placeholder="输入编制日期查询"
            :picker-options="pickerOptions"
            unlink-panels
          />
        </el-col>
        <el-col :span="9">
          <label>票据种类</label>
          <el-select
            v-model="selectType"
            clearable
            placeholder="请选择票据种类"
            style="margin-left:8px"
            size="small"
          >
            <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col
          :span="2"
          :offset="1.5"
        >
          <el-button
            type="primary"
            size="small"
          >查询</el-button>
        </el-col>
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

      <div v-if="row.fIsUpload==='已上报'">
        <el-table
          :data="items.list"
          :header-cell-style="{'text-align':'center', 'background-color':'#EEF5FD'}"
          :cell-style="{'text-align':'center'}"
          stripe
          border
        >
          <el-table-column
            label="序号"
            type="index"
            :index="table_index"
            width="60"
          />
          <el-table-column
            label="票据种类"
            prop="fType"
          />
          <el-table-column
            label="票据编码"
            prop="fBillCode"
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
              :current-page="queryInfo.pageNum"
              :page-sizes="[10, 15, 20, 30, 50]"
              :page-size="queryInfo.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="items.total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </el-col>
        </el-row>
      </div>

      <div v-if="row.fIsUpload!=='已上报'">
        <el-table
          :data="bill"
          style="margin-top:8px"
          :header-cell-style="{'text-align':'center', 'background-color':'#EEF5FD'}"
          :cell-style="{'text-align':'center'}"
          stripe
          border
        >
          <el-table-column type="selection" />
          <el-table-column
            label="序号"
            type="index"
            :index="table_index"
            width="60"
          />
          <el-table-column label="票据种类" />
          <el-table-column label="票据编码" />
          <el-table-column label="开票日期" />
          <el-table-column label="金额" />
          <el-table-column label="状态" />
        </el-table>
      </div>

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
import { getItemList } from '@/api/qiuhengGroupApi/writeOff/wirteOffUnit'
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
          return time.getTime() > Date.now()
        }
      },
      // 编制人
      author: '',
      // 编制日期
      date: '',
      // 单位代码
      unitCode: '090293092616',
      // 单位名
      unitName: '',
      // 备注
      memo: '',
      // 下拉框相关数据
      types: [
        {
          value: '1',
          label: '医疗票据'
        },
        {
          value: '2',
          label: '教育票据'
        }
      ],
      defaultType: '请选择票据种类',
      selectType: '',
      // apply item
      items: {
        list: [],
        total: 0
      },
      // itemqueryInfo
      queryInfo: {
        no: this.row.fNo,
        pageNum: 1,
        pageSize: 10
      },
      bill: []
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    close () {
      this.$parent.close()
    },
    // 翻页序号连续
    table_index (index) {
      return (this.queryInfo.pageNum - 1) * this.queryInfo.pageSize + index + 1
    },
    // 初始化数据
    initData () {
      this.author = '杨乐乐'
      this.date = new Date().toLocaleDateString()
      this.unitName = '北京市海淀区交警大队'
      this.memo = this.row.fMemo
      if (this.row.fIsUpload === '已上报') {
        this.getWriteOffItemList()
      }
    },
    async getWriteOffItemList () {
      const { data: res } = await getItemList(this.queryInfo)

      this.items.list = res.records
      this.items.total = res.total
    },
    // 处理下拉框点击事件
    handleCommand (command) {
      if (command !== this.defaultType) {
        this.defaultType = command
      }
    },
    // 监听 pagesize 改变的事件
    handleSizeChange (newSize) {
      this.loading = true
      this.queryInfo.pageSize = newSize
      this.getWriteOffItemList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange (newPage) {
      this.loading = true
      this.queryInfo.pageNum = newPage
      this.getWriteOffItemList()
    },
    // 添加明细到数据库
    save () {
      this.close()
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
    .el-table {
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
