<template>
  <div>
    <el-form
      :label-position="labelPosition"
      label-width="80px"
      :model="form"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="单位ID">
            <span>{{ info.fAgenIdCode }}</span>
          </el-form-item>
        </el-col>
        <el-col
          :span="3"
          style="float:right"
        >
          <el-form-item>
            <el-button
              type="primary"
              size="small"
              @click="onSubmit()"
            >通 过</el-button>
          </el-form-item>
        </el-col>

        <el-col
          :span="2"
          style="float:right"
        >
          <el-form-item>
            <el-button
              align="right"
              size="small"
              @click="onCancel()"
            >不通过</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="申请单位">
            <span>{{ info.fAgenName }}</span>
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          style="float:right"
        >
          <el-form-item label="审验时间">
            <el-date-picker
              v-model="form.date"
              disabled="true"
              type="date"
              placeholder="审验时间"
              style="width: 100%;"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="备 注">
          <el-input
            v-model="form.remarks"
            auto-complete="off"
          />
        </el-form-item>
      </el-row>
    </el-form>

    <el-tabs type="border-card">

      <el-tab-pane label="开票总览">
        <el-table
          style="width: 100%; margin-top:30px;"
          border
          class="main-el-table"
          stripe
          :data="overViewData"
          height="350px"
          :cell-style="rowClass"
          :header-cell-style="headClass"
        >
          <el-table-column
            label="序号"
            width="50"
          >
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="开票单位"
            width="180"
          >
            <template>
              {{ info.fAgenIdCode }}
            </template>
          </el-table-column>
          <el-table-column
            property="fbillCode"
            label="票据编码"
            width="180"
          />
          <el-table-column
            property="fbillName"
            label="票据名称"
            width="220"
          />
          <el-table-column
            property="fnumber"
            label="份数"
            width="120"
          />
          <el-table-column
            property="fnumber"
            label="开票份数"
            width="160"
          />
          <el-table-column
            property="famt"
            label="开票金额"
            width="200"
          />
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="收入情况">
        <el-table
          style="width: 100%; margin-top:30px;"
          border
          class="main-el-table"
          stripe
          :data="incomeData"
          height="350px"
          :cell-style="rowClass"
          :header-cell-style="headClass"
        >
          <el-table-column
            label="序号"
            width="50"
          >
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="开票单位"
            width="180"
          >
            <template>
              {{ info.fAgenIdCode }}
            </template>
          </el-table-column>
          <el-table-column
            property="fitemCode"
            label="收费项目编码"
            width="160"
          />
          <el-table-column
            property="fitemName"
            label="收费项目名称"
            width="180"
          />
          <el-table-column
            property="funits"
            label="计量单位"
            width="60"
          />
          <el-table-column
            property="famt"
            label="开票金额"
            width="130"
          />
          <el-table-column
            property="famt"
            label="应缴金额"
            width="130"
          />
          <el-table-column
            property="famt"
            label="已缴金额"
            width="130"
          />
          <el-table-column
            label="欠费金额"
            width="130"
          >
            <template>0</template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="开票明细">
        <el-table
          style="width: 100%; margin-top:30px;"
          border
          class="main-el-table"
          stripe
          :data="invoiceData"
          height="350px"
          :cell-style="rowClass"
          :header-cell-style="headClass"
        >
          <el-table-column
            label="序号"
            width="50"
          >
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="开票单位"
            width="180"
          >
            <template>
              {{ info.fAgenIdCode }}
            </template>
          </el-table-column>
          <el-table-column
            property="fbatchNo"
            label="票据批次编码"
            width="180"
          />
          <el-table-column
            property="fbatchNo"
            label="票据批次名称"
            width="180"
          />
          <el-table-column
            property="fnumber"
            label="份数"
            width="60"
          />
          <el-table-column
            property="fbillNo1"
            label="起始号"
            width="160jq"
          />
          <el-table-column
            property="fbillNo2"
            label="终止号"
            width="160"
          />
          <el-table-column
            property="famt"
            label="开票金额"
            width="160"
          />
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="预警记录">
        <el-table
          style="width: 100%; margin-top:30px;"
          border
          class="main-el-table"
          stripe
          :data="monitorData"
          height="350px"
          :cell-style="rowClass"
          :header-cell-style="headClass"
        >
          <el-table-column
            label="序号"
            width="50"
          >
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="开票单位"
            width="180"
          >
            <template>
              {{ info.fAgenIdCode }}
            </template>
          </el-table-column>
          <el-table-column
            property="fdate"
            label="预警日期"
            width="180"
          />
          <el-table-column
            property="itemName"
            label="监控事项"
            width="300"
          />
          <el-table-column
            property="itemContent"
            label="预警内容"
            width="400"
          />
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <el-footer class="dialog-footer">
      <el-form label-width="80px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="编制人: ">{{ info.author }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="编制日期: ">{{ info.date }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-footer>
  </div>
