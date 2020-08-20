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
                v-model="destroySearch.no"
                size="small"
                placeholder="请输入需要查询的业务单号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label>
              <el-button
                icon="el-icon-search"
                size="small"
                @click="handleSearch"
              >搜索</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <el-button
              size="small"
              type="success"
              @click="refreshButton()"
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
        width="180"
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
        width="120"
      />
      <el-table-column
        fixed="right"
        label="操作"
        width="130"
      >
        <template slot-scope="scope">
          <el-button
            type="success"
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
      labelPosition: 'right',

      destroySearch: {
        no: ''
      },
      // 分页
      page: {
        currentPage: 1,
        pageSize: 1,
        total: 0,
        keyword: ''
      },

      visible: true,

      async refreshButton () {
        const res = await refresh()
        // debugger
        // console.log(res);
        this.tableData = res
        // console.log(this.tableData);
        for (var i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].fDestroyType) {
            this.tableData[i].fDestroyType = '库存票据销毁'
          } else {
            this.tableData[i].fDestroyType = '核销票据销毁'
          }
        }
        // eslint-disable-next-line no-redeclare
        for (var i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].fStatus) {
            this.tableData[i].fStatus = '已审核'
          } else {
            this.tableData[i].fStatus = '未审核'
          }
        }
        console.log(this.tableData)
      }
    }
  },
  // components:{
  // "addDestroyApplyDialog": addDestroyApplyVue
  // },
  created () {
    this.refreshButton()// 需要触发的函数
  },
  methods: {
    // eslint-disable-next-line vue/no-dupe-keys
    async refreshButton () {
      const res = await refresh()
      // debugger
      console.log(res)
      this.tableData = res
    },
    handleSearch () {},
    handleSizeChange () {},
    handleCurrentChange () {},
    handleClick (row) {
      // console.log(row)
      this.$root.eventBus.$emit('fDestroyNoConfirm', row.fDestroyNo)
      // console.log(this.visible)
      this.$root.eventBus.$emit('visibleDestroyConfirm', this.visible)
    }
  }

}
</script>
<style scoped>
.header {
  margin-top: 20px;
}
</style>
