<template>
  <div class="app-container">
    <el-card>

      <el-form
        :model="query"
        :inline="true"
        style="height: 40px;"
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
      </el-form>

    </el-card>
    <el-card style="margin-top:10px;height:755px">
      <el-button
        type="primary"
        size="small"
        @click="handleAdd"
      >新建记录</el-button>
      <el-button
        :disabled="deleteBatchDisable"
        type="danger"
        size="small"
        @click="handleDeleteBatch"
      >批量删除</el-button>

      <el-table
        v-loading.body="loading"
        :data="mailTableData"
        style="width: 100%;margin-top:10px;"
        max-height="620px"
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

          <template slot-scope="scope">
            <el-popover
              slot="reference"
              placement="top-start"
              title="邮件内容"
              width="300"
              trigger="click"
            >
              <div class="popover-content" v-html="util.prettyJson(scope.row.content)" />
              <el-button slot="reference" type="text">点击查看内容</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column align="center" label="发件时间" prop="date" sortable>
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
          <template slot-scope="scope">
            <el-popover
              slot="reference"
              placement="top-start"
              title="发件详情"
              width="300"
              trigger="click"
            >
              <div class="popover-content" v-html="scope.row.error" />
              <el-button slot="reference" type="text">{{ scope.row.error?scope.row.error.substring(0,4)+' ...':'' }}</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="165px">
          <template slot-scope="scope">
            <el-button
              v-if="!query.isSent"
              type="primary"
              size="mini"
              @click="handleEdit(scope)"
            >已发件</el-button>

            <el-button
              type="danger"
              size="mini"
              @click="handleDelete(scope)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="query.total > 0"
        background
        layout="prev, pager, next, sizes, total, jumper"
        :total="query.total"
        :current-page="query.page"
        :page-sizes="[10, 20, 50, 100, 500, 1000]"
        :page-size="query.limit"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <el-dialog
        :visible.sync="dialogVisible"
        :title="dialogType === 'edit' ? '编辑邮件' : '新建邮件'"
      >
        <el-form
          v-loading="dialogLoading"
          :model="mail"
          label-width="80px"
          label-position="left"
          :rules="rules"
        >
          <div>
            <el-form-item label="发件人" prop="mailFrom">
              <el-input
                v-model="mail.mailFrom"
                placeholder="发件人"
              />
            </el-form-item>
            <el-form-item label="收件人" prop="mailTo">
              <el-input
                v-model="mail.mailTo"
                placeholder="收件人"
              />
            </el-form-item>
            <el-form-item label="邮件主题" prop="subject">
              <el-input
                v-model="mail.subject"
                placeholder="邮件主题"
              />
            </el-form-item>
            <el-form-item label="邮件内容" prop="content">
              <el-input
                v-model="mail.content"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="邮件内容"
              />
            </el-form-item>
            <el-form-item style="text-algin:center;" class="dialogButton">
              <el-button
                type="danger"
                @click="dialogVisible = false"
              >取消</el-button>
              <el-button
                type="primary"
                @click="confirmMail"
              >确定</el-button>
            </el-form-item>

          </div>
        </el-form>
      </el-dialog>
    </el-card>

  </div>
</template>

<script>
import { getMailList, updateStatus, util, deleteMail, deleteMailBatch, addMail, updateMail } from '@/api/msg.js'
const defaultMail = {
  id: '',
  mailFrom: '',
  mailTo: '',
  subject: '',
  content: '',
  sentDate: '',
  isSent: '',
  error: ''
}
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
        mailTo: null,
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
      util,
      rules: {
        mailTo: [{
          required: true,
          message: '请输入收件人邮箱',
          trigger: ['blur', 'change']
        }, {
          pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
          message: '无效邮箱'
        }
        ],
        mailFrom: [{
          required: true,
          message: '请输入发件人信息',
          trigger: ['blur', 'change']
        }
        ],
        subject: [{
          required: true,
          message: '请输入邮件标题',
          trigger: ['blur', 'change']
        }
        ],
        content: [{
          required: true,
          message: '请输入邮件内容',
          trigger: ['blur', 'change']
        }
        ] },
      detail: null
    }
  },
  computed: {
    deleteBatchDisable () {
      return this.selectedList.length === 0
    }
  },

  created () {
    this.getTableData()
  },
  methods: {
    // 获取邮件列表
    async getTableData () {
      this.loading = true
      this.mailTableData = []
      await getMailList(this.query).then(res => {
        this.mailTableData = res.data.row
        this.query.total = res.data.total
        this.query.limit = res.data.limit
        this.query.page = res.data.page
        this.selectedList = []
        this.loading = false
      }).catch(() => { this.loading = false })
    },

    async handleSearch () {
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

    // 新建邮件
    async handleAdd () {
      this.mail = Object.assign({}, defaultMail)
      this.dialogType = 'new'
      this.dialogVisible = true
    },

    // 根据ID删除
    async handleDelete ({ $index, row }) {
      this.$confirm('确定要删除此邮件?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        deleteMail(row.id)
          .then((res) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getTableData()
          })
      })
    },
    // 批量删除
    async handleDeleteBatch () {
      this.$confirm('是否要删除这些邮件?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        deleteMailBatch(this.selectedList).then((res) => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getTableData()
        })
      })
    },
    async confirmMail () {
      const isEdit = this.dialogType === 'edit'
      let successFlag = false
      if (isEdit) {
        await updateMail(this.mail).then((res) => {
          successFlag = true
        })
      } else {
        await addMail(this.mail).then((res) => {
          successFlag = true
        })
      }
      if (successFlag) {
        const { mailFrom, mailTo, subject } = this.mail
        this.dialogVisible = false
        this.$notify({
          title: '成功',
          dangerouslyUseHTMLString: true,
          message: `

            <div>发件人: ${mailFrom}</div>
            <div>收件人: ${mailTo}</div>
            <div>邮件主题: ${subject}</div>
          `,
          type: 'success'
        })
        await this.getTableData()
      }
    },

    handleOnSelectChange (selection) {
      console.log(selection)
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
    },
    detailOver (scope) {
      console.log(scope)
      this.detail = scope.row.error
      console.log('123'.substring(0, 1))
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
  .dialogButton {
    text-align: right;
  }
  // 跳转页脚
  .el-pagination {
    float: right;
    margin-right: 30px;
    margin-top: 20px;
    margin-bottom: 30px;
  }
}
</style>
