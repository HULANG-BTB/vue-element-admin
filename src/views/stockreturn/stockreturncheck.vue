/* eslint-disable vue/valid-template-root */
/* eslint-disable vue/valid-template-root */
<template>
  <div class="app-container">
    <el-form
      :model="query"
      label-width="80px"
      class="demo-for-inline"
      :inline="true"
      @keyup.enter.native="handleSearch"
    >
      <el-form-item label="业务单号:">
        <el-input
          v-model="query.no"
          placeholder="请输入业务单号"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label="日期:">
        <div class="block">
          <el-date-picker
            v-model="query.date"
            type="daterange"
            value-format="yyyy-MM-dd"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            size="small"
          />
        </div>
      </el-form-item>
      <el-form-item label>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="handleSearch"
        >搜索</el-button>
      </el-form-item>
      <el-form-item label>
        <el-button
          type="success"
          size="small"
          @click="getTableData"
        >重载数据</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading.body="loading" :data="stockReturnTableData" style="width: 100%">
      <el-table-column label="序号" width="90">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.$index+1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">
            <el-tag v-if="scope.row.changeState==0" type="info" effect="dark" width="50px">未审核</el-tag>
            <el-tag v-if="scope.row.changeState==1" type="success" effect="dark" width="50px">审核通过</el-tag>
            <el-tag v-if="scope.row.changeState==2" type="warning" effect="dark" width="50px">审核未通过</el-tag>
            <el-tag v-if="scope.row.changeState==3" type="danger" effect="dark" width="50px">无需审核</el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="业务单号" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.no }}</span>
        </template>
      </el-table-column>
      <el-table-column label="编制日期" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="退票原因" width="400" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.returnReason }}</span>
        </template>
      </el-table-column>
      <el-table-column label="退票人" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.returner }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核意见" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.changeSitu }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核人" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.changeMan }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleCheck(scope.row); dialogFormVisible=true; noStatus=true">审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next, sizes, total, jumper"
      align="right"
      :total="query.total"
      :current-page="query.page"
      :page-sizes="[2, 5, 10, 20, 50, 100, 500, 1000]"
      :page-size="query.limit"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!------------------------------新增弹出框---------------------------->
    <el-dialog
      title="退票明细"
      :visible.sync="dialogFormVisible"
      :width="'80%'"
      @closed="initVo()"
    >
      <el-form
        :model="Stockreturn"
        :inline="true"
        :label-position="labelPosition"
        label-width="100px"
        class="demo-form-inline"
      >
        <el-row>
          <el-col :span="2" />
          <el-col :span="11">
            <el-form-item label="业务单号">
              <el-input v-model="Stockreturn.no" autocomplete="off" :disabled="noStatus" placeholder="请输入业务单号：" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="编制日期">
              <div class="block">
                <el-date-picker
                  v-model="Stockreturn.date"
                  type="date"
                  placeholder="选择日期"
                />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2" />
          <el-col :span="11">
            <el-form-item label="单位编码">
              <el-input v-model="Stockreturn.agenIdCode" autocomplete="off" placeholder="请输入单位名称：" />
            </el-form-item>
          </el-col>
          <el-col :span="2" />
          <el-col :span="11">
            <el-form-item label="编制人">
              <el-input v-model="Stockreturn.returner" autocomplete="off" placeholder="请输入编制人(退票人):" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2" />
          <el-col :span="22">
            <el-form-item label="退票原因">
              <el-input
                v-model="Stockreturn.returnReason"
                placeholder="请输入退票原因："
                type="textarea"
                :rows="3"
                style="width: 800px"
                resize="none"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!--新增明细-->
      <el-button
        type="primary"
        :disabled="true"
        @click="itemAdd(Stockreturn.stockReturnItemVOList, Stockreturn.no)"
      >新增</el-button>
      <el-table
        v-loading.body="loading"
        :data="Stockreturn.stockReturnItemVOList"
        style="width: 100%; margin-top: 10px;"
        border
      >
        <el-table-column type="selection" align="center" width="55" />
        <!-- 从1开始，与数据库数据无关 -->
        <el-table-column type="index" align="center" label="序号" width="90%" />
        <!-- 出库主键 -->
        <!-- <el-table-column align="center" label="单号" width="165">
          <template slot-scope="scope">{{ scope.row.id.toString().padStart(11, 'SI00000000') }}</template>
        </el-table-column> -->
        <el-table-column align="center" label="票据代码" width="165">
          <template slot-scope="scope">
            {{ scope.row.billCode }}
            <!-- {{ scope.row.billPrecode }} -->
          </template>
        </el-table-column>
        <el-table-column align="center" label="票据名称">
          <template slot-scope="scope">{{ scope.row.billName }}</template>
        </el-table-column>
        <el-table-column align="center" label="数量" width="165">
          <template slot-scope="scope">
            <el-input v-model="scope.row.number" />
            <!-- {{ scope.row.number }} -->
          </template>
        </el-table-column>
        <el-table-column align="center" label="计量单位" width="100">
          <template> 张 </template>
        </el-table-column>
        <el-table-column align="center" label="起始号" width="200">
          <template slot-scope="scope">{{ scope.row.billNo1 }}</template>
        </el-table-column>
        <el-table-column align="center" label="终止号" width="200">
          <template slot-scope="scope">{{ scope.row.billNo2 }}</template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false;">取 消</el-button>
        <el-button @click="dialogFormVisible = false; dialogFormVisibleForReturn = true">审 核</el-button>
      </div></el-dialog>
    <!-- 审核弹出框 -->
    <el-dialog
      title="审核"
      :visible.sync="dialogFormVisibleForReturn"
      :width="'60%'"
      @closed="initVo()"
    >
      <el-form
        v-model="StockreturnCheck"
        :inline="true"
        :label-position="labelPosition"
        label-width="100px"
        class="demo-form-inline"
      >
        <el-row>
          <el-col :span="2" />
          <el-col :span="11">
            <el-form-item label="审核意见">
              <el-input v-model="StockreturnCheck.changeSitu" autocomplete="off" placeholder="请输入审核意见：" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2" />
          <el-col :span="11">
            <el-form-item label="审核状态">
              <template>
                <el-select v-model="StockreturnCheck.changeState" placeholder="请选择">
                  <el-option
                    v-for="item in changeStateOptions"
                    :key="item.changeState"
                    :label="item.label"
                    :value="item.changeState"
                    :disabled="item.selected"
                  />
                </el-select>
                <!-- {{ scope.row.billPrecode }} -->
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="2" />
          <el-col :span="11">
            <el-form-item label="审核人">
              <el-input v-model="StockreturnCheck.changeMan" autocomplete="off" placeholder="请输入审核人:" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-button
        type="primary"
        @click="checkSave(); dialogFormVisibleForReturn=false"
      >提交审核</el-button>
    </el-dialog>
  </div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import { getFinanStockReturnList, getFinanStockReturnItems, getCheckStateByNo } from '@/api/stockreturn.js'