</template>

<script>
// 引入api
import { getDetails, result } from '@/api/qiuhengGroupApi/writeOff/writeOff'

export default {
  components: {
  },
  props: {
    info: {
      // 申请单位
      fAgenName: {
        type: String,
        default: ''
      },
      // 单位ID
      fAgenIdCode: {
        type: String,
        default: ''
      },
      // 编制日期
      date: {
        type: Date,
        default: ''
      },
      // 编制人
      author: {
        type: String,
        default: ''
      },
      fNo: {
        type: String,
        default: ''
      },
      state: {
        type: String,
        default: ''
      }
    }
  },

  data () {
    return {
      form: {
        id: this.info.fAgenIdCode,
        name: this.info.fAgenName,
        date: new Date(),
        remarks: ''
      },
      tableData: {
        fAgenName: '',
        fAgenIdCode: '',
        date: '',
        author: '',
        fNo: '',
        state: ''
      },
      datail: [],
      // 开票总览
      overViewData: [],
      // 收入情况
      incomeData: [],
      // 开票明细
      invoiceData: [],
      // 预警
      monitorData: [],
      labelPosition: 'right'
    }
  },
  created () {
    this.tableData = this.info
    this.$root.eventBus.$on('billNo', (val) => {
      this.tableData.fNo = val
      this.getData()
    })
    this.getData()
  },

  methods: {
    rowClass () {
      return 'text-align: center;'
    },
    headClass () {
      return 'text-align: center; background-color: #EEF5FD'
    },
    async getData () {
      const params = {
        // 单位ID
        fAgenIdCode: this.tableData.fAgenIdCode,
        // 业务单号
        fNo: this.tableData.fNo
      }
      const res = await getDetails(params)
      this.overViewData = res.data.writeOffInvoceDetailDTOList
      this.incomeData = res.data.writeOffIncomeDetailDTOList
      this.invoiceData = res.data.writeOffBillInvDetailDTOList
      this.monitorData = res.data.writeOffMonitorDetailDTOList
    },
    // 功能函数
    async onCancel () {
      if (this.tableData.state === '已审验') {
        alert('该业务已审验，请谨慎操作')
      } else {
        // 不通过
        const params = {
          fAgenIdCode: this.tableData.fAgenIdCode,
          fNo: this.tableData.fNo,
          res: 'unPass'
        }
        await result(params)
        this.$emit('closeMoule', 'true')
      }
    },
    async onSubmit () {
      if (this.tableData.state === '已审验') {
        alert('该业务已审验，请谨慎操作')
      } else {
        // 通过
        const params = {
          fAgenIdCode: this.tableData.fAgenIdCode,
          fNo: this.tableData.fNo,
          res: 'pass'
        }
        await result(params)
        this.$emit('closeMoule', 'true')
      }
    },
  }
}
</script>

<style scoped>
</style>
