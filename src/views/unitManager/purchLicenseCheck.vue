<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true" size="small" style="margin-top:10px;">
      <el-form-item label="准购证编码" prop="keyword.crtCode">
        <el-input
          v-model="queryParams.keyword.crtCode"
          placeholder="请输入准购证编码"
          clearable
          style="width: 140px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="准购证名称" prop="keyword.crtName">
        <el-input
          v-model="queryParams.keyword.crtName"
          placeholder="请输入准购证"
          clearable
          style="width: 140px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属单位" prop="keyword.agenName">
        <el-select v-model="queryParams.keyword.agenName" placeholder="请选择项目用途" style="width: 150px">
          <el-option v-for="(item,index) in agenNameList" :key="index" :label="item.agenName" :value="item.agenName" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          size="small"
          @click="handleMultCheck"
        >批量审核</el-button>
      </el-col>
    </el-row>

    <el-table :data="crtList" style="width: 100%;margin-top:30px;" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column align="center" label="状态" prop="isenable">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isenable ? 'success' : 'info'"
            disable-transitions
          >{{ scope.row.isenable ? '已完成' : '待审核' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="准购证号" prop="crtCode" />
      <el-table-column align="center" label="准购证名称" prop="crtName" :show-overflow-tooltip="true" />
      <el-table-column align="center" label="所属单位" prop="agenName" />
      <el-table-column align="center" label="经办人" prop="operator" />
      <el-table-column align="center" label="办证日期" prop="createTime">
        <template slot-scope="scope">
          {{ parseTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="220">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="handleLook(scope.row)">查看</el-button>
          <el-button type="primary" size="mini" @click="handleCheck(scope.row)">审核</el-button>
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

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'准购证信息':'新增项目'">
      <el-form ref="crt" :disabled="true" :model="crt" :rules="rules" label-width="80px" label-position="right" style="padding-right:25px;">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="准购证号" :label-width="formLabelWidth" prop="crtCode">
              <el-input v-model="crt.crtCode" placeholder="准购证号" />
            </el-form-item>
            <el-form-item label="联系地址" :label-width="formLabelWidth" prop="address">
              <el-input v-model="crt.address" placeholder="联系地址" />
            </el-form-item>
            <el-form-item label="经办ID" :label-width="formLabelWidth" prop="operatorId">
              <el-input v-model="crt.operatorId" placeholder="经办ID" />
            </el-form-item>
            <el-form-item label="单位法人证号" :label-width="formLabelWidth" prop="legalno">
              <el-input v-model="crt.legalno" placeholder="单位法人证号" />
            </el-form-item>
            <el-form-item label="收费许可证号" :label-width="formLabelWidth" prop="chargno">
              <el-input v-model="crt.chargno" placeholder="收费许可证号" />
            </el-form-item>
            <el-form-item label="财务负责人" :label-width="formLabelWidth" prop="finmgr">
              <el-input v-model="crt.finmgr" placeholder="财务负责人" />
            </el-form-item>
            <el-form-item label="单位编码" :label-width="formLabelWidth" prop="agenCode">
              <el-input v-model="crt.agenCode" placeholder="单位编码" />
            </el-form-item>
            <el-form-item label="单位负责人" :label-width="formLabelWidth" prop="linkman">
              <el-input v-model="crt.linkman" placeholder="单位负责人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="准购证名称" :label-width="formLabelWidth" prop="crtName">
              <el-input v-model="crt.crtName" placeholder="准购证名称" />
            </el-form-item>
            <el-form-item label="办证日期" :label-width="formLabelWidth">
              <!-- <el-input v-model="project.itemExpdate" placeholder="失效日期" /> -->
              <el-date-picker v-model="crt.issuedate" type="date" placeholder="选择日期" style="width: 100%;" />
            </el-form-item>
            <el-form-item label="经办人" :label-width="formLabelWidth" prop="operator">
              <el-input v-model="crt.operator" placeholder="经办人" />
            </el-form-item>
            <el-form-item label="罚没许可证号" :label-width="formLabelWidth" prop="fineno">
              <el-input v-model="crt.proxyno" placeholder="罚没许可证号" />
            </el-form-item>
            <el-form-item label="收费委托书号" :label-width="formLabelWidth" prop="proxyno">
              <el-input v-model="crt.proxyno" placeholder="收费委托书号" />
            </el-form-item>
            <el-form-item label="备注" :label-width="formLabelWidth" prop="note">
              <el-input v-model="crt.note" placeholder="备注" />
            </el-form-item>
            <el-form-item label="单位名称" :label-width="formLabelWidth" prop="agenName">
              <el-input v-model="crt.agenName" placeholder="单位名称" />
            </el-form-item>
            <el-form-item label="单位负责人电话" :label-width="formLabelWidth" prop="linkmanTel">
              <el-input v-model="crt.linkmanTel" placeholder="单位负责人电话" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="text-align:right;">
        <el-button type="primary" @click="cancel">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { checkCrtListByPage, getCrtById, checkBatch, updateCrt, getAgenName } from '@/api/base/unitManager/purchLicense'
// , updateCrt, checkBatch
import { parseTime } from '@/utils/index'
export default {
  data () {
    return {
    //   loading: true,
      queryParams: { // 查询参数
        page: 1,
        limit: 10,
        keyword: {
          crtName: '',
          agenName: '',
          crtCode: ''
        }
      },
      crtList: [],
      crt: {},
      dialogVisible: false,
      dialogType: 'new',
      formLabelWidth: '120px',
      fileList: [],
      selectedList: [],
      agenNameList: [],
      rules: {
      }
    }
  },
  created () {
    this.getTableData()
    this.getAgenNames()
  },
  methods: {
    // 格式化时间
    parseTime (time) {
      return parseTime(new Date())
    },
    async getAgenNames () {
      this.loading = true
      const res = await getAgenName()
      this.agenNameList = res.data
      this.loading = false
    },
    // 获取单位信息
    async getCrtMessage (id) {
      this.loading = true
      const res = await getCrtById(id)
      this.crt = res.data
      this.loading = false
    },
    // 获取资源列表
    async getTableData () {
      this.loading = true
      const res = await checkCrtListByPage(this.queryParams)
      this.crtList = res.data.items
      this.queryParams.total = res.data.total
      this.queryParams.limit = res.data.limit
      this.queryParams.page = res.data.page
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
      this.queryParams = {
        page: 1,
        limit: 10,
        keyword: {
          crtName: '',
          agenName: '',
          crtCode: '',
          isenable: ''
        }
      }
      this.getTableData()
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.selectedList = selection
    },
    // 批量审核
    handleMultCheck () {
      this.$confirm('审核选中的准购证, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.selectedids = this.selectedList.map(item => {
          return { id: item.id }
        })
        checkBatch(this.selectedids).then((res) => {
          this.$message({
            type: 'success',
            message: '审核成功!'
          })
          this.getTableData()
        })
      })
    },
    // 审核按钮
    async handleCheck (rowData) {
      this.loading = true
      const data = {
        id: rowData.id,
        isenable: true
      }
      await updateCrt(data).then(res => {
        this.getTableData()
        this.dialogVisible = false
        this.$message({
          showClose: true,
          message: '审核成功',
          type: 'success'
        })
      })
      this.loading = false
    },
    // 查看按钮
    handleLook (rowData) {
      this.dialogVisible = true
      this.dialogType = 'edit'
      // this.project = Object.assign({}, rowData)
      this.getCrtMessage(rowData.id)
    },
    // 模态框取消
    cancel () {
      this.dialogVisible = false
      this.resetForm('project')
    },
    // 分页
    handleCurrentChange (cpage) {
      // userList.slice((currpage - 1) * pagesize, currpage * pagesize)
      this.currpage = cpage
    },
    handleSizeChange (psize) {
      this.pagesize = psize
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
