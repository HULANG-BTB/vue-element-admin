<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form
        :model="query"
        :inline="true"
        class="demo-form-inline"
        label-width="110px"
        label-position="right"
      >
        <el-form-item label="查询模板文件:">
          <el-input
            v-model="template.billCode"
            placeholder="输入票据代码(不含年度)"
            clearable
            size="small"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="template.name"
            placeholder="输入模板名称"
            clearable
            size="small"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="handleSearch"
          >查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            icon="el-icon-refresh"
            size="small"
            @click="handleReset"
          >重置</el-button>
        </el-form-item>
      </el-form>
      <el-row>
        <el-button
          type="primary"
          icon="el-icon-circle-plus-outline"
          size="small"
          @click="handleShowFile"
        >添加模板</el-button>
        <el-button
          type="danger"
          :disabled="deleteBatchDisable"
          icon="el-icon-delete"
          size="small"
          @click="handleDeleteBatch"
        >批量删除</el-button>
      </el-row>

    </el-card>

    <el-card class="box-card">
      <el-table
        v-loading.body="loading"
        :data="templateTableData"
        style="width: 100%; text-align: center"
        border
        @selection-change="handleOnSelectChange"
      >
        <el-table-column
          type="selection"
          align="center"
          width="60"
        />
        <el-table-column
          align="center"
          label="模板ID"
          width="70"
        >
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          label="票据代码"
          width="80"
        >
          <template slot-scope="scope">
            {{ scope.row.rgnCode + scope.row.typeId + scope.row.sortId }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="模板名称"
        >
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          label="备注"
        >
          <template slot-scope="scope">{{ scope.row.memo }}</template>
        </el-table-column>
        <el-table-column
          fixed="right"
          align="center"
          label="操作"
          width="220"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleUpdateTemplateDialog(scope.row)"
            >编辑</el-button>
            <el-button
              type="primary"
              size="small"
              @click="handleShowTemplate(scope.row.id)"
            >查看</el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(scope)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

<<<<<<< HEAD
    <!-- 分页 -->
    <el-pagination
      layout="prev, pager, next, sizes, total, jumper"
      style="text-align: right"
      :page-size="query.pageSize"
      :total="query.total"
      :current-page="query.currentPage"
      :page-sizes="[2, 5, 10, 20, 50, 100, 500, 1000]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 在页面下方显示具体模板内容 -->
=======
    <el-card class="box-card">
      <el-pagination
        layout="prev, pager, next, sizes, total, jumper"
        align="right"
        :page-size="query.pageSize"
        :total="query.total"
        :current-page="query.currentPage"
        :page-sizes="[2, 5, 10, 20, 50, 100, 500, 1000]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>

>>>>>>> 5a0304584f918d42096b53ef98b7cb07e57b7c14
    <el-card>
      <div
        id="container"
        style="width: 100%;margin: auto;"
      />
    </el-card>
    <!-- 显示模板信息 -->
    <el-dialog
      title="编辑模板信息"
      :visible.sync="dialogVisible"
      :before-close="handleUpdateDialogClose"
      width="500px"
    >
      <el-form
        id="editTemplate"
        label-width="150px"
      >
        <el-form-item label="票据代码:">
          <el-input
            v-model="billCode"
            placeholder="例:011602"
            clearable
            :disabled="true"
            size="small"
            class="input-width"
          />
        </el-form-item>
        <el-form-item label="备注:">
          <el-input
            v-model="memo"
            placeholder="备注"
            clearable
            size="small"
            class="input-width"
          />
        </el-form-item>
        <el-form-item label="模板名称:">
          <el-input
            v-model="templateName"
            placeholder="非税票据"
            clearable
            size="small"
            class="input-width"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="small"
            @click="handleUpdateTemplate"
          >修改</el-button>
          <el-button
            type="primary"
            size="small"
            :disabled="setDefault"
            @click="handleSetDefaultTemplate"
          >设为默认模板</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 上传模板文件 -->
    <el-dialog
      title="添加模板文件"
      :visible.sync="dialogAddFile"
      width="500px"
    >
      <el-form
        id="uploadTemplateFile"
        label-width="150px"
      >
        <el-form-item label="票据代码:">
          <el-input
            v-model="billCode"
            placeholder="例:011602"
            clearable
            size="small"
            class="input-width"
          />
        </el-form-item>
        <el-form-item label="备注:">
          <el-input
            v-model="memo"
            placeholder="备注"
            clearable
            size="small"
            class="input-width"
          />
        </el-form-item>
        <el-form-item label="模板名称:">
          <el-input
            v-model="templateName"
            placeholder="非税票据"
            clearable
            size="small"
            class="input-width"
          />
        </el-form-item>
        <el-form-item label="ftl 或 xlsx 文件:">
          <input
            id="uploadFileName"
            type="file"
            @change="getFile($event)"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="small"
            @click="submitAddFile"
          >上传</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getTemplateListByPage,
  getTemplate,
  searchList,
  deleteTemplate,
  deleteTemplateBatch,
  uploadTemplate,
  uploadExcel,
  setDefaultTemplate,
  isDefault,
  updateTemplate
} from '@/api/template'

