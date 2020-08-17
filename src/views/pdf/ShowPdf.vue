<template>
  <div class="app-container">
    <el-form
      :model="query"
      :inline="true"
      class="demo-form-inline"
    >
      <el-form-item label="查询PDF文件:">
        <el-input
          v-model="query.keyword"
          placeholder="输入PDF名称"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          icon="el-icon-search"
          size="small"
          @click="handleSearch"
        >查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          :disabled="deleteBatchDisable"
          icon="el-icon-delete"
          size="small"
          @click="handleDeleteBatch"
        >批量删除</el-button>
      </el-form-item>
    </el-form>

    <el-pagination
      layout="prev, pager, next, sizes, total, jumper"
      :page-size="query.pageSize"
      :total="query.currentTotal"
      :current-page="query.currentPage"
      :page-sizes="[10, 20, 50, 100, 500, 1000]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-table
      v-loading.body="loading"
      :data="pdfTableData"
      style="width: 100%; margin-top: 30px;"
      border
      @selection-change="handleOnSelectChange"
    >
      <el-table-column
        type="selection"
        align="center"
        width="55px"
      />
      <el-table-column
        align="left"
        label="PDF-ID"
        width="100"
      >
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="PDF名称"
        width="280"
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
            size="mini"
            @click="handleShow(scope)"
          >查看</el-button>
          <el-button
            type="danger"
            size="mini"
            @click="handleDelete(scope)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 显示pdf信息 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :data="pdfTableData"
    >
      <template slot-scope="scope">
        <pdf
          :src="src"
          :page="query.currentPage"
          @loaded="handleLoadPdf(scope)"
        />
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPdfListByPage,
  deletePdf,
  deletePdfBatch
} from '@/api/pdf'
import pdf from 'vue-pdf'

export default {
  name: 'ShowPdf',
  components: {
    pdf
  },
  data () {
    return {
      pdf: {
        billCode: '',
        serialCode: ''
      },
      src: '',
      loading: false,
      selectedList: [],
      dialogVisible: false,
      pdfTableData: '',
      query: {
        currentPage: 1,
        pageSize: 10,
        currentTotal: 0,
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
    // this.src = pdf.createLoadingTask(this.src)
  },
  mounted () {
    this.src = 'http://123.206.126.23:8080/pdf/output/011602010000000021.pdf'
  },
  methods: {
    // 获取pdf列表
    async getTableData () {
      this.loading = true
      const res = await getPdfListByPage(this.query)
      this.pdfTableData = res.data.items
      this.query.currentTotal = res.data.currentTotal
      this.query.pageSize = res.data.pageSize
      this.query.currentPage = res.data.currentPage
      this.selectedList = []
      this.loading = false
    },

    handleSearch () {
      this.query.currentPage = 1
      this.getTableData()
    },

    // pdf显示框可视化，并展示对应pdf
    handleShow (scope) {
      this.dialogVisible = true
      this.src = 'http://123.206.126.23:8080/pdf/output/' + scope.row.name + '.pdf'
      // 解决跨域问题
      this.src = pdf.createLoadingTask(this.src)
    },

    // 删除单个pdf文件
    handleDelete ({ $index, row }) {
      this.$confirm('是否删除该PDF文件', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(async () => {
        deletePdf(row.id).then(res => {
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

    // 批量删除pdf文件
    async handleDeleteBatch () {
      this.$confirm('是否删除选中的PDF文件?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(async () => {
        deletePdfBatch(this.selectedList).then((res) => {
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

    handleLoadPdf (scope) {
      console.log('hasLoaded')
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
}
</style>
