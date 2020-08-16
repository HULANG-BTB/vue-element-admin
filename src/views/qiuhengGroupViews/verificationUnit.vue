<template>
  <div class="app-container">
    <el-card>
      <el-row
        :gutter="20"
        class="query-area"
      >
        <el-col :span="5">
          <span>业务单号</span>
          <el-input
            v-model="queryInfo.no"
            style="width: 65%;"
            placeholder="请输入业务单号"
            size="small"
            clearable
            @clear="clearSearch"
          />
        </el-col>
        <el-col :span="10">
          <span>编制日期</span>
          <el-date-picker
            v-model="rangeDate"
            size="small"
            type="daterange"
            range-separator="至"
            start-placeholder="输入编制日期查询"
            end-placeholder="输入编制日期查询"
            :picker-options="pickerOptions"
            unlink-panels
            @change="changeDateRange"
          />
        </el-col>
        <el-col
          :span="2"
          :offset="1.5"
        >
          <el-button
            type="primary"
            size="small"
            @click="query"
          >查询</el-button>
        </el-col>
      </el-row>
      <div class="main-area">
        <el-row>
          <el-col :span="6">
            <el-button
              type="primary"
              size="small"
              @click="add"
            >新增</el-button>
            <el-button
              type="primary"
              size="small"
              @click="upload"
            >上报</el-button>
            <el-button
              type="primary"
              size="small"
            >撤销</el-button>
          </el-col>
          <el-col
            :span="9"
            :offset="9"
          >
            <!-- 分页区域 -->
            <el-pagination
              :current-page="queryInfo.pageNum"
              :page-sizes="[10, 15, 20, 30, 50]"
              :page-size="queryInfo.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="writeOffApply.total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </el-col>
        </el-row>
        <el-table
          :data="writeOffApply.list"
          :header-cell-style="{'text-align':'center', 'background-color':'#EEF5FD'}"
          :cell-style="{'text-align':'center'}"
          stripe
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" />
          <el-table-column
            label="序号"
            type="index"
            :index="table_index"
            width="60"
          />
          <el-table-column
            label="状态"
            prop="fChangeState"
          />
          <el-table-column
            label="业务单号"
            prop="fNo"
          />
          <el-table-column
            label="日期"
            prop="fDate"
          />
          <el-table-column
            label="合计份数"
            prop="fNumber"
          />
          <el-table-column
            label="金额"
            prop="fTotalAmt"
          />
          <el-table-column
            label="备注"
            prop="fMemo"
          />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-tooltip
                content="查看并修改信息"
                placement="top"
                :enterable="false"
              >
                <el-button
                  icon="el-icon-notebook-2"
                  size="small"
                  @click="edit"
                />
              </el-tooltip>
              <el-tooltip
                content="删除"
                placement="top"
                :enterable="false"
              >
                <el-button
                  icon="el-icon-error"
                  size="small"
                  @click="del(scope.row)"
                />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <bill-dialog
      v-if="dialogVisible"
      :dialog-visible="dialogVisible"
      :is-new="isNew"
    />

  </div>
</template>

