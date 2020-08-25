<template>
  <div class="app-container">
    <!-- <el-form
      ref="queryForm"
      :model="queryParams"
      :inline="true"
      size="small"
      style="margin-top:10px;"
    >
      <el-form-item
        label="可用票据名称"
        prop="name"
      >
        <el-input
          v-model="queryParams.keyword"
          placeholder="请输入可用票据名称"
          clearable
          style="width: 150px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="handleQuery"
        >搜索</el-button>
        <el-button
          icon="el-icon-refresh"
          @click="resetQuery"
        >重置</el-button>
      </el-form-item>
    </el-form> -->
    <el-table
      :data="unitBillList"
      style="width: 100%;margin-top:30px;"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        align="center"
        label="票据名称"
        prop="name"
      />
      <el-table-column
        align="center"
        label="票据用途"
        prop="billNature"
      />
      <el-table-column
        align="center"
        label="助记码"
        prop="memoryCode"
      />
      <el-table-column
        align="center"
        label="生效日期"
        prop="effDate"
      >
        <template slot-scope="scope">
          {{ parseTime(scope.row.effDate) }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="失效日期"
        prop="expDate"
      ><template slot-scope="scope">
        {{ parseTime(scope.row.expDate) }}
      </template></el-table-column>

      <el-table-column
        align="center"
        label="操作"
        width="100"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleLook(scope.row)"
          >查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="margin-top:20px;float:right;margin-right:20px;"
      center
      background
      margin-top="10"
      layout="prev, pager, next, sizes, total, jumper"
      :page-sizes="[10,20,50,100]"
      :page-size="queryParams.limit"
      :total="queryParams.total"
      :current-page="queryParams.page"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <el-dialog
      :visible.sync="dialogVisible"
    >
      <el-form
        ref="unitBill"
        :model="unitBill"
        label-width="80px"
        label-position="right"
        style="padding-right:25px;"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="票据编码"
              :label-width="formLabelWidth"
              prop="code"
            >
              <el-input
                v-model="unitBill.code"
                readonly
              />
            </el-form-item>
            <el-form-item
              label="票据名称"
              :label-width="formLabelWidth"
              prop="name"
            >
              <el-input
                v-model="unitBill.name"
                readonly
              />
            </el-form-item>
            <el-form-item
              label="票据用途"
              :label-width="formLabelWidth"
              prop="billNature"
            >
              <el-input
                v-model="unitBill.billNature"
                readonly
              />
            </el-form-item>
            <el-form-item label="生效日期" :label-width="formLabelWidth" prop="effDate">
              <el-date-picker v-model="unitBill.effDate" type="date" readonly style="width: 100%;" />
            </el-form-item>
            <el-form-item
              label="定额面值"
              :label-width="formLabelWidth"
              prop="quotaAmount"
            >
              <el-input
                v-model="unitBill.quotaAmount"
                readonly
              />
            </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item
              label="助记码"
              :label-width="formLabelWidth"
              prop="memoryCode"
            >
              <el-input
                v-model="unitBill.memoryCode"
                readonly
              />
            </el-form-item>
            <el-form-item
              label="是否分类"
              :label-width="formLabelWidth"
              prop="checkSort"
            >
              <el-input
                readonly
                :value="unitBill.checkSort === 1? '是' : '否'"
                placeholder=""
              />
            </el-form-item>
            <el-form-item
              label="是否定额"
              :label-width="formLabelWidth"
              prop="checkQuota"
            >
              <el-input
                readonly
                :value="unitBill.checkQuota === 1? '是' : '否'"
                placeholder=""
              />
            </el-form-item>
            <el-form-item
              label="失效日期"
              :label-width="formLabelWidth"
              prop="expDate"
            >
              <el-date-picker
                v-model="unitBill.expDate"
                type="date"
                readonly
                style="width: 100%;"
              />
            </el-form-item>
            <el-form-item
              label="法定保存年限"
              :label-width="formLabelWidth"
              prop="safeYear"
            >
              <el-input
                v-model="unitBill.safeYear"
                readonly
              />
            </el-form-item></el-col>
        </el-row>
      </el-form>
      <div style="text-align:right;">
        <el-button
          type="danger"
          @click="cancel"
        >关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getunitBillListByPage } from '@/api/unitItemBill'
import { parseTime } from '@/utils/index'
export default {
  data () {
    return {
    //   loading: true,
      queryParams: { // 查询参数
        keyword: '112233',
        page: 1,
        limit: 10,
        total: 0
      },
      unitBillList: [],
      unitBill: {},
      dialogVisible: false,
      dialogType: 'new',
      formLabelWidth: '100px'
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    // 获取资源列表
    async getTableData () {
      this.loading = true
      const res = await getunitBillListByPage(this.queryParams)
      this.unitBillList = res.data.items
      this.queryParams.total = res.data.total
      this.queryParams.limit = res.data.limit
      this.queryParams.page = res.data.page
      this.selectedList = []
      this.loading = false
    },
    // 搜索
    handleQuery () {
      this.queryParams.page = 1
      this.getTableData()
    },
    // 表单重置封装
    resetForm (refName) {
      if (this.$refs[refName]) {
        this.$refs[refName].resetFields()
      }
    },
    // 重置
    resetQuery () {
      // this.resetForm('queryParams')
      this.queryParams = {}
    },
    handleLook (rowData) {
      this.dialogVisible = true
      this.unitBill = Object.assign({}, rowData)
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.selectedList = selection
    },

    // 模态框取消
    cancel () {
      this.dialogVisible = false
      this.resetForm('project')
    },
    handleSizeChange (val) {
      this.queryParams.limit = val
      this.getTableData()
    },
    // 转换时间戳
    parseTime (time) {
      return parseTime(new Date(time), '{y}-{m}-{d}')
    },
    // 当前页码改变
    handleCurrentChange (val) {
      this.queryParams.page = val
      this.getTableData()
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
