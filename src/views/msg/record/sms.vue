<template>
  <div class="app-container">
    <el-form
      :model="query"
      :inline="true"
      class="demo-form-inline"
      @keyup.enter.native="handleSearch"
    >
      <el-form-item label="短信ID:">
        <el-input
          v-model="query.id"
          placeholder="请输入短信ID"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label="收信人:">
        <el-input
          v-model="query.smsTo"
          placeholder="请输入收信人"
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
      <el-form-item :label="query.isSent ? '已发信':'未发信'">
        <el-switch
          v-model="query.isSent"
          active-color="#13ce66"
          inactive-color="#ff4949"
          @change="handleIsSentChange"
        /></el-form-item>
      <el-form-item label>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="handleSearch"
        >搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading.body="loading"
      :data="smsTableData"
      max-height="700px"
      style="width: 100%;"
      border
      @selection-change="handleOnSelectChange"
    >
      <el-table-column align="center" label="短信Id" width="165">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column align="center" label="发信人" width="165">
        <template slot-scope="scope">{{ scope.row.smsFrom }}</template>
      </el-table-column>
      <el-table-column align="center" label="收信人" width="165">
        <template slot-scope="scope">{{ scope.row.smsTo }}</template>
      </el-table-column>
      <el-table-column align="center" label="校验码">
        <template slot-scope="scope">{{ scope.row.verifyCode }}</template>
      </el-table-column>
      <el-table-column align="center" label="短信内容">
        <template slot-scope="scope"><el-popover
          slot="reference"
          placement="top-start"
          title="短信内容"
          width="300"
          trigger="click"
        >
          <div class="popover-content" v-html="util.prettyJson(scope.row.content)" />
          <el-button slot="reference" type="text">点击查看内容</el-button>

        </el-popover></template>
      </el-table-column>
      <el-table-column align="center" label="发信时间">
        <template slot-scope="scope">{{ scope.row.sentDate }}</template>
      </el-table-column>
      <el-table-column align="center" label="是否已发送">
        <template slot-scope="scope">
          <el-tag
            :key="scope.row.isSent ? '已发送' : '未发送'"
            :type="scope.row.isSent ? 'success' : 'danger'"
            effect="plain"
          >
            {{ scope.row.isSent ? '已发送' : '未发送' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发件详情">
        <template slot-scope="scope">{{ scope.row.error }}</template>
      </el-table-column>
      <el-table-column v-if="!query.isSent" align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleEdit(scope)"
          >已发件</el-button>
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

  </div>
</template>

<script>
import { getSmsList, updateSmsStatus, util } from '@/api/msg.js'

export default {
  data () {
    return {
      sms: {
        id: '',
        smsFrom: '',
        smsTo: '',
        content: '',
        sentDate: '',
        isSent: '',
        error: ''
      },
      smsTableData: [],
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

        id: null,
        smsTo: null,
        isSent: true,
        period: null

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
    // 获取短信列表
    async getTableData () {
      this.loading = true
      const res = await getSmsList(this.query).catch(() => { this.loading = false })
      this.smsTableData = res.data.row
      this.query.total = res.data.total
      this.query.limit = res.data.limit
      this.query.page = res.data.page
      this.selectedList = []
      this.loading = false
    },

    handleSearch () {
      this.query.page = 1
      this.getTableData()
    },

    // 更新短信为已发件
    async handleEdit (scope) {
      this.loading = true
      this.sms = Object.assign(this.sms, scope.row)
      this.sms.isSent = true
      await updateSmsStatus(this.sms).catch(() => { this.loading = false })
      this.getTableData()
      this.loading = false
    },

    handleReset (scope) {
      this.resetsubjectDialogVisible = true
      this.sms = Object.assign(this.sms, scope.row)
      this.sms.subject = ''
      this.sms.content = ''
    },

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
  // 跳转页脚
  .el-pagination {
    float: right;
    margin-right: 30px;
    margin-top: 30px;
    margin-bottom: 30px;
  }
}
</style>
