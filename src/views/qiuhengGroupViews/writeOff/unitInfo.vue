<template>
  <el-form
    :label-position="labelPosition"
    label-width="80px"
    :model="form"
  >
    <el-row>
      <el-col :span="8">
        <el-form-item label="单位ID">
          <span>{{ unitInfo.no }}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="10">
        <el-form-item label="申请单位">
          <span>{{ unitInfo.name }}</span>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
<<<<<<< HEAD
=======

>>>>>>> f1094634b6f4f2cc9be4a846ff9413dbf02cb4d5
import { getUnitDetails } from '@/api/qiuhengGroupApi/writeOff/writeOff'

export default {
  props: {
    unitInfo: {
      name: {
        type: String,
        default: '单位名称'
      },
      no: {
        type: String,
        default: '单位编码'
      }
    }
  },
  data () {
    return {
      // 属性区
    }
  },
  methods: {
    // 方法区
    async getData () {
      const params = {
        unitId: this.unitInfo.no
      }
      const res = await getUnitDetails(params)
      alert(res)
    }
  }

}
</script>

<style>
</style>
