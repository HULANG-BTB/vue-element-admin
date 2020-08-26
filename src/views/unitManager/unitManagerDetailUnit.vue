<template>
  <div class="app-container">
    <el-form :model="project" label-width="80px" label-position="right">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="单位编码" :label-width="formLabelWidth">
            <el-input v-model="project.agenCode" placeholder="单位编码" disabled="true" />
          </el-form-item>
          <el-form-item label="部门编码" :label-width="formLabelWidth">
            <el-input v-model="project.deptCode" placeholder="部门编码" disabled="true" />
          </el-form-item>
          <el-form-item label="部门名称" :label-width="formLabelWidth">
            <el-input v-model="project.deptName" placeholder="部门编码" disabled="true" />
          </el-form-item>
          <el-form-item label="所属行业" :label-width="formLabelWidth">
            <el-input v-model="project.indCode" placeholder="所属行业" disabled="true" />
          </el-form-item>
          <el-form-item label="单位负责人" :label-width="formLabelWidth">
            <el-input v-model="project.linkMan" placeholder="单位负责人" disabled="true" />
          </el-form-item>
          <el-form-item label="单位联系人电话" :label-width="formLabelWidth">
            <el-input v-model="project.linkTel" placeholder="单位联系人电话" disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="单位名称" :label-width="formLabelWidth">
            <el-input v-model="project.agenName" placeholder="单位名称" disabled="true" />
          </el-form-item>
          <el-form-item label="助记码" :label-width="formLabelWidth">
            <el-input v-model="project.mnem" placeholder="助记码" disabled="true" />
          </el-form-item>
          <el-form-item label="归口财政部门" :label-width="formLabelWidth">
            <el-input v-model="project.findeptId" placeholder="归口财政部门" disabled="true" />
          </el-form-item>
          <el-form-item label="单位分类" :label-width="formLabelWidth">
            <el-input v-model="project.sortCode" placeholder="单位分类" disabled="true" />
          </el-form-item>
          <el-form-item label="生效日期" :label-width="formLabelWidth">
            <el-date-picker v-model="project.effDate" type="date" placeholder="选择日期" style="width: 100%;" disabled="true" />
          </el-form-item>
          <el-form-item label="失效日期" :label-width="formLabelWidth">
            <el-date-picker v-model="project.expDate" type="date" placeholder="选择日期" style="width: 100%;" disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="级次" :label-width="formLabelWidth">
            <el-input v-model="project.level" placeholder="级次" disabled="true" />
          </el-form-item>
          <el-form-item label="财务负责人" :label-width="formLabelWidth">
            <el-input v-model="project.finMgr" placeholder="财务负责人" disabled="true" />
          </el-form-item>
          <el-form-item label="财务负责人电话" :label-width="formLabelWidth">
            <el-input v-model="project.finMgrTel" placeholder="财务负责人电话" disabled="true" />
          </el-form-item>
          <el-form-item label="邮政编码" :label-width="formLabelWidth">
            <el-input v-model="project.zip" placeholder="邮政编码" disabled="true" />
          </el-form-item>
          <el-form-item label="联系地址" :label-width="formLabelWidth">
            <el-input v-model="project.addr" placeholder="联系地址" disabled="true" />
          </el-form-item>
          <el-form-item label="备注" :label-width="formLabelWidth">
            <el-input v-model="project.note" placeholder="备注" disabled="true" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row :gutter="20" class="mb8" style="margin-top:20px;">
      <el-col :span="1.5">
        <el-button type="primary" size="mini" icon="el-icon-edit" @click="unitEdit">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(project)">准购证</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleProject(project)">挂接项目</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleBill(project)">挂接票据</el-button>
      </el-col>
    </el-row>

    <el-dialog :visible.sync="dialogVisibleTow" title="准购证信息">
      <el-form :model="crt" label-width="80px" label-position="right" style="padding-right:20px;">
        <el-form-item label="准购证名称" :label-width="formLabelWidth">
          <el-input v-model="crt.crtName" placeholder="准购证名称" />
        </el-form-item>
        <el-form-item label="所属单位" :label-width="formLabelWidth">
          <el-input v-model="crt.agenName" placeholder="所属单位" />
        </el-form-item>
        <el-form-item label="办证日期" :label-width="formLabelWidth">
          <el-date-picker v-model="crt.issuedate" type="date" placeholder="选择日期" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="单位法人证号" :label-width="formLabelWidth">
          <el-input v-model="crt.legalno" placeholder="单位法人证号" />
        </el-form-item>
        <el-form-item label="收费许可证号" :label-width="formLabelWidth">
          <el-input v-model="crt.chargno" placeholder="收费许可证号" />
        </el-form-item>
        <el-form-item label="罚没许可证号" :label-width="formLabelWidth">
          <el-input v-model="crt.fineno" placeholder="罚没许可证号" />
        </el-form-item>
        <el-form-item label="收费委托书号" :label-width="formLabelWidth">
          <el-input v-model="crt.proxyno" placeholder="收费委托书号" />
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="crt.note" placeholder="备注" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirmCrt">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="manageDialogVisible" :title="manageDialogType === 'projectTow' ? '挂接项目管理' : '挂接票据管理'">
      <div v-loading="loading" style="text-align:center" class="transfer">
        <el-transfer v-model="manageHasList" style="text-align: left; display: inline-block; margin-bottom: 1rem" :data="manageOriginList" :button-texts="['删除', '添加']" :titles="['未拥有列表', '已拥有列表']">
          <span slot-scope="{ option }">{{ option.label }}</span>
        </el-transfer>
        <div style="text-align:right;">
          <el-button type="danger" @click="cancel">取消</el-button>
          <el-button type="primary" @click="confirmManage">确认</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="unitdialogVisible" :title="unitdialogType==='edit'?'单位变动':'新增单位'">
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
              <el-select v-model="project.indCode" placeholder="请选择所属行业">
                <el-option label=" 农、林、牧、渔业" value=" 农、林、牧、渔业" />
                <el-option label="采矿业" value="采矿业" />
                <el-option label="制造业" value="制造业" />
                <el-option label="电力、热力、燃气及水的生产和供应业" value="电力、热力、燃气及水的生产和供应业" />
                <el-option label="环境和公共设施管理业" value="环境和公共设施管理业" />
                <el-option label="建筑业" value="建筑业" />
                <el-option label="交通运输、仓储业和邮政业" value="交通运输、仓储业和邮政业" />
                <el-option label="信息传输、计算机服务和软件业" value="信息传输、计算机服务和软件业" />
                <el-option label="批发和零售业" value="批发和零售业" />
                <el-option label="住宿、餐饮业" value="住宿、餐饮业" />
                <el-option label="金融、保险业" value="金融、保险业" />
                <el-option label="房地产业" value="房地产业" />
                <el-option label="租赁和商务服务业" value="租赁和商务服务业" />
                <el-option label="科学研究、技术服务和地质勘查业" value="科学研究、技术服务和地质勘查业" />
                <el-option label="水利、环境和公共设施管理业" value="水利、环境和公共设施管理业" />
                <el-option label="居民服务和其他服务业" value="居民服务和其他服务业" />
                <el-option label="教育" value="教育" />
                <el-option label="卫生、社会保障和社会服务业" value="卫生、社会保障和社会服务业" />
                <el-option label="文化、体育、娱乐业" value="文化、体育、娱乐业" />
                <el-option label="综合" value="综合" />
                <el-option label="其它" value="其它" />
              </el-select>
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
              <el-select v-model="project.findeptId" placeholder="归口财政部门">
                <el-option v-for="item in finDept" :key="item.id" :label="item.findeptName" :value="item.findeptName" />
              </el-select>
            </el-form-item>
            <el-form-item label="单位分类" :label-width="formLabelWidth">
              <el-select v-model="project.sortCode" placeholder="请选择单位类型">
                <el-option label="国有企业" value="国有企业" />
                <el-option label="国有控股企业" value="国有控股企业" />
                <el-option label="外资企业" value="外资企业" />
                <el-option label="合资企业" value="合资企业" />
                <el-option label="私营企业" value="私营企业" />
                <el-option label="事业单位" value="事业单位" />
                <el-option label="国家行政机关" value="国家行政机关" />
                <el-option label="政府" value="政府" />
              </el-select>
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
  </div>
