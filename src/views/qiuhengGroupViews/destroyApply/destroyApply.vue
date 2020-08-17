<template>
  <div class="destroy-apply-container">
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
          <el-col :span="4">
            <el-button
              type="success"
              @click="refreshButton()"
            >刷新</el-button>
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
        type="index"
        label="序号"
        width="50"
      />
      <el-table-column
        prop="fStatus"
        label="审核状态"
        sortable
        width="180"
      />
      <el-table-column
        prop="fDestroyNo"
        label="申请单号"
        sortable
        width="180"
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
        prop="fApplyMan"
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
import {addDestroyApply,getApplyListByAgenIdCode } from '@/api/qiuhengGroupApi/destroy/destroyApply'
import addDestroyApplyVue from './addDestroyApply'
export default {
  components: {
    'addDestroyApplyDialog': addDestroyApplyVue
  },

  data () {
    return {
      tableData: [],

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
      },

      fDestroyNo: ''
    }
  },
  created () {
    this.$root.eventBus.$on('dialogVisible1', (val) => {
      this.dialogVisible = val
      //console.log(this.dialogVisible)
    })
    this.$root.eventBus.$on('dialogVisibleCancel', (val) => {
      this.dialogVisible = val
    })
    this.refreshButton();
  },
  methods: {
    handleClick (row) {
      console.log(row)
    },
    addDestroyApply () {
      this.dialogVisible = true
      this.randomNumber()
      this.$root.eventBus.$emit('fDestroyNo', this.fDestroyNo)

    },
    handleSearch () {},
    handleSizeChange () {},
    handleCurrentChange () {},
    // 生成流水号
    randomNumber () {
      const now = new Date()
      const month = now.getMonth() + 1
      const day = now.getDate()
      const hour = now.getHours()
      const minutes = now.getMinutes()
      const seconds = now.getSeconds()
      this.fDestroyNo = now.getFullYear().toString() + month.toString() + day + hour + minutes + seconds + (Math.round(Math.random() * 23 + 100)).toString()
    },
    async refreshButton(){
      const res = await getApplyListByAgenIdCode("1314")
      this.tableData = res
      for(var i = 0; i < this.tableData.length; i++){
          if(this.tableData[i].fDestroyType){
          this.tableData[i].fDestroyType="库存票据销毁";
          }else{
          this.tableData[i].fDestroyType="核销票据销毁";
          }
      }
      for(var i = 0; i < this.tableData.length; i++){
          if(this.tableData[i].fStatus){
          this.tableData[i].fStatus="已审核";
          }else{
          this.tableData[i].fStatus="未审核";
          }
      }
        //console.log(this.tableData);
    },
  }
}
</script>
<style scoped>
.header {
  margin-top: 20px;
}
</style>
