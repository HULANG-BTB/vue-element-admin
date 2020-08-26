<template>
  <div class="app-container">
    <el-form
      ref="queryForm"
      :model="queryParams"
      :inline="true"
      size="small"
      style="margin-top:10px;"
    >
      <el-row
        :gutter="10"
        class="mb8"
      >
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="small"
            @click="handleAdd"
          >新增开票点</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            @click="handleMultDelete"
          >批量删除</el-button>
        </el-col>
      </el-row>

      <el-table
        :data="unitPlaceList"
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
          label="状态"
          prop="isenable"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.isenable ? 'success' : 'info'"
              disable-transitions
            >{{ scope.row.isenable ? '启用' : '未启用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="开票点编码"
          prop="placeId"
        />
        <el-table-column
          align="center"
          label="开票点名称"
          prop="placeName"
        />
        <el-table-column
          align="center"
          label="级次"
          prop="level"
        />
        <el-table-column
          align="center"
          label="经办人"
          prop="operator"
        />
        <el-table-column
          align="center"
          label="创建日期"
          prop="createTime"
        >
          <template slot-scope="scope">
            {{ parseTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="最后修改时间"
          prop="updateTime"
        ><template slot-scope="scope">
          {{ parseTime(scope.row.updateTime) }}
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
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
            >修改</el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="handleDelete(scope)"
            >删除</el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="管理"
          width="100"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.isenable"
              type="danger"
              size="mini"
              @click="handleDisable(scope)"
            >禁用</el-button>
            <el-button
              v-else
              type="success"
              size="mini"
              @click="handleEnable(scope)"
            >启用</el-button>
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

    </el-form>
    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType==='edit'?'修改开票点':'新增开票点'"
      @close="cancel"
    >
      <el-form
        ref="UnitPlace"
        :model="UnitPlace"
        label-width="100px"
        label-position="right"
        :rules="placeRules"
        style="padding-right:25px;"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="区划id"
              prop="rgnId"
            >
              <el-input
                v-model="UnitPlace.rgnId"
                placeholder="区划id"
                readonly
              />
            </el-form-item>
            <el-form-item
              label="开票点名称"
              prop="placeName"
            >
              <el-input
                v-model="UnitPlace.placeName"
                placeholder="开票点名称"
              />
            </el-form-item>
            <el-form-item
              label="级次"
              prop="level"
            >
              <el-input
                v-model="UnitPlace.level"
                placeholder="级次"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="开票点编码"
              prop="placeId"
            >
              <el-input
                v-model="UnitPlace.placeId"
                placeholder="开票点编码"
                readonly
              />
            </el-form-item>
            <el-form-item
              label="助记码"
              prop="mmen"
            >
              <el-input
                v-model="UnitPlace.mmen"
                placeholder="助记码"
              />
            </el-form-item>
            <el-form-item
              label="备注"
              prop="note"
            >
              <el-input
                v-model="UnitPlace.note"
                placeholder="备注"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="text-align:right;">
        <el-button
          type="danger"
          @click="cancel"
        >取消</el-button>
        <el-button
          type="primary"
          @click="confirmRole"
        >确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addUnitPlace, getunitPlaceListByPage, updateUnitPlace, deleteUnitPlace, deleteUnitPlaceBatch } from '@/api/base/unitManager/unitPlaceManager'
import { getByAgenCode } from '@/api/base/unitManager/unitManager'
import { parseTime } from '@/utils/index'

const defaultUnitPlace = {
  agenId: '',
  rgnId: '',
  placeId: '',
  placeName: '',
  mmen: '',
  level: '',
  isenable: 0,
  note: ''
}

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
      unitPlaceList: [],
      UnitPlace: {
        rgnId: '',
        placeId: '',
        placeName: '',
        agenId: '',
        mmen: '',
        level: ''
      },
      dialogVisible: false,
      dialogType: 'new',
      formLabelWidth: '80px',
      fileList: [],
      unit: {
        note: '',
        finMgr: '',
        linkTel: '',
        linkMan: '',
        expDate: '',
        effDate: '',
        addr: '',
        finMgrTel: '',
        zip: '',
        level: '',
        agenCode: '',
        indCode: '',
        sortCode: '',
        agenName: '',
        mnem: '',
        deptCode: '',
        findeptId: '',
        deptName: ''
      },
      placeRules: {
        placeName: [
          { required: true, message: '开票点名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    // 获取资源列表
    async getTableData () {
      this.loading = true
      const res = await getunitPlaceListByPage(this.queryParams)
      this.unitPlaceList = res.data.items
      this.queryParams.total = res.data.total
      this.queryParams.limit = res.data.limit
      this.queryParams.page = res.data.page
      const val = await getByAgenCode({ agenCode: this.queryParams.keyword })
      this.unit = val.data
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
    // 上传下载
    submitUpload () {
      this.$refs.upload.submit()
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.selectedList = selection
    },
    // 新增按钮
    handleAdd () {
      this.UnitPlace = Object.assign({}, defaultUnitPlace)
      this.dialogType = 'new'
      this.dialogVisible = true
      const val = parseInt(this.queryParams.total) + 1
      this.UnitPlace.placeId = this.unit.agenCode + val
      this.UnitPlace.rgnId = this.unit.rgnId
      this.UnitPlace.level = this.unit.level
      this.UnitPlace.agenId = this.unit.agenCode
    },
    // 编辑按钮
    handleEdit (rowData) {
      this.dialogVisible = true
      this.dialogType = 'edit'
      this.UnitPlace = Object.assign({}, rowData)
    },
    handleDisable (rowData) {
      this.$confirm('是否禁用开票点？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        rowData.row.isenable = 0
        updateUnitPlace(rowData.row).then(res => {
          this.getTableData()
          if (res.code === 10000) {
            // this.$set(this.project, {})
            this.$message({
              showClose: true,
              message: '禁用成功',
              type: 'success'
            })
          } else {
            this.$message({
              showClose: true,
              message: '禁用失败',
              type: 'error'
            }) // 或者弹出后台返回错误
          }
        })
      })
    },
    handleEnable (rowData) {
      this.$confirm('是否启用开票点？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        rowData.row.isenable = 1
        updateUnitPlace(rowData.row).then(res => {
          this.getTableData()
          if (res.code === 10000) {
            // this.$set(this.project, {})
            this.$message({
              showClose: true,
              message: '启用成功',
              type: 'success'
            })
          } else {
            this.$message({
              showClose: true,
              message: '启用失败',
              type: 'error'
            }) // 或者弹出后台返回错误
          }
        })
      })
    },
    // 删除按钮
    handleDelete ({ $index, row }) {
      this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        deleteUnitPlace(row.id)
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
    // 批量删除
    async handleMultDelete () {
      this.$confirm('此操作将永久删除选中项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        deleteUnitPlaceBatch(this.selectedList).then((res) => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getTableData()
        })
      })
    },
    // 模态框提交
    async confirmRole () {
      this.$refs['UnitPlace'].validate(async (valid) => {
        if (valid) {
          if (this.dialogType !== 'edit') { // 新增
            await addUnitPlace(this.UnitPlace).then(res => {
              if (res.code === 10000) {
                this.$set(this.UnitPlace, {})
                this.getTableData() // 重新渲染数据列表
                this.dialogVisible = false // 关闭模态框
                // this.msgSuccess(res.message)
                this.$message({
                  showClose: true,
                  message: '添加成功',
                  type: 'success'
                })
              } else {
                this.$message({
                  showClose: true,
                  message: '添加失败',
                  type: 'error'
                }) // 或者弹出后台返回错误
              }
            })
          } else { // 变动
            await updateUnitPlace(this.UnitPlace).then(res => {
              this.getTableData()
              this.dialogVisible = false
              if (res.code === 10000) {
                // this.$set(this.project, {})
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
