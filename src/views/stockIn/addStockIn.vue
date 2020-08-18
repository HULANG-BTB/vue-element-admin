<template>
  <div class="app-container">
    <el-form ref="ruleForm" :model="stockIn" :rules="rules" label-width="100px" class="demo-ruleForm">
      <el-form-item label="业务号" prop="no">
        <span style="color:red">NO.{{ stockIn.no }}</span>
      </el-form-item>
      <el-form-item label="备注" prop="memo">
        <el-input v-model="stockIn.memo" type="textarea" />
      </el-form-item>

      <el-table
        :data="stockIn.addStockInItemDTOArray"
        style="width: 100%"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          type="index"
          width="50"
        />
        <el-table-column
          label="票据编码"
          width="120"
        >
          <template slot-scope="scope">
            {{ scope.row.billCode }}
          </template>
        </el-table-column>
        <el-table-column
          label="票据名称"
          width="180"
        >
          <template slot-scope="scope">
            {{ scope.row.billName }}
          </template>
        </el-table-column>
        <el-table-column
          label="数量"
          width="120"
        >
          <template slot-scope="scope">
            {{ scope.row.number }}
          </template>
        </el-table-column>
        <el-table-column
          label="起始号"
          width="120"
        >
          <template slot-scope="scope">
            {{ scope.row.billNo1 }}
          </template>
        </el-table-column>
        <el-table-column
          label="终止号"
          width="120"
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
            >删除</el-button>
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
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
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
          <el-input v-model="addItemDTO.number" readonly />
        </el-form-item>
        <el-form-item label="起始号" prop="billNo1">
          <el-input v-model="addItemDTO.billNo1" @blur="billNo2Change" />
        </el-form-item>
        <el-form-item label="终止号" prop="billNo2">
          <el-input v-model="addItemDTO.billNo2" @blur="billNo2Change" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="okBtn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getBillNumber } from '@/api/stockIn.js'
export default {
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入终止号'))
      }
      if (value.length > 10) {
        callback(new Error('终止号长度小于等于十位'))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (value <= this.addItemDTO.billNo1) {
            callback(new Error('终止号必须大于起始号'))
          } else {
            callback()
          }
        }
      }, 1000)
    }
    return {
      index: 0,
      isEdit: false,
      stockIn: {
        no: '',
        memo: '',
        author: 'test',
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
        ],
        billNo1: [
          { required: true, message: '请填写开始号码', trigger: 'blur' }
        ],
        billNo2: [
          { validator: validatePass, trigger: 'blur' }
        ]
      },
      dialogFormVisible: false
    }
  },
  created () {
    this.getId()
    this.createTable()
  },
  methods: {
    async getId () {
      this.loading = true
      const res = await getBillNumber(this.stockInPageQuery).catch(() => { this.loading = false })
      this.stockIn.no = res.data.no
      console.log(this.addItemDTO)
      this.loading = false
    },
    createTable () {
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid && this.stockIn.addStockInItemDTOArray.length !== 0) {
          // addStockIn(this.stockIn)
          this.$router.push('stockInList')
        } else {
          console.log('error submit!!')
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
    okBtn () {
      this.dialogFormVisible = false
      if (this.isEdit) {
        this.stockIn.addStockInItemDTOArray.splice(this.index, 1)
      }
      this.stockIn.addStockInItemDTOArray.push(this.addItemDTO)
    },
    billCodeChange () {
      for (let i = 0; i < this.billTypes.length; i++) {
        if (this.billTypes[i].code === this.addItemDTO.billCode) {
          this.billType = this.billTypes[i]
        }
      }
      this.addItemDTO.billName = this.billType.name
    },
    billNo2Change () {
      if (this.addItemDTO.billNo1 === '' || this.addItemDTO.billNo2 === '') {
        return
      }
      this.addItemDTO.number = this.addItemDTO.billNo2 - this.addItemDTO.billNo1 + 1
    }
  }
}

</script>
