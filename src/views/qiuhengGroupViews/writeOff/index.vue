<template>
  <div class="app-container">
    <!-- 主干由卡片构成 -->
    <el-card class="box-card">
      <el-container direction="horizontal">
        <el-container>
          <el-header>
            <!-- 查询表单 -->
            <el-form
              v-model="searchForm"
              label-width="80px"
              label-position="right"
            >
              <el-row>
                <el-col :span="4">
                  <el-form-item label="业务单号:">
                    <el-input
                      v-model="searchForm.orderNo"
                      type="text"
                      placeholder="输入业务单号查询"
                      autocomplete="false"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-form-item label="状态">
                    <el-select
                      v-model="searchForm.state"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="state in StatusOptions"
                        :key="state.key"
                        :value="state.key"
                        :label="state.display_name"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="1">
                  <el-form-item label-width="40px">
                    <el-button
                      type="primary"
                      size="small"
                      @click="onSearch()"
                    >查询</el-button>
                  </el-form-item>
                </el-col>

              </el-row>
            </el-form>
          </el-header>

          <el-header style="height: 40px;">
            <el-form>
              <el-row>
                <el-col :span="1">
                  <el-form-item label="">
                    <el-button
                      type="primary"
                      size="small"
                      @click="doReceive()"
                    >接 收</el-button>
                  </el-form-item>
                </el-col>
                <el-col
                  :span="1"
                  style="padding-left:10px"
                >
                  <el-form-item label="">
                    <el-button
                      type="primary"
                      size="small"
                      @click="doSendBack()"
                    >退 回</el-button>
                  </el-form-item>
                </el-col>
                <el-col
                  :span="11"
                  style="padding-left:82px"
                >
                  <el-form-item label="">
                    <el-button
                      style="background-color: #F56C6C; color: #FFFFFF"
                      size="small"
                      @click="doDelete()"
                    >删 除</el-button>
                  </el-form-item>
                </el-col>
                <!-- 分页 -->
                <el-col :span="1">
                  <el-form-item
                    label=""
                    label-width="120px"
                  >
                    <el-pagination
                      :current-page="currentPage"
                      :page-sizes="[5, 10, 15]"
                      :page-size="pageSize"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="tableData.length"
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-header>

          <el-table
            style="width: 100%; margin-top:30px;"
            border
            :data="currentData"
            stripe
            tooltip-effect="dark"
            :cell-style="rowClass"
            :header-cell-style="headClass"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              align="center"
            />
            <el-table-column
              label="序号"
              width="80px"
              align="center"
            >
              <!-- 自动生成序号 -->
              <template slot-scope="scope">
                <span>{{ (currentPage-1)*pageSize + scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="状态"
              width="140px"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.state }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="no"
              label="业务单号"
              width="220px"
              align="center"
            />
            <el-table-column
              prop="date"
              label="编制日期"
              width="180px"
              align="center"
            />
            <el-table-column
              prop="reason"
              label="退票原因"
              width="340px"
              align="center"
            />
            <el-table-column
              prop="author"
              label="经办人"
              width="120px"
              align="center"
            />
            <el-table-column
              label="操作"
              width="340px"
              align="center"
            >
              <!-- 获取整行数据 -->
              <template slot-scope="scope">
                <i
                  class="el-icon-tickets"
                  style="padding: 10px;"
                  @click="onDetailsBtn(scope.row)"
                />
                <i
                  class="el-icon-success"
                  style="padding: 10px"
                />

              </template>
            </el-table-column>
          </el-table>
          <!-- dialog -->
          <el-dialog
            :visible.sync="dialogVisible"
            :show-close="true"
            title="票据审验详情"
            class="header-title"
            width="60%"
            top="5vh"
          >
            <dialog-info
              :info="billInfo"
              @closeMoule="closeMoule"
            />

          </el-dialog>
        </el-container>
      </el-container>
    </el-card>
  </div>
</template>

<script>
// 引入核销票据详细信息的Dialog
import InfoDialog from './billInfo'

// 引入api
import { receive, sendBack } from '@/api/qiuhengGroupApi/writeOff/writeOff'

export default {
  components: {
    'dialog-info': InfoDialog
  },
  data () {
    return {
      status: '',
      fileList: [],
      // 记录选中的行
      // 上述为前端测试数据
      currentPage: 1, // 初始页
      pageSize: 10, // 分页大小
      currentData: [],
      tempData: [],
      tableData: [],
      searchDate: [],
      // dialog显示
      dialogVisible: false,
      // 状态下拉列表
      StatusOptions: [
        { key: '0', display_name: '全部' },
        { key: '1', display_name: '已审验' },
        { key: '2', display_name: '未审验' }
      ],
      // 搜索表单
      searchForm: {
        orderNo: '',
        state: ''
      },
      // 这里单位号是要获取的Dialog
      fAgenName: '同福客栈',
      fAgenIdCode: 1,
      multipleSelection: [], // 这里用multipleSelection存储勾选的数据

      // 传给BillInfo数据
      billInfo: {
        fAgenName: '',
        fAgenIdCode: '',
        date: '',
        author: '',
        fNo: '',
        state: ''
      },
      // 记录正在操作的业务行
      optRow: ''
    }
  },
  created () {
    this.searchForm.state = this.StatusOptions[0].key
  },
  methods: {
    // 样式函数
    rowClass () {
      return 'text-align: center;'
    },

    headClass () {
      return 'text-align: center; background-color: #EEF5FD'
    },

    // 分页
    handleSizeChange (val) {
      this.pageSize = val
      this.currentPage = 1
      this.setPageData()
    },

    handleCurrentChange (val) {
      this.currentPage = val
      this.setPageData()
    },

    setPageData () {
      this.currentData = []
      this.tempData = this.tableData
      // this.currentData = this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
      this.currentData = this.tempData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    },

    setSearchPageData () {
      this.currentData = []
      this.tempData = this.searchDate
      // this.currentData = this.searchDate.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
      this.currentData = this.tempData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
      this.searchDate = []
    },

    // 点击勾选，并保存勾选内容
    handleSelectionChange: function (row) {
      // 记录 Table 中的选择内容
      this.multipleSelection = row
    },

    onSearch () {
      // 提交查询表单信息
      // 由前端进行搜索并实现分页
      if (this.tableData.length === 0) {
        // 判断未空，则不做操作
        alert('请先接收核销请求')
      } else if (this.searchForm.orderNo === '') {
        if (this.searchForm.state === '0') {
          this.setPageData()
        } else {
          if (this.searchForm.state === '1') {
            for (let i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].state === '已审验') {
                this.searchDate.push(this.tableData[i])
              }
            }
            this.setSearchPageData()
          }
          if (this.searchForm.state === '2') {
            for (let i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].state === '未审验') {
                this.searchDate.push(this.tableData[i])
              }
            }
            this.setSearchPageData()
          }
        }
      } else if (this.searchForm.orderNo !== '') {
        let flag = false
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].no === this.searchForm.orderNo) {
            if (this.searchForm.state === '0') {
              this.currentData = this.tableData.slice(i, i + 1)
            } else {
              if (this.searchForm.state === '1') {
                if (this.tableData[i].state === '已审验') {
                  this.currentData = this.tableData.slice(i, i + 1)
                } else {
                  this.currentData = []
                  alert('未找到符合条件的业务')
                }
              }
              if (this.searchForm.state === '2') {
                if (this.tableData[i].state === '未审验') {
                  this.currentData = this.tableData.slice(i, i + 1)
                } else {
                  this.currentData = []
                  alert('未找到符合条件的业务')
                }
              }
            }
            flag = true
            break
          }
        }
        if (!flag) {
          alert('搜索失败，请输入正确的业务单号')
        }
      }
      // 尚需完善
    },
    async onDetailsBtn (row) {
      // 点击打开Dialog
      this.dialogVisible = true
      // 单位ID, 申请单位， 审验时间， 备注 ， 编制人， 编制日期， 前端在获取的时候保存， 后端只要通过单号获取详细信息
      // 获取核销单位信息
      this.billInfo.fAgenName = this.fAgenName
      this.billInfo.fAgenIdCode = this.fAgenIdCode
      this.billInfo.date = row.date
      this.billInfo.author = row.author
      this.billInfo.fNo = row.no
      this.billInfo.state = row.state
      this.$root.eventBus.$emit('billNo', this.billInfo.fNo)
      this.optRow = row
    },
    closeMoule (e) {
      // 点击关闭的callback事件 e的值为false，这里直接赋值为false
      // row.state = "已审验"
      if (e === 'true') {
        this.optRow.state = '已审验'
        this.optRow = ''
      }
      this.dialogVisible = false
    },
    async doReceive () {
      // 接收核销请求
      const params = {
        fAgenIdCode: this.fAgenIdCode
      }
      const res = await receive(params)
      this.tableData = res.data
      this.setPageData()
    },
    async doSendBack () {
      // 退回核销请求
      if (this.multipleSelection.length !== 0) {
        const params = this.multipleSelection
        this.doDelete()
        await sendBack(params)
        this.setPageData()
      } else {
        alert('请选择需要退回的业务单号')
      }
    },
    doManualImport () {
      // 手工导入核销
      // 直接导入，这里做文件导入格式类型判断
    },
    doDelete () {
      // 删除核销请求
      // 获取要删除的票据单号或者核销的业务单号
      // 直接进行删除，刷新UI
      if (this.multipleSelection.length !== 0) {
        this.multipleSelection.forEach((item) => {
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].no === item.no) {
              this.tableData.splice(i, 1)
              break
            }
          }
        })
        this.multipleSelection = []
        this.setPageData()
      } else {
        alert('请选择需要删除的业务单号')
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.header-title {
  color: blue;
}
</style>
