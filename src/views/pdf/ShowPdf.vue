<template>
  <div class="app-container">
    <el-form
      :model="query"
      :inline="true"
      class="demo-form-inline"
      label-width="110px"
      label-position="right"
    >
      <el-form-item label="查询模板文件:">
        <el-input
          v-model="query.keyword"
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
    <el-form
      :inline="true"
    >
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-circle-plus-outline"
          size="small"
          @click="handleShowFile"
        >添加模板</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          type="danger"
          :disabled="deleteBatchDisable"
          icon="el-icon-delete"
          size="small"
          @click="handleDeleteBatch"
        >批量删除</el-button>
      </el-form-item>
    </el-form>
    <div align="center">
      <div style="width: 650px;">
        <el-table
          v-loading.body="loading"
          :data="templateTableData"
          style="width: 100%; margin-top: 30px;"
          border
          @selection-change="handleOnSelectChange"
        >
          <el-table-column
            type="selection"
            align="center"
            width="60"
          />
          <el-table-column
            align="left"
            label="模板ID"
            width="100"
          >
            <template slot-scope="scope">{{ scope.row.id }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="模板名称"
            width="290"
          >
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="200"
          >
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="small"
                @click="handleShowTemplate(scope)"
              >查看</el-button>
              <el-button
                type="danger"
                size="small"
                @click="handleDelete(scope)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-pagination
      layout="prev, pager, next, sizes, jumper"
      :page-size="query.size"
      :total="query.total"
      :current-page="query.current"
      :page-sizes="[2, 5, 10, 20, 50, 100, 500, 1000]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-card>
      <div
        id="continer"
        style="width: 100%;margin: auto;"
      />
    </el-card>
    <!-- 显示模板信息 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :data="templateTableData"
    />
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
            placeholder="billCode"
            clearable
            size="small"
            class="input-width"
          />
        </el-form-item>
        <el-form-item label="备注:">
          <el-input
            v-model="memo"
            placeholder="memo"
            clearable
            size="small"
            class="input-width"
          />
        </el-form-item>
        <el-form-item label="模板名称:">
          <el-input
            v-model="templateName"
            placeholder="templateName"
            clearable
            size="small"
            class="input-width"
          />
        </el-form-item>
        <el-form-item>
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
  getTemplateByName,
  deleteTemplate,
  deleteTemplateBatch
  // getAllTemplate
} from '@/api/template'
import axios from 'axios'

export default {
  name: 'ShowTemplate',
  data () {
    return {
      billCode: '',
      memo: '',
      templateName: '',
      loading: false,
      selectedList: '',
      dialogVisible: false,
      dialogAddFile: false,
      templateTableData: '',
      addArr: [],
      query: {
        current: 1,
        size: 2,
        total: 15,
        keyword: ''
      }
    }
  },
  computed: {
    // 复选框数量等于0，将批量删除按钮的可点击属性置为false，否则置为true
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
      // const res = await getAllTemplate()
      this.templateTableData = res.data.records
      this.query.total = res.data.total
      this.query.size = res.data.size
      this.query.current = res.data.current
      this.selectedList = []
      this.loading = false
    },

    /**
     * 查询模板信息
     */
    handleSearch () {
      if (this.query.keyword === '') {
        this.$message({
          type: 'info',
          message: '查询内容不为空'
        })
        return
      }
      this.query.currentPage = 1
      const res = getTemplateByName(this.query.keyword)
      this.templateTableData = res.data
      this.selectedList = []
      // this.getTableData()
    },

    /**
     * 重置查询信息
     */
    handleReset () {
      this.query.keyword = ''
      this.query.currentPage = 1
      this.selectedList = []
      this.getTableData()
    },

    handleShowFile () {
      this.dialogAddFile = true
    },

    /**
     * template显示框可视化，并展示对应template
     */
    handleShow (scope) {
      this.dialogVisible = false
      document.getElementById('continer').innerHTML = scope.row.template
    },

    handleShowTemplate (scope) {
      this.dialogVisible = false
      document.getElementById('continer').innerHTML = getTemplate(scope.row.id).data
    },

    /**
     * 删除单个模板文件
     */
    handleDelete ({ $index, row }) {
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
          console.log(res)
          this.getTableData()
        }).catch(err => {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
          console.error(err)
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
          console.log(res)
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

    getFile (event) {
      const file = event.target.files
      console.log(event)
      console.log(file[0])
      for (let i = 0; i < file.length; i++) {
        // 上传类型判断
        const imgName = file[i].name
        console.log(imgName)
        const idx = imgName.lastIndexOf('.')
        if (idx !== -1) {
          let ext = imgName.substr(idx + 1).toUpperCase()
          ext = ext.toLowerCase()
          if (ext !== 'pdf' && ext !== 'ftl') {
            this.$message({
              type: 'info',
              message: '文件类型错误'
            })
            return
          } else {
            this.addArr.push(file[i])
            console.log(this.addArr[0])
          }
        } else {
          console.log(idx)
        }
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
      for (let i = 0; i < this.addArr.length; i++) {
        formData.append('file', this.addArr[i])
      }
      console.log(this.addArr[0].name)
      axios.post('http://pro.beanbang.cn:8080/printTemplate/uploadTemplate', formData)
        .then((res) => {
          if (res.data.success) {
            this.$message({
              type: 'success',
              message: '附件上传成功!'
            })
          }
        })
      /**
       * 上传结束后将上传表单清空
       */
      document.getElementById('uploadTemplateFile').reset()
      this.dialogAddFile = false
    },

    handleOnSelectChange (selection) {
      this.selectedList = selection
    },

    // 每页数目改变
    handleSizeChange (val) {
      this.query.size = val
      this.getTableData()
    },

    // 当前页码改变
    handleCurrentChange (val) {
      this.query.current = val
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
