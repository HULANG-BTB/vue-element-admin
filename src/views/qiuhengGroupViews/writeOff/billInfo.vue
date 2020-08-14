<template>
    <div>
        <span slot="header" class="dialog-header" padding="top:0px">
            <el-form :label-position="labelPosition" label-width="20px">
                <el-row>
                    <el-col :span="6" style="float:left； padding-top:0px">
                        <el-form-item><h1><b>票据审验详情</b></h1></el-form-item>
                    </el-col>

                    <el-col :span="3.5" style="float:right">
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit()">通 过</el-button>
                        </el-form-item>
                    </el-col>

                    <el-col :span="3.5" style="float:right">
                        <el-form-item>
                            <el-button @click="onCancel()" align="right">不通过</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </span>

        <el-form :label-position="labelPosition" label-width="80px" :model="form">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="单位ID">{{form.id}}</el-form-item> 
                </el-col>
                <el-col :span="5.5" style="float:right">
                    <el-form-item>
                        <el-button @click="getUnitElectronicFile()">单位电子档案</el-button>
                    </el-form-item>
                    <!-- 单位电子信息 -->
                    <el-dialog :visible.sync="unitInfoDialogVisible" :append-to-body="true">
                        <unit-dialog v-bind:unitInfo="unitInfo" />
                    </el-dialog>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <el-form-item label="申请单位" >
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12" style="float:right">
                    <el-form-item label="审验时间">
                        <el-date-picker type="date" placeholder="审验时间" v-model="form.date1" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-form-item label="备 注">
                    <el-input v-model="form.remarks" auto-complete="off"></el-input>
                </el-form-item>
            </el-row>
        </el-form>

        <div class="tableTitle"></div>

        <el-tabs type="border-card">

            <el-tab-pane label="开票总览">
                <el-table class="main-el-table" 
                stripe="true"
                :data="gridData" height="350px" 
                :cell-style="rowClass" 
                :header-cell-style="headClass">
                    <el-table-column property="date" label="序号" width="50" ></el-table-column>
                    <el-table-column property="name" label="开票单位" width="230"></el-table-column>
                    <el-table-column property="address" label="票据编码" width="180"></el-table-column>
                    <el-table-column property="address" label="票据名称" width="220"></el-table-column>
                    <el-table-column property="address" label="计量单位" width="80"></el-table-column>
                    <el-table-column property="address" label="份数" width="100"></el-table-column>
                    <el-table-column property="address" label="开票份数" width="100"></el-table-column>
                    <el-table-column property="address" label="开票金额" width="140"></el-table-column>
                    <el-table-column property="address" label="作废份数" width="100"></el-table-column>
                    <el-table-column property="address" label="操作" width="70">
                        <i class="el-icon-delete" @click="onDelete()"></i>
                    </el-table-column>
                </el-table>
            </el-tab-pane>

            <el-tab-pane label="收入情况">
                <el-table class="main-el-table"
                stripe="true"
                :data="gridData" height="350px" 
                :cell-style="rowClass" 
                :header-cell-style="headClass">
                    <el-table-column property="date" label="序号" width="50" ></el-table-column>
                    <el-table-column property="name" label="开票单位" width="230"></el-table-column>
                    <el-table-column property="address" label="收费项目编码" width="180"></el-table-column>
                    <el-table-column property="address" label="收费项目名称" width="220"></el-table-column>
                    <el-table-column property="address" label="开票金额" width="145"></el-table-column>
                    <el-table-column property="address" label="应缴金额" width="145"></el-table-column>
                    <el-table-column property="address" label="已缴金额" width="145"></el-table-column>
                    <el-table-column property="address" label="欠费金额" width="145"></el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="预警记录">
                <el-table class="main-el-table"
                stripe="true"
                :data="gridData" height="350px" 
                :cell-style="rowClass" 
                :header-cell-style="headClass">
                    <el-table-column property="date" label="序号" width="50" ></el-table-column>
                    <el-table-column property="name" label="开票单位" width="200"></el-table-column>
                    <el-table-column property="address" label="预警日期" width="140"></el-table-column>
                    <el-table-column property="address" label="发送时间" width="140"></el-table-column>
                    <el-table-column property="address" label="监控事项" width="160"></el-table-column>
                    <el-table-column property="address" label="预警内容" width="370"></el-table-column>
                    <el-table-column property="address" label="处理状态" width="100"></el-table-column>
                    <el-table-column property="address" label="查看" width="100">
                        <i class="el-icon-tickets" @click="onCheck()"></i>
                    </el-table-column>
                </el-table>
            </el-tab-pane>

            <el-tab-pane label="开票明细">
                <el-table class="main-el-table"
                stripe="true"
                :data="gridData" height="350px" 
                :cell-style="rowClass" 
                :header-cell-style="headClass">
                    <el-table-column property="date" label="序号" width="50" ></el-table-column>
                    <el-table-column property="name" label="开票单位" width="160"></el-table-column>
                    <el-table-column property="address" label="票据批次编码" width="160"></el-table-column>
                    <el-table-column property="address" label="票据批次名称" width="180"></el-table-column>
                    <el-table-column property="address" label="份数" width="80"></el-table-column>
                    <el-table-column property="address" label="起始号" width="190"></el-table-column>
                    <el-table-column property="address" label="终止号" width="190"></el-table-column>
                    <el-table-column property="address" label="开票金额" width="140"></el-table-column>
                    <el-table-column property="address" label="作废份数" width="80"></el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="作废票段号">
                <el-table class="main-el-table" 
                stripe="true"
                :data="gridData" height="350px" 
                :cell-style="rowClass" 
                :header-cell-style="headClass">
                    <el-table-column property="date" label="序号" width="50" ></el-table-column>
                    <el-table-column property="name" label="开票单位" width="200"></el-table-column>
                    <el-table-column property="address" label="票据批次编码" width="165"></el-table-column>
                    <el-table-column property="address" label="票据批次名称" width="165"></el-table-column>
                    <el-table-column property="address" label="作废份数" width="160"></el-table-column>
                    <el-table-column property="address" label="起始号" width="260"></el-table-column>
                    <el-table-column property="address" label="终止号" width="260"></el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>

        <el-footer class="dialog-footer">
            <el-form label-width="80px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="编制人: ">{{}}</el-form-item>
                    </el-col>
                   <el-col :span="6">
                        <el-form-item label="编制日期: ">{{}}</el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-footer>
    </div>
