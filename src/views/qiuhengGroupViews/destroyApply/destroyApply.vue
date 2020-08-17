<template>
  <div class="destroy-apply-container">
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
              type="primary"
              @click="addDestroyApply()"
            >新增</el-button>
          </el-col>
          <el-dialog
            :visible.sync="dialogVisible"
            :show-close="true"
            width="80%"
            top="6vh"
            title="票据销毁申请——新增"
          >
            <add-destroy-apply-dialog />
          </el-dialog>
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
        label="序号"
        width="50"
      />
      <el-table-column
        prop="status"
        label="状态"
        sortable
        width="180"
      />
      <el-table-column
        prop="no"
        label="业务单号"
        sortable
        width="180"
      />
      <el-table-column
        prop="date"
        label="编制日期"
        sortable
        width="180"
      />
      <el-table-column
        prop="type"
        label="销毁类型"
        sortable
        width="180"
      />
      <el-table-column
        prop="changeMan"
        label="申请人"
        sortable
        width="180"
      />
      <el-table-column
        fixed="right"
        label="操作"
        width="180"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="handleClick(scope.row)"
          >查看</el-button>
          <el-button
            type="text"
            size="small"
            @click="handleClick(scope.row)"
          >修改</el-button>
          <el-button
            type="text"
            size="small"
            @click="handleClick(scope.row)"
          >新增</el-button>
          <el-button
            type="text"
            size="small"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import addDestroyApplyVue from './addDestroyApply'
export default {
  components: {
    'addDestroyApplyDialog': addDestroyApplyVue
  },

  data () {
    return {
      tableData: [{
        id: '1',
        status: '未审核',
        no: '90293092617',
        date: '2020-08-10',
        type: '核销票据销毁',
        changeMan: '张三'
      }, {
        id: '2',
        status: '已审核',
        no: '90293092618',
        date: '2020-08-10',
        type: '库存票据销毁',
        changeMan: '李四'
      }, {
        id: '3',
        status: '已审核',
        no: '90293092619',
        date: '2020-08-10',
        type: '核销票据销毁',
        changeMan: '王二'
      }],

      dialogVisible: false,
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

  methods: {
    handleClick (row) {
      console.log(row)
    },
    addDestroyApply () {
      this.dialogVisible = true
    },
    handleSearch () {},
    handleSizeChange () {},
    handleCurrentChange () {}
  }
}
</script>
