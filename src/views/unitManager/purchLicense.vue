<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true" size="small" style="margin-top:10px;">
      <el-form-item label="准购证编码" prop="keyword.crtCode">
        <el-input
          v-model="queryParams.keyword.crtCode"
          placeholder="请输入准购证编码"
          clearable
          style="width: 140px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="准购证名称" prop="keyword.crtName">
        <el-input
          v-model="queryParams.keyword.crtName"
          placeholder="请输入准购证名称"
          clearable
          style="width: 140px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属单位" prop="keyword.agenName">
        <el-select v-model="queryParams.keyword.agenName" placeholder="请选择项目用途" style="width: 150px">
          <el-option v-for="(item,index) in agenNameList" :key="index" :label="item.agenName" :value="item.agenName" />
        </el-select>
      </el-form-item>
      <el-form-item label="准购证状态">
        <el-select v-model="queryParams.keyword.isenable" placeholder="请选择项目状态" style="width: 150px">
          <el-option label="待审核" value="false" />
          <el-option label="已完成" value="true" />
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
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="handleAdd"
        >新增准购证</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="small"
          @click="handleMultDelete"
        >批量删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <!-- <el-button
          type="warning"
          icon="el-icon-check"
          size="small"
        >导入</el-button> -->
        <el-upload
          ref="upload"
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
        >
          <el-button slot="trigger" size="small" type="warning" icon="el-icon-check" @click="submitUpload">导入</el-button>
        </el-upload>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-message"
          size="small"
        >导出</el-button>
      </el-col>
    </el-row>
    <el-table :data="crtList" style="width: 100%;margin-top:30px;" border @selection-change="handleSelectionChange">
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
      <el-table-column align="center" label="准购证号" prop="crtCode" />
      <el-table-column align="center" label="准购证名称" prop="crtName" :show-overflow-tooltip="true" />
      <el-table-column align="center" label="所属单位" prop="agenName" />
      <el-table-column align="center" label="经办人" prop="operator" />

      <el-table-column align="center" label="办证日期" prop="createTime">
        <template slot-scope="scope">
          {{ parseTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="220">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
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

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'准购证变动':'新增准购证'">
      <el-form ref="crt" :model="crt" :rules="rules" label-width="80px" label-position="right" style="padding-right:20px;">
        <el-row :gutter="20">
          <el-form-item label="准购证名称" :label-width="formLabelWidth" prop="crtName">
            <el-input v-model="crt.crtName" placeholder="准购证名称" />
          </el-form-item>
          <el-form-item label="所属单位" :label-width="formLabelWidth" prop="agenName" @change="changed">
            <el-select v-model="crt.agenName">
              <el-option v-for="(item,index) in agenNameList" :key="index" :label="item.agenName" :value="item.agenName" />
            </el-select>
          </el-form-item>
          <el-form-item label="办证日期" :label-width="formLabelWidth" prop="issuedate">
            <el-date-picker v-model="crt.issuedate" type="date" placeholder="选择日期" style="width: 100%;" />
          </el-form-item>
          <el-form-item label="备注" :label-width="formLabelWidth">
            <el-input v-model="crt.note" placeholder="备注" />
          </el-form-item>
          <el-form-item label="单位法人证号" :label-width="formLabelWidth" prop="legalno">
            <el-input v-model="crt.legalno" placeholder="单位法人证号" />
          </el-form-item>
          <el-form-item label="收费许可证号" :label-width="formLabelWidth" prop="chargno">
            <el-input v-model="crt.chargno" placeholder="收费许可证号" />
          </el-form-item>
          <el-form-item label="罚没许可证号" :label-width="formLabelWidth" prop="fineno">
            <el-input v-model="crt.fineno" placeholder="罚没许可证号" />
          </el-form-item>
          <el-form-item label="收费委托书号" :label-width="formLabelWidth" prop="proxyno">
            <el-input v-model="crt.proxyno" placeholder="收费委托书号" />
          </el-form-item>
        </el-row>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirmCrt">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCrtListByPage, deleteCrt, deleteCrtBatch, addCrt, updateCrt, getAgenName } from '@/api/purchLicense'
import { parseTime } from '@/utils/index'
import { validateDatePicker } from '@/utils/validate'
// , addCrt, updateCrt, deleteCrt, deleteCrtBatch,getCrtListByPage,
const defaultUser = {
  isEnable: '',
  itemCode: '',
  itemName: '',
  itemEffdate: '',
  itemExpdate: '',
  fundsnatureCode: ''
}

export default {
  data () {
    return {
    //   loading: true,
      queryParams: { // 查询参数
        page: 1,
        limit: 10,
        keyword: {
          crtName: '',
          agenName: '',
          crtCode: '',
          isenable: ''
        }
        // total: 0
      },
      crtList: [
      ],
      crt: {
        note: '',
        logicDelete: false,
        address: '',
        finmgr: '',
        crtCode: '',
        agenCode: '',
        crtName: '',
        linkmanTel: '',
        legalno: '',
        updateTime: 0,
        issuedate: '',
        version: 0,
        linkman: '',
        operator: '',
        fineno: '',
        createTime: 0,
        proxyno: '',
        agenName: '',
        operatorId: 0,
        chargno: ''
      },
      agenNameList: [],
      dialogVisible: false,
      dialogType: 'new',
      formLabelWidth: '120px',
      selectedList: [],
      // multiple: true, // 非多个禁用
      // pagesize: 5,
      // currpage: 1,
      fileList: [],
      rules: {
        crtName: [
          { required: true, message: '准购证名称不能为空', trigger: 'blur' }
        ],
        agenName: [
          { required: true, message: '所属单位不能为空', trigger: 'blur' }
        ],
        legalno: [
          { required: true, message: '单位法人证号不能为空', trigger: 'blur' }
        ],
        chargno: [
          { required: true, message: '收费许可证号不能为空', trigger: 'blur' }
        ],
        fineno: [
          { required: true, message: '罚没许可证号不能为空', trigger: 'blur' }
        ],
        issuedate: [
          { trigger: 'blur', validator: validateDatePicker }
        ],
        proxyno: [
          { required: true, message: '收费委托书号不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getTableData()
    this.getAgenNames()
  },
  methods: {
    // 格式化时间
    parseTime (time) {
      return parseTime(new Date())
    },
    // 获取资源列表
    async getTableData () {
      this.loading = true
      const res = await getCrtListByPage(this.queryParams)
      this.crtList = res.data.items
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
    // 获取id
    changed (val) {
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
      this.queryParams = {
        page: 1,
        limit: 10,
        keyword: {
          crtName: '',
          agenName: '',
          crtCode: '',
          isenable: ''
        }
      }
      this.getTableData()
    },
    // 上传下载
    submitUpload () {
      this.$refs.upload.submit()
    },
    handleRemove (file, fileList) {
      // console.log(file, fileList)
    },
    handlePreview (file) {
      // console.log(file)
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.selectedList = selection
    },
    // 新增按钮
    handleAdd () {
      this.user = Object.assign({}, defaultUser)
      this.dialogType !== 'edit'
      this.dialogVisible = true
    },
    // 编辑按钮
    handleEdit (rowData) {
      this.dialogVisible = true
      this.dialogType = 'edit'
      this.crt = Object.assign({}, rowData)
      // const { data } = await getOtherItem(rowData.id) // 模态框中需要的其他接口
      // this.project.roles = data
    },
    // 删除按钮
    handleDelete (deleData) {
      this.$confirm('此操作将永久删除准购证, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        deleteCrt(deleData.id)
          .then((res) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getTableData()
          })
          // eslint-disable-next-line handle-callback-err
          .catch((err) => {
            this.$message({
              type: 'error',
              message: '删除失败!'
            })
          })
      })
    },
    // 批量删除
    async handleMultDelete () {
      this.$confirm('此操作将永久删除选中准购证, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.selectedids = this.selectedList.map(item => {
          return { id: item.id }
        })
        deleteCrtBatch(this.selectedids).then((res) => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getTableData()
        })
      })
    },
    // 模态框提交
    async confirmCrt () {
      this.$refs['crt'].validate(async (valid) => {
        if (valid) {
          console.log(this.crt)
          if (this.dialogType !== 'edit') { // 新增
            await addCrt(this.crt).then(res => {
              this.$set(this.crt, {})
              this.getTableData()
              this.dialogVisible = false
              this.$message({
                showClose: true,
                message: '添加成功',
                type: 'success'
              })
            })
          } else { // 编辑
            await updateCrt(this.crt).then(res => {
              this.getTableData()
              this.dialogVisible = false
              if (res.code === 10000) {
                this.$message({
                  showClose: true,
                  message: '编辑成功',
                  type: 'success'
                })
              } else {
                this.$message({
                  showClose: true,
                  message: '编辑失败',
                  type: 'error'
                }) // 或者弹出后台返回错误
              }
            })
          }
        }
      })
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

    // 当前页码改变
    handleCurrentChange (val) {
      this.queryParams.page = val
      this.getTableData()
    },

    // 获取单位信息列表
    async getAgenNames () {
      this.loading = true
      const res = await getAgenName()
      this.agenNameList = res.data
      this.loading = false
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
  .customWidth{
    width:80%;
  }
}
</style>