</template>

<script>

// 引入单位信息的Dialog
import UnitInfo from './unitInfo'

export default {
    props: ['closeValue'],
    components:{
        "unit-dialog" : UnitInfo
    },
    data(){
        return {
            form: {
                id: '',
                name: '',
                date1: '',
                date2: '',
                remarks: ''
            },
            gridData: [
                {
                    date: '01',
                    name: '王小虎',
                    address: '上海市'
                }, 
                {
                   date: '01',
                    name: '王小虎',
                    address: '上海市'
                }, 
                {
                   date: '01',
                    name: '王小虎',
                    address: '上海市'
                }, 
                {
                   date: '01',
                    name: '王小虎',
                    address: '上海市'
                }
            ],
            labelPosition: "right",
            unitInfoDialogVisible : false,
            unitInfo:{
                name: "111",
                no: "222"
            }
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
        onCancel() {
            this.$emit('closeMoule', 'true')
        },
        onSubmit() {
            this.$emit('closeMoule', 'true')
        },
        getUnitElectronicFile(){
            // 获得单位电子档案
            // 在生成Dialog前获取单位电子档案数据，传到子组件
            this.unitInfo.name = "shhs"
            this.unitInfo.no = 123

            // 打开子组件 UnitInfoDialog
            this.unitInfoDialogVisible = true
        },
        onDelete(){
            // 删除操作 -- 开票预览
            alert("delete")
        },
        onCheck(){
            // 查看预警信息
            alert("check")
        }
    }
}
</script>

<style scoped>

</style>