<template>
  <div class="leftSide">
    <span class="top">{{ year }}年</span>
    <span v-if="leftSideData.showTitle" class="title">{{ leftSideData.showTitle }}</span>
    <div v-if="leftSideData.showSearch ? leftSideData.showSearch:false">
      <el-input
        v-model="filterText"
        placeholder="输入关键字进行过滤"
        class="filterInput"
      />
    </div>
    <div class="leftTree">
      <el-tree
        ref="tree"
        :data="leftSideData.showTreeData"
        :show-checkbox="leftSideData.showCheckBox"
        default-expand-all
        :expand-on-click-node="false"
        :default-expanded-keys="leftSideData.defaultExpand"
        :node-key="leftSideData.key ? leftSideData.key:'id'"
        :props="defaultProps"
        :filter-node-method="filterNode"
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
    },
    year: {
      type: String,
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
        label: 'label'
      },
      sideHeight: {
        height: ''
      },
      filterText: ''
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted () {
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    nodeClick (object, node) {
      this.$emit('treeNodeSearch', object)
    }
  }
}
</script>
<style scoped>
.filterInput{
  margin-top: 10px;
  width:200px;
}
.top{
  display: block;
  color: #aaafb9;
  font-size: 30px;
}
.title{
  text-align: center;
  display: block;
  color: #aaafb9;
  font-size: 30px;
}
.leftSide {
  width: 250px;
  margin-top:20px;
  border-right: 1px solid #cfd7e5;
  text-align: center;
  overflow-y: auto;
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
