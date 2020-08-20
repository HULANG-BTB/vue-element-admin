<template>
  <div class="app-container">
    <el-form
      :model="query"
      :inline="true"
      class="demo-form-inline"
      @keyup.enter.native="handleSearch"
    >
      <el-form-item label="单号:">
        <el-input
          v-model="query.id"
          placeholder="请输入业务单号"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label="编制人:">
        <el-input
          v-model="query.author"
          placeholder="请输入编制人"
          clearable
          size="small"
        />
      </el-form-item>

      <el-form-item label="日期:">
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

      <el-form-item :label="query.changeState!=0 ? '已审核':'未审核'">
        <el-switch
          v-model="query.ischange"
          active-color="#13ce66"
          inactive-color="#ff4949"
          @change="handleIsSentChange"
        />
      </el-form-item>

      <el-form-item label>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="handleSearch"
        >搜索</el-button>
      </el-form-item>
      <!-- <el-form-item label>
        <el-button
          :disabled="deleteBatchDisable"
          type="danger"
          size="small"
          @click="handleDeleteBatch"
        >批量删除</el-button>
      </el-form-item> -->
      <el-form-item label>
        <el-button
          type="success"
          size="small"
          @click="getTableData"
        >重载数据</el-button>
      </el-form-item>
    </el-form>

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

    <el-table
      v-loading.body="loading"
      :data="StockoutTableData"
      style="width: 100%; margin-top: 30px;"
      border
      @selection-change="handleOnSelectChange"
    >
      <el-table-column type="selection" align="center" width="55" />
      <!-- 从1开始，与数据库数据无关 -->
      <el-table-column type="index" align="center" label="序号" width="165" />
      <!-- 出库主键 -->
      <el-table-column align="center" label="单号" width="165">
        <template slot-scope="scope">{{ scope.row.id.toString().padStart(9, 'S0000000') }}</template>
      </el-table-column>
      <el-table-column align="center" label="仓库ID">
        <template slot-scope="scope">{{ scope.row.warehouseId }}</template>
      </el-table-column>
      <el-table-column align="center" label="领用人">
        <template slot-scope="scope">{{ scope.row.useMan }}</template>
      </el-table-column>
      <el-table-column align="center" label="申请日期">
        <template slot-scope="scope">{{ dateFormat(scope.row.date) }}</template>
      </el-table-column>
      <el-table-column align="center" label="编制人" width="165">
        <template slot-scope="scope">{{ scope.row.author }}</template>
      </el-table-column>
      <el-table-column align="center" label="审核状态">
        <template slot-scope="scope">{{ showCheckStr(scope.row.changeState) }}</template>
      </el-table-column>
      <el-table-column align="center" label="摘要" width="165">
        <template slot-scope="scope">{{ scope.row.abstact }}</template>
      </el-table-column>
      <!-- <el-table-column v-if="!query.changeState" align="center" label="操作"> -->
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleEdit(scope)"
          >查看</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { getAllList, getItem, util } from '@/api/finanbill.js'

export default {
  data () {
    return {
      stockOutVos: {
        id: '',
        rgnCode: '',
        warehouseId: '',
        useMan: '虚拟领票单位',
        date: '',
        author: '',
        changeState: '',
        abstact: ''
      },
      StockoutTableData: [],
      selectedList: [],
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
        changeState: 1,
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
      console.log('----------' + JSON.stringify(this.query, null, 4))
      const res = await getAllList(this.query).catch(() => { this.loading = false })
      console.log('----------' + JSON.stringify(res.data.row, null, 4))
      this.StockoutTableData = res.data.row
      this.query.total = res.data.total
      this.query.limit = res.data.limit
      this.query.page = res.data.page
      // this.selectedList = []
      this.loading = false
    },

    handleSearch () {
      this.query.page = 1
      this.getTableData()
    },

    // 更新邮件为已发件
    async handleEdit (scope) {
      this.loading = true
      this.mail = Object.assign(this.mail, scope.row)
      this.mail.changeState = true
      await getItem(this.mail).catch(() => { this.loading = false })
      this.getTableData()
      this.loading = false
    },

    /**
     * 处理changeState审核状态在前端的展示
     * 注：case 0：新建实际不存在，因为新建未保存的默认不存在
     */
    showCheckStr (changeState) {
      switch (changeState) {
        case 0:
          return '新建'
        case 1:
          return '保存'
        case 2:
          return '提交'
        case 3:
          return '通过'
        case 4:
          return '退回'
      }
    },

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

    handleOnSelectChange (selection) {
      this.selectedList = selection
    },

    // 发件状态改变
    handleIsSentChange () {
      this.query.page = 1
      this.getTableData()
    },

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
</style>
