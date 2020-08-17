<template>
  <el-form
    :model="applyDto"
    label-width="200px"
    label-position="labelPosition"
  >
    <el-row>
      <el-col :span="12">
        <el-form-item
          label="申请单号"
          label-width="80px"
        >
          <el-input
            v-model="applyDto.fDestroyNo"
            disabled
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item
          label="单位"
          label-width="80px"
        >
          <el-input
            v-model="applyDto.fUnitName"
            :disabled="true"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item
          label="销毁类型"
          label-width="222px"
        >
          <el-select
            v-model="applyDto.fDestroyType"
            placeholder="选择销毁的票据类型"
          >
            <el-option
              label="库存票据销毁"
              value="库存票据销毁"
            />
            <el-option
              label="核销票据销毁"
              value="核销票据销毁"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="21">
        <el-form-item
          label="备注"
          label-width="80px"
        >
          <el-input
            v-model="applyDto.fDestroyMemo"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-table
        :data="itemDtoList"
        border
      >
        <el-table-column
          label="序号"
          width="50px"
          type="index"
          :index="indexMethod"
        />
        <el-table-column
          label="票据名称"
          width="180px"
        >
          <template slot-scope="scope">
            <el-input
              v-show="scope.row.show"
              v-model="scope.row.billName"
              placeholder="票据名称"
            />
            <span v-show="!scope.row.show">{{ scope.row.billName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="票据代码">
          <template slot-scope="scope">
            <el-input
              v-show="scope.row.show"
              v-model="scope.row.fBillBatchCode"
              placeholder="票据代码"
            />
            <span v-show="!scope.row.show">{{ scope.row.fBillBatchCode }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="仓库ID"
          width="100px"
        >
          <template slot-scope="scope">
            <el-input
              v-show="scope.row.show"
              v-model="scope.row.fWarehouseId"
              placeholder="仓库ID"
            />
            <span v-show="!scope.row.show">{{ scope.row.fWarehouseId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="仓库名称">
          <template slot-scope="scope">
            <el-input
              v-show="scope.row.show"
              v-model="scope.row.fWarehouseName"
              placeholder="仓库名称"
            />
            <span v-show="!scope.row.show">{{ scope.row.fWarehouseName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="数量"
          width="100px"
        >
          <template slot-scope="scope">
            <el-input
              v-show="scope.row.show"
              v-model="scope.row.fNumber"
              placeholder="数量"
            />
            <span v-show="!scope.row.show">{{ scope.row.fNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="起始号">
          <template slot-scope="scope">
            <el-input
              v-show="scope.row.show"
              v-model="scope.row.fBillNo1"
              placeholder="起始号"
            />
            <span v-show="!scope.row.show">{{ scope.row.fBillNo1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="终止号">
          <template slot-scope="scope">
            <el-input
              v-show="scope.row.show"
              v-model="scope.row.fBillNo2"
              placeholder="终止号"
            />
            <span v-show="!scope.row.show">{{ scope.row.fBillNo2 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="200px"
        >
          <template slot-scope="scope">
            <el-button @click="scope.row.show =true">编辑</el-button>
            <el-button @click="scope.row.show =false">保存</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <el-col :span="6">
        <el-form-item
          label="申请人"
          label-width="80px"
        >
          <el-input
            v-model="applyDto.fApplyMan"
            placeholder="请输入申请人"
          />
        </el-form-item>
      </el-col>
      <el-col :span="9">
        <el-form-item
          label="申请时间"
          label-width="200px"
        >
          <el-input
            v-model="applyDto.fApplyDate"
            :disabled="true"
          />
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item
          label="状态"
          label-width="130px"
        >
          <el-input
            v-model="applyDto.fStatus"
            :disabled="true"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item>
      <el-button
        type="primary"
        @click="addDestroyApply()"
      >立即申请</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {
  addDestroyApply
} from '@/api/qiuhengGroupApi/destroy/destroyApply'
export default {
  data () {
    return {
      applyDto: {
        fDestroyNo: '',
        fUnitName: '博思软件股份有限公司',
        fDestroyType: '',
        fDestroyMemo: '',
        fApplyMan: '',
        fApplyDate: new Date().toLocaleString(),
        fStatus: '未审核'
      },
      itemDtoList: [
        { fBillBatchCode: '13412321', fWarehouseId: '213213', fWarehouseName: 'A仓库', fNumber: 100, fBillNo1: '00000001', fBillNo2: '00000100', show: true },
        { fBillBatchCode: '13412321', fWarehouseId: '213213', fWarehouseName: 'A仓库', fNumber: 66, fBillNo1: '00000120', fBillNo2: '00000186', show: true }
      ]
    }
  },

  labelPosition: 'right',
  created () {
    this.applyDto.fDestroyNo = this.randomNumber()
    console.log(this.applyDto.fDestroyNo)
  },
  methods: {
    async addDestroyApply () {
      let fDestroyTypeToBool
      if (this.applyDto.fDestroyType === '核销票据销毁') {
        fDestroyTypeToBool = 0
      } else {
        fDestroyTypeToBool = 1
      }

      let fStatusToBool
      if (this.applyDto.fStatus === '未审核') {
        fStatusToBool = 0
      } else {
        fStatusToBool = 1
      }

      const applyVo = {
        applyDto: {
          fDestroyNo: this.applyDto.fDestroyNo,
          fUnitName: this.applyDto.fUnitName,
          fDestroyType: fDestroyTypeToBool,
          fDestroyMemo: this.applyDto.fDestroyMemo,
          fApplyMan: this.applyDto.fApplyMan,
          fApplyDate: this.applyDto.fApplyDate,
          fStatus: fStatusToBool,
          fOperatorId: '66623214',
          fOperatorName: '李四',
          fRgnCode: '42',
          fAgenIdCode: '1314'
        },
        itemDtoList: this.itemDtoList
      }

      this.$confirm('是否立即创建票据销毁申请, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await addDestroyApply(applyVo)
        console.log(res)
        this.$message({
          type: 'success',
          message: '创建票据销毁申请成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    indexMethod (index) {
      return index + 1
    },
    // 生成流水号
    randomNumber () {
      const now = new Date()
      const month = now.getMonth() + 1
      const day = now.getDate()
      const hour = now.getHours()
      const minutes = now.getMinutes()
      const seconds = now.getSeconds()
      return now.getFullYear().toString() + month.toString() + day + hour + minutes + seconds + (Math.round(Math.random() * 23 + 100)).toString()
    }
  }
}
</script>

<style>
</style>
