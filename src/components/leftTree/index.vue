<!--
 * @Author: Raiz
 * @since: Do not edit
 * @lastTime: 2020-08-09 23:45:37
 * @LastEditors: Raiz
 * @Description:
-->
<template>
  <div class="leftSide">
    <span v-if="leftSideData.showTitle" class="title">{{ leftSideData.showTitle }}</span>
    <div v-if="leftSideData.showSearch ? leftSideData.showSearch:false">
      <el-input
        v-model.trim="searchParam"
        placeholder="杜索"
        class="searchInput"
      >
        <el-button slot="append" icon="el-icon-search" @click="submitSearch" />
      </el-input>
    </div>
    <div class="leftTree">
      <el-tree
        ref="tree"
        :data="leftSideData.showTreeData"
        :show-checkbox="leftSideData.showCheckBox"
        :default-expand-all="leftSideData.expand"
        :node-key="leftSideData.key ? leftSideData.key:'id'"
        :props="leftSideData.treeProps ? leftSideData.treeProps:defaultProps"
        :expand-on-click-node="false"
        @node-click="nodeClick"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'LeftTree',
  props: {
    leftSideData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      searchParam: '',
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      sideHeight: {
        height: ''
      }
    }
  },
  watch: {
  },
  mounted () {
  },
  methods: {
    submitSearch () {
      this.$emit('search', this.searchParam)
      this.searchParam = ''
    },
    nodeClick (object, node) {
      const param = {
        id: object.id
      }
      this.$emit('treeNodeSearch', param)
    }
  }
}
</script>
<style scoped>
.searchInput{
  width:300px;
}
.title{
  font-size: 20px;
}
.leftSide {
 width: 320px;
 margin-left:20px;
 margin-top:20px;
 border-right: 1px solid #cfd7e5;
}
.leftTree{
  margin-top: 10px;
}
</style>
<style>
.el-tree-node > .el-tree-node__children {
  width: 100%;
  overflow: visible;
}
.el-tree-node {
  width: 100%;
  overflow: visible;
}
</style>
