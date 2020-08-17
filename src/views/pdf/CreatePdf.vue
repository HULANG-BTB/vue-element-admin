<template>

  <div>
    <p align="center" class="font-type">录入票据PDF文件</p>
    <el-form ref="form" label-width="150px" :model="form" :inline="true">
      <el-form-item label="票据代码:">
        <el-input v-model="form.billCode" class="input-text" />
      </el-form-item>
      <el-form-item label="票号:">
        <el-input v-model="form.serialCode" class="input-text" />
      </el-form-item>
      <el-form-item label="校验码:">
        <el-input v-model="form.checkCode" class="input-text" />
      </el-form-item>
      <el-form-item label="交款人:">
        <el-input v-model="form.payerName" class="input-text" />
      </el-form-item>
      <el-form-item label="开票日期:">
        <el-input v-model="form.date" class="input-text" />
      </el-form-item>
      <el-form-item label="合计金额（小写）:">
        <el-input v-model="form.totalAmount" class="input-text" />
      </el-form-item>
      <el-form-item label="金额合计（大写）:">
        <el-input v-model="form.totalAmountCapital" class="input-text" />
      </el-form-item>
      <el-form-item label="备注:">
        <el-input v-model="form.remark" class="input-text" />
      </el-form-item>
      <el-form-item label="附加说明:">
        <el-input v-model="form.addition" class="input-text" />
      </el-form-item>
      <el-form-item label="收款单位:">
        <el-input v-model="form.agenName" class="input-text" />
      </el-form-item>
      <el-form-item label="收款人:">
        <el-input v-model="form.payee" class="input-text" />
      </el-form-item>
      <el-form-item label="复核人:">
        <el-input v-model="form.checker" class="input-text" />
      </el-form-item>
    </el-form>
    <el-form ref="form2" :model="form" label-width="150px">
      <el-form-item v-for="(item, index) in form.items" :key="item.itemCode" :label="'收费项目' + (1+index)">
        <el-col :span="4">
          <el-input v-model="item.itemCode" size="small" placeholder="项目编码"/>
        </el-col>
        <el-col :span="4">
          <el-input v-model="item.itemName" size="small" placeholder="项目名称"/>
        </el-col>
        <el-col :span="2">
          <el-input v-model="item.units" size="small" placeholder="单位"/>
        </el-col>
        <el-col :span="2">
          <el-input v-model="item.quantity" size="small" placeholder="数量"/>
        </el-col>
        <el-col :span="4">
          <el-input v-model="item.standardName" size="small" placeholder="标准"/>
        </el-col>
        <el-col :span="4">
          <el-input v-model="item.amount" size="small" placeholder="金额"/>
        </el-col>
        <el-button size="small" @click.prevent="removeItem(item)">删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="onSubmit">立即创建</el-button>
        <el-button size="small" :disabled="addButtonAvailable" @click="addItem">新增收费项目</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ShowPdf',
  data() {
    return {
      form: {
        str1: '',
        str2: '',
        billCode: '00010120',
        serialCode: '0000000020',
        checkCode: '',
        payerName: '',
        date: '',
        totalAmount: '',
        totalAmountCapital: '',
        remark: '',
        addition: '',
        agenName: '',
        payee: '',
        checker: '',
        items: [{
          itemCode: '',
          itemName: '',
          units: '',
          quantity: '',
          standardName: '',
          amount: ''
        }]
      }
    }
  },
  computed: {
    addButtonAvailable: function() {
      return this.form.items.length >= 4
    }
  },
  methods: {
    onSubmit () {
      axios({
        method: 'post',
        url: '/createPdf4',
        baseURL: 'http://localhost:8080',
        res: this.from,
        data: {
          'billCode': this.form.billCode,
          'serialCode': this.form.serialCode,
          'checkCode': this.form.checkCode,
          'payerName': this.form.payerName,
          'date': this.form.date,
          'totalAmount': this.form.totalAmount,
          'totalAmountCapital': this.form.totalAmountCapital,
          'remark': this.form.remark,
          'agenName': this.form.agenName,
          'payee': this.form.payee,
          'checker': this.form.checker,
          'items': [{
            'itemCode': this.form.items.itemCode,
            'itemName': this.form.items.itemName,
            'units': this.form.items.units,
            'quantity': this.form.items.quantity,
            'standardName': this.form.items.standardName,
            'amount': this.form.items.amount
          }]
        }
      }).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    },
    addItem() {
      this.form.items.push({
        amount: '6000.00',
        itemCode: '033022',
        itemName: '高等学校学费',
        quantity: '1',
        standardName: '6000',
        units: '元'
      })
    },
    removeItem(item) {
      const index = this.form.items.indexOf(item)
      if (index !== -1) {
        this.form.items.splice(index, 1)
      }
    }
  }
}
</script>

<style scoped>
.input-text{
  width: 200px;
}
.label-inline{
  display: inline-block
}
.font-type{
  font-family: 楷体;
  font-size: 50px
}
</style>
