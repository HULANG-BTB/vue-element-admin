<template>
  <div class="image-template">
    <h1>图片显示模板</h1>
    <div id="img">
      <img
        :src="imgUrl"
        alt="模板图片"
      />
    </div>
    <div style="margin-top: 15px;" />
    <div>
      <el-form
        ref="form"
        :model="nontaxBill"
        label-width="150px"
        :inline="true"
      >
        <el-form-item label="票据代码">
          <el-input
            v-model="nontaxBill.billCode"
            size="small"
          />
        </el-form-item>
        <el-form-item label="票号">
          <el-input
            v-model="nontaxBill.serialCode"
            size="small"
          />
        </el-form-item>
        <el-form-item label="校验码">
          <el-input
            v-model="nontaxBill.checkCode"
            size="small"
          />
        </el-form-item>
        <el-form-item label="交款人">
          <el-input
            v-model="nontaxBill.payerName"
            size="small"
          />
        </el-form-item>
        <el-form-item label="开票日期">
          <el-input
            v-model="nontaxBill.date"
            size="small"
          />
        </el-form-item>
        <el-form-item label="金额合计（小写）">
          <el-input
            v-model="nontaxBill.totalAmount"
            size="small"
          />
        </el-form-item>
        <el-form-item label="金额合计（大写）">
          <el-input
            v-model="nontaxBill.totalAmountCapital"
            size="small"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="nontaxBill.remark"
            size="small"
          />
        </el-form-item>
        <el-form-item label="附加说明">
          <el-input
            v-model="nontaxBill.addition"
            size="small"
          />
        </el-form-item>
        <el-form-item label="收款单位">
          <el-input
            v-model="nontaxBill.agenName"
            size="small"
          />
        </el-form-item>
        <el-form-item label="收款人">
          <el-input
            v-model="nontaxBill.payee"
            size="small"
          />
        </el-form-item>
        <el-form-item label="复核人">
          <el-input
            v-model="nontaxBill.checker"
            size="small"
          />
        </el-form-item>
      </el-form>
      <el-form
        ref="form2"
        :model="nontaxBill"
        label-width="150px"
      >
        <el-form-item
          v-for="(item, index) in nontaxBill.items"
          :key="item.itemCode"
          :label="'收费项目' + (1+index)"
        >
          <el-col :span="4">
            <el-input
              v-model="item.itemCode"
              size="small"
              placeholder="项目编码"
            />
          </el-col>
          <el-col :span="4">
            <el-input
              v-model="item.itemName"
              size="small"
              placeholder="项目名称"
            />
          </el-col>
          <el-col :span="2">
            <el-input
              v-model="item.units"
              size="small"
              placeholder="单位"
            />
          </el-col>
          <el-col :span="2">
            <el-input
              v-model="item.quantity"
              size="small"
              placeholder="数量"
            />
          </el-col>
          <el-col :span="4">
            <el-input
              v-model="item.standardName"
              size="small"
              placeholder="标准"
            />
          </el-col>
          <el-col :span="4">
            <el-input
              v-model="item.amount"
              size="small"
              placeholder="金额"
            />
          </el-col>
          <el-button
            size="small"
            @click.prevent="removeItem(item)"
          >删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            size="small"
            type="primary"
            @click="onSubmit"
          >立即创建</el-button>
          <el-button
            size="small"
            :disabled="addButtonAvailable"
            @click="addItem"
          >新增收费项目</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

import { getImageTemplate, generateImage } from '@/api/image-template'

export default {
  name: 'Image',
  data () {
    return {
      imgUrl: '',
      nontaxBill: {
        addition: '附加说明',
        agenName: '收款单位',
        billCode: '01160201',
        checkCode: '529720',
        checker: '复核人',
        date: '2020-08-10',
        payee: '林强',
        payerName: '张全蛋',
        remark: '备注',
        serialCode: '0000000020',
        totalAmount: '6000.00',
        totalAmountCapital: '陆仟圆整',
        items: [
          {
            amount: '6000.00',
            itemCode: '033022',
            itemName: '高等学校学费',
            quantity: '1',
            standardName: '6000',
            units: '元'
          },
          {
            amount: '6000.00',
            itemCode: '033022',
            itemName: '高等学校学费',
            quantity: '1',
            standardName: '6000',
            units: '元'
          }
        ]
      }
    }
  },
  computed: {
    addButtonAvailable: function () {
      return this.nontaxBill.items.length >= 4
    }
  },
  created () {
    getImageTemplate().then(res => {
      this.setImage(res)
    })
  },
  methods: {
    // 从文件流显示图片
    setImage (blobData) {
      const blob = new Blob([blobData])
      const url = window.URL.createObjectURL(blob)
      console.log(url)
      this.imgUrl = url
    },
    onSubmit () {
      generateImage(this.nontaxBill).then(res => {
        this.setImage(res)
      })
    },
    addItem () {
      this.nontaxBill.items.push({
        amount: '6000.00',
        itemCode: '033022',
        itemName: '高等学校学费',
        quantity: '1',
        standardName: '6000',
        units: '元'
      })
    },
    removeItem (item) {
      const index = this.nontaxBill.items.indexOf(item)
      if (index !== -1) {
        this.nontaxBill.items.splice(index, 1)
      }
    }
  }
}
</script>

<style scoped>
h1 {
  text-align: center;
}

#img {
  text-align: center;
}

.el-input {
  padding-right: 3px;
}
</style>
