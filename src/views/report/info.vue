<template>
  <div>
    <el-contanier>
      <el-button v-print="'#printMe'">打印表格</el-button>
      {{ form.date }}{{ new Date() }}
      <el-form ref="form" :inline="true" :model="form" label-width="70px" size="small" style="margin-top:20px">
        <el-form-item label="单号">
          <el-input v-model="form.name" style="width:150px" />
        </el-form-item>

        <el-form-item label="通知日期">
          <el-date-picker
            v-model="form.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width:300px"
            format="yyyy/MM/dd"
            value-format="yyyy:MM:dd HH:mm:ss"
          />

        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="form.region" placeholder="请选择" style="width:130px">
            <el-option label="部分入库" value="shanghai" />
            <el-option label="全部入库" value="beijing" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary"><i class="el-icon-search" />查询</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" style="margin-left:100px" @click="dialogVisible = true">高级搜索<i class="el-icon-search" /></el-button>
        </el-form-item>
      </el-form>
      <el-table
        id="printMe"
        :data="payment"
        border
        stripe
        highlight-current-row
        size="mini"
        style="width: 90%;margin: 0 auto"
        :header-cell-style="{background:'rgb(48,65,86)',color:'white'}"
      >
        <el-table-column
          prop="payItem"
          label="收费项目"
          width="180"
        />
        <el-table-column
          prop="payStandard"
          label="收费标准"
          width="180"
        />
        <el-table-column
          prop="payAmount"
          label="应缴金额"
        />
        <el-table-column
          size="large"
          label="查看详情"
        ><el-button icon="el-icon-notebook-2" circle @click="$router.push('/report/life')" /></el-table-column>
      </el-table>
    </el-contanier>
    <el-dialog top="20vh" title="高级查询" :visible.sync="dialogVisible" :close-on-click-modal="false" width="40%">
      <el-form ref="form1" :model="form1" label-width="70px" style="margin-top:10px">
        <el-form-item label="业务单号">
          <el-input v-model="form1.id" placeholder="业务单号" />
        </el-form-item>
        <el-form-item label="印制单位">
          <el-select v-model="form1.danwei" placeholder="请选择">
            <el-option label="A印刷厂" value="A" />
            <el-option label="B印刷厂" value="B" />
          </el-select>
        </el-form-item>
        <el-form-item label="票据类型">
          <el-select v-model="form1.type" placeholder="请选择">
            <el-option label="A票据" value="A" />
            <el-option label="B票据" value="B" />
          </el-select>
        </el-form-item>
        <el-form-item label="通知日期">
          <el-date-picker v-model="form1.date1" type="date" style="width:180px" format="yyyy/MM/dd" />
          至
          <el-date-picker v-model="form1.date2" type="date" style="width:180px" format="yyyy/MM/dd" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">查 询</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {

  data () {
    return {
      payment: [
        {
          'payItem': '本专科学费',
          'payStandard': 5600,
          'payAmount': 5600
        },
        {
          'payItem': '住宿费',
          'payStandard': 5600,
          'payAmount': 5600
        },
        {
          'payItem': '教材费',
          'payStandard': 5600,
          'payAmount': 5600
        },
        {
          'payItem': '其他',
          'payStandard': '...',
          'payAmount': '...'
        }
      ],
      form: {
        name: '',
        region: '',
        date: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      form1: {
        id: '',
        danwei: '',
        type: '',
        data1: '',
        data2: ''
      },
      dialogVisible: false
    }
  }

}
</script>

<style>

</style>
