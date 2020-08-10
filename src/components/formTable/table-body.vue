<!--
 * @Author: Raiz
 * @since: Do not edit
 * @lastTime: 2020-08-10 12:46:39
 * @LastEditors: Raiz
 * @Description:
-->
<template>
  <div :style="windowHeight">
    <buttons
      v-for="item in tableData.headButtonData"
      :key="item.name"
      :button-data="item"
      @click="tableHeadButtonClick"
    />
    <div style="margin-left:10px; margin-top:10px;">
      <el-table
        ref="table"
        :data="tableData.bodyData"
        :height="tableHeight"
        :empty-text="tableColumnData.emptyText || '暂无数据'"
        size="small"
        style="width:900px;"
        highlight-current-row
        @selection-change="tableSelectionChange"
      >
        <el-table-column
          v-if="tableColumnData.select"
          fixed="left"
          type="selection"
          width="50"
          align="center"
        />
        <el-table-column fixed="left" label="序号" width="50" type="index" align="center" />
        <el-table-column
          v-for="item in tableColumnData.column"
          :key="item.prop"
          :label="item.label"
          :prop="item.prop"
          align="center"
          :width="item.width?item.width:120"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-tag
              v-if="ifShowTag(item.prop)"
              class="clickTag"
              :type="tableTagType(item.prop,scope.row)"
              size="small"
              @click="tableTagClick(item.prop,scope.row)"
            >
              <span v-if="ifReData(item.prop)">{{ tableReData(item.prop,scope.row) }}</span>
              <span v-else>{{ scope.row[item.prop] }}</span>
            </el-tag>

            <span v-else-if="ifReData(item.prop)">{{ tableReData(item.prop,scope.row) }}</span>
            <span v-else>{{ scope.row[item.prop] }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="tableColumnData.operation && tableColumnData.operation.length > 0"
          fixed="right"
          label="操作"
          align="center"
          :width="150"
        >
          <template slot-scope="scope" class="buttonColumn">
            <tipButton
              v-for="item in tableColumnData.operation"
              :key="item.name"
              :button-data="item"
              @click="tableButtonClick(item.name,scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="page.pageNum"
        :page-size="page.pageSize"
        layout="total, prev, pager, next, jumper,sizes"
        :page-sizes="[5,10]"
        :total="total"
        class="pagination"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script>

import tipButton from '@/components/Button/tip-button'
import buttons from '@/components/Button/index'
export default {
  components: {
    tipButton,
    buttons
  },
  props: {
    tableData: {
      type: Object,
      default () {
        return {}
      }
    },
    tableColumnData: {
      type: Object,
      default () {
        return {}
      }
    },
    total: {
      type: Number,
      default () {
        return 0
      }
    }
  },
  data () {
    return {
      page: {
        pageNum: 1,
        pageSize: 10
      },
      maxHeight: 800,
      windowHeight: { height: window.innerHeight - 150 + 'px' },
      tableHeight: window.innerHeight - 240,
      resizable: false
    }
  },
  mounted () {
  },
  methods: {
    tableHeadButtonClick (name) {
      this.$emit('tableHeadButtonClick', name)
    },
    ifShowTag (prop) {
      if (this.tableColumnData.showTag && this.tableColumnData.showTag.props.indexOf(prop) > -1) {
        return true
      }
      return false
    },
    ifReData (prop) {
      if (this.tableColumnData.reData && this.tableColumnData.reData.props.indexOf(prop) > -1) {
        return true
      }
      return false
    },
    tableTagType (prop, row) {
      return this.tableColumnData.showTag.tagType[prop][row[prop]]
    },
    tableReData (prop, row) {
      return this.tableColumnData.reData.newData[prop][row[prop]]
    },
    tableTagClick (prop, row) {
    },
    handleCurrentChange (index) {
      this.$emit('pageNumChange', index)
    },
    handleSizeChange (size) {
      this.$emit('pageSizeChange', size)
    },
    tableSelectionChange (rows) {
      this.$emit('tableSelectionChange', rows)
    },
    tableButtonClick (name, row) {
      this.$emit('tableButtonClick', name, row)
    }
  }
}
</script>
<style scoped>
.pagination{
  margin-top:10px;
  position: absolute;
}
</style>
