<template>
  <div class="destroy-confirm-container">
    <el-header class="header">
      <el-form
        :model="destroySearch"
        label-width="100px"
        label-position="labelPosition"
      >
        <el-row>
          <el-col :span="7">
            <el-form-item label="业务单号：">
              <el-input
                v-model="destroySearch.fDestroyNo"
                size="small"
                placeholder="请输入需要查询的业务单号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label>
              <el-button
                icon="el-icon-search"
                type="primary"
                size="small"
                @click="handleSearch()"
              >搜索</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <el-button
              size="small"
              type="success"
              @click="refreshButton1()"
            ><i class="el-icon-refresh el-icon--left" /> 刷新页面</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <!-- <el-pagination
      background
      :current-page="page.currentPage"
      :page-sizes="[10,100, 200, 300, 400]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    /> -->

    <el-table
      :data="tableData"
      style="width: 100%;margin-top:50px"
      :default-sort="{prop: 'id'}"
      border
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        prop="id"
        type="index"
        label="序号"
        width="50"
      />
      <el-table-column
        prop="fDestroyNo"
        label="申请单号"
        sortable
        disable="true"
        width="180"
      />
      <el-table-column
        prop="fUnitName"
        label="单位名称"
        sortable
        width="200"
      />
      <el-table-column
        prop="fApplyMan"
        label="申请人"
        sortable
        width="100"
      />
      <el-table-column
        prop="fApplyDate"
        label="申请日期"
        sortable
        width="180"
      />
      <el-table-column
        prop="fDestroyType"
        label="销毁类型"
        sortable
        width="180"
      />
      <el-table-column
        prop="fStatus"
        label="审核状态"
        sortable
        width="150"
      />
      <el-table-column
        fixed="right"
        label="操作"
        width="160"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="handleClick(scope.row)"
          >查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <destroy-confirm-dialog />
  </div>
</template>

<script>
import {
  refresh
} from '@/api/qiuhengGroupApi/destroy/destroyConfirm'
import {
  getApplyInfoByDestroyNo
} from '@/api/qiuhengGroupApi/destroy/destroyApply'

import DestroyConfirmDialog from '@/views/qiuhengGroupViews/destroyConfirm/destroyConfirmDialog'

export default {

  components: {
    'destroy-confirm-dialog': DestroyConfirmDialog
  },
  data () {
    return {
      tableData: [],
      // tableData: [{
      //   fDestroyNo: '',
      //   fUnitName: '',
      //   fApplyMan: '',
      //   fApplyDate: '',
      //   fDestroyType: '',
      //   fStatus: '',
      //   },
      // ],
      // dialogVisible: false,
      tableData1: [],
      labelPosition: 'right',

      destroySearch: {
        fDestroyNo: ''
      },
      // 分页
      page: {
        currentPage: 1,
        pageSize: 1,
        total: 0,
        keyword: ''
      },
      visible: true
    }
  },
  created () {
    this.refreshButton1()
  },
  methods: {
    async refreshButton () {
      const res = await refresh()
      this.tableData = res.data
    },
    async refreshButton1 () {
      const res = await refresh()
      this.tableData = res.data
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].fDestroyType) {
          this.tableData[i].fDestroyType = '库存票据销毁'
        } else {
          this.tableData[i].fDestroyType = '核销票据销毁'
        }
      }
      // eslint-disable-next-line no-redeclare
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].fStatus === 0) {
          this.tableData[i].fStatus = '未审核'
        }
        if (this.tableData[i].fStatus === 1) {
          this.tableData[i].fStatus = '已审核但未通过'
        }
        if (this.tableData[i].fStatus === 2) {
          this.tableData[i].fStatus = '已审核并通过'
        }
      }
    },
    async handleSearch () {
      this.tableData1 = []
      const res = await getApplyInfoByDestroyNo(this.destroySearch.fDestroyNo)
      this.tableData1.push(res.data)
      this.tableData = this.tableData1
    },
    handleSizeChange () {},
    handleCurrentChange () {},
    handleClick (row) {
      this.$root.eventBus.$emit('fDestroyNoConfirm', row.fDestroyNo)
      this.$root.eventBus.$emit('visibleDestroyConfirm', this.visible)
      this.$root.eventBus.$emit('lookDestroyApplyMan', row.fApplyMan)
      this.$root.eventBus.$emit('lookDestroyApplyDate', row.fApplyDate)
      this.$root.eventBus.$emit('lookDestroyApplyType', row.fDestroyType)
    }
  }

}
</script>
<style scoped>
.header {
  margin-top: 20px;
}
</style>