export default {
  name: 'ShowTemplate',
  data () {
    return {
      id: '',
      billCode: '',
      memo: '',
      templateName: '',
      loading: false,
      selectedList: '',
      dialogVisible: false,
      dialogAddFile: false,
      setDefault: true,
      templateTableData: '',
      addArr: [],
      contents: '',
      query: {
        currentPage: 1,
        pageSize: 5,
        total: 15
      },
      template: {
        billCode: '',
        name: ''
      }
    }
  },
  computed: {
    /**
     * 复选框数量等于0，将批量删除按钮的可点击属性置为false，否则置为true
     */
    deleteBatchDisable () {
      return this.selectedList.length === 0
    }
  },
  created () {
    this.getTableData()
  },
  mounted () {
  },
  methods: {
    /**
     * 获取template列表
     */
    async getTableData () {
      this.loading = true
      const res = await getTemplateListByPage(this.query)
      this.templateTableData = res.data.records
      this.query.total = res.data.total
      this.query.pageSize = res.data.size
      this.query.currentPage = res.data.current
      this.selectedList = []
      this.loading = false
    },

    /**
     * 查询模板信息
     */
    async handleSearch () {
      this.loading = true
      this.query.currentPage = 1
      const res = await searchList(this.template)
      this.templateTableData = res.data
      this.selectedList = []
      this.loading = false
    },

    /**
     * 重置查询信息
     */
    handleReset () {
      this.template.billCode = ''
      this.template.name = ''
      this.query.currentPage = 1
      this.selectedList = []
      this.getTableData()
    },

    handleShowFile () {
      this.dialogAddFile = true
    },

    /**
     * 在页面下方展示对应的模板
     */
    handleShowTemplate (id) {
      getTemplate(id).then(res => {
        const blob = new Blob([res])
        const reader = new FileReader()
        reader.onload = function (event) {
          document.getElementById('container').innerHTML = reader.result
        }
        reader.readAsText(blob)
      })
    },

    /**
     * 弹出编辑模板信息框，并显示相关信息
     */
    handleUpdateTemplateDialog (row) {
      this.dialogVisible = true
      this.id = row.id
      this.billCode = row.rgnCode + row.typeId + row.sortId
      this.memo = row.memo
      this.templateName = row.name
      this.setDefault = true
      const data = { 'id': row.id }
      isDefault(data).then(res => {
        this.setDefault = res.data
      })
    },

    /**
     * 修改模板信息
     */
    handleUpdateTemplate () {
      const data = {
        'id': this.id,
        'memo': this.memo,
        'templateName': this.templateName
      }
      updateTemplate(data).then(res => {
        this.$message({
          type: 'success',
          message: '修改成功！'
        })
        this.dialogVisible = false
        this.getTableData()
      })
    },

    /**
     * 将模板设为默认模板
     */
    handleSetDefaultTemplate () {
      const data = { 'id': this.id }
      setDefaultTemplate(data).then(res => {
        this.$message({
          type: 'success',
          message: '成功设为默认模板'
        })
        this.setDefault = true
      })
    },

    /**
     * 关闭模板前清空模板信息
     */
    handleUpdateDialogClose () {
      this.id = ''
      this.billCode = ''
      this.templateName = ''
      this.memo = ''
      this.dialogVisible = false
    },

    /**
     * 删除单个模板文件
     */
    handleDelete (row) {
      this.$confirm('是否删除该模板文件', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(async () => {
        deleteTemplate(row.id).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getTableData()
        }).catch(err => {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
          console.log(err)
        })
      })
    },

    /**
     * 批量删除模板文件
     */
    async handleDeleteBatch () {
      this.$confirm('是否删除选中的模板文件?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(async () => {
        deleteTemplateBatch(this.selectedList).then((res) => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getTableData()
        }).catch((err) => {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
          console.log(err)
        })
      })
    },

    /**
     * 判断上传的文件类型，不符合返回-1
     */
    fileType (file) {
      const fileName = file.name
      const idx = fileName.lastIndexOf('.')
      if (idx !== -1) {
        let ext = fileName.substr(idx + 1).toUpperCase()
        ext = ext.toLowerCase()
        if (ext === 'ftl') {
          return 'ftl'
        } else if (ext === 'xlsx') {
          return 'xlsx'
        } else {
          return -1
        }
      }
    },

    getFile (event) {
      const file = event.target.files
      for (let i = 0; i < file.length; i++) {
        const type = this.fileType(file[i])
        if (type === -1) {
          this.$message({
            type: 'info',
            message: '文件类型错误'
          })
          return
        }
        this.addArr.push(file[i])
      }
    },

    submitAddFile () {
      /**
       * 添加的文件数量为0，返回提示信息
       */
      if (this.addArr.length === 0) {
        this.$message({
          type: 'info',
          message: '请选择要上传的文件'
        })
        return
      }
      /**
       * 设置传输的模板文件的信息
       * @billCode 票据代码
       * @memo 备注
       * @templateName 模板名称
       * @file 模板文件
       * @type {FormData}
       */

      const formData = new FormData()
      formData.append('billCode', this.billCode)
      formData.append('memo', this.memo)
      formData.append('templateName', this.templateName)
      formData.append('file', this.addArr[0])
      const fileType = this.fileType(this.addArr[0])
      switch (fileType) {
        case 'ftl':
          uploadTemplate(formData).then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '附件上传成功!'
              })
            }
          })
          break
        case 'xlsx':
          uploadExcel(formData).then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '附件上传成功!'
              })
            }
          })
          break
      }
      /**
       * 上传结束后将上传表单清空
       */
      document.getElementById('uploadTemplateFile').reset()
      this.addArr = []
      this.dialogAddFile = false
    },

    handleOnSelectChange (selection) {
      this.selectedList = selection
    },

    // 每页数目改变
    handleSizeChange (val) {
      this.query.pageSize = val
      this.getTableData()
    },

    // 当前页码改变
    handleCurrentChange (val) {
      this.query.currentPage = val
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
  .input-width {
    width: 280px;
  }
}
</style>
