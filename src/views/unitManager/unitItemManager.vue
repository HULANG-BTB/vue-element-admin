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
        label="可用项目名称"
        prop="itemName"
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
      :data="unitItemList"
      style="width: 100%;margin-top:30px;"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
      />
      <el-table-column
        align="center"
        label="项目名称"
        prop="itemName"
      />
      <el-table-column
        align="center"
        label="项目编码"
        prop="itemId"
      />
      <el-table-column
        align="center"
        label="分类编码"
        prop="itemSortId"
      />
      <el-table-column
        align="center"
        label="生效日期"
        prop="itemEffdate"
      >
        <template slot-scope="scope">
          {{ parseTime(scope.row.itemEffdate) }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="失效日期"
        prop="itemExpdate"
      ><template slot-scope="scope">
        {{ parseTime(scope.row.itemExpdate) }}
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
        ref="UnitItem"
        :model="UnitItem"
        label-width="80px"
        label-position="right"
        style="padding-right:25px;"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="项目编码"
              :label-width="formLabelWidth"
              prop="itemId"
            >
              <el-input
                v-model="UnitItem.itemId"
                :disabled="true"
              />
            </el-form-item>
            <el-form-item
              label="项目名称"
              :label-width="formLabelWidth"
              prop="itemName"
            >
              <el-input
                v-model="UnitItem.itemName"
                :disabled="true"
              />
            </el-form-item>
            <el-form-item
              label="项目分类编码"
              :label-width="formLabelWidth"
              prop="itemSortId"
            >
              <el-input
                v-model="UnitItem.itemSortId"
                :disabled="true"
              />
            </el-form-item>
            <el-form-item
              label="生效日期"
              :label-width="formLabelWidth"
              prop="itemEffdate"
            >
              <el-date-picker
                v-model="UnitItem.itemEffdate"
                type="date"
                :disabled="true"
                style="width: 100%;"
              />
            </el-form-item>
            <el-form-item
              label="助记码"
              :label-width="formLabelWidth"
              prop="mnen"
            >
              <el-input
                v-model="UnitItem.mnen"
                :disabled="true"
              />
            </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item
              label="预算科目"
              :label-width="formLabelWidth"
              prop="subject"
            >
              <el-input
                v-model="UnitItem.subject"
                :disabled="true"
              />
            </el-form-item>
            <el-form-item
              label="收缴方式"
              :label-width="formLabelWidth"
              prop="paymode"
            >
              <el-input
                v-model="UnitItem.paymode"
                :disabled="true"
              />
            </el-form-item>
            <el-form-item
              label="收入类别"
              :label-width="formLabelWidth"
              prop="incomSortCode"
            >
              <el-input
                v-model="UnitItem.incomSortCode"
                :disabled="true"
              />
            </el-form-item>
            <el-form-item
              label="失效日期"
              :label-width="formLabelWidth"
              prop="itemExpdate"
            >
              <el-date-picker
                v-model="UnitItem.itemExpdate"
                type="date"
                :disabled="true"
                style="width: 100%;"
              />
            </el-form-item>
            <el-form-item
              label="资金性质"
              :label-width="formLabelWidth"
              prop="fundsnatureCode"
            >
              <el-input
                v-model="UnitItem.fundsnatureCode"
                :disabled="true"
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
import { getunitItemListByPage } from '@/api/unitItemBill'
import { parseTime } from '@/utils/index'
export default {
  data () {
    return {
    //   loading: true,
      queryParams: { // 查询参数
        keyword: '22222222222',
        page: 1,
        limit: 10,
        total: 0
      },
      unitItemList: [],
      checksort: '是',
      nochecksort: '否',
      UnitItem: {},
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
      const res = await getunitItemListByPage(this.queryParams)
      this.unitItemList = res.data.items
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
      this.UnitItem = Object.assign({}, rowData)
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
