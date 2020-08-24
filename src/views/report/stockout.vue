<template>
  <div>
    票据出库
    <el-table
      :data="roleTableData"
      border
      stripe
    >
      <el-table-column prop="fid" label="ID" width="100px" />
      <el-table-column prop="fname" label="姓名" width="100px" />
      <el-table-column prop="frole" label="角色" width="300px" />
      <el-table-column prop="fdescription" label="描述" width="200px" />
    </el-table>
  </div>
</template>

<script>
import { getRoleList } from '@/api/userManager/role'

export default {

  data () {
    return {
      roleTableData: []
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    // 获取角色列表
    async getRoleList (reload) {
      const res = await getRoleList()
      this.roleTableData = res
    }
  }
}
</script>

<style>

</style>
