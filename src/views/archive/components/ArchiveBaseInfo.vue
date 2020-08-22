<template>
  <div class="agen-archive">
    <el-table :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="单位编码" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.agenCode }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="单位名称" min-width="250px">
        <template slot-scope="scope">
          <span>{{ scope.row.agenName }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="领用数量">
        <template slot-scope="scope">
          <span>{{ scope.row.applyNumber }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="使用数量">
        <template slot-scope="scope">
          <span>{{ scope.row.useNumber }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="已审验">
        <template slot-scope="scope">
          <span>{{ scope.row.authorNumber }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="未审验">
        <template slot-scope="scope">
          <span>{{ scope.row.unAuthorNumber }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 向子组件传递参数 -->
    <ArchiveTabs
      :list.sync="list"
      :agencode.sync="query.agenCode"
    /></div>
</template>

<script>
import ArchiveTabs from './ArchiveTabs'
import { fetchAgenArchiveDetail } from '@/api/archive'

export default {
  name: 'ArchiveBaseInfo',
  components: {
    ArchiveTabs
  },
  props: {
    agencode: {
      type: String,
      required: true,
      defaule () {
        return ''
      }
    }
  },
  data () {
    return {
      list: [],
      // 查询对象
      query: {
        agenCode: '',
        agenName: ''
      }
    }
  },
  // 获取财政主界面的详细信息
  created () {
    // console.log(this.$route)
    // console.log(this.agencode)
    // console.log(this.$route.query.agenCode.length)
    // console.log(this.agencode)
    // console.log(this.agencode.length)
    if (this.agencode !== undefined) {
      console.log('bbbbb')
      if (this.agencode.length !== 0) {
        this.query.agenCode = this.agencode
      }
    } else if (this.$route.query.agenCode.length !== 0) {
      console.log('aaaaa')
      console.log(this.$route.query.agenCode)
      this.query.agenCode = this.$route.query.agenCode
    }

    this.getAgenDetail()
    // this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    // 获取单位详细信息
    getAgenDetail () {
      this.listLoading = true
      fetchAgenArchiveDetail(this.query).then(response => {
        this.list.push(response.data)
        this.listLoading = false
      })
    }

  }
}

</script>
