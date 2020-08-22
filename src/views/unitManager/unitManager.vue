<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true" size="small" style="margin-top:10px;">
      <el-form-item label="单位名称" prop="keyword.agenName">
        <el-input v-model="queryParams.keyword.agenName" placeholder="请输入单位名称" clearable style="width: 140px" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="部门名称" prop="keyword.deptName">
        <el-select v-model="queryParams.keyword.deptName" placeholder="请选择部门名称" @change="deptVal">
          <el-option v-for="item in deptManag" :key="item.id" :label="item.deptName" :value="item.deptName" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="keyword.isenable">
        <el-select v-model="queryParams.keyword.isenable" placeholder="请选择单位状态" style="width: 150px">
          <el-option label="待审核" value="false" />
          <el-option label="已完成" value="true" />
          <el-option label="全部" value="" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="small" @click="handleAdd">新增单位</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" :disabled="deleteBatchDisable" icon="el-icon-delete" size="small" @click="handleMultDelete">批量删除</el-button>
      </el-col>
    </el-row>

    <el-table :data="projectList" style="width: 100%;margin-top:30px;" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column align="center" label="状态" prop="isenable">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isenable ? 'success' : 'info'" disable-transitions>{{ scope.row.isenable ? '已完成' : '待审核' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="单位编码" prop="agenCode" />
      <el-table-column align="center" label="单位名称" prop="agenName" :show-overflow-tooltip="true" />
      <el-table-column align="center" label="部门名称" prop="deptName" />
      <el-table-column align="center" label="单位分类" prop="sortCode" />
      <el-table-column align="center" label="操作" width="400">
        <template slot-scope="scope">
          <!-- <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleProject(scope.row)">项目</el-button>
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleBill(scope.row)">票据</el-button> -->
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleLook(scope.row)">查看</el-button>
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
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

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'单位变动':'新增单位'">
      <el-form ref="project" :model="project" :rules="rules" label-width="80px" label-position="right" style="padding-right:25px;">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="单位编码" :label-width="formLabelWidth" prop="agenCode">
              <el-input v-model="project.agenCode" placeholder="单位编码" :disabled="true" />
            </el-form-item>
            <el-form-item label="部门编码" :label-width="formLabelWidth">
              <el-input v-model="project.deptCode" placeholder="部门编码" :disabled="true" />
            </el-form-item>
            <el-form-item label="部门名称" :label-width="formLabelWidth" prop="deptName">
              <el-select v-model="project.deptName" placeholder="请选择部门名称" @change="deptVal">
                <el-option v-for="item in deptManag" :key="item.id" :label="item.deptName" :value="item.deptName" />
              </el-select>
            </el-form-item>
            <el-form-item label="所属行业" :label-width="formLabelWidth">
              <el-input v-model="project.indCode" placeholder="所属行业" />
            </el-form-item>
            <el-form-item label="生效日期" :label-width="formLabelWidth" prop="effDate">
              <el-date-picker v-model="project.effDate" type="date" placeholder="选择日期" style="width: 100%;" />
            </el-form-item>
            <el-form-item label="单位负责人" :label-width="formLabelWidth">
              <el-input v-model="project.linkMan" placeholder="单位负责人" />
            </el-form-item>
            <el-form-item label="财务负责人" :label-width="formLabelWidth">
              <el-input v-model="project.finMgr" placeholder="财务负责人" />
            </el-form-item>
            <el-form-item label="联系地址" :label-width="formLabelWidth">
              <el-input v-model="project.addr" placeholder="联系地址" />
            </el-form-item>
            <el-form-item label="备注" :label-width="formLabelWidth">
              <el-input v-model="project.note" placeholder="备注" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位名称" :label-width="formLabelWidth" prop="agenName">
              <el-input v-model="project.agenName" placeholder="单位名称" />
            </el-form-item>
            <el-form-item label="助记码" :label-width="formLabelWidth" prop="mnem">
              <el-input v-model="project.mnem" placeholder="助记码" />
            </el-form-item>
            <el-form-item label="归口财政部门" :label-width="formLabelWidth">
              <el-input v-model="project.findeptId" placeholder="归口财政部门" />
            </el-form-item>
            <el-form-item label="单位分类" :label-width="formLabelWidth">
              <el-input v-model="project.sortCode" placeholder="单位分类" />
            </el-form-item>
            <el-form-item label="失效日期" :label-width="formLabelWidth" prop="expDate">
              <el-date-picker v-model="project.expDate" type="date" placeholder="选择日期" style="width: 100%;" />
            </el-form-item>
            <el-form-item label="单位联系人电话" :label-width="formLabelWidth">
              <el-input v-model="project.linkTel" placeholder="单位联系人电话" />
            </el-form-item>
            <el-form-item label="财务负责人电话" :label-width="formLabelWidth">
              <el-input v-model="project.finMgrTel" placeholder="财务负责人电话" />
            </el-form-item>
            <el-form-item label="级次" :label-width="formLabelWidth">
              <el-input v-model="project.level" placeholder="级次" />
            </el-form-item>
            <el-form-item label="邮政编码" :label-width="formLabelWidth">
              <el-input v-model="project.zip" placeholder="邮政编码" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirmRole">确认</el-button>
      </div>
    </el-dialog>

    <!-- <el-dialog :visible.sync="manageDialogVisible" :title="manageDialogType === 'projectTow' ? '项目管理' : '票据管理'">
      <div v-loading="loading" style="text-align:center" class="transfer">
        <el-transfer v-model="manageHasList" style="text-align: left; display: inline-block; margin-bottom: 1rem" :data="manageOriginList" :button-texts="['删除', '添加']" :titles="['未拥有列表', '已拥有列表']">
          <span slot-scope="{ option }">{{ option.label }}</span>
        </el-transfer>
        <div style="text-align:right;">
          <el-button type="danger" @click="cancel">取消</el-button>
          <el-button type="primary" @click="confirmManage">确认</el-button>
        </div>
      </div>
    </el-dialog> -->

  </div>
