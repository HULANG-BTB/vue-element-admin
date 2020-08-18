<template>
  <div class="app-container">
    <!-- 主干由卡片构成 -->
    <el-card class="box-card">
      <el-container direction="horizontal">
        <el-container>
          <el-header>
            <!-- 查询表单 -->
            <el-form v-model="searchForm">
              <el-row>
                <el-col :span="4">
                  <el-form-item
                    label="业务单号:"
                    label-width="80px"
                  >
                    <el-input
                      type="text"
                      v-model="searchForm.orderNo"
                      placeholder="输入业务单号查询"
                      autocomplete="false"
                    ></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="7">
                  <el-form-item
                    label="编制日期:"
                    label-width="120px"
                  >
                    <!-- <el-input type="text" v-model="searchForm.startDate" placeholder="输入日期查询" autocomplete="false"></el-input> -->
                    <el-date-picker
                      v-model="searchForm.date"
                      type="daterange"
                      value-format="yyyy-MM-dd"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>

                <el-col :span="4">
                  <el-form-item
                    label="状态"
                    label-width="80px"
                  >
                    <el-select
                      placeholder="请选择"
                      v-model="searchForm.state"
                    >
                      <el-option
                        v-for="state in StatusOptions"
                        :key="state.key"
                        :value="state.key"
                        :label="state.display_name"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item
                    label=""
                    label-width="40px"
                  >
                    <el-button
                      type="primary"
                      style="width: 100%;"
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
                      @click="doSendBack()"
                    >退 回</el-button>
                  </el-form-item>
                </el-col>
                <el-col
                  :span="1"
                  style="padding-left:20px"
                >
                  <el-form-item label="">
                    <el-upload
                      action=""
                      :file-list="fileList"
                    >
                      <el-button type="primary">手工导入核销</el-button>
                    </el-upload>
                  </el-form-item>
                </el-col>
                <el-col
                  :span="11"
                  style="padding-left:82px"
                >
                  <el-form-item label="">
                    <el-button
                      type="primary"
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
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page="currentPage"
                      :page-sizes="[5, 10, 15]"
                      :page-size="pageSize"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="tableData.length"
                    >
                    </el-pagination>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-header>

          <el-table
            :data="currentData"
            stripe
            tooltip-effect="dark"
            :cell-style="rowClass"
            :header-cell-style="headClass"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="55"
              align="center"
            ></el-table-column>
            <el-table-column
              label="序号"
              width="120"
              align="center"
            >
              <!-- 自动生成序号 -->
              <template slot-scope="scope">
                <span>{{(currentPage-1)*pageSize + scope.$index + 1}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="状态"
              width="160"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{scope.row.state}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="no"
              label="业务单号"
              width="200"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="date"
              label="编制日期"
              width="200"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="reason"
              label="退票原因"
              width="320"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="author"
              label="经办人"
              width="120"
              align="center"
            ></el-table-column>
            <el-table-column
              label="操作"
              width="400"
              align="center"
            >
              <!-- 获取整行数据 -->
              <template slot-scope="scope">
                <i
                  class="el-icon-tickets"
                  style="padding: 10px;"
                  @click="onDetailsBtn(scope.row)"
                ></i>
                <i
                  class="el-icon-success"
                  style="padding: 10px"
                ></i>

              </template>
            </el-table-column>
          </el-table>
          <!-- dialog -->
          <el-dialog
            :visible.sync="dialogVisible"
            :show-close="true"
            width="70%"
            top="5vh"
          >
            <dialog-info
              @closeMoule="closeMoule"
              v-bind:billInfo="billInfo"
            ></dialog-info>

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
import { receive, sendBack, getDetails, setResult, search } from '@/api/qiuhengGroupApi/writeOff/writeOff'
 
export default {
    components: {
       "dialog-info" : InfoDialog
    },
    data() {


        return {
            status: "",
            fileList: [],
            // 记录选中的行
            // 上述为前端测试数据
            currentPage : 1, // 初始页
            pageSize: 10, // 分页大小
            currentData : [],
            tableData : [],
            // dialog显示
            dialogVisible : false,
            // 状态下拉列表 
            StatusOptions : [
            {key: '0', display_name : "全部"},
            {key: '1', display_name : "已审验"},
            {key: '2', display_name : "未审验"}
            ],
            // 搜索表单
            searchForm : {
                orderNo : '',
                date: '',
                state: ''
            },
            // 这里单位号是要获取的Dialog
            fAgenName : "同福客栈",
            fAgenIdCode : 1,
            multipleSelection: [], //这里用multipleSelection存储勾选的数据
            
            // 传给BillInfo数据
            billInfo : {
                fAgenName: "",
                fAgenIdCode: "",
                date: "",
                author: "",
            }
        }
    },
    created () {
        this.searchForm.state = this.StatusOptions[0].key
    },
    methods: {
        // 样式函数
        rowClass(){
            return "text-align: center;";
        },
        headClass(){
            return "text-align: center;";
        },

        // 分页
        handleSizeChange(val){
            this.pageSize = val
            this.currentPage = 1
            this.setPageData()
        },
        handleCurrentChange(val){
            this.currentPage = val
            this.setPageSize()
        },
        setPageData(){
            this.currentData = [],
            this.currentData = this.tableData.slice((this.currentPage-1)*this.pageSize, this.currentPage*this.pageSize)
        },
        
        // 点击勾选，并保存勾选内容
        handleSelectionChange: function(row) {
            // 记录 Table 中的选择内容
            this.multipleSelection = row;
        },

        onSearch() {
            // 提交查询表单信息
            // 有前端进行搜索并实现分页
            if (this.tableData.length === 0 ){
                // 判断未空，则不做操作
            } else if (this.searchForm.orderNo === "" && this.searchForm.date === "") {
                this.setPageData();
            } else if (this.searchForm.orderNo != "" && this.searchForm.date === ""){
                for(let i=0; i<this.tableData.length; i++){
                    if(this.tableData[i].no === this.searchForm.orderNo){
                        this.currentData = this.tableData.slice(i, i+1)
                        break;
                    }
                }
            } else if (this.searchForm.orderNo === ""  && this.searchForm.date[0] != "" && this.searchForm.date[1] != ""){
                let startIndex = 0
                let endIndex = 0
                alert(this.searchForm.date[0]+","+this.searchForm.date[1])
                alert(this.tableData[0].date)
                for (let i=0; i<this.tableData.length; i++){
                    if(this.tableData[i].date>=this.searchForm.date[0]){
                        startIndex = i;
                        break;
                    }
                }
                for (let i=this.tableData.length-1; i>=0; i--){
                    if(this.tableData[i].date<=this.searchForm.date[1]){
                        endIndex = i;
                        break;
                    }
                }
                alert(startIndex+","+endIndex)
                if (startIndex > endIndex){
                    this.currentData = []
                }else {
                    this.currentData = this.tableData.slice(startIndex, endIndex+1)
                }
            }
             // 尚需完善   
        },
        async onDetailsBtn(row) {
            // 点击打开Dialog
            this.dialogVisible = true
            // 单位ID, 申请单位， 审验时间， 备注 ， 编制人， 编制日期， 前端在获取的时候保存， 后端只要通过单号获取详细信息
            // 获取核销单位信息
            this.billInfo.fAgenName = this.fAgenName
            this.billInfo.fAgenIdCode = this.fAgenIdCode
            this.billInfo.date = row.date
            this.billInfo.author = row.author
            // 查询核销信息
            let params = {
                // 单位ID
                fAgenIdCode : this.fAgenIdCode,
                // 业务单号
                fNo : row.no
            }
            const res = await getDetails(params)
            // ### 将 res 存入一个对象中 prop 方法传给billInfo.vue
            // row.state = "已审验"
        },
        closeMoule(e) {
            // 点击关闭的callback事件 e的值为false，这里直接赋值为false
            this.dialogVisible = false
        },
        async doReceive(){
            var that = this
            // 接收核销请求
            let params = {
                fAgenIdCode : this.fAgenIdCode
            }
            const res = await receive(params)
            // ### 将数据存在 multipleSelection 再去做分页
            this.tableData = res;
            this.setPageData()
        },
        async doSendBack(){
            // 退回核销请求
            let params = this.multipleSelection
            this.doDelete()
            const res = await sendBack(params)
            this.setPageData()
        },
        doManualImport(){
            // 手工导入核销
            // 直接导入，这里做文件导入格式类型判断
        },
        doDelete(){
            // 删除核销请求
            // 获取要删除的票据单号或者核销的业务单号
            // 直接进行删除，刷新UI
            this.multipleSelection.forEach ((item) => {
                for (let i=0; i<this.tableData.length; i++){
                    if (this.tableData[i].no === item.no){
                        this.tableData.splice(i, 1)
                        break
                    }
                }
            })
            this.multipleSelection = []
            this.setPageData()
        }
    },

}
</script>

<style lang="scss" scoped>
</style>
