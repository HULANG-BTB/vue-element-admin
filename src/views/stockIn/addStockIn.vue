<template>
  <div class="app-container">
    <el-form ref="ruleForm" :model="stockIn" :rules="rules" label-width="100px" class="demo-ruleForm" style="margin: 30px;">
      <el-form-item label="业务号" prop="no">
        <span style="color:red">NO.{{ stockIn.no }}</span>
      </el-form-item>
      <el-form-item label="备注" prop="memo">
        <el-input v-model="stockIn.memo" type="textarea" />
      </el-form-item>

      <div>
        <el-dialog
          title="创建票据代码"
          :visible.sync="singleDialogFormVisible"
        >
          <el-form
            :inline="true"
            :model="code"
          >
            <el-form-item
              label="区划编码"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="code.regiId"
                size="small"
                autocomplete="off"
                maxlength="2"
                minlength="2"
              />
            </el-form-item>
            <el-form-item
              label="分类编码"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="code.sortId"
                size="small"
                autocomplete="off"
                maxlength="2"
                minlength="2"
              />
            </el-form-item>
            <el-form-item
              label="种类编码"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="code.typeId"
                size="small"
                autocomplete="off"
                this.value="this.value.replace(/\D/g,'')"
                maxlength="2"
                minlength="2"
              />
            </el-form-item>
            <el-form-item
              label="年度编码"
              :label-width="formLabelWidth"
              maxlength="2"
              minlength="2"
            >
              <el-input
                v-model="code.annualId"
                size="small"
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item
              label="操作人"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="code.operator"
                size="small"
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item
              label="操作人ID"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="code.operatorId"
                size="small"
                autocomplete="off"
              />
            </el-form-item>
          </el-form>
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
            <el-button
              type="primary"
              size="small"
              @click="createNewCode"
            >创建</el-button>
          </div>
        </el-dialog>

        <!-- 批量创建 -->
        <el-dialog
          title="创建票据代码"
          :visible.sync="batchDialogFormVisible"
        >
          <el-form
            :inline="true"
            :model="code"
          >
            <el-form-item
              label="区划编码"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="batchCode.regiId"
                size="small"
                autocomplete="off"
                maxlength="2"
                minlength="2"
              />
            </el-form-item>
            <el-form-item
              label="分类编码"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="batchCode.sortId"
                size="small"
                autocomplete="off"
                maxlength="2"
                minlength="2"
              />
            </el-form-item>

            <el-form-item
              label="起始种类编码"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="batchCode.typeStartId"
                size="small"
                autocomplete="off"
                this.value="this.value.replace(/\D/g,'')"
                maxlength="2"
                minlength="2"
              />
            </el-form-item>
            <el-form-item
              label="终止种类编码"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="batchCode.typeEndId"
                size="small"
                autocomplete="off"
                this.value="this.value.replace(/\D/g,'')"
                maxlength="2"
                minlength="2"
              />
            </el-form-item>

            <el-form-item
              label="年度编码"
              :label-width="formLabelWidth"
              maxlength="2"
              minlength="2"
            >
              <el-input
                v-model="batchCode.annualId"
                size="small"
                autocomplete="off"
              />
            </el-form-item>

            <el-form-item
              label="操作人"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="batchCode.operator"
                size="small"
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item
              label="操作人ID"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="batchCode.operatorId"
                size="small"
                autocomplete="off"
              />
            </el-form-item>

          </el-form>
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button size="small" @click="batchDialogFormVisible = false">取 消</el-button>
            <el-button
              type="primary"
              size="small"
              @click="createNewBatchCode"
            >创建</el-button>
          </div>
        </el-dialog>
      </div>

      <el-table
        :data="stockIn.addStockInItemDTOArray"
        style="width: 100%; margin: 30px;"
      >
        <el-table-column
          label="序号"
          type="index"
          width="50"
          align="center"
        />
        <el-table-column
          label="票据编码"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.billCode }}
          </template>
        </el-table-column>
        <el-table-column
          label="票据名称"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.billName }}
          </template>
        </el-table-column>
        <el-table-column
          label="数量"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.number }}
          </template>
        </el-table-column>
        <el-table-column
          label="起始号"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.billNo1 }}
          </template>
        </el-table-column>
        <el-table-column
          label="终止号"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.billNo2 }}
          </template>
        </el-table-column>
        <el-table-column>
          <template slot="header">
            <el-button
              size="mini"
              @click="handleAdd"
            >新建</el-button>
          </template>
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-form-item style="float: right">
        <el-button
          type="primary"
          class="btn-create"
          icon="el-plus"
          size="mini"
          @click="singleDialogFormVisible = true"
        >创建</el-button>

        <el-button
          type="primary"
          class="btn-create"
          icon="el-plus"
          size="mini"
          @click="batchDialogFormVisible = true"
        >批量创建</el-button>
        <el-button type="primary" :disabled="submitable()" size="mini" @click="submitForm('ruleForm')">提交</el-button>
        <el-button size="mini" @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>

    <!----------------新增明细对话框------------------->

    <el-dialog title="新增明细" :visible.sync="dialogFormVisible">
      <el-form :model="addItemDTO" :rules="rules" label-width="80px" class="demo-ruleForm" size="mini">
        <el-form-item label="票据编码" prop="billCode">
          <el-select v-model="addItemDTO.billCode" placeholder="" @change="billCodeChange">
            <el-option v-for=" item in billTypes " :key="item.code" :label="item.code" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="票据名称" prop="billName">
          <el-input v-model="addItemDTO.billName" readonly />
        </el-form-item>
        <el-form-item label="票据数量" prop="number">
          <el-input v-model="addItemDTO.number" />
        </el-form-item>
        <el-form-item label="起始号" prop="billNo1">
          <el-input v-model="addItemDTO.billNo1" readonly />
        </el-form-item>
        <el-form-item label="终止号" prop="billNo2">
          <el-input v-model="addItemDTO.billNo2" readonly />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="setCode">保 存</el-button>
        <el-button type="primary" :disabled="okable" @click="okBtn">确 定</el-button>
      </div>
    </el-dialog>

    <!-------------------新增明细对话框结束---------------------->
  </div>
