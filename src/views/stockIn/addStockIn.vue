<template>
  <div class="app-container">
    <el-form ref="ruleForm" :model="stockIn" :rules="rules" label-width="100px" class="demo-ruleForm" style="margin: 30px;">
      <el-form-item label="业务号" prop="no">
        <span style="color:red">NO.{{ stockIn.no }}</span>
      </el-form-item>
      <el-form-item label="备注" prop="memo">
        <el-input v-model="stockIn.memo" type="textarea" />
      </el-form-item>

      <el-table
        :data="stockIn.addStockInItemDTOArray"
        style="width: 100%; margin: 30px;"
      >
        <el-table-column
          type="selection"
          width="50"
          align="center"
        />
        <el-table-column
          label="序号"
          type="index"
          width="50"
          align="center"
        />
        <el-table-column
          label="票据编码"
          width="130"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.billCode }}
          </template>
        </el-table-column>
        <el-table-column
          label="票据名称"
          width="130"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.billName }}
          </template>
        </el-table-column>
        <el-table-column
          label="数量"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.number }}
          </template>
        </el-table-column>
        <el-table-column
          label="起始号"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.billNo1 }}
          </template>
        </el-table-column>
        <el-table-column
          label="终止号"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.billNo2 }}
          </template>
        </el-table-column>
        <el-table-column width="180">
          <template slot="header" slot-scope="scope">
            <el-button
              size="mini"
              @click="handleAdd"
            >新建</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >删除多项</el-button>
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
        <el-button type="primary" :disabled="submitable()" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
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
        <el-button type="primary" @click="okBtn">确 定</el-button>
      </div>
    </el-dialog>

    <!-------------------新增明细对话框结束---------------------->
  </div>
</template>
<script>
import { getBillNumber, getStockInInfo, getCodeFunction, updateStockIn, addStockIn } from '@/api/stockIn.js'
export default {
  data () {
    return {
      index: 0,
      isEdit: false,
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
        codeNum: 500,
        regiId: '35',
        sortId: '30',
        typeId: '30'
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
          code: '00000001',
          name: '基础票据',
          typecode: '1'
        },
        {
          id: '2',
          code: '00000002',
          name: '中级票据',
          typecode: '1'
        },
        {
          id: '3',
          code: '00000003',
          name: '高级票据',
          typecode: '1'
        }
      ],
      rules: {
        memo: [
          { required: true, message: '请填写备注', trigger: 'blur' }
        ],
        billCode: [
          { required: true, message: '请选择票据代码', trigger: 'blur' }
        ]
      },
      dialogFormVisible: false
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
      this.getCode.codeNum = this.addItemDTO.number
      const result = getCodeFunction(this.getCode)
      this.addItemDTO.billNo1 = result.beginCode
      this.addItemDTO.billNo2 = result.endCode
    },
    okBtn () {
      this.dialogFormVisible = false
      if (this.isEdit) {
        this.stockIn.addStockInItemDTOArray.splice(this.index, 1)
      }
      this.stockIn.addStockInItemDTOArray.push(this.addItemDTO)
    }
  }
}

</script>
