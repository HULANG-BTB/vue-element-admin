<template>
  <div>
    <el-form label-width="120px" :inline="true" class="form" @keyup.enter.native="handleSearch">
      <el-form-item hide-required-asterisk="true" label="票据池编码：">
        <el-input v-model="billTypeCode" size="small" placeholder="请输入票据编码" maxlength="8" clearable class="input" />
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-search" type="primary" @click="query">搜索</el-button>
        <el-button icon="el-icon-refresh" type="default" size="small" @click="billTypeCode = ''">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10">
      <el-col :span="1.5" :push="2">
        <el-button type="primary" icon="el-icon-circle-plus" size="mini" @click="createDialogVisible = true">新增票据池</el-button>
      </el-col>
      <el-col :span="1.5" :push="2">
        <el-button type="success" icon="el-icon-refresh" size="mini" @click="query">刷新</el-button>
      </el-col>
    </el-row>

    <el-dialog
      title="新增票据池"
      :visible.sync="createDialogVisible"
      width="28%"
      center
    >
      <el-form :model="createPoolData" class="divForm">
        <el-form-item
          label="票据池代码"
          :label-width="formLabelWidth"
          class="divForm"
        >
          <el-input
            v-model="createPoolData.billTypeCode"
            size="small"
            autocomplete="off"
            maxlength="8"
            minlength="8"
          />
        </el-form-item>
        <el-form-item label="票据池预警数量" :label-width="formLabelWidth">
          <el-input
            v-model="createPoolData.minNumber"
            size="small"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="每次推送数量" :label-width="formLabelWidth">
          <el-input
            v-model="createPoolData.pushNumber"
            size="small"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="操作人" :label-width="formLabelWidth">
          <el-input
            v-model="createPoolData.operator"
            size="small"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="操作人ID" :label-width="formLabelWidth">
          <el-input
            v-model="createPoolData.operatorID"
            size="small"
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="createDialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" :loading="createLoading" @click="createPool">创建</el-button>
      </div>
    </el-dialog>

    <!-- <el-form
      ref="form"
      :model="form"
      label-width="120px"
      :inline="true"
    > -->

    <!-- 设置票据池 -->
    <el-dialog
      title="票据池设置"
      :visible.sync="editDialogVisible"
      width="30%"
      center
    >
      <el-form :model="poolData" class="divForm">
        <el-form-item
          label="票据池代码"
          :label-width="formLabelWidth"
          class="divForm"
        >
          <el-input
            v-model="editPoolData.billTypeCode"
            size="small"
            autocomplete="off"
            :readonly="true"
            maxlength="8"
            minlength="8"
          />
        </el-form-item>
        <el-form-item label="票据池预警数量" :label-width="formLabelWidth">
          <el-input
            v-model="editPoolData.minNumber"
            size="small"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="单次推送数量" :label-width="formLabelWidth">
          <el-input
            v-model="editPoolData.pushNumber"
            size="small"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="操作人" :label-width="formLabelWidth">
          <el-input
            v-model="editPoolData.operator"
            size="small"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="操作人ID" :label-width="formLabelWidth">
          <el-input
            v-model="editPoolData.operatorID"
            size="small"
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="editPool">确认</el-button>
      </div>
    </el-dialog>
    <div>
      <h2 style="margin-left: 100px">票据池信息</h2>
      <!-- :data="poolData.slice((currentPage-1)*pageSize,currentPage*pageSize)" -->
      <el-table
        v-show="poolDataVisible"
        highlight-current-row
        height="500"
        :data="poolData"
        :border="true"
        :default-sort="{prop:'billTypeCode',order:'ascending'}"
        @current-change="handleCurrentChange"
      >
        <el-table-column
          prop="billTypeCode"
          label="票据编码"
          width="200"
          sortable
        />
        <el-table-column prop="minNumber" label="票据池预警数量" width="200" />
        <el-table-column prop="pushNumber" label="每次推送数量" width="200" />

        <el-table-column
          label="是否可用"
          width="200"
        >
          <!-- 数据的遍历  scope.row就代表数据的每一个对象-->
          <template slot-scope="scope">
            <el-tag v-if="scope.row.enable==1" type="" size="small">可用</el-tag>
            <el-tag v-else type="danger" size="small">不可用</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="  操作" width="200">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="callEditDialog(scope.row, scope.$index)"
            >编辑</el-button>

            <el-button
              v-if="scope.row.enable==1"
              type="danger"
              size="mini"
              @click="deletePool(scope.row)"
            >删除</el-button>

            <el-button
              v-if="scope.row.enable==0"
              type="success"
              size="mini"
              @click="enablePool(scope.row)"
            >启用</el-button>

          </template>
        </el-table-column>
        <!-- <el-table-column:label="是否可用" /></el-table> -->
      </el-table></div>
  </div>
</template>

