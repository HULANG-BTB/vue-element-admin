<template>
  <el-form
    ref="form"
    :model="form"
    label-width="200px"
    label-position="labelPosition"
  >
    <el-row>
      <el-col :span="12">
        <el-form-item
          label="单位"
          label-width="80px"
        >
          <el-input
            v-model="form.unitName"
            :disabled="true"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item
          label="销毁类型"
          label-width="80px"
        >
          <el-select
            v-model="form.type"
            placeholder="选择销毁的票据类型"
          >
            <el-option
              label="库存票据销毁"
              value="库存票据销毁"
            ></el-option>
            <el-option
              label="核销票据销毁"
              value="核销票据销毁"
            ></el-option>
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
            v-model="input"
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-table
        :data="tabledatas"
        border
      >
        <el-table-column
          label="序号"
          width="100px"
          type="index"
          :index="indexMethod"
        >
          <!-- <template slot-scope="scope">
            <el-input
              placeholder="请输入内容"
              v-show="scope.row.show"
              v-model="scope.row.id"
            ></el-input>
            <span v-show="!scope.row.show">{{scope.row.id}}</span>
          </template> -->
        </el-table-column>
        <el-table-column label="票据名称">
          <template slot-scope="scope">
            <el-input
              placeholder="请输入内容"
              v-show="scope.row.show"
              v-model="scope.row.name"
            ></el-input>
            <span v-show="!scope.row.show">{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="票据代码">
          <template slot-scope="scope">
            <el-input
              placeholder="请输入内容"
              v-show="scope.row.show"
              v-model="scope.row.billCode"
            ></el-input>
            <span v-show="!scope.row.show">{{scope.row.billCode}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="计量单位"
          width="100px"
        >
          <template slot-scope="scope">
            <el-input
              placeholder="请输入内容"
              v-show="scope.row.show"
              v-model="scope.row.unitMeasurement"
            ></el-input>
            <span v-show="!scope.row.show">{{scope.row.unitMeasurement}}</span>
          </template>
        </el-table-column>
        <el-table-column label="仓库">
          <template slot-scope="scope">
            <el-input
              placeholder="请输入内容"
              v-show="scope.row.show"
              v-model="scope.row.warehouse"
            ></el-input>
            <span v-show="!scope.row.show">{{scope.row.warehouse}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="数量"
          width="100px"
        >
          <template slot-scope="scope">
            <el-input
              placeholder="请输入内容"
              v-show="scope.row.show"
              v-model="scope.row.number"
            ></el-input>
            <span v-show="!scope.row.show">{{scope.row.number}}</span>
          </template>
        </el-table-column>
        <el-table-column label="起始号">
          <template slot-scope="scope">
            <el-input
              placeholder="请输入内容"
              v-show="scope.row.show"
              v-model="scope.row.beginNumber"
            ></el-input>
            <span v-show="!scope.row.show">{{scope.row.beginNumber}}</span>
          </template>
        </el-table-column>
        <el-table-column label="终止号">
          <template slot-scope="scope">
            <el-input
              placeholder="请输入内容"
              v-show="scope.row.show"
              v-model="scope.row.endNumber"
            ></el-input>
            <span v-show="!scope.row.show">{{scope.row.endNumber}}</span>
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
      <el-col :span="4">
        <el-form-item
          label="申请人"
          label-width="80px"
        >
          <el-input
            v-model="applyName"
            placeholder="请输入编制人"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="3">
        <el-form-item
          label="编制时间"
          label-width="100px"
        >
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="form.date1"
          ></el-date-picker>
        </el-form-item>
      </el-col>
      <!-- <el-col
            class="line"
            :span="0.5"
          >-</el-col> -->
      <el-col :span="1">
        <el-form-item>
          <el-time-picker
            placeholder="选择时间"
            v-model="form.date2"
          ></el-time-picker>

        </el-form-item>
      </el-col>
      <el-col
        :span="14"
        style="padding-left: 400px"
      >
        <el-form-item
          label="状态"
          label-width="40px"
        >
          <el-input
            v-model="form.status"
            :disabled="true"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item>
      <el-button
        type="primary"
        @click="onSubmit"
      >立即创建</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
      return {
        form: {
          unitName: '博思软件股份有限公司',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
          status: '未审核'
        },
        tabledatas: [
          { id: 1, name: '财政专用票据', billCode: '2020',unitMeasurement: '份', warehouse:'A仓库', number: 100, beginNumber: '00000001', endNumber: '00000100', show:true},
          { id: 1, name: '财政专用票据', billCode: '2020',unitMeasurement: '份', warehouse:'A仓库', number: 100, beginNumber: '00000001', endNumber: '00000100', show:true},
          { tab1: 'aaa', tab2: 'bbb' ,show:false},]
      }
    },
    labelPosition: "right",
    methods: {
      onSubmit() {
        console.log('submit!');
      },
      indexMethod(index){
        return index+1;
      }
    }
}
</script>

<style>
</style>
