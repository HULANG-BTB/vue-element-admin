<template>
  <div class="app-container">
    <el-form
      :model="query"
      :inline="true"
      class="demo-form-inline"
      @keyup.enter.native="handleSearch"
    >
      <div class="my-form-item">
        <el-form-item label="单号">
          <el-input
            v-model="query.id"
            placeholder="请输入业务单号"
            clearable
            size="small"
          />
        </el-form-item>
        <el-form-item label="编制人">
          <el-input
            v-model="query.author"
            placeholder="请输入编制人"
            clearable
            size="small"
          />
        </el-form-item>

        <el-form-item label="日期">
          <div class="block">
            <el-date-picker
              v-model="query.period"
              type="daterange"
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
        <el-form-item label style="margin-left: 30px">
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="handleSearch"
          >搜索</el-button>
          <el-button
            type=""
            icon="el-icon-refresh"
            size="small"
            @click="getTableData"
          >重置</el-button>
        </el-form-item>
      </div>
      <!-- <el-form-item label>
        <el-button
          :disabled="deleteBatchDisable"
          type="danger"
          size="small"
          @click="handleDeleteBatch"
        >批量删除</el-button>
      </el-form-item> -->
      <!-- <el-form-item :label="query.changeState!=0 ? '已审核':'未审核'">
        <el-switch
          v-model="query.ischange"
          active-color="#13ce66"
          inactive-color="#ff4949"
          @change="handleIsSentChange"
        />
      </el-form-item> -->
      <div class="my-form-item">
        <el-row>
          <el-col :span="5">
            <el-form-item label="操作">
              <el-button
                type="primary"
                size="small"
                @click="handleAdd(); dialogFormVisible = true"
              >新增</el-button>
              <el-button
                type="primary"
                size="small"
                :disabled="isCheckBoxChecked"
                @click="submitAll()"
              >提交</el-button>
              <el-button
                v-if="!isCheckBoxChecked"
                type="danger"
                size="small"
                @click="deleteAll()"
              >删除</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="审核状态">
              <el-radio-group
                v-model="query.changeState"
                size="small"
                @change="handleSearch"
              >
                <el-radio-button label="1">保存</el-radio-button>
                <el-radio-button label="2">待审核</el-radio-button>
                <el-radio-button label="3">通过</el-radio-button>
                <el-radio-button label="4">退回</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>

    <el-table
      v-loading.body="loading"
      :data="StockoutTableData"
      style="width: 100%; margin-top: 30px;"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" width="55" />
      <!-- 从1开始，与数据库数据无关 -->
      <el-table-column type="index" align="center" label="序号" width="65" />
      <!-- 出库主键 -->
      <el-table-column align="center" label="单号" width="130">
        <template slot-scope="scope">{{ scope.row.id.toString().padStart(9, 'S0000000') }}</template>
      </el-table-column>
      <el-table-column align="center" label="仓库ID" width="85">
        <template slot-scope="scope">{{ scope.row.warehouseId }}</template>
      </el-table-column>
      <el-table-column align="center" label="领用人" width="155">
        <template slot-scope="scope">{{ scope.row.useMan }}</template>
      </el-table-column>
      <el-table-column align="center" label="申请日期" width="155">
        <template slot-scope="scope">{{ dateFormat(scope.row.date) }}</template>
      </el-table-column>
      <el-table-column align="center" label="编制人" width="155">
        <template slot-scope="scope">{{ scope.row.author }}</template>
      </el-table-column>
      <el-table-column align="center" label="摘要" width="200">
        <template slot-scope="scope">{{ scope.row.abstact }}</template>
      </el-table-column>
      <el-table-column align="center" label="审核状态" width="85">
        <template slot-scope="scope">
          <!-- <el-tag v-if="scope.row.changeState==0" type="info" effect="dark">{{ showCheckStr(scope.row.changeState) }}</el-tag> -->
          <el-tag
            :type="showCheckStr(scope.row.changeState).type"
            :effect="showCheckStr(scope.row.changeState).effect"
          >
            {{ showCheckStr(scope.row.changeState).label }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column v-if="!query.changeState" align="center" label="操作"> -->
      <el-table-column align="center" fixed="right" label="操作" width="165">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleEdit(scope); dialogFormVisible = true"
          >查看</el-button>
          <el-button
            v-if="!isSend"
            type="primary"
            size="mini"
            @click="handleSubmit(scope)"
          >提交</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next, sizes, total, jumper"
      :total="query.total"
      :current-page="query.page"
      :page-sizes="[10, 20, 50, 100, 500, 1000]"
      :page-size="query.limit"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!--
      弹出Dialog框
      ----------------------------------------------------
      -->
    <el-dialog
      title="出库详情"
      :visible.sync="dialogFormVisible"
      :width="'80%'"
      @closed="initVo()"
    >
      <el-form
        :model="outVo"
        :inline="true"
        :label-position="labelPosition"
        label-width="120px"
        class="demo-form-inline"
      >
        <el-row>
          <el-col :span="10" :offset="3">
            <el-form-item label="单号">
              <el-input v-model="outVo.id" autocomplete="off" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" :offset="3">
            <el-form-item label="编制人">
              <el-input v-model="outVo.author" autocomplete="off" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="领用人/单位">
              <el-select v-model="outVo.useMan" placeholder="请选择" :disabled="isSend">
                <el-option
                  v-for="item in useManOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" :offset="3">
            <el-form-item label="仓库">
              <el-select v-model="outVo.warehouseId" placeholder="请选择" :disabled="isSend">
                <el-option
                  v-for="item in warehouseOptions"
                  :key="item.warehouseId"
                  :label="item.warehouseName"
                  :value="item.warehouseId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="区划编码">
              <el-select v-model="outVo.rgnCode" placeholder="请选择" :disabled="isSend">
                <el-option
                  v-for="item in rgnCodeOptions"
                  :key="item.rgnCode"
                  :label="item.rgnCode"
                  :value="item.rgnCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" align="bottom">
          <el-col :span="3">
            <el-button
              type="primary"
              size="small"
              style="margin-bottom: 10px"
              :disabled="isSend"
              @click="itemAdd(outVo.outItemVos, outVo.id)"
            >新增</el-button>
          </el-col>
          <el-col :span="21">
            <el-form-item label="摘要">
              <el-input
                v-model="outVo.abstact"
                placeholder="请输入备注/摘要："
                type="textarea"
                style="width: 310%"
                :rows="3"
                :disabled="isSend"
                resize="none"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!--
        item的table----------------------------------
      -->
      <el-table
        v-loading.body="loading"
        :data="outVo.outItemVos"
        style="width: 100%; margin-top: 10px;"
        border
      >
        <el-table-column type="selection" align="center" width="55" />
        <!-- 从1开始，与数据库数据无关 -->
        <el-table-column type="index" align="center" label="序号" width="55" />
        <!-- 出库主键 -->
        <el-table-column align="center" label="单号" width="130">
          <template slot-scope="scope">{{ scope.row.id.toString().padStart(11, 'SI00000000') }}</template>
        </el-table-column>
        <el-table-column align="center" label="票据代码" width="160">
          <template slot-scope="scope">
            <el-select v-model="scope.row.billPrecode" placeholder="请选择" :disabled="isSend" @change="billPrecodeChange(scope)">
              <el-option
                v-for="item in billOptions"
                :key="item.billPrecode"
                :label="item.billPrecode"
                :value="item.billPrecode"
                :disabled="item.selected"
              />
            </el-select>
            <!-- {{ scope.row.billPrecode }} -->
          </template>
        </el-table-column>
        <el-table-column align="center" label="票据名称" width="155">
          <template slot-scope="scope">{{ scope.row.billName }}</template>
        </el-table-column>
        <el-table-column align="center" label="数量" width="85">
          <template slot-scope="scope">
            <el-input v-model="scope.row.number" size="mini" :disabled="isSend" />
            <!-- {{ scope.row.number }} -->
          </template>
        </el-table-column>
        <el-table-column align="center" label="单位" width="55">
          <template> 张 </template>
        </el-table-column>
        <el-table-column align="center" label="起始号" width="130">
          <template slot-scope="scope">{{ scope.row.billNo1 }}</template>
        </el-table-column>
        <el-table-column align="center" label="终止号" width="130">
          <template slot-scope="scope">
            {{ scope.row.billNo2 = (parseInt(scope.row.billNo1)+parseInt(scope.row.number)-1).toString().padStart(10, '000000000') }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="85">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              :disabled="isSend"
              @click="itemDelete(scope.$index, outVo.outItemVos)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button
          v-if="!isSend"
          type="danger"
          @click="dialogFormVisible = false"
        >取 消</el-button>
        <el-button
          v-if="!isSend"
          type="primary"
          @click="handleSave(); dialogFormVisible = false"
        >保 存</el-button>
        <el-button
          v-if="isSend"
          type="info"
          @click="dialogFormVisible = false"
        >关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getAll, addOut, getItem, save, submit, submitAll, deleteAll, util } from '@/api/finanbill.js'

export default {
  name: 'OutApp',
  data () {
    return {
      /**
       * 出票项
       */
      outVo: {
        id: '',
        rgnCode: '',
        warehouseId: '',
        useMan: '',
        date: '',
        author: 'defaultAuthor',
        changeState: '',
        abstact: '',
        altercode: '',
        outItemVos: []
      },
      /**
       * 领用人选择
       */
      useManOptions: [{
        value: '虚拟领票单位',
        label: '虚拟领票单位'
      }, {
        value: '单位1',
        label: '单位1'
      }, {
        value: '单位2',
        label: '单位2'
      }],
      // 出库项展示
      StockoutTableData: [],
      // dialog弹出框可视控制
      dialogFormVisible: false,
      // 仓库选择
      warehouseOptions: [{
        warehouseId: 1,
        warehouseName: '仓库1'
      }, {
        warehouseId: 2,
        warehouseName: '仓库2'
      }],
      // 区划选择
      rgnCodeOptions: [{
        rgnCode: '00'
      }, {
        rgnCode: '01'
      }, {
        rgnCode: '02'
      }, {
        rgnCode: '10'
      }, {
        rgnCode: '11'
      }],
      // 票据类别选择
      billOptions: [{
        billPrecode: '00000120',
        billName: '票据1',
        selected: false
      }, {
        billPrecode: '00000121',
        billName: '票据2',
        selected: false
      }, {
        billPrecode: '00000210',
        billName: '票据3',
        selected: false
      }, {
        billPrecode: '01000120',
        billName: '票据4',
        selected: false
      }, {
        billPrecode: '02000120',
        billName: '票据5',
        selected: false
      }],
      // 对齐方式
      labelPosition: 'left',
      isSend: false,
      // 提交多选按钮是否可用
      isCheckBoxChecked: true,
      // 多选的项
      selectedList: [],
      // loading转圈图标可视控制
      loading: true,
      dialogLoading: false,
      dialogVisible: false,
      resetsubjectDialogVisible: false,
      dialogType: 'new',
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      query: {
        page: 1,
        limit: 10,
        total: 0,

        ischange: true,
        id: '',
        author: '',
        changeState: '1',
        period: [new Date(new Date().getTime() - 3600 * 1000 * 24 * 365), new Date()]

      },
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
      util
    }
  },
  computed: {
  },

  created () {
    this.getTableData()
  },
  methods: {
    // 获取出库列表
    async getTableData () {
      this.loading = true
      // console.log('----------' + JSON.stringify(this.query, null, 4))
      const res = await getAll(this.query).catch(() => { this.loading = false })
      // console.log('----------' + JSON.stringify(res.data.row, null, 4))
      this.StockoutTableData = res.data.row
      this.query.total = res.data.total
      this.query.limit = res.data.limit
      this.query.page = res.data.page
      this.selectedList = []
      // 确定明细项是否可改变
      if (this.query.changeState === '1') {
        this.isSend = false
      } else {
        this.isSend = true
      }
      this.loading = false
    },

    // 初始化数据，退出详情界面时强制要求调用
    async initVo () {
      Object.assign(this.$data.outVo, this.$options.data().outVo)
      // this.getTableData()
    },

    // 进入出库编辑界面
    async handleEdit (scope) {
      this.loading = true
      this.outVo = Object.assign(this.outVo, scope.row)
      // console.log('pid:' + this.outVo.id)
      const items = await getItem(this.outVo.id).catch(() => { this.loading = false })
      this.outVo.outItemVos = items.data
      this.outVo.altercode = 2
      // 处理票据代码选择时的选项
      this.billPrecodeChange(scope)
      this.loading = false

      // this.loading = true
      // this.mail = Object.assign(this.mail, scope.row)
      // this.mail.changeState = true
      // await getItem(this.mail).catch(() => { this.loading = false })
      // this.getTableData()
      // this.loading = false
    },

    // 进入出库新增界面
    async handleAdd () {
      this.loading = true
      const items = await addOut(this.outVo.author).catch(() => { this.loading = false })
      this.outVo = items.data
      this.outVo.altercode = 1
      this.outVo.outItemVos = []
      // 处理票据代码选择时的选项
      this.loading = false
    },

    // 新增item
    async itemAdd (tableData, pid) {
      this.loading = true
      tableData.push({
        'pid': pid,
        'billPrecode': '',
        'billName': '',
        'number': 0,
        'billNo1': '0000000001',
        'billNo2': '0000000000',
        'id': 0
      })
      this.loading = false
    },

    // // 获取未被选择的
    // async unselectedBill () {
    //   var returns = []
    //   this.outVo.outItemVos.forEach(item => {
    //     this.billOptions.forEach(e => {
    //       if (e.billPrecode === item.billPrecode) {
    //         e.selected = true
    //       }
    //     })
    //   })
    //   console.log('length:' + this.outVo.outItemVos.length)
    //   this.billOptions.forEach(item => {
    //     if (item.selected) {
    //       returns.push(item)
    //     }
    //   })
    //   console.log(returns)
    //   return returns
    // },

    // 详情页面，改变票据代码方法
    async billPrecodeChange (scope) {
      this.billOptions.forEach(e => {
        e.selected = false
        this.outVo.outItemVos.forEach(item => {
          if (e.billPrecode === item.billPrecode) {
            e.selected = true
          }
        })
        if (e.billPrecode === scope.row.billPrecode) {
          scope.row.billName = e.billName
        }
      })
    },

    // 删除item
    async itemDelete (index, rows) {
      this.loading = true
      rows.splice(index, 1)
      this.loading = false
    },
    // 处理保存请求
    async handleSave () {
      this.loading = true
      console.log('save id:' + this.outVo.id)
      console.log(this.outVo)
      // 判断数据是否有误
      // 判断。。。。。
      const subres = await save(this.outVo).catch(() => { this.loading = false })
      console.log('提交结果：' + subres)
      if (subres) {
        this.$message.success('保存成功！')
      } else {
        this.$message.error('保存失败！')
      }
      this.loading = false
      this.getTableData()
    },

    // 提交到审核
    async handleSubmit (scope) {
      this.loading = true
      this.outVo = Object.assign(this.outVo, scope.row)
      console.log('id:' + this.outVo.id)
      const subres = await submit(this.outVo.id).catch(() => { this.loading = false })
      console.log('提交结果：' + subres)
      if (subres) {
        this.$message.success('提交成功！')
      } else {
        this.$message.error('提交失败！')
      }
      this.loading = false
      this.getTableData()
    },

    /**
     * 多选的选择改变事件
     */
    handleSelectionChange (val) {
      this.selectedList = val
      if (val !== undefined && val.length > 0) {
        this.isCheckBoxChecked = false
      } else {
        this.isCheckBoxChecked = true
      }
    },

    // 提交到审核多选
    async submitAll () {
      this.loading = true
      const subAllres = await submitAll(this.selectedList).catch(() => { this.loading = false })
      console.log('提交结果：' + subAllres)
      if (subAllres) {
        this.$message.success('提交成功！')
      } else {
        this.$message.error('提交失败！')
      }
      this.loading = false
      this.getTableData()
    },

    /**
     * 删除多选
     */
    async deleteAll () {
      this.loading = true
      const delAllres = await deleteAll(this.selectedList).catch(() => { this.loading = false })
      if (delAllres) {
        this.$message.success('删除成功！')
      } else {
        this.$message.error('删除失败！')
      }
      this.loading = false
      this.getTableData()
    },

    /**
     * 处理changeState审核状态在前端的展示
     * 注：case 0：新建实际不存在，因为新建未保存的默认不存在
     */
    showCheckStr (changeState) {
      switch (changeState) {
        case 0:
          return { type: '', label: '新建', effect: '' }
        case 1:
          return { type: 'warning', label: '保存', effect: 'plain' }
        case 2:
          return { type: 'info', label: '审核中', effect: 'plain' }
        case 3:
          return { type: 'success', label: '通过', effect: 'plain' }
        case 4:
          return { type: 'danger', label: '退回', effect: 'plain' }
      }
    },

    /**
     * ********************************************
     * 后面都不用动
     * ********************************************
     */
    /**
     * 将后台传过来的valueOf格式的时间改成yyyy/m/d的格式
     */
    dateFormat (s) {
      var date = new Date(s)
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      var d = date.getDate()
      return `${y}/${m < 10 ? '0' + m : m}/${d < 10 ? '0' + d : d}`
    },

    /*
    handleReset (scope) {
      this.resetsubjectDialogVisible = true
      this.mail = Object.assign(this.mail, scope.row)
      this.mail.subject = ''
      this.mail.content = ''
    },
*/

    handleSearch () {
      this.query.page = 1
      this.getTableData()
    },

    // handleOnSelectChange (selection) {
    //   this.selectedList = selection
    // },

    // 每页数目改变
    handleSizeChange (val) {
      this.query.limit = val
      this.getTableData()
    },

    // 当前页码改变
    handleCurrentChange (val) {
      this.query.page = val
      this.getTableData()
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .sentDate-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
.my-form-item {
  margin-top: 0px;
  .el-form-item {
    margin-right: 20px;
  }
}
.my-dialog {
  .el-form-item {
    margin-left: 100px;
    margin-right: 200px;
  }
}
// .el-col {
//   min-height: 1px;
// }
// 跳转页脚
.el-pagination {
  float: right;
  margin-top: 10px;
  margin-right: 30px;
}
</style>
