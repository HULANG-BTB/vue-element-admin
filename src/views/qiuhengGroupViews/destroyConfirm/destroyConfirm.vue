<template>
  <div class="destroy-confirm-container">
    <el-header>
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
                placeholder="请输入需要查询的业务单号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label>
              <el-button
                icon="el-icon-search"
                @click="handleSearch"
              >搜索</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button
              type="success"
              @click="refreshButton()"
            >刷新</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-pagination
      background
      :current-page="page.currentPage"
      :page-sizes="[10,100, 200, 300, 400]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-table
      :data="tableData"
      style="width: 100%"
      :default-sort="{prop: 'id'}"
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
        width="100"
      />
      <el-table-column
        fixed="right"
        label="操作"
        width="100"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="handleClick(scope.row)"
          >查看</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
  refresh
} from '@/api/qiuhengGroupApi/destroy/destroyConfirm'
export default {

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
    handleClick (row) {
      console.log(row)
    },
    async refreshButton () {
      const res = await refresh()
      // debugger
      console.log(res)
      this.tableData = res
    },
    handleSearch () {},
    handleSizeChange () {},
    handleCurrentChange () {}
  }

}
</script>