<script>
import { getApplyList, deleteApply, uploadApply } from '@/api/qiuhengGroupApi/wirteoffunit'
import BillVerificationInfo from './billVerificationInfo'
export default {
  components: {
    'bill-dialog': BillVerificationInfo
  },
  data () {
    return {
      // 查询信息
      queryInfo: {
        // 单位识别码，登录时应该保存，在这里读取
        agenIdCode: '1',
        no: '',
        startDate: null,
        endDate: null,
        pageNum: 1,
        pageSize: 10
      },
      rangeDate: [],
      // 限定时间选择不超过今天
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      writeOffApply: {
        // 数据列表
        list: [],
        // 数据总数
        total: 0
      },
      // 是否显示
      dialogVisible: false,
      // 是否为新增
      isNew: false,
      // 选中的数据
      multipleSelection: []
    }
  },
  created () {
    this.getWriteOffApplyList()
  },
  methods: {
    async getWriteOffApplyList () {
      // 获取数据
      const { data: res } = await getApplyList(this.queryInfo)

      this.writeOffApply.list = res.records
      this.writeOffApply.total = res.total

      this.writeOffApply.list.forEach(item => {
        const date = new Date()
        date.setTime(item.fDate)
        item.fDate = date.toLocaleDateString()
      })
    },
    query () {
      if (this.rangeDate.length !== 0) {
        this.queryInfo.startDate = this.rangeDate[0].toLocaleDateString()
        // 由于传到后端的数据为当日0时，所以查不到结束日期当天的数据，为此将日期多加一天以达到要求
        // 创建date对象的目的是不修改日期范围选择器中的范围
        const date = new Date()
        date.setTime(this.rangeDate[1].getTime())
        date.setDate(date.getDate() + 1)
        this.queryInfo.endDate = date.toLocaleDateString()
      }
      this.getWriteOffApplyList()
    },
    // 监听 pagesize 改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getWriteOffApplyList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      this.getWriteOffApplyList()
    },
    // 翻页序号连续
    table_index (index) {
      return (this.queryInfo.pageNum - 1) * this.queryInfo.pageSize + index + 1
    },
    // 清空搜索区
    clearSearch () {
      this.getWriteOffApplyList()
    },
    // 监听日期选择的变化
    changeDateRange () {
      if (this.rangeDate === null) {
        this.queryInfo.startDate = null
        this.queryInfo.endDate = null
        this.clearSearch()
      }
    },
    // 新增申请对话框显示
    add () {
      this.dialogVisible = true
      this.isNew = true
    },
    // 修改申请对话框显示
    edit () {
      this.dialogVisible = true
      this.isNew = false
    },
    // 关闭对话框
    close () {
      this.dialogVisible = false
    },
    // 删除申请
    del (row) {
      this.$confirm('此操作将永久删除该核销申请, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        if (row.fIsUpload !== '已上报') {
          deleteApply(row.fNo)
            .then((res) => {
              if (res.status === 200) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.getWriteOffApplyList()
              } else {
                this.$message({
                  type: 'error',
                  message: '删除失败!'
                })
              }
            })
            .catch((err) => {
              this.$message({
                type: 'error',
                message: '删除失败!'
              })
              console.error(err)
            })
        } else {
          this.$message({
            type: 'info',
            message: '已上报的申请不可删除!'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 处理多选框
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 上报申请
    upload () {
      try {
        const list = []
        this.multipleSelection.forEach(item => {
          if (item.fIsUpload === '已上报') {
            this.$message({
              type: 'warning',
              message: '选中的申请中存在已经上报的申请'
            })
            throw new Error('hasUploadApply')
          }
          list.push(item.fNo)
        })
        console.log(list)
        uploadApply(list)
          .then((res) => {
            if (res.status === 200) {
              this.$message({
                type: 'success',
                message: '上报成功!'
              })
              this.getWriteOffApplyList()
            } else {
              this.$message({
                type: 'error',
                message: '上报失败!'
              })
            }
          })
          .catch((err) => {
            this.$message({
              type: 'error',
              message: '上报失败!'
            })
            console.error(err)
          })
      } catch (e) {
        if (e.message !== 'hasUploadApply') console.error(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .el-card {
    .query-area {
      margin-bottom: 5px;
    }
    .main-area {
      margin-top: 20px;
    }
    .el-col {
      text-align: center;
      span,
      .el-input,
      .el-date-editor {
        margin-left: 5px;
      }
      .el-button {
        margin-left: 30px;
      }
    }
    .el-table {
      margin-top: 10px;
      .el-button {
        border: none;
        background-color: transparent;
        padding-top: 0;
        padding-bottom: 0;
        font-size: 18.5px;
      }
    }
  }
}
</style>

<style lang="scss">
body .el-table th.gutter {
  display: table-cell !important;
}
</style>

