<template>
  <el-card class="card">
    <div slot="header" class="clearfix">
      <span>{{ cardname }}</span>
    </div>
    <div v-for="item in items" :key="item" class="text item">
      {{ item }}
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'BillSummaryCard',
  props: {
    cardname: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      required: true
    }
  }
}
</script>
