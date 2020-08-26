<template>
  <el-container>
    <el-main>
      <el-timeline>
        <el-timeline-item v-if="list[0].fstockInCreateTime" :timestamp="list[0].fstockInCreateTime.substring(0,10)" placement="top">
          <el-card>
            <div class="table">入库详细信息</div>
            <el-table :data="list" style="width: 100%">
              <el-table-column prop="fbillName" label="票据名称" />
              <el-table-column prop="fstockInAuthor" label="入库操作人" />
              <el-table-column prop="fstockInChangeStatus" label="入库审核状态" />
              <el-table-column prop="fstockInWarehouseId" label="入库票据仓库ID" />
            </el-table>
          </el-card>
        </el-timeline-item>
        <el-timeline-item v-if="list[0].fstockOutCreateTime" :timestamp="list[0].fstockOutCreateTime.substring(0,10)" placement="top">
          <el-card>
            <div class="table">出库详细信息</div>
            <el-table :data="list" style="width: 100%">
              <el-table-column prop="fbillName" label="票据名称" />
              <el-table-column prop="fstockOutAuthor" label="出库审核人" />
              <el-table-column prop="fstockOutChangeStatus" label="出库审核状态" />
              <el-table-column prop="fstockOutWarehouseId" label="出库票据仓库ID" />
            </el-table>
          </el-card>
        </el-timeline-item>
        <el-timeline-item v-if="list[0].fwriteoffCreateTime" :timestamp="list[0].fwriteoffCreateTime.substring(0,10)" placement="top">
          <el-card>
            <div class="table">开票详细信息</div>
            <el-table :data="list" style="width: 100%">
              <el-table-column prop="fbillName" label="票据名称" />
              <el-table-column prop="fwriteoffOperator" label="开票操作人" />
              <el-table-column prop="fwriteoffAmt" label="开票票面金额" />
              <el-table-column prop="fwriteoffUnitName" label="开票单位" />
            </el-table>
          </el-card>
        </el-timeline-item>
        <el-timeline-item v-if="list[0].fdestroryCreateTime" :timestamp="list[0].fdestroryCreateTime.substring(0,10)" placement="top">
          <el-card>
            <div class="table">销毁详细信息</div>
            <el-table :data="list" style="width: 100%">
              <el-table-column prop="fbillName" label="票据名称" />
              <el-table-column prop="fdestroryApplyMan" label="销毁审核人" />
              <el-table-column prop="fdestroryStatus" label="销毁审核状态" />
              <el-table-column prop="fdestroryUnitName" label="票据销毁单位" />
            </el-table>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-main>
  </el-container>
</template>

<script>
import {
  getLifeList
} from '@/api/report/report'

export default {
  data () {
    return {
      data: {
        code: this.$route.params.data
      },

      list: [{
        fstockInCreateTime: '',
        fstockOutCreateTime: '',
        fwriteoffCreateTime: '',
        fdestroryCreateTime: ''
      }
      ]
    }
  },
  created () {
    this.getList()
  },
  methods: {
    async getList () {
      this.list = (await getLifeList(this.data)).data
    }
  }

}
</script>

<style>
  .el-timeline-item__timestamp {
    font-size: 16px;
  }
  .table {
    /*text-align: center;*/
    font-size: 16px;
    font-weight: bold
  }
</style>
