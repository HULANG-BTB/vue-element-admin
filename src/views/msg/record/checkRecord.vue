<template>
  <div class="app-container">
    <el-card>
      <el-form
        :model="query"
        style="height: 40px;"
        :inline="true"
        class="demo-form-inline"
        @keyup.enter.native="handleSearch"
      >
        <el-form-item label="记录ID:">
          <el-input
            v-model="query.id"
            placeholder="请输入记录ID"
            clearable
            size="small"
            class="query"
          />
        </el-form-item>
        <el-form-item label="票据号码:">
          <el-input
            v-model="query.billCode"
            placeholder="请输入票据号码"
            clearable
            size="small"
            class="query"
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
        <el-form-item label="查验结果：">
          <el-select v-model="query.result" clearable placeholder="请选择" size="small">
            <el-option
              label="查验为真"
              value="1"
            />
            <el-option
              label="查验为假"
              value="0"
            />
          </el-select>
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
        :disabled="deleteBatchDisable"
        type="danger"
        size="small"
        @click="handleDeleteBatch"
      >批量删除</el-button>
      <el-table
        v-loading.body="loading"
        :data="checkRecordTableData"
        style="width: 100%;margin-top:20px;"
        border
        @selection-change="handleOnSelectChange"
      >
        <el-table-column type="selection" align="center" width="55" />
        <el-table-column align="center" label="记录Id" width="165">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column align="center" label="票据号码" width="165">
          <template slot-scope="scope">{{ scope.row.billCode }}</template>
        </el-table-column>
        <el-table-column align="center" label="查验结果" width="165">
          <template slot-scope="scope">
            <el-tag
              :key="scope.row.result ? '1' : '0'"
              :type="scope.row.result ? 'success' : 'danger'"
              effect="plain"
            >
              {{ scope.row.result ? 'TRUE' : 'FALSE' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="查验类型">
          <template slot-scope="scope">{{ scope.row.checkType }}</template>
        </el-table-column>
        <el-table-column align="center" label="查验人">
          <template slot-scope="scope">{{ scope.row.operatorIp }}</template>
        </el-table-column>
        <el-table-column align="center" label="查验时间">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>

        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
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
    </el-card>
  </div>
</template>

<script>
import { util, getCheckRecordList, deleteCheckRecordBatch, deleteCheckRecord } from '@/api/msg.js'

export default {
  data () {
    return {
      checkRecord: {
        id: '',
        billCode: '',
        checkType: '',
        createTime: '',
        operatorIp: '',
        result: ''
      },
      checkRecordTableData: [],
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
        billCode: null,
        checkType: null,
        period: null,
        operatorIp: null,
        result: null
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
      this.checkRecordTableData = []
      await getCheckRecordList(this.query).then(res => {
        this.checkRecordTableData = res.data.row
        this.query.total = res.data.total
        this.query.limit = res.data.limit
        this.query.page = res.data.page
        this.selectedList = []
        this.loading = false
      }).catch(() => { this.loading = false })
    },

    async handleSearch () {
      this.query.page = 1
      await this.getTableData()
    },

    // 根据ID删除
    async handleDelete ({ row }) {
      this.$confirm('确定要删除此记录?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        deleteCheckRecord(row.id)
          .then(() => {
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
        deleteCheckRecordBatch(this.selectedList).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getTableData()
        })
      })
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
    margin-top: 20px;
    margin-bottom: 30px;
  }
}
  // 查验结果
  ::v-deep .el-select .el-input {
    width: 100px;
  }
  // id
  ::v-deep .query .el-input__inner {
    width: 150px;
  }
</style>
