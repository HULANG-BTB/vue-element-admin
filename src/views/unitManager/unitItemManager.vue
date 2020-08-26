<template>
  <div class="app-container">
    <el-table
      :data="unitItemList"
      style="width: 100%;margin-top:30px;"
      border
      @selection-change="handleSelectionChange"
    >
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
        width="200"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleLook(scope.row)"
          >查看</el-button>
          <el-button
            type="primary"
            size="mini"
            @click="handleAddGroup(scope.row)"
          >添加分组</el-button>
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
        ref="unitItem"
        :model="unitItem"
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
                v-model="unitItem.itemId"
                readonly
              />
            </el-form-item>
            <el-form-item
              label="项目名称"
              :label-width="formLabelWidth"
              prop="itemName"
            >
              <el-input
                v-model="unitItem.itemName"
                readonly
              />
            </el-form-item>
            <el-form-item
              label="预算科目"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="unitItem.subjectName"
                placeholder="预算科目"
                readonly
              />
            </el-form-item>
            <el-form-item
              label="生效日期"
              :label-width="formLabelWidth"
              prop="itemEffdate"
            >
              <el-date-picker
                v-model="unitItem.itemEffdate"
                type="date"
                readonly
                style="width: 100%;"
              />
            </el-form-item>
            <el-form-item
              label="助记码"
              :label-width="formLabelWidth"
              prop="mnen"
            >
              <el-input
                v-model="unitItem.mnen"
                readonly
              />
            </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item
              label="预算科目"
              :label-width="formLabelWidth"
              prop="subject"
            >
              <el-input
                v-model="unitItem.subject"
                readonly
              />
            </el-form-item>
            <el-form-item
              label="收缴方式"
              :label-width="formLabelWidth"
              prop="paymode"
            >
              <el-input
                v-model="unitItem.paymode"
                readonly
              />
            </el-form-item>
            <el-form-item
              label="收入类别"
              :label-width="formLabelWidth"
              prop="name"
            >
              <el-input
                v-model="incomeSort.name"
                readonly
              />
            </el-form-item>
            <el-form-item
              label="失效日期"
              :label-width="formLabelWidth"
              prop="itemExpdate"
            >
              <el-date-picker
                v-model="unitItem.itemExpdate"
                type="date"
                readonly
                style="width: 100%;"
              />
            </el-form-item>
            <el-form-item
              label="资金性质"
              :label-width="formLabelWidth"
              prop="fundsnatureCode"
            >
              <el-input
                v-model="unitItem.fundsnatureCode"
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

    <el-dialog
      :visible.sync="groupVisible"
    >
      <el-form :model="group">
        <el-form-item label="选择分组" :label-width="formLabelWidth">
          <el-select v-model="group.groupCode" placeholder="请选分组">
            <el-option v-for="(item, index) in groupList" :key="index" :label="item.groupName" :value="item.groupCode" />
          </el-select>
        </el-form-item>
      </el-form>

      <div style="text-align:right;">
        <el-button
          type="danger"
          @click="cancel"
        >取消</el-button>
        <el-button
          type="primary"
          @click="addGroup"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getIncomeSortName } from '@/api/base/projectManager/projectManager'
import { getunitItemListByPage, getGroupByCode, addItemGroup } from '@/api/base/unitManager/unitItemBill'
import { parseTime } from '@/utils/index'
export default {
  data () {
    return {
    //   loading: true,
      queryParams: { // 查询参数
        keyword: this.$store.state.user.agenCode,
        page: 1,
        limit: 10,
        total: 0
      },
      groupParams: {
        agenCode: this.$store.state.user.agenCode,
        page: 1,
        limit: 10,
        total: 0
      },
      unitItemList: [],
      group: {
        groupCode: ''
      },
      groupList: [],
      incomeSort: {
        code: '',
        name: ''
      },
      checksort: '是',
      nochecksort: '否',
      unitItem: {
        id: '',
        itemName: '',
        itemCode: '',
        itemId: '',
        itemSortId: '',
        itemEffdate: '',
        mnen: '',
        subject: '',
        paymode: '',
        incomSortCode: '',
        itemExpdate: '',
        fundsnatureCode: ''
      },
      groupVisible: false,
      dialogVisible: false,
      dialogType: 'new',
      formLabelWidth: '100px'
    }
  },
  created () {
    this.getTableData()
    this.getGroup()
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
    async getGroup () {
      const res = await getGroupByCode(this.groupParams)
      this.groupList = res.data
      this.group.groupCode = this.groupList[0].groupCode
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
    async handleLook (rowData) {
      this.dialogVisible = true
      this.unitItem = Object.assign({}, rowData)
      const res2 = await getIncomeSortName(this.unitItem.incomSortCode)
      this.incomeSort = res2.data
    },
    handleAddGroup (rowData) {
      this.groupVisible = true
      this.unitItem = Object.assign({}, rowData)
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.selectedList = selection
    },

    // 模态框取消
    cancel () {
      this.dialogVisible = false
      this.groupVisible = false
      this.resetForm('project')
    },
    async addGroup () {
      const data = { 'groupCode': this.group.groupCode, 'itemCode': this.unitItem.itemId }
      await addItemGroup(data)
        .then((res) => {
          this.groupList = false
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          this.getTableData()
          this.dialogVisible = false
        })
        .catch((err) => {
          console.error(err)
        })
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
