<template>
  <div class="item-available-container">
    <el-table v-loading="listLoading" :data="itemavailable" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号" width="100px">
        <template slot-scope="scope">
          <!-- 前端序号如何生成 -->
          <span>{{ scope.$index+1 }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="项目业务码" width="300px">
        <template slot-scope="scope">
          <span>{{ scope.row.mnen }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="项目识别码" width="300px">
        <template slot-scope="scope">
          <span>{{ scope.row.itemCode }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="项目名称" min-width="300px">
        <template slot-scope="scope">
          <span>{{ scope.row.itemName }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'ItemAvailable',
  props: {
    itemavailable: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      listLoading: false
    }
  }
}

</script>