</template>
<script>
import { getBillNumber, getStockInInfo, getCodeFunction, updateStockIn, addStockIn } from '@/api/stockIn.js'
import { createCode, createBatchCode } from '@/api/encode'
export default {
  data () {
    return {
      index: 0,
      isEdit: false,
      okable: true,
      stockIn: {
        no: '',
        memo: '',
        author: 'test',
        changeMan: 'test',
        billSource: '',
        addStockInItemDTOArray: []
      },
      addItemDTO: {
        no: '',
        billCode: '',
        billName: '',
        number: 0,
        billNo1: '',
        billNo2: ''
      },
      getCode: {
        annualId: '20',
        codeNum: 50,
        regiId: '35',
        sortId: '20',
        typeId: '20'
      },
      billType: {
        id: '',
        code: '',
        name: '',
        typecode: ''
      },
      billTypes: [
        {
          id: '1',
          code: '00000120',
          name: '票据1',
          typecode: '1'
        },
        {
          id: '2',
          code: '00000121',
          name: '票据2',
          typecode: '1'
        },
        {
          id: '3',
          code: '01160201',
          name: '票据3',
          typecode: '1'
        }
      ],
      rules: {
        memo: [
          { required: true, message: '请填写备注', trigger: 'blur' }
        ],
        billCode: [
          { required: true, message: '请选择票据代码', trigger: 'blur' }
        ],
        number: [
          { required: true, message: '请填写票据数', trigger: 'blur' }
        ]
      },
      dialogFormVisible: false,
      singleDialogFormVisible: false,
      batchDialogFormVisible: false,
      code: {
        // 区划编码
        regiId: '',
        // 分类编码
        sortId: '',
        // 种类编码
        typeId: '',
        // 年度编码
        annualId: '',
        // 操作人姓名
        operator: '',
        // 操作人Id
        operatorId: '',
        // 返回msg
        encodeMessage: '',
        // 是否成功
        successFlag: false
      },
      batchCode: {
        // 区划编码
        regiId: '',
        // 分类编码
        sortId: '',
        // 起始种类编码
        typeStartId: '',
        // 终止种类编码
        typeEndId: '',
        // 年度编码
        annualId: '',
        // 操作人姓名
        operator: '',
        // 操作人Id
        operatorId: '',
        // 返回msg
        encodeMessage: '',
        // 是否成功
        successFlag: false
      },
      formLabelWidth: '120px'
    }
  },
  created () {
    if (this.$route.params && this.$route.params.id) {
      const id = this.$route.params.id
      this.fetchDataById(id)
    } else {
      this.getId()
      this.createTable()
    }
  },
  methods: {
    async getId () {
      this.loading = true
      const res = await getBillNumber(this.stockInPageQuery).catch(() => { this.loading = false })
      this.stockIn.no = res.data.no
      this.loading = false
    },
    createTable () {
    },
    submitable () {
      return this.stockIn.addStockInItemDTOArray.length === 0
    },
    // 根据id获取详细信息
    fetchDataById (id) {
      getStockInInfo(id)
        .then(response => {
          this.stockIn = response.data
          // 重要！！！ 设置修改人
          this.stockIn.changeMan = 'test'
        })
        .catch()
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid && this.stockIn.addStockInItemDTOArray.length !== 0) {
          if (this.$route.params.id) {
            updateStockIn(this.stockIn).then(response => {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.$router.push('/stockIn/stockInList')
            }).catch(response => {
              this.$message.error('失败了，请稍后再试')
            })
          } else {
            addStockIn(this.stockIn).then(response => {
              this.$message({
                message: '新增成功',
                type: 'success'
              })
              this.$router.push('/stockIn/stockInList')
            }).catch(response => {
              this.$message.error('失败了，请稍后再试')
            })
          }
          // this.$router.push('stockInList')
        } else {
          console.log('error submit!!')
          this.$message.error('失败了，请稍后再试')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    handleEdit (index, row) {
      console.log(index, row)
      this.isEdit = true
      // this.stockIn.addStockInItemDTOArray.splice(index, 1)
      this.index = index
      this.addItemDTO = row
      this.dialogFormVisible = true
    },
    handleDelete (index, row) {
      console.log(index, row)
      // 从数组中删除本条记录
      this.stockIn.addStockInItemDTOArray.splice(index, 1)
    },
    handleAdd () {
      this.addItemDTO = {
        no: '',
        billCode: '',
        billName: '',
        number: 0,
        billNo1: '',
        billNo2: ''
      }
      this.billType = {
        id: '',
        code: '',
        name: '',
        typecode: ''
      }
      this.dialogFormVisible = true
    },
    // 获取票号段
    setCode () {
      console.log('setcode')
      this.getCode.codeNum = this.addItemDTO.number
      getCodeFunction(this.getCode).then((result) => {
        console.log(result)
        this.addItemDTO.billNo1 = result.data.beginCode
        this.addItemDTO.billNo2 = result.data.endCode
        this.okable = false
      }).catch((res) => {
        console.log('catch' + res)
        this.$message({
          type: 'info',
          message: '获取票据号码失败'
        })
      })
    },
    okBtn () {
      this.dialogFormVisible = false
      if (this.isEdit) {
        this.stockIn.addStockInItemDTOArray.splice(this.index, 1)
      }
      this.stockIn.addStockInItemDTOArray.push(this.addItemDTO)
    },
    billCodeChange () {
      // 获取对应的票据名
      for (let i = 0; i < this.billTypes.length; i++) {
        if (this.addItemDTO.billCode === this.billTypes[i].code) {
          this.billType = this.billTypes[i]
          this.addItemDTO.billName = this.billType.name
        }
      }
    },
    createNewCode () {
      this.singleDialogFormVisible = false
      this.$confirm('此操作将创建新的票据代码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.code.regiId.length === 0 || this.code.sortId.length === 0 || this.code.typeId.length === 0 || this.code.annualId.length === 0) {
          this.$message.error('数据不能为空')
        } else {
          createCode(this.code).then(response => {
            this.code.encodeMessage = response.message
            this.code.responseStatus = response.code
            this.code.successFlag = response.success
            if (this.code.successFlag === true) {
              this.$message({
                message: this.code.encodeMessage,
                type: 'success'
              })
            } else {
              this.$message({
                message: this.code.encodeMessage,
                type: 'warning'
              })
            }
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消创建'
        })
      })
    },
    createNewBatchCode () {
      this.dialogFormVisible = false
      this.$confirm('此操作将创建新的票据代码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.batchCode.regiId.length === 0 || this.batchCode.sortId.length === 0 || this.batchCode.typeStartId.length === 0 || this.batchCode.typeEndId === 0 || this.batchCode.annualId.length === 0) {
          this.$message.error('数据不能为空')
        } else {
          createBatchCode(this.batchCode).then(response => {
            console.log(this)
            this.batchCode.encodeMessage = response.message
            this.batchCode.responseStatus = response.code
            this.batchCode.successFlag = response.success
            if (this.code.successFlag === true) {
              this.$message({
                message: this.batchCode.encodeMessage,
                type: 'success'
              })
            } else {
              this.$message({
                message: this.batchCode.encodeMessage,
                type: 'warning'
              })
            }
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消创建'
        })
      })
    }
  }
}

</script>
