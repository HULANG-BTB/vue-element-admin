<template>
  <div>
    <span
      slot="header"
      class="dialog-header"
      padding="top:0px"
    >
      <el-form
        :label-position="labelPosition"
        label-width="20px"
      >
        <el-row>
          <el-col
            :span="6"
            style="float:left； padding-top:0px"
          >
            <el-form-item>
              <h1><b>票据审验详情</b></h1>
            </el-form-item>
          </el-col>

          <el-col
            :span="3.5"
            style="float:right"
          >
            <el-form-item>
              <el-button
                type="primary"
                @click="onSubmit()"
              >通 过</el-button>
            </el-form-item>
          </el-col>

          <el-col
            :span="3.5"
            style="float:right"
          >
            <el-form-item>
              <el-button
                align="right"
                @click="onCancel()"
              >不通过</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </span>

    <el-form
      :label-position="labelPosition"
      label-width="80px"
      :model="form"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="单位ID">
            <span>{{ billInfo.fAgenIdCode }}</span>
          </el-form-item>
        </el-col>
        <el-col
          :span="5.5"
          style="float:right"
        >
          <el-form-item>
            <el-button @click="getUnitElectronicFile()">单位电子档案</el-button>
          </el-form-item>
          <!-- 单位电子信息 -->
          <el-dialog
            :visible.sync="unitInfoDialogVisible"
            :append-to-body="true"
          >
            <unit-dialog :unit-info="unitInfo" />
          </el-dialog>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="申请单位">
            <span>{{ billInfo.fAgenName }}</span>
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          style="float:right"
        >
          <el-form-item label="审验时间">
            <el-date-picker
              v-model="form.date"
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

    <div class="tableTitle" />

    <el-tabs type="border-card">

      <el-tab-pane label="开票总览">
        <el-table
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
            width="230"
          >
            <template>
              {{ billInfo.fAgenIdCode }}
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
          <el-table-column
            label="操作"
            width="100"
          >
            <i
              class="el-icon-delete"
              @click="onDelete()"
            />
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="收入情况">
        <el-table
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
            width="200"
          >
            <template>
              {{ billInfo.fAgenIdCode }}
            </template>
          </el-table-column>
          <el-table-column
            property="fitemCode"
            label="收费项目编码"
            width="180"
          />
          <el-table-column
            property="fitemName"
            label="收费项目名称"
            width="200"
          />
          <el-table-column
            property="funits"
            label="计量单位"
            width="80"
          />
          <el-table-column
            property="famt"
            label="开票金额"
            width="135"
          />
          <el-table-column
            property="famt"
            label="应缴金额"
            width="135"
          />
          <el-table-column
            property="famt"
            label="已缴金额"
            width="135"
          />
          <el-table-column
            label="欠费金额"
            width="145"
          >
            <template>0</template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="开票明细">
        <el-table
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
              {{ billInfo.fAgenIdCode }}
            </template>
          </el-table-column>
          <el-table-column
            property="fbatchNo"
            label="票据批次编码"
            width="200"
          />
          <el-table-column
            property="fbatchNo"
            label="票据批次名称"
            width="200"
          />
          <el-table-column
            property="fnumber"
            label="份数"
            width="100"
          />
          <el-table-column
            property="fbillNo1"
            label="起始号"
            width="185jq"
          />
          <el-table-column
            property="fbillNo2"
            label="终止号"
            width="185"
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
          class="main-el-table"
          stripe
          :data="gridData"
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
            property="name"
            label="开票单位"
            width="200"
          />
          <el-table-column
            property="address"
            label="预警日期"
            width="140"
          />
          <el-table-column
            property="address"
            label="发送时间"
            width="140"
          />
          <el-table-column
            property="address"
            label="监控事项"
            width="160"
          />
          <el-table-column
            property="address"
            label="预警内容"
            width="370"
          />
          <el-table-column
            property="address"
            label="处理状态"
            width="100"
          />
          <el-table-column
            property="address"
            label="查看"
            width="100"
          >
            <i
              class="el-icon-tickets"
              @click="onCheck()"
            />
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <el-footer class="dialog-footer">
      <el-form label-width="80px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="编制人: ">{{ billInfo.author }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="编制日期: ">{{ billInfo.date }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-footer>
  </div>
</template>

<script>

// 引入单位信息的Dialog
import UnitInfo from './unitInfo'

// 引入api
import { getDetails, pass, unPass } from '@/api/qiuhengGroupApi/writeOff/writeOff'

export default {
  components: {
    'unit-dialog': UnitInfo
  },
  props: {
    billInfo: {
      // 申请单位
      fAgenName: {
        type: String
      },
      // 单位ID
      fAgenIdCode: {
        type: String
      },
      // 编制日期
      date: {
        type: Date
      },
      // 编制人
      author: {
        type: String
      },
      fNo: {
        type: String
      }
    }
  },

  watch: {
    billInfo(newVal, oldVal){
      this.billInfo = newVal
      console.log(this.billInfo.fNo)
    }
  },

  data () {
    return {
      gridData: [
        {
          name: '12',
          address: 'asd'
        }
      ],

      form: {
        id: this.billInfo.fAgenIdCode,
        name: this.billInfo.fAgenName,
        date1: '',
        date2: '',
        remarks: ''
      },
      tableData: {
        date: '',
        author: '',
        fNo: ''
      },
      datail: [],
      // 开票总览
      overViewData: [],
      // 收入情况
      incomeData: [],
      // 开票明细
      invoiceData: [],
      labelPosition: 'right',
      unitInfoDialogVisible: false,
      unitInfo: {
        name: '111',
        no: '222'
      }
    }
  },

  created () {
    this.getData()
  },

  methods: {
    rowClass () {
      return 'text-align: center;'
    },
    headClass () {
      return 'text-align: center;'
    },
    async getData () {
      const params = {
        // 单位ID
        fAgenIdCode: this.billInfo.fAgenIdCode,
        // 业务单号
        fNo: this.billInfo.fNo
      }
      const res = await getDetails(params);
      this.overViewData = res.writeOffInvoceDetailDTOList
      this.incomeData = res.writeOffIncomeDetailDTOList
      this.invoiceData = res.writeOffBillInvDetailDTOList
    },
    // 功能函数
    async onCancel () {
      // 不通过
      const params = {}
      const res = await unPass(params)
      console.log(res)
      this.$emit('closeMoule', 'true')
    },
    async onSubmit () {
      // 通过
      const params = {}
      const res = await pass(params)
      console.log(res)
      this.$emit('closeMoule', 'true')
    },

    getUnitElectronicFile () {
      // 获得单位电子档案
      // 在生成Dialog前获取单位电子档案数据，传到子组件
      this.unitInfo.name = 'shhs'
      this.unitInfo.no = 123

      // 打开子组件 UnitInfoDialog
      this.unitInfoDialogVisible = true
    },
    onDelete () {
      // 删除操作 -- 开票预览
      alert('delete')
    },
    onCheck () {
      // 查看预警信息
      alert('check')
    }
  }
}
</script>

<style scoped>
</style>
