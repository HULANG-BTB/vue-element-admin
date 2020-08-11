<template>
    <div class="app-container">
        <!-- 主干由卡片构成 -->
        <el-card class="box-card">
            <el-container direction="horizontal">
                <el-container>
                    <el-header>
                    <!-- 查询表单 -->
                        <el-form>
                            <el-row>
                                <el-col :span="4">
                                    <el-form-item label="业务单号:" label-width="80px">
                                        <el-input type="text" placeholder="输入业务单号查询" autocomplete="false"></el-input>
                                    </el-form-item>
                                </el-col>
                                
                                <el-col :span="4">
                                    <el-form-item label="编制日期:" label-width="120px">
                                        <el-input type="text" placeholder="输入日期查询" autocomplete="false"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="3">
                                    <el-form-item label="至" label-width="40px">
                                        <el-input type="text" placeholder="输入日期查询" autocomplete="false"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    <el-form-item label="状态" label-width="80px">
                                        <el-select v-model="status" placeholder="请选择">
                                            <el-option label="已审验" value="yes"></el-option>
                                            <el-option label="未审验" value="no"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2">
                                    <el-form-item label="" label-width="40px">
                                        <el-button type="primary" style="width: 100%;" @click="onSubmit()">查询</el-button>
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
                                        <el-button type="primary" @click="addButton()">接 收</el-button>    
                                    </el-form-item>
                                </el-col >
                                <el-col :span="1" style="padding-left:10px">
                                    <el-form-item label="">                                       
                                        <el-button type="primary">退 回</el-button>
                                    </el-form-item>
                                </el-col >
                                <el-col :span="1" style="padding-left:20px">
                                    <el-form-item label="">
                                        <el-upload 
                                        action=""
                                        :file-list="fileList">
                                            <el-button type="primary">手工导入核销</el-button>     
                                        </el-upload>   
                                    </el-form-item>
                                </el-col>
                                <el-col :span="11" style="padding-left:82px">
                                    <el-form-item label="">
                                        <el-button type="primary">删 除</el-button>                  
                                    </el-form-item>
                                </el-col>
                                <el-col :span="1">
                                    <el-form-item label="" label-width="120px">
                                        <el-pagination
                                            @size-change="handleSizeChange"
                                            @current-change="handleCurrentChange"
                                            :current-page="currentPage"
                                            :page-sizes="[10, 20]"
                                            :page-size="100"
                                            layout="total, sizes, prev, pager, next, jumper"
                                            :total="multipleSelection.length">
                                        </el-pagination>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </el-header>
                    
                    <el-table :data="tableData" 
                        stripe="true"
                        tooltip-effect="dark" 
                        :cell-style="rowClass" 
                        :header-cell-style="headClass"
                        @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55" align="center"></el-table-column>  
                        <el-table-column prop="id" label="序号" width="120" align="center"></el-table-column>
                        <el-table-column prop="state" label="状态" width="160" align="center"></el-table-column>
                        <el-table-column prop="no" label="业务单号" width="200" align="center"></el-table-column>
                        <el-table-column prop="date" label="编制日期" width="200" align="center"></el-table-column>
                        <el-table-column prop="reason" label="退票原因" width="320" align="center"></el-table-column>
                        <el-table-column prop="author" label="经办人" width="120" align="center"></el-table-column>
                        <el-table-column label="操作" width="400" align="center">
                            <i class="el-icon-tickets" style="padding: 10px;" @click="testBtn()"></i>
                            <i class="el-icon-success" style="padding: 10px"></i>
                        </el-table-column>
                    </el-table>
                    <!-- dialog -->
                    <el-dialog :visible.sync="dialogVisible" :show-close="true" width="70%" top="5vh">
                        <dialog-info :closeValue="false" @closeMoule="closeMoule"></dialog-info>
                    </el-dialog>
                </el-container>
            </el-container>
        </el-card>
    </div>
</template>

<script>
import InfoDialog from './billInfo'

export default {
    components: {
       "dialog-info" : InfoDialog
    },
    data() {
        const item = {
            id: '1',
            state: '未审验',
            no: '00001',
            date: '2020-8-5',
            reason: '没啥原因',
            author: '王某人'    
        };
        return {
            status: "",
            fileList: [],
            tableData : [],
            searchForm : {
                number : "",
                startDate: "",
                endDate: ""
            },
            // 记录选中的行
            currentPage : 1, // 初始页
            pageSize: 10, // 分页大小
            multipleSelection: Array(20).fill(item), //这里用multipleSelection存储数据
            tableData : [],
            // dialog显示
            dialogVisible : false,
        }
    },
    methods: {
        // 样式函数
        rowClass(){
            return "text-align: center;";
        },
        headClass(){
            return "text-align: center;";
        },

        // 功能函数
        handleSelectionChange: function(val) {
            // 记录 Table 中的选择内容
            this.multipleSelection = val;
        },
        handleSizeChange(val) {
            // 直接选择跳转的页面
            this.pageSize = val
            console.log(`每页 ${val} 条`);
            this.tableData = this.multipleSelection.slice((this.currentPage-1) * this.pageSize, this.currentPage * this.pageSize);
        },
        handleCurrentChange(val) {
            // 跳转到输入的界面
            this.currentPage = val
            console.log(`当前页: ${val}`);
            this.tableData = this.multipleSelection.slice((this.currentPage-1) * this.pageSize, this.currentPage * this.pageSize);
        },

        testBtn() {
            // 点击打开Dialog
            this.dialogVisible = true
        },
        closeMoule(e) {
            // 点击关闭的callback事件
            // e为值
            this.dialogVisible = false
        },
        
        doSearch: function(){
            // 查询核销信息

        },
        doReceive: function(){
            // 接收核销请求

        },
        doReturn: function(){
            // 退回核销请求

        },
        doManualImport: function(){
            // 手工导入核销

        },
        doDelete: function(){
            // 删除核销请求

        }

    },
    created(){
        this.tableData = this.multipleSelection.slice((this.currentPage-1) * this.pageSize, this.currentPage * this.pageSize);
    }
}
</script>

<style lang="scss" scoped>

</style>