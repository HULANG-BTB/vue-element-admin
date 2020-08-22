<template>
  <div class="app-container">
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
    <el-dialog custom-class="customWidth" :visible.sync="createTableVisiable">
      <act style="text-align:left" :row="rowCreate" />
    </el-dialog>
  </div>

</template>

<script>
import { getApplyList, getItemList, deleteApply, util } from '@/api/apply'
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
      rowCreate: null
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
        no: null,
        rgnCode: 1,
        agenIdCode: 1,
        kindName: '测试型单位',
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
      getApplyList().then(function (data) {
        that.list = data
      })
      this.listLoading = false
    },
    refreshRow (row) {
      getItemList(row.id).then(function (data) {
        row.items = data
      })
      return row
    },
    displayStatus (status) {
      switch (status) {
        case 0:
          return '未提交'
          break
        case 1:
          return '已提交'
          break
        case 2:
          return '审核通过'
          break
        case 3:
          return '审核未通过'
          break
        default:
          return '未提交'
      }
    },
    onDelete (applyId) {
      var that = this
      deleteApply(applyId).then(
        function () {
          getApplyList().then(function (data) {
            that.list = data
          })
        }
      )
    }
  }
}
</script>

<style>
       .customWidth{
        width:70%;
    }
      </style>