<script>
import { querySource, addSource, batchQuerySource, setSource, deleteSource } from '@/api/pool'
export default {
  name: 'PoolSetting',
  data () {
    return {
      currentPage: 1, // 默认显示页面为1
      pagesize: 5, //    每页的数据条数
      tableData: [],

      poolDataVisible: false,
      dialogFormVisible: false,
      createDialogVisible: false,
      editDialogVisible: false,

      createLoading: false,
      formLabelWidth: '120px',
      billTypeCode: '',
      editIndex: '',
      // 查找获得的票据池数据信息
      poolData: [
        {
          billTypeCode: '',
          enable: '',
          pushNumber: '',
          minNumber: ''
          // alterCode: 1
        }
      ],
      // 创建票据池数据
      createPoolData: {
        alterCode: 1,
        pushNumber: '',
        minNumber: '',
        operator: '',
        operatorID: '',
        billTypeCode: '',
        enable: 1,
        success: true,
        message: ''
      },
      editPoolData: {
        alterCode: 2,
        pushNumber: '',
        minNumber: '',
        operator: '',
        operatorID: '',
        billTypeCode: '',
        enable: 1,
        success: true,
        message: ''
      }
    }
  },
  // 页面加载时执行
  created () {
    this.query()
  },
  methods: {
    getList () {
      // 获取数据
      return this.poolData
    },
    handleSizeChange: function (size) {
      this.pagesize = size
    },
    // 点击第几页
    handleCurrentChange: function (currentPage) {
      if (!isNaN(currentPage)) {
        this.currentPage = currentPage
      }
    },
    // 创建票据池
    createPool () {
      this.$confirm('此操作将创建新的票据池, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 表单验证
        if (this.createPoolData.billTypeCode.length === 0 ||
            this.createPoolData.minNumber.length === 0 ||
            this.createPoolData.pushNumber.length === 0 ||
            this.createPoolData.operator.length === 0 ||
            this.createPoolData.operatorID.length === 0) {
          this.$message.error('数据不能为空')
        } else if (this.createPoolData.billTypeCode.length !== 8) {
          this.$message.error('请正确输入8位票据池代码')
        } else {
          // 发送后端请求
          this.createLoading = true
          addSource(this.createPoolData).then(res => {
            this.createPoolData.success = res.success
            this.createPoolData.message = res.message
            if (this.createPoolData.success === true) {
              this.$message({
                message: this.createPoolData.message,
                type: 'success'
              })
            } else {
              this.$message({
                message: this.code.encodeMessage,
                type: 'warning'
              })
            }
            this.createDialogVisible = false
            this.createLoading = false
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消创建'
        })
      })
    },
    // 包含精确查询和查询所有，根据票据编码有无查询
    query () {
      if (this.billTypeCode.length === 0) {
        batchQuerySource().then(res => {
          this.poolData = res.data
        })
      } else if (this.billTypeCode.length !== 8) {
        // 票据代码长度错误
        this.$message.error('请正确输入8位票据池代码')
        this.billTypeCode = ''
      } else {
        // 根据票据代码查询票据池
        const billcode = {
          billTypeCode: this.billTypeCode
        }
        // this.poolData = null
        // 精确查询
        querySource(billcode).then(res => {
          const data = res.data
          this.poolData = []
          // this.poolData[0] = res.data
          this.poolData[0] = data
        })
      }
      this.poolDataVisible = true
      this.tableData = this.poolData
    },
    callEditDialog (rowData, index) {
      // 唤起设置票据池界面，需要在此时就传入设置的票据池信息
      this.editDialogVisible = true
      this.editPoolData.billTypeCode = rowData.billTypeCode
      this.editPoolData.minNumber = rowData.minNumber
      this.editPoolData.pushNumber = rowData.pushNumber
      // this.data = rowData.enable
      this.editPoolData.enable = rowData.enable
      this.editIndex = index
    },
    editPool () {
      // 编辑票据池
      setSource(this.editPoolData).then(res => {
        this.editPoolData.success = res.success
        this.editPoolData.message = res.message
        if (this.editPoolData.success === true) {
          this.$message({
            message: '编辑成功',
            type: 'success'
          })
          this.query()
        } else {
          this.$message({
            message: '编辑失败',
            type: 'warning'
          })
        }
      })
      this.poolData[this.editIndex] = this.editPoolData
      this.editDialogVisible = false
    },
    deletePool (rowData) {
      // 删除票据池
      this.$confirm('此操作将使该票据池不可用, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.editPoolData.billTypeCode = rowData.billTypeCode
          this.editPoolData.minNumber = rowData.minNumber
          this.editPoolData.pushNumber = rowData.pushNumber
          this.data = rowData.enable
          this.editPoolData.enable = 0
          deleteSource(this.editPoolData).then(res => {
            if (res.success === true) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.query()
            } else {
              this.$message.error('删除失败')
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    enablePool (rowData) {
      // 启用票据池
      this.$confirm('此操作将启用该票据池, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.editPoolData.billTypeCode = rowData.billTypeCode
          this.editPoolData.minNumber = rowData.minNumber
          this.editPoolData.pushNumber = rowData.pushNumber
          this.data = rowData.enable
          this.editPoolData.enable = 1
          deleteSource(this.editPoolData).then(res => {
            if (res.success === true) {
              this.$message({
                type: 'success',
                message: '启用成功!'
              })
              this.query()
            } else {
              this.$message.error('启用失败')
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    }
  }
}
</script>

<style scoped>
.divForm {
  text-align: center;
}
.form {
  margin-top: 30px;
}
.form-item {
  margin-left: 100px;
}
.form-item-button {
  margin-left: 50px;
}
.input {
  width: 350px;
}
.container {
  margin-top: 20px;
  margin-bottom: 20px;
}
.icon {
  height: 50px;
  width: 50px;
  margin-left: 5px;
  margin-top: -5px;
}
.el-row {
  margin-bottom: 20px;
  /* &:last-child {
    margin-bottom: 0;
  } */
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.el-table {
  margin-left: 100px;
}
.el-input {
  padding-right: 30px;
  width: 200px;
}
.top-query-form {
  margin-top: 20px;
  margin-left: 20px;
}
.pagination {
  margin-left: 500px;
  /* text-align: center; */
}
</style>
