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
            size="small"
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
            size="small"
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
            size="small"
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
            size="small"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-card shadow="always">
      <div style="height: 260px">
        <div
          class="subject"
          size="small"
        >
          <span>票据销毁申请明细</span>
          <el-button type="primary" size="small" style="float:right" icon="el-icon-plus" circle @click="addApplyOneItem()" />
        </div>
        <el-divider content-position="left">票据销毁申请信息明细</el-divider>
        <el-table
          :data="itemDtoList"
          border
          size="small"
          tooltip-effect="dark"
          class="infinite-list-wrapper"
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
                size="small"
              >
                <el-option
                  v-show="scope.row.show"
                  label="01160201"
                  value="01160201"
                />
              </el-select>
              <span v-show="!scope.row.show" />
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
                size="small"
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
              <span v-show="!scope.row.show" />
            </template>
          </el-table-column>
          <el-table-column
            label="仓库ID"
            width="140px"
          >
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.fWarehouseId"
                placeholder="仓库ID"
                size="small"
              >
                <el-option
                  v-show="scope.row.show"
                  label="0001"
                  value="0001"
                />
              </el-select>
              <span v-show="!scope.row.show" />
            </template>
          </el-table-column>
          <el-table-column
            label="仓库名称"
            width="130px"
          >
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.fWarehouseName"
                placeholder="仓库名称"
                size="small"
              >
                <el-option
                  v-show="scope.row.show"
                  label="A仓库"
                  value="A仓库"
                />
                <span v-show="!scope.row.show" />
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
                size="small"
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
                size="small"
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
                size="small"
              />
              <span v-show="!scope.row.show">{{ scope.row.fBillNo2 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="160px"
          >
            <template slot-scope="scope">
              <el-button type="primary" size="small" icon="el-icon-edit" circle @click="scope.row.show =true" />
              <el-button type="success" size="small" icon="el-icon-check" circle @click="scope.row.show =false" />
              <el-button type="danger" size="small" icon="el-icon-delete" circle @click.prevent="delteItem(index)" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-row style="margin-top:20px;">
      <el-col :span="6">
        <el-form-item
          label="申请人"
          label-width="80px"
        >
          <el-input
            v-model="applyDto.fApplyMan"
            placeholder="请输入申请人"
            size="small"
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
            size="small"
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
            size="small"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row style="text-align:left">
      <el-form-item>
        <el-button
          type="primary"
          size="small"
          @click="addDestroyApply()"
        >立即申请</el-button>
        <el-button size="small" @click="cancel()">取消</el-button>
      </el-form-item>
    </el-row>

  </el-form>
</template>

<script>
import {
  addDestroyApply, getApplyInfoByDestroyNo, updateApplyInfo
} from '@/api/qiuhengGroupApi/destroy/destroyApply'
import { getItemListByDestroyNo } from '@/api/qiuhengGroupApi/destroy/destroyConfirm'
// import destroy from '@/router/modules/qiuhengGroupModule/destroy'
export default {
  props: {
    operateType: {
      type: String,
      default: ''
    }
    // destroyNo: {
    //   type: String,
    //   default: ''
    // }
  },
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
        { fBillName: '', fBillBatchCode: '', fWarehouseId: '', fWarehouseName: '', fNumber: 100, fBillNo1: '0000000001', fBillNo2: '0000000100', show: true }
      ],
      dialogVisible: false
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
  },
  methods: {
    addApplyOneItem () {
      this.itemDtoList.push({
        fBillName: '',
        fBillBatchCode: '',
        fWarehouseId: '',
        fWarehouseName: '',
        fNumber: '',
        fBillNo1: '',
        fBillNo2: '',
        show: true
      })
    },
    delteItem (index) {
      this.itemDtoList.splice(index, 1)
    },
    async addDestroyApply () {
      let fDestroyTypeToBool
      if (this.applyDto.fDestroyType === '核销票据销毁') {
        fDestroyTypeToBool = 0
      } else {
        fDestroyTypeToBool = 1
      }

      let fStatusToInt
      if (this.applyDto.fStatus === '未审核') {
        fStatusToInt = 0
      }
      if (this.applyDto.fStatus === '已审核但未通过') {
        fStatusToInt = 1
      }
      if (this.applyDto.fStatus === '已审核并通过') {
        fStatusToInt = 2
      }
      const applyVo = {
        applyDto: {
          fDestroyNo: this.applyDto.fDestroyNo,
          fUnitName: this.applyDto.fUnitName,
          fDestroyType: fDestroyTypeToBool,
          fDestroyMemo: this.applyDto.fDestroyMemo,
          fApplyMan: this.applyDto.fApplyMan,
          fApplyDate: this.applyDto.fApplyDate,
          fStatus: fStatusToInt,
          fOperatorId: '66623214',
          fOperatorName: '李四',
          fRgnCode: '42',
          fAgenIdCode: this.$store.state.user.agenCode
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

      let fStatusToInt
      if (this.applyDto.fStatus === '未审核') {
        fStatusToInt = 0
      }
      if (this.applyDto.fStatus === '已审核但未通过') {
        fStatusToInt = 1
      }
      if (this.applyDto.fStatus === '已审核并通过') {
        fStatusToInt = 2
      }

      const applyVo = {
        applyDto: {
          fDestroyNo: this.applyDto.fDestroyNo,
          fUnitName: this.applyDto.fUnitName,
          fDestroyType: fDestroyTypeToBool,
          fDestroyMemo: this.applyDto.fDestroyMemo,
          fApplyMan: this.applyDto.fApplyMan,
          fApplyDate: this.applyDto.fApplyDate,
          fStatus: fStatusToInt,
          fOperatorId: '66623214',
          fOperatorName: '李四',
          fRgnCode: '42',
          fAgenIdCode: '1314'
        },
        itemDtoList: this.itemDtoList
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
      this.applyDto = res.data
      if (this.applyDto.fDestroyType === true) {
        this.applyDto.fDestroyType = '库存票据销毁'
      } else {
        this.applyDto.fDestroyType = '核销票据销毁'
      }
      if (this.applyDto.fStatus === 0) {
        this.applyDto.fStatus = '未审核'
      }
      if (this.applyDto.fStatus === 1) {
        this.applyDto.fStatus = '已审核但未通过'
      }
      if (this.applyDto.fStatus === 2) {
        this.applyDto.fStatus = '已审核并通过'
      }
      // console.log(this.applyDto)
    },
    async getItemList (val) {
      const res1 = await getItemListByDestroyNo(val)
      // console.log(res1)
      this.itemDtoList = res1.data
      // console.log(this.itemDtoList)
    }
  }
}
</script>

<style>
</style>
