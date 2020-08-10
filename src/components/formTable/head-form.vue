<!--
 * @Author: Raiz
 * @since: Do not edit
 * @lastTime: 2020-08-09 23:45:14
 * @LastEditors: Raiz
 * @Description:
-->
<template>
  <div>
    <el-form ref="searchForm" :inline="true" :model="searchForm" size="mini" style="margin-left:10px;">
      <el-form-item
        v-for="item in searchFormData"
        :key="item.label"
        :label="item.label"
        :prop="item.prop"
      >
        <el-input
          v-if="item.type === 'input'"
          v-model.trim="searchForm[item.prop]"
          :placeholder="item.placeholder||'请输入'"
        />
        <el-select
          v-else-if="item.type === 'select'"
          v-model="searchForm[item.prop]"
          :placeholder="item.placeholder||'请输入'"
        >
          <el-option
            v-for="option in item.options"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
        <el-date-picker
          v-else-if="item.type === 'date-range'"
          v-model="searchForm[item.prop]"
          :type="item.showType === ''?'daterange':item.showType"
          :start-placeholder="item.placeholderStart || '开始时间'"
          :range-separator="item.placeholderRange || '-'"
          :end-placeholder="item.placeholderEnd || '结束时间'"
          :format="item.format || 'yyyy-MM-dd'"
          :value-format="item.format || 'yyyy-MM-dd'"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitClick">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'HeadForm',
  props: {
    searchFormData: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      searchForm: {}
    }
  },
  methods: {
    submitClick () {
      const searchParam = { ...this.searchForm }
      this.$emit('sumbitSearch', searchParam)
    }
  }
}
</script>
