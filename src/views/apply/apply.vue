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
              placeholder="选择开始日期">
            </el-date-picker>
            <el-date-picker
              v-model="query.lastDate"
              type="date"
              size="small"
              placeholder="选择结束日期">
            </el-date-picker>
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
            <el-radio-button label="0">未提交</el-radio-button>
            <el-radio-button label="1">已提交</el-radio-button>
            <el-radio-button label="2">审核通过</el-radio-button>
            <el-radio-button label="3">审核退回</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </div>
    </el-form>

    <el-button @click="openCreate" style="margin-bottom:10px">新增</el-button>
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
          {{ scope.row.submitDate | dateFmt("YYYY-MM-DD HH:mm:SS") }}
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
            <adt style="text-align:left" :row="rowDetail" />
          </el-dialog>
          <el-button :type="scope.row.status | statusFilter" @click="openDetail(scope.row)">{{ scope.row.status==0?"编辑":"查看" }}</el-button>
          <el-button v-if="scope.row.status==0" :type="scope.row.status | statusFilter" @click="onDelete(scope.row.id)">{{ scope.row.status==0?"删除":"" }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog customClass="customWidth" :visible.sync="createTableVisiable">
      <act style="text-align:left" :visiable="createTableVisiable" :row="rowCreate"/>
    </el-dialog>

    <el-pagination
      background
      layout="prev, pager, next, sizes, total, jumper"
      :current-page="query.page"
      :page-sizes="[5, 10, 20, 50, 100, 500]"
      :page-size="query.limit"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>

</template>

<script>
import { getApplyList, getItemList, deleteApply, util , getMaxNo } from '@/api/apply'
import adt from './applyDetail.vue'
import act from './applyCreate.vue'

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
    adt,
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
        changeState: 0,
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
        agenName: "博思软件股份有限公司",
        memo: null,
        summary: null,
        author: null,
        updateTime: null,
        no: null,
        rgnCode: 1,
        agenIdCode: 1314,
        kindName: "测试型单位",
        author: "测试作者",
        status: 0
      }
      this.onGetMaxNo().then(
        res => {
          this.rowCreate.no = res.data
        }
      )
      this.createTableVisiable = true;
    },
    openDetail (row) {
      this.rowDetail = this.refreshRow(row)
      this.detailTableVisiable = true
    },
  fetchData() {
      var that = this
      getApplyList(this.query).then(res => {
        that.list = res.data
        this.listLoading = false
      })
    },
    refreshRow(row){
      getItemList(row.id).then(res => {
          row.items = res.data
        })
      return row
    },
    displayStatus(status){
      switch(status) {
      case 0:
        return "未提交"
        break;
      case 1:
        return "已提交"
        break;
      case 2:
        return "审核通过"
        break;
      case 3:
        return "审核退回"
        break;
     default:
        return "未提交"
      } 
    },
    onDelete (applyId) {
      var that = this
      deleteApply(applyId).then(
        res => {
          this.refreshQuery()
        }
      )
    },
    handleSearch(){
      this.query.page = 1
      this.fetchData()
    },
    handleSizeChange(val) {
      this.query.limit = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.query.page = val
      this.fetchData()
    },
    refreshQuery(){
      this.query.no = ""
      this.query.author = ""
      this.query.preDate = null
      this.query.lastDate = null
      this.fetchData()
    },
    onGetMaxNo(){
      return getMaxNo()
    }
  }
}
</script>

<style>
       .customWidth{
        width:70%;
    }
      </style>
