<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true" size="small" style="margin-top:10px;">
      <el-form-item label="标准名称" prop="keyword.name">
        <el-input
          v-model="queryParams.keyword.name"
          placeholder="请输入标准名称"
          clearable
          style="width: 140px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryParams.keyword.isenable" placeholder="请选择标准状态" style="width: 150px">
          <el-option label="已完成" value="1" />
          <el-option label="待审核" value="0" />
          <el-option label="全部" value="" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="success"
          :disabled="deleteBatchDisable"
          icon="el-icon-delete"
          size="small"
          @click="handleMultCheck"
        >批量审核</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          :disabled="deleteBatchDisable"
          icon="el-icon-delete"
          size="small"
          @click="handleMultDelete"
        >批量删除</el-button>
      </el-col>
    </el-row>

    <el-table :data="standardList" style="width: 100%;margin-top:30px;" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column align="center" label="状态" prop="isenable">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isenable ? 'success' : 'info'"
            disable-transitions
          >{{ scope.row.isenable ? '已完成' : '待审核' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="标准编码" prop="itemstdCode" />
      <el-table-column align="center" label="标准名称" prop="itemstdName" :show-overflow-tooltip="true" />
      <el-table-column align="center" label="标准下限" prop="minCharge" />
      <el-table-column align="center" label="标准上限" prop="maxCharge" />
      <el-table-column align="center" label="计量单位" prop="units" />
      <el-table-column align="center" label="生效日期" prop="itemstdEffdate">
        <template slot-scope="scope">
          {{ parseTime(scope.row.itemstdEffdate ) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="失效日期" prop="itemstdExpdate ">
        <template slot-scope="scope">
          {{ parseTime(scope.row.itemstdExpdate ) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="220">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          <el-button type="success" size="mini" @click="handleCheck(scope.row)">审核</el-button>
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

    <el-dialog :visible.sync="dialogVisible" :title="dialogType">
      <el-form ref="standard" :model="standard" :rules="rules" label-width="80px" label-position="right" style="padding-right:25px;">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="标准编码" :label-width="formLabelWidth" prop="itemstdCode">
              <el-input v-model="standard.itemstdCode" placeholder="标准编码" readonly />
            </el-form-item>
            <el-form-item label="项目编码" :label-width="formLabelWidth" prop="itemCode ">
              <el-input v-model="standard.itemCode " placeholder="项目编码" readonly />
            </el-form-item>
            <el-form-item label="标准下限" :label-width="formLabelWidth" prop="minCharge">
              <el-input v-model="standard.minCharge" placeholder="标准下限" />
            </el-form-item>
            <el-form-item label="生效日期" :label-width="formLabelWidth" prop="itemstdEffdate">
              <el-date-picker v-model="standard.itemstdEffdate" type="date" placeholder="选择日期" style="width: 100%;" />
            </el-form-item>
            <el-form-item label="计量单位" :label-width="formLabelWidth" prop="units">
              <el-input v-model="standard.units" placeholder="计量单位" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标准名称" :label-width="formLabelWidth" prop="itemstdName">
              <el-input v-model="standard.itemstdName" placeholder="标准名称" />
            </el-form-item>
            <el-form-item label="助记码" :label-width="formLabelWidth" prop="mnem">
              <el-input v-model="standard.mnem" placeholder="助记码" />
            </el-form-item>
            <el-form-item label="标准上限" :label-width="formLabelWidth" prop="maxCharge">
              <el-input v-model="standard.maxCharge" placeholder="标准上限" />
            </el-form-item>
            <el-form-item label="失效日期" :label-width="formLabelWidth" prop="itemstdExpdate">
              <el-date-picker v-model="standard.itemstdExpdate" type="date" placeholder="选择日期" style="width: 100%;" />
            </el-form-item>
            <el-form-item label="标准金额" :label-width="formLabelWidth">
              <el-input v-model="standard.charge" placeholder="标准金额" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirmRole">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getStdListByPage, updateStd, deleteStd, deleteStdBatch, projectStdCheck } from '@/api/base/projectManager/projectManager'
import { parseTime } from '@/utils/index'

export default {
  data () {
    const validateDatePicker = (rule, value, callback, source, option, other) => {
      const thisZero = new Date().setHours(0, 0, 0, 0)
      const input = new Date(value).setHours(0, 0, 0, 0)
      if (input < thisZero && !other && this.dialogType !== 'edit') {
        callback(new Error('日期不能早于今天'))
      } else if (other || this.dialogType === 'edit') {
        const otherStdData = new Date(this.standard[other]).setHours(0, 0, 0, 0)
        if (otherStdData > input) {
          callback(new Error('当前日期不能在开始日期之前'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
    //   loading: true,
      queryParams: { // 查询参数
        keyword: {
          name: '',
          isenable: ''
        },
        page: 1,
        limit: 10
        // total: 0
      },
      standardList: [],
      standard: {
        itemstdCode: '',
        itemstdName: '',
        mnem: '',
        maxCharge: '',
        minCharge: '',
        charge: '',
        units: '',
        itemstdEffdate: '',
        itemstdExpdate: '',
        note: '',
        id: '',
        isenable: '',
        itemCode: '',
        operator: '',
        operatorId: '',
        updateTime: '',
        createTime: ''
      },
      dialogVisible: false,
      dialogType: '编辑标准',
      formLabelWidth: '120px',
      selectedList: [],
      rules: {
        itemstdCode: [
          { required: true, message: '标准编码不能为空', trigger: 'blur' }
        ],
        itemstdName: [
          { required: true, message: '标准名称不能为空', trigger: 'blur' }
        ],
        maxCharge: [
          { required: true, message: '标准上限不能为空', trigger: 'blur' }
        ],
        minCharge: [
          { required: true, message: '标准下线不能为空', trigger: 'blur' }
        ],
        units: [
          { required: true, message: '计量单位不能为空', trigger: 'blur' }
        ],
        itemstdEffdate: [
          { trigger: 'blur', validator: validateDatePicker }
        ],
        itemstdExpdate: [
          { trigger: 'blur', validator: (rule, value, callback, source, option, other) => validateDatePicker(rule, value, callback, source, option, 'itemstdEffdate') }
        ],
        createTime: [
          { trigger: 'blur', validator: validateDatePicker }
        ],
        updateTime: [
          { trigger: 'blur', validator: (rule, value, callback, source, option, other) => validateDatePicker(rule, value, callback, source, option, 'createTime') }
        ],
        itemCode: [
          { required: true, message: '项目编码不能为空', trigger: 'blur' }
        ],
        operator: [
          { required: true, message: '经办人不能为空', trigger: 'blur' }
        ],
        operatorId: [
          { required: true, message: '经办人ID不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    deleteBatchDisable () {
      return this.selectedList.length === 0
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    // 格式化时间
    parseTime (time) {
      return parseTime(new Date(time), '{y}-{m}-{d}')
    },
    // 获取资源列表
    async getTableData () {
      // this.loading = true
      const res = await getStdListByPage(this.queryParams)
      this.standardList = res.data.items
      this.queryParams.total = res.data.total
      this.queryParams.limit = res.data.limit
      this.queryParams.page = res.data.page
      this.selectedList = []
      // this.loading = false
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
      this.queryParams.keyword.name = ''
      this.queryParams.keyword.isenable = ''
    },
    // 编辑按钮
    handleEdit (rowData) {
      this.dialogVisible = true
      this.standard = Object.assign({}, rowData)
    },
    // 删除按钮
    handleDelete (deleData) {
      this.$confirm('此操作将永久删除该标准, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        deleteStd(deleData.id)
          .then((res) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getTableData()
          })
          .catch((err) => {
            this.$message({
              type: 'error',
              message: '删除失败!'
            })
            console.error(err)
          })
      })
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.selectedList = selection
    },
    // 批量删除
    async handleMultDelete () {
      this.$confirm('此操作将永久删除选中标准, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.selectedids = this.selectedList.map(item => {
          return { id: item.id }
        })
        deleteStdBatch(this.selectedids).then((res) => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getTableData()
        })
      })
    },
    // 编辑模态框提交
    async confirmRole () {
      this.$refs['standard'].validate(async (valid) => {
        if (valid) {
          this.standard.isenable = 0 // 有修改就需要重新审核
          await updateStd(this.standard).then(res => {
            this.getTableData()
            this.dialogVisible = false
            this.$message({
              showClose: true,
              message: '编辑成功',
              type: 'success'
            })
          })
        }
      })
    },
    // 模态框取消
    cancel () {
      this.dialogVisible = false
      this.resetForm('standard')
    },
    // 单个审核
    async handleCheck (simpData) {
      this.standard = Object.assign({}, simpData)
      this.standard.isenable = 1 // 单击审核就相当于让状态变为1
      await updateStd(this.standard).then(res => {
        this.getTableData()
        this.dialogVisible = false
        this.$message({
          showClose: true,
          message: '审核成功',
          type: 'success'
        })
      })
    },
    // 批量审核按钮
    async handleMultCheck (checkData) {
      this.selectedids = this.selectedList.map(item => {
        return { id: item.id }
      })
      await projectStdCheck(this.selectedids).then(res => {
        this.$set(this.standard, {})
        this.getTableData()
        this.dialogVisible = false
        this.$message({
          showClose: true,
          message: '全部审核成功',
          type: 'success'
        })
      })
    },
    // 分页，每页数目改变
    handleSizeChange (val) {
      this.queryParams.limit = val
      this.getTableData()
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
