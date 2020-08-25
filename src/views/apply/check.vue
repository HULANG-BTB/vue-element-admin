<template>
  <div class="app-container">
    <el-form
      :model="query"
      :inline="true"
      class="demo-form-inline"
      @keyup.enter.native="handleSearch"
    >
      <div class="my-form-item">
        <el-form-item label="单号:">
          <el-input
            v-model="query.no"
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
              v-model="query.preDate"
              type="date"
              size="small"
              placeholder="选择开始日期"
            />

            <el-date-picker
              v-model="query.lastDate"
              type="date"
              size="small"
              placeholder="选择结束日期"
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
        </el-form-item>
        <el-form-item label>
          <el-button
            type=""
            icon="el-icon-refresh"
            size="small"
            @click="refreshQuery"
          >重置</el-button>
        </el-form-item>
      </div>

      <div>
        <el-form-item label="审核状态">
          <el-radio-group
            v-model="query.changeState"
            size="medium"
            @change="handleSearch"
          >
            <el-radio-button label="1">待审核</el-radio-button>
            <el-radio-button label="2">审核通过</el-radio-button>
            <el-radio-button label="3">审核退回</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </div>
    </el-form>

    <el-button style="margin-bottom:10px" @click="openCreate">新增</el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" prop="id" label="序号" width="95" sortable>
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="110" sortable>
        <template slot-scope="scope">
          <span v-text="displayStatus(scope.row.status)" />
        </template>
      </el-table-column>
      <el-table-column label="申领单号" width="160" align="center" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.no }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申领日期" width="220" align="center" sortable>
        <template slot-scope="scope">
          {{ parseTime(scope.row.submitDate) }}
        </template>
      </el-table-column>
      <el-table-column label="领购人" width="160" align="center" sortable>
        <template slot-scope="scope">
          {{ scope.row.linkMan }}
        </template>
      </el-table-column>
      <el-table-column label="备注" width="160" align="center" sortable>
        <template slot-scope="scope">
          {{ scope.row.memo }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="操作" align="center">
        <template slot-scope="scope">
          <el-dialog custom-class="customWidth" :visible.sync="detailTableVisiable">
            <act style="text-align:left" :row="rowDetail" />
          </el-dialog>
          <el-button :type="scope.row.status | statusFilter" @click="openDetail(scope.row)">{{ scope.row.status==0?"编辑":"查看" }}</el-button>
          <el-button v-if="scope.row.status==0" :type="scope.row.status | statusFilter" @click="onDelete(scope.row.id)">{{ scope.row.status==0?"删除":"" }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog custom-class="customWidth" :visible.sync="createTableVisiable">
      <act style="text-align:left" :row="rowCreate" />
    </el-dialog>
  </div>

</template>

<script>
import { getApplyCheckList, getCheckItemList } from '@/api/apply'
import act from './applyCheck.vue'
import { parseTime } from '@/utils'

export default {
  filters: {
    statusFilter (status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  components: {
    act
  },
  data () {
    return {
      list: null,
      listLoading: true,
      detailTableVisiable: false,
      createTableVisiable: false,
      rowDetail: null,
      rowCreate: null,
      query: {
        page: 1,
        limit: 10,
        total: 0,
        no: '',
        author: '',
        changeState: 1,
        preDate: null,
        lastDate: null
      }
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    openCreate () {
      this.rowCreate = {
        id: null,
        linkMan: null,
        linkAddr: null,
        linkTel: null,
        agenName: '单位名',
        memo: null,
        summary: null,
        author: null,
        updateTime: null,
        no: 1,
        rgnCode: 1,
        agenIdCode: 1,
        kindName: '测试型单位',
        // eslint-disable-next-line no-dupe-keys
        author: '测试作者',
        status: 0
      }
      this.createTableVisiable = true
    },
    openDetail (row) {
      this.rowDetail = this.refreshRow(row)
      this.detailTableVisiable = true
    },
    fetchData () {
      var that = this
      getApplyCheckList(this.query).then(res => {
        that.list = res.data
        this.listLoading = false
      })
    },
    refreshRow (row) {
      getCheckItemList(row.id).then(res => {
        row.items = res.data
      })
      return row
    },
    displayStatus (status) {
      switch (status) {
        case 1:
          return '待审核'
        case 2:
          return '审核通过'
        case 3:
          return '审核退回'
        default:
          return '待审核'
      }
    },
    handleSearch () {
      this.query.page = 1
      this.fetchData()
    },
    handleSizeChange (val) {
      this.query.limit = val
      this.fetchData()
    },
    handleCurrentChange (val) {
      this.query.page = val
      this.fetchData()
    },
    refreshQuery () {
      this.query.no = ''
      this.query.author = ''
      this.query.preDate = null
      this.query.lastDate = null
      this.fetchData()
    },
    parseTime (time) {
      return parseTime(new Date(time))
    }
  }
}
</script>

<style>
       .customWidth{
        width:70%;
    }
      </style>