export default {
  data () {
    return {
      stockReturnTableData: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      // date: [0, 0],
      query: {
        page: 1,
        limit: 5,
        total: 0,

        no: '',
        date: [new Date(new Date().getTime() - 3600 * 1000 * 24 * 90), new Date()],
        startTime: '',
        endTime: ''
      },
      Stockreturn: {
        no: '',
        date: '',
        agenIdCode: '',
        returner: '',
        author: 'defaultAuthor',
        changeState: '0',
        changeMan: '',
        changeSitu: '',
        returnReason: '',
        submitStatus: '0',
        stockReturnItemVOList: []
      },
      no: 0,
      StockreturnCheck: {
        no: '',
        changeState: '0',
        changeMan: '',
        changeSitu: ''
      },
      dialogFormVisible: false,
      dialogFormVisibleForReturn: false,
      noStatus: false,
      // submitStatus: false,
      saveStatus: false,
      labelPosition: 'left',
      changeStateOptions: [{
        changeState: 1,
        label: '审核通过'
      }, {
        changeState: 2,
        label: '审核未通过'
      }]
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    async getTableData () {
      this.loading = true
      const res = await getFinanStockReturnList(this.query).catch(() => { this.loading = false })
      console.log(res)
      this.query.limit = res.data.limit
      this.query.total = res.data.total
      this.query.page = res.data.page
      this.stockReturnTableData = res.data.row
      console.log(this.query.limit, this.query.total, this.query.page)
      this.loading = false
    },
    async handleSearch () {
      this.query.page = 1
      this.loading = true
      this.query.startTime = this.query.date[0]
      this.query.endTime = this.query.date[1]
      // const res = await getListStockReturnByDateOrNo(this.query).catch(() => { this.loading = false })
      // this.tableData = res
      this.getTableData()
      this.loading = false
    },
    async checkSave () {
      this.loading = true
      // this.Stockreturn = Object.assign(this.Stockreturn)
      // eslint-disable-next-line no-unused-vars
      this.StockreturnCheck.no = this.no
      console.log(this.StockreturnCheck)
      const save = await getCheckStateByNo(this.StockreturnCheck).catch(() => { this.loading = false })
      console.log('save', save)
      this.loading = false
      this.getTableData()
    },
    async initVo () {
      Object.assign(this.$data.Stockreturn, this.$options.data().Stockreturn)
      // this.getTableData()
    },
    async handleSizeChange (val) {
      this.query.limit = val
      this.getTableData()
    },
    async handleCurrentChange (val) {
      this.query.page = val
      this.getTableData()
    },
    async handleCheck (row) {
      this.no = row.no
      console.log('row', row)
      this.loading = true
      this.Stockreturn = Object.assign(this.Stockreturn, row)
      const items = await getFinanStockReturnItems(this.Stockreturn).catch(() => { this.loading = false })
      console.log('items', items)
      this.Stockreturn.stockReturnItemVOList = items.data.stockReturnItemVOList
      console.log('list', this.Stockreturn.stockReturnItemVOList)
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
