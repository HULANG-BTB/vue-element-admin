<template>
  <!-- v-model="agenInfo" -->
  <div class="agen-info-container">
    <table>
      <tr>
        <th>单位编码</th>
        <td>{{ agenInfo.agenCode }}</td>
        <th>单位名称</th>
        <td>{{ agenInfo.agenName }}</td>
      </tr>
      <tr>
        <th>主管部门</th>
        <td>{{ agenInfo.deptName }}</td>
        <th>级次</th>
        <td>{{ agenInfo.level }}</td>
      </tr>
      <tr>
        <th>单位分类</th>
        <td>{{ agenInfo.kindName }}</td>
        <th>单位负责人</th>
        <td>{{ agenInfo.linkMan }}</td>
      </tr>
      <tr>
        <th>单位助记码</th>
        <td>{{ agenInfo.mnem }}</td>
        <th>组织机构代码</th>
        <td>{{ agenInfo.orgCode }}</td>
      </tr>
      <tr>
        <th>单位地址</th>
        <td>{{ agenInfo.linkAddr }}</td>
        <th>生效时间</th>
        <!-- 时间不对时尝试*1000 -->
        <td>{{ agenInfo.createTime | parseTime }}</td>
      </tr>

    </table>
  </div>
</template>
<script>
// 时间格式转化
import { parseTime } from '@/utils/index'
export default {
  // 日期格式转换
  filters: {
    parseTime (time) {
      var date = new Date(time)
      return parseTime(date, '{y}-{m}-{d} {h}:{i}:{s}')
    }
  },
  props: {
    agenInfo: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
  }
}
</script>
<style scoped>
  div{
    padding-top: 30px;
  }
  table{
    font: 15px/1.5 Tahoma,Helvetica,Arial,'宋体',sans-serif;
    min-height: 300px;
    min-width: 1490px;
    border-collapse: collapse;
    margin: auto;
  }
  table th{
    min-width: 150px;
    border:1px solid #EBEEF5;
    background-color:whitesmoke
  }
  table td{
    min-width: 300px;
    color: #606266;
    border:1px solid #EBEEF5;
    text-align: center;
  }
</style>
