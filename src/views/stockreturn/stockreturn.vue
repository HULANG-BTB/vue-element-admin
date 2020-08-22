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
      <div class="my-form-item">
        <el-row>
          <el-col :span="5">
            <el-form-item label="操作">
              <el-button
                type="primary"
                size="small"
                @click="handleAdd(); dialogFormVisible = true; noStatus=false"
              >新增</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
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
      <el-table-column label="业务单号" width="150">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.no }}</span>
        </template>
      </el-table-column>
      <el-table-column label="编制日期" width="150">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="退票原因" width="250" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.returnReason }}</span>
        </template>
      </el-table-column>
      <el-table-column label="退票人" width="150">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.returner }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核意见" width="250">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.changeSitu }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核人" width="150">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.changeMan }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row); dialogFormVisible=true; noStatus=true">编辑</el-button>
<<<<<<< HEAD
          <!-- <el-button size="mini"@click="dialogFormVisible=true; noStatus=true">查看</el-button> -->
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
=======
          <el-button :disabled="scope.row.submitStatus==1" size="mini" @click="handleSubmit1(scope.row)">提交</el-button>
          <el-button size="mini" type="danger" :disabled="scope.row.submitStatus==1" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
>>>>>>> master
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
            <el-select v-model="scope.row.billCode" placeholder="请选择" @change="billPrecodeChange(scope.row)">
              <el-option
                v-for="item in billOptions"
                :key="item.billCode"
                :label="item.billCode"
                :value="item.billCode"
                :disabled="item.selected"
              />
            </el-select>
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
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="itemDelete(scope.$index, Stockreturn.stockReturnItemVOList)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false;">取 消</el-button>
        <el-button
          type="primary"
          :disabled="Stockreturn.submitStatus == 1"
          @click="handleSave(); dialogFormVisible = false"
        >保 存</el-button>
      </div></el-dialog>
  </div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
<<<<<<< HEAD
import { getStockReturnList, getListStockReturnByDateOrNo, addStockReturn, getStockReturnItems, deleteStockReturnByNo, updateByNo } from '@/api/stockreturn.js'
=======
import { getStockReturnList, getListStockReturnByDateOrNo, addStockReturn, getStockReturnItems, deleteStockReturnByNo, updateByNo, putSubmit } from '@/api/stockreturn.js'
>>>>>>> master

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
        changeMan: '',
        changeSitu: '',
        changeState: '0',
        returnReason: '',
        submitStatus: '0',
        stockReturnItemVOList: []
      },
      dialogFormVisible: false,
      noStatus: false,
<<<<<<< HEAD
=======
      // submitStatus: false,
      saveStatus: false,
>>>>>>> master
      labelPosition: 'left',
      billOptions: [{
        billCode: '00000120',
        billName: '票据1',
        selected: false
      }, {
        billCode: '00000121',
        billName: '票据2',
        selected: false
      }, {
        billCode: '00000210',
        billName: '票据3',
        selected: false
      }, {
        billCode: '01000120',
        billName: '票据4',
        selected: false
      }, {
        billCode: '02000120',
        billName: '票据5',
        selected: false
      }]
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    async getTableData () {
      this.loading = true
      const res = await getStockReturnList(this.query).catch(() => { this.loading = false })
      console.log(res)
      this.query.limit = res.limit
      this.query.total = res.total
      this.query.page = res.page
      this.stockReturnTableData = res.row
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
    async billPrecodeChange (row) {
      this.billOptions.forEach(e => {
        e.selected = false
        this.Stockreturn.stockReturnItemVOList.forEach(item => {
          if (e.billCode === item.billCode) {
            e.selected = true
          }
        })
        if (e.billCode === row.billCode) {
          row.billName = e.billName
        }
      })
    },
    async handleAdd () {
    },
    async itemAdd (tableData) {
      this.loading = true
      tableData.push({
        'billCode': '',
        'billName': '',
<<<<<<< HEAD
        'number': 5,
        'billNo1': '0000000001',
        'billNo2': '0000000005'
=======
        'number': 2,
        'billNo1': '0000000001',
        'billNo2': '0000000002'
>>>>>>> master
      })
      this.loading = false
    },
    async itemDelete (index, rows) {
<<<<<<< HEAD
      this.loading = true
      rows.splice(index, 1)
=======
      this.loading = true
      rows.splice(index, 1)
      this.loading = false
    },
    async handleSubmit1 (row) {
      console.log(row)
      this.loading = true
      // eslint-disable-next-line no-unused-vars
      this.Stockreturn = Object.assign(this.Stockreturn, row)
      const submitS = await putSubmit(this.Stockreturn).catch(() => { this.loading = false })
      if (submitS) {
        this.$message.success('提交成功！')
      } else {
        this.$message.error('提交失败！')
      }
>>>>>>> master
      this.loading = false
    },
    // 处理保存请求
    async handleSave () {
      this.loading = true
      // 判断为新增还是编辑明细页面
      // eslint-disable-next-line eqeqeq
      if (this.noStatus == true) {
        const updateS = await updateByNo(this.Stockreturn).catch(() => { this.loading = false })
        console.log(updateS)
        if (updateS) {
          this.$message.success('修改成功！')
        } else {
          this.$message.error('修改失败！')
        }
        this.loading = false
      } else {
        const subres = await addStockReturn(this.Stockreturn).catch(() => { this.loading = false })
        console.log('StockReturn', this.Stockreturn)
        console.log('提交结果：' + subres)
        if (subres) {
          this.$message.success('提交成功！')
        } else {
          this.$message.error('提交失败！')
        }
        this.loading = false
      }
      this.getTableData()
    },
    // 处理保存请求
    async handleSave () {
      this.loading = true
      // 判断为新增还是编辑明细页面
      // eslint-disable-next-line eqeqeq
      if (this.noStatus == true) {
        const updateS = await updateByNo(this.Stockreturn).catch(() => { this.loading = false })
        console.log(updateS)
        if (updateS) {
          this.$message.success('修改成功！')
        } else {
          this.$message.error('修改失败！')
        }
        this.loading = false
      } else {
        const subres = await addStockReturn(this.Stockreturn).catch(() => { this.loading = false })
        console.log('StockReturn', this.Stockreturn)
        console.log('提交结果：' + subres)
        if (subres) {
          this.$message.success('提交成功！')
        } else {
          this.$message.error('提交失败！')
        }
        this.loading = false
      }
      this.getTableData()
    },
    async initVo () {
      Object.assign(this.$data.Stockreturn, this.$options.data().Stockreturn)
      // this.getTableData()
    },
    async handleEdit (row) {
      console.log(row)
      this.loading = true
      this.Stockreturn = Object.assign(this.Stockreturn, row)
      const items = await getStockReturnItems(this.Stockreturn).catch(() => { this.loading = false })
      console.log(items)
      this.Stockreturn.stockReturnItemVOList = items.stockReturnItemVOList
      this.billPrecodeChange(row)
      this.loading = false
    },
    async handleDelete (index, row) {
      console.log(index, row)
      this.loading = true
      this.Stockreturn = Object.assign(this.Stockreturn, row)
      // 删除一项退票主表信息
      // eslint-disable-next-line no-unused-vars
      const deleteStockReturn = await deleteStockReturnByNo(this.Stockreturn).catch(() => { this.loading = false })
      this.getTableData()
    },
    async handleSizeChange (val) {
      this.query.limit = val
      this.getTableData()
    },
    async handleCurrentChange (val) {
      this.query.page = val
      this.getTableData()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
