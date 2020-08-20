<template>
  <div class="app-container">
    <el-form
      :model="query"
      :inline="true"
      class="demo-form-inline"
      @keyup.enter.native="handleSearch"
    >
      <el-form-item label="邮件ID:">
        <el-input
          v-model="query.id"
          placeholder="请输入邮件ID"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label="收件人:">
        <el-input
          v-model="query.mailTo"
          placeholder="请输入收件人"
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

      <el-form-item :label="query.isSent ? '已发件':'未发件'">
        <el-switch
          v-model="query.isSent"
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
      :data="mailTableData"
      style="width: 100%; margin-top: 30px;"
      border
      @selection-change="handleOnSelectChange"
    >
      <el-table-column type="selection" align="center" width="55" />
      <el-table-column align="center" label="邮件Id" width="165">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column align="center" label="发件人" width="165">
        <template slot-scope="scope">{{ scope.row.mailFrom }}</template>
      </el-table-column>
      <el-table-column align="center" label="收件人" width="165">
        <template slot-scope="scope">{{ scope.row.mailTo }}</template>
      </el-table-column>
      <el-table-column align="center" label="邮件主题">
        <template slot-scope="scope">{{ scope.row.subject }}</template>
      </el-table-column>
      <el-table-column align="center" label="邮件内容">
        <template slot-scope="scope">{{ util.jsonFormat(scope.row.content) }}</template>
      </el-table-column>
      <el-table-column align="center" label="发件时间">
        <template slot-scope="scope">{{ scope.row.sentDate }}</template>
      </el-table-column>
      <el-table-column align="center" label="是否已发送">
        <template slot-scope="scope">{{ scope.row.isSent ? '已发送' : '未发送' }}</template>
      </el-table-column>
      <el-table-column align="center" label="发件详情" width="165">
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

  </div>
</template>

<script>
import { getMailList, updateStatus, util } from '@/api/msg.js'

export default {
  data () {
    return {
      mail: {
        id: '',
        mailFrom: '',
        mailTo: '',
        subject: '',
        content: '',
        sentDate: '',
        isSent: '',
        error: ''
      },
      mailTableData: [],
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

        id: '',
        mailTo: '',
        isSent: true,
        period: [new Date(new Date().getTime() - 3600 * 1000 * 24 * 90), new Date()]

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
    // 获取邮件列表
    async getTableData () {
      this.loading = true
      const res = await getMailList(this.query).catch(() => { this.loading = false })
      this.mailTableData = res.data.row
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

    // 更新邮件为已发件
    async handleEdit (scope) {
      this.loading = true
      this.mail = Object.assign(this.mail, scope.row)
      this.mail.isSent = true
      await updateStatus(this.mail).catch(() => { this.loading = false })
      this.getTableData()
      this.loading = false
    },

    handleReset (scope) {
      this.resetsubjectDialogVisible = true
      this.mail = Object.assign(this.mail, scope.row)
      this.mail.subject = ''
      this.mail.content = ''
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
}
</style>