</template>

<script>
import {
  getUnitListByPage,
  addUnit,
  updateUnit,
  deleteUnit,
  deleteUnitBatch,
  getDapartListAll,
  getAgenCount
} from '@/api/base/unitManager/unitManager'
// import {
//   getAgenBillType,
//   getBillAllType,
//   updateAgenBillBatch,
//   getAgenItemList,
//   getAllItemList,
//   updateAgenItemBatch
// } from '@/api/unitManager'

const defaultUser = {
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
}

export default {
  data () {
    const validateDatePicker = (rule, value, callback, source, option, other) => {
      const thisZero = new Date().setHours(0, 0, 0, 0)
      const input = new Date(value).setHours(0, 0, 0, 0)
      if (input < thisZero && !other && this.dialogType !== 'edit') {
        callback(new Error('日期不能早于今天'))
      } else if (other || this.dialogType === 'edit') {
        const otherDate = new Date(this.project[other]).setHours(0, 0, 0, 0)
        if (otherDate > input) {
          callback(new Error('当前日期不能在开始日期之前'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      optionsStart: {},
      optionsEnd: {},
      loading: true,
      queryParams: {
        keyword: {
          deptName: '',
          agenName: '',
          isenable: ''
        },
        page: 1,
        limit: 10
        // total: 0
      },
      projectList: [],
      project: {
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
      dialogVisible: false,
      // manageDialogVisible: false,
      // manageDialogType: 'projectTow',
      // manageHasList: [],
      // manageOriginList: [],
      dialogType: 'new',
      formLabelWidth: '120px',
      selectedList: [],
      deptManag: [],
      rules: {
        agenCode: [
          { required: true, message: '', trigger: 'change' }
        ],
        deptName: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' }
        ],
        agenName: [
          { required: true, message: '单位名称不能为空', trigger: 'blur' }
        ],
        mnem: [{ required: true, message: '助记码不能为空', trigger: 'blur' }],
        effDate: [
          { required: true, trigger: 'blur', validator: validateDatePicker }
        ],
        expDate: [
          { required: true, trigger: 'blur', validator: (rule, value, callback, source, option, other) => validateDatePicker(rule, value, callback, source, option, 'effDate') }
        ]
      }
    }
  },
  computed: {
    deleteBatchDisable () {
      return this.selectedList.length === 0
    }
  },
  created () {
    this.getTableData()
    this.getDapartName()
  },
  methods: {
    // 获取资源列表
    async getTableData () {
      // this.loading = true
      const res = await getUnitListByPage(this.queryParams)
      this.projectList = res.data.items
      this.queryParams.total = res.data.total
      this.queryParams.limit = res.data.limit
      this.queryParams.page = res.data.page
      this.selectedList = []
      // this.loading = false
    },
    // 获取部门列表
    async getDapartName () {
      const { data } = await getDapartListAll() // 无参查询部门列表
      this.deptManag = data
    },
    async deptVal (val) {
      let obj = {}
      obj = this.deptManag.find(item => {
        return item.deptName === val
      })
      this.project.deptCode = obj.deptCode
      this.queryParams.keyword.deptName = obj.deptName

      if (this.project.deptCode !== '') {
        await getAgenCount({ deptCode: this.project.deptCode }).then(res => {
          // console.log(res.data)
          this.project.agenCode = obj.deptCode + res.data
        })
      }
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
      this.queryParams.keyword = {}
    },
    // 新增按钮
    async handleAdd () {
      this.project = Object.assign({}, defaultUser)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    // 编辑按钮
    handleEdit (rowData) {
      this.dialogVisible = true
      this.dialogType = 'edit'
      this.project = Object.assign({}, rowData)
    },
    // 查看按钮
    handleLook (rowData) {
      this.$router.push({
        path: '/unitManager/unitManagerDetail/' + rowData.id
      })
    },
    // 单位管理模态框提交
    confirmRole () {
      this.$refs.project.validate(async (valid) => {
        if (valid) {
          if (this.dialogType === 'edit') { // 编辑
            this.project.isenable = false // 有修改就需要重新审核
            await updateUnit(this.project).then(res => {
              this.getTableData()
              this.dialogVisible = false
              this.$message({
                showClose: true,
                message: '编辑成功',
                type: 'success'
              })
            }).catch((err) => {
              this.$message({
                type: 'error',
                message: '编辑失败!'
              })
              console.error(err)
            })
          } else {
            // 新增
            await addUnit(this.project).then(res => {
              this.$set(this.project, {})
              this.getTableData()
              this.dialogVisible = false
              this.$message({
                showClose: true,
                message: '添加成功',
                type: 'success'
              })
            }).catch((err) => {
              this.$message({
                type: 'error',
                message: '添加失败'
              })
              console.error(err)
            })
          }
        }
      })
    },
    // 模态框取消
    cancel () {
      this.dialogVisible = false
      this.manageDialogVisible = false
      this.resetForm('project')
    },
    // 删除按钮
    handleDelete (deleData) {
      this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        deleteUnit(deleData.id)
          .then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getTableData()
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: '删除失败!'
            })
            console.error(err)
          })
      })
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.selectedList = selection
    },
    // 批量删除
    async handleMultDelete () {
      this.$confirm('此操作将永久删除选中部门, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.selectedids = this.selectedList.map(item => {
          return { id: item.id }
        })
        deleteUnitBatch(this.selectedids).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getTableData()
        })
      })
    },
    // 分页，每页数目改变
    handleSizeChange (val) {
      this.queryParams.limit = val
      this.getTableData()
    },
    // 当前页码改变
    handleCurrentChange (val) {
      this.queryParams.page = val
      this.getTableData()
    }
    // 获取所有财政票据种类
    // async getBillAllType () {
    //   // Todo
    //   const { data } = await getBillAllType()
    //   if (!data) {
    //     return
    //   }
    //   this.manageOriginList = data.map(item => {
    //     return { ...item, disabled: false, key: item.code, label: item.name }
    //   })
    //   if (this.manageOriginList === undefined) {
    //     this.manageOriginList = []
    //   }
    // },

    // 获取单位具有的所有票据
    // async getAgenBillAll (agenIdcode) {
    //   const { data } = await getAgenBillType({ agenIdcode })
    //   if (!data) {
    //     return
    //   }
    //   this.manageHasList = data.map(item => item.code)
    //   if (this.manageHasList === undefined) {
    //     this.manageHasList = []
    //   }
    // },

    // 获取所有财政项目列表
    // async getAllItemList () {
    //   // Todo
    //   const { data } = await getAllItemList()
    //   if (!data) {
    //     return
    //   }
    //   this.manageOriginList = data.map(item => {
    //     return {
    //       ...item,
    //       disabled: false,
    //       key: item.itemId,
    //       label: item.itemName
    //     }
    //   })
    //   if (this.manageOriginList === undefined) {
    //     this.manageOriginList = []
    //   }
    // },

    // 查询单位具有的项目
    // async getAgenItemList (agenIdcode) {
    //   const { data } = await getAgenItemList({ agenIdcode })
    //   if (!data) {
    //     return
    //   }
    //   this.manageHasList = data.map(item => item.itemId)
    //   if (this.manageHasList === undefined) {
    //     this.manageHasList = []
    //   }
    // },

    // 管理提交
    // async confirmManage () {
    //   const isBillManage = this.manageDialogType === 'bill'
    //   let successFlag = false
    //   if (isBillManage) {
    //     const postData = this.manageHasList.map(item => {
    //       return { agenIdcode: this.project.agenCode, typeCode: item }
    //     })
    //     await updateAgenBillBatch(postData).then(res => {
    //       successFlag = true
    //     })
    //   } else {
    //     const postData = this.manageHasList.map(item => {
    //       return { agenIdcode: this.project.agenCode, itemCode: item }
    //     })
    //     await updateAgenItemBatch(postData).then(res => {
    //       successFlag = true
    //     })
    //   }
    //   if (successFlag) {
    //     this.$message({
    //       showClose: true,
    //       message: '添加成功',
    //       type: 'success'
    //     })
    //   }
    //   this.manageDialogVisible = false
    // },
    // 项目管理按钮
    // async handleProject (row) {
    //   this.loading = true
    //   this.manageOriginList = []
    //   this.manageHasList = []
    //   this.project = Object.assign({}, row)
    //   this.manageDialogType = 'projectTow'
    //   this.manageDialogVisible = true
    //   await this.getAllItemList()
    //   await this.getAgenItemList(row.agenCode)
    //   this.loading = false
    // },

    // 票据管理按钮
    // async handleBill (row) {
    //   this.loading = true
    //   this.manageOriginList = []
    //   this.manageHasList = []
    //   this.project = Object.assign({}, row)
    //   this.manageDialogType = 'bill'
    //   this.manageDialogVisible = true
    //   await this.getBillAllType()
    //   await this.getAgenBillAll(row.agenCode)
    //   this.loading = false
    // },
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
  ::v-deep div.el-transfer-panel {
    width: 330px;
  }
}
</style>