</template>

<script>
import {
  getAgenBillType,
  getBillAllType,
  updateAgenBillBatch,
  getAgenItemList,
  getAllItemList,
  updateAgenItemBatch,
  getByAgenCode,
  getDapartListAll,
  getAgenCount,
  updateUnit
} from '@/api/base/unitManager/unitManager'
import { getCrtByAgenCode } from '@/api/base/unitManager/purchLicense'
import { getAllFinDept } from '@/api/finDept/finDept'
export default {
  data () {
    return {
      searchByAgenCode: this.$store.state.user.agenCode,
      // searchByAgenCode: '35018201',
      loading: true,
      dialogVisible: false,
      dialogVisibleTow: false,
      dialogType: 'subject',
      manageDialogVisible: false,
      manageDialogType: 'projectTow',
      unitdialogVisible: false,
      unitdialogType: 'new',
      manageHasList: [],
      manageOriginList: [],
      formLabelWidth: '120px',
      deptManag: [],
      finDept: [],
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
      crt: {
        note: '',
        logicDelete: false,
        address: '',
        finmgr: '',
        crtCode: '',
        agenCode: '',
        crtName: '',
        linkmanTel: '',
        legalno: '',
        updateTime: 0,
        issuedate: '',
        version: 0,
        linkman: '',
        operator: '',
        fineno: '',
        createTime: 0,
        proxyno: '',
        agenName: '',
        operatorId: 0,
        chargno: ''
      }
    }
  },
  created () {
    this.getFormData()
    this.getDapartName()
    this.getFinDeptName()
  },
  methods: {
    // 单位端获取表单数据
    async getFormData () {
      const { data } = await getByAgenCode({ agenCode: this.searchByAgenCode })
      this.project = data
    },
    // 获取部门列表
    async getDapartName () {
      const { data } = await getDapartListAll() // 无参查询部门列表
      this.deptManag = data
    },
    // 获取财政部门
    async getFinDeptName () {
      const { data } = await getAllFinDept() // 无参查询部门列表
      this.finDept = data
      console.log(data)
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
    // 单位管理模态框提交
    confirmRole () {
      this.$refs.project.validate(async (valid) => {
        if (valid) {
          if (this.unitdialogType === 'edit') { // 编辑
            this.project.isenable = false // 有修改就需要重新审核
            await updateUnit(this.project).then(res => {
              this.getFormData()
              this.unitdialogVisible = false
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
          }
        }
      })
    },
    // 准购证按钮
    async handleEdit (rowData) {
      this.dialogVisibleTow = true
      await getCrtByAgenCode({ agenCode: rowData.agenCode }).then(res => {
        this.crt = res.data[0]
      })
    },
    unitEdit () {
      this.unitdialogVisible = true
      this.unitdialogType = 'edit'
    },
    // 准购证模态框提交
    async confirmCrt () {
      this.dialogVisibleTow = false
    },
    // 表单重置封装
    resetForm (refName) {
      if (this.$refs[refName]) {
        this.$refs[refName].resetFields()
      }
    },
    // 获取所有财政项目列表
    async getAllItemList () {
      // Todo
      const { data } = await getAllItemList()
      if (!data) {
        return
      }
      this.manageOriginList = data.map(item => {
        return {
          ...item,
          disabled: false,
          key: item.itemId,
          label: item.itemName
        }
      })
      if (this.manageOriginList === undefined) {
        this.manageOriginList = []
      }
    },
    // 模态框取消
    cancel () {
      this.manageDialogVisible = false
      this.dialogVisibleTow = false
      this.unitdialogVisible = false
      this.resetForm('project')
      this.resetForm('crt')
    },
    // 项目管理按钮
    async handleProject () {
      this.loading = true
      this.manageOriginList = []
      this.manageHasList = []
      // this.project = Object.assign({}, rowData)
      this.manageDialogType = 'projectTow'
      this.manageDialogVisible = true
      await this.getAllItemList()
      await this.getAgenItemList(this.project.agenCode)
      this.loading = false
    },
    // 查询单位具有的项目
    async getAgenItemList (agenIdcode) {
      const { data } = await getAgenItemList({ agenIdcode })
      if (!data) {
        return
      }
      this.manageHasList = data.map(item => item.itemId)
      if (this.manageHasList === undefined) {
        this.manageHasList = []
      }
    },
    // 获取所有财政票据种类
    async getBillAllType () {
      const { data } = await getBillAllType()
      if (!data) {
        return
      }
      this.manageOriginList = data.map(item => {
        return { ...item, disabled: false, key: item.code, label: item.name }
      })
      if (this.manageOriginList === undefined) {
        this.manageOriginList = []
      }
    },

    // 获取单位具有的所有票据
    async getAgenBillAll (agenCode) {
      const { data } = await getAgenBillType({ agenCode })
      if (!data) {
        return
      }
      this.manageHasList = data.map(item => item.code)
      if (this.manageHasList === undefined) {
        this.manageHasList = []
      }
    },

    // 票据管理按钮
    async handleBill (rowData) {
      // console.log(rowData)
      this.loading = true
      this.manageOriginList = []
      this.manageHasList = []
      this.project = Object.assign({}, rowData)
      this.manageDialogType = 'bill'
      this.manageDialogVisible = true
      await this.getBillAllType()
      await this.getAgenBillAll(rowData.agenCode)
      this.loading = false
    },
    // 管理提交
    async confirmManage () {
      const isBillManage = this.manageDialogType === 'bill'
      let successFlag = false
      if (isBillManage) {
        const postData = this.manageHasList.map(item => {
          return { agenCode: this.project.agenCode, typeCode: item }
        })
        await updateAgenBillBatch(postData).then(res => {
          successFlag = true
        })
      } else {
        const postData = this.manageHasList.map(item => {
          return { agenIdcode: this.project.agenCode, itemCode: item }
        })
        await updateAgenItemBatch(postData).then(res => {
          successFlag = true
        })
      }
      if (successFlag) {
        this.$message({
          showClose: true,
          message: '添加成功',
          type: 'success'
        })
      }
      this.manageDialogVisible = false
    }
  }
}
</script>

<style scoped lang = "sass">

</style>
