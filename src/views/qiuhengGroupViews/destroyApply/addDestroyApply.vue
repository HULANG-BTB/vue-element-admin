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
          style="color: green"
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
          label="票据代码"
          width="160px"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.fBillBatchCode"
              placeholder="选择票据代码"
            >
              <el-option
                v-show="scope.row.show"
                label="01160220"
                value="01160220"
              />
            </el-select>
            <span v-show="!scope.row.show">{{ scope.row.fBillBatchCode }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="票据名称"
          width="220px"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.fBillName"
              placeholder="选择票据种类"
            >
              <el-option
                v-show="scope.row.show"
                label="中央非税收入统一票据"
                value="中央非税收入统一票据"
              />
            </el-select>
            <!-- <el-input
              v-show="scope.row.show"
              v-model="scope.row.billName"
              placeholder="票据名称"
            /> -->
            <span v-show="!scope.row.show">{{ scope.row.billName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="仓库ID"
          width="140px"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.fWarehouseId"
              placeholder="选择仓库ID"
            >
              <el-option
                v-show="scope.row.show"
                label="0001"
                value="0001"
              />
            </el-select>
            <span v-show="!scope.row.show">{{ scope.row.fWarehouseId }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="仓库名称"
          width="160px"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.fWarehouseName"
              placeholder="选择仓库名称"
            >
              <el-option
                v-show="scope.row.show"
                label="A仓库"
                value="A仓库"
              />
              <span v-show="!scope.row.show">{{ scope.row.fWarehouseName }}</span>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          label="数量"
          width="80px"
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
        <el-table-column
          label="起始号"
          width="140px"
        >
          <template slot-scope="scope">
            <el-input
              v-show="scope.row.show"
              v-model="scope.row.fBillNo1"
              placeholder="起始号"
            />
            <span v-show="!scope.row.show">{{ scope.row.fBillNo1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="终止号"
          width="140px"
        >
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
          width="180px"
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
      <div v-if="operateType == '新增票据销毁申请'">
        <el-button
          type="primary"
          @click="addDestroyApply()"
        >立即申请</el-button>
        <el-button @click="cancel()">取消</el-button>
      </div>
      <div v-if="operateType == '修改票据销毁申请信息'">
        <el-button
          type="primary"
          @click="updateApplyInfo()"
        >立即修改</el-button>
        <el-button @click="cancel()">取消</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
import {
  addDestroyApply, getApplyInfoByDestroyNo, updateApplyInfo
} from '@/api/qiuhengGroupApi/destroy/destroyApply'
import { getItemListByDestroyNo } from '@/api/qiuhengGroupApi/destroy/destroyConfirm'
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
        { fBillName: '', fBillBatchCode: '', fWarehouseId: '', fWarehouseName: '', fNumber: 100, fBillNo1: '0000000001', fBillNo2: '0000000100', show: true },
        { fBillName: '', fBillBatchCode: '', fWarehouseId: '', fWarehouseName: '', fNumber: 66, fBillNo1: '0000000120', fBillNo2: '0000000186', show: true }
      ],
      dialogVisible: false,
      operateType: 'aa'
    }
  },

  labelPosition: 'right',
  created () {
    this.$root.eventBus.$on('fDestroyNo', (val) => {
      this.applyDto.fDestroyNo = val
    })
    this.$root.eventBus.$on('fDestroyNoUpdate', (val) => {
      this.getApplyInfo(val)
      this.getItemList(val)
    })
    this.$root.eventBus.$on('operateType', (val) => {
      this.operateType = val
      console.log(this.operateType)
    })
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
        await addDestroyApply(applyVo)
        this.$root.eventBus.$emit('dialogVisible1', this.dialogVisible)
        // console.log(res)
        this.$router.push
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
    async updateApplyInfo () {
      let fDestroyTypeToBool
      if (this.applyDto.fDestroyType === '核销票据销毁') {
        fDestroyTypeToBool = 0
      } else {
        fDestroyTypeToBool = 1
      }

<<<<<<< HEAD
      indexMethod(index){
        return index+1;
=======
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
>>>>>>> 20fb2d9a2f26e6e65345eb942e1392643d7af1a9
      }
      this.$confirm('是否立即修改票据销毁申请信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await updateApplyInfo(applyVo)
        this.$root.eventBus.$emit('dialogVisible1', this.dialogVisible)
        // console.log(res)
        this.$router.push
        this.$message({
          type: 'success',
          message: '修改票据销毁申请信息成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    indexMethod (index) {
      return index + 1
    },
    cancel () {
      this.$root.eventBus.$emit('dialogVisibleCancel', this.dialogVisible)
    },
    async getApplyInfo (val) {
      const res = await getApplyInfoByDestroyNo(val)
      // console.log(res)
      this.applyDto = res
      if (this.applyDto.fDestroyType === true) {
        this.applyDto.fDestroyType = '库存票据销毁'
      } else {
        this.applyDto.fDestroyType = '核销票据销毁'
      }
<<<<<<< HEAD
  

=======
      if (this.applyDto.fStatus === true) {
        this.applyDto.fStatus = '已审核'
      } else {
        this.applyDto.fStatus = '未审核'
      }
      // console.log(this.applyDto)
    },
    async getItemList (val) {
      const res1 = await getItemListByDestroyNo(val)
      // console.log(res1)
      this.itemDtoList = res1
      // console.log(this.itemDtoList)
    }
  }
>>>>>>> 20fb2d9a2f26e6e65345eb942e1392643d7af1a9
}
</script>

<style>
</style>
