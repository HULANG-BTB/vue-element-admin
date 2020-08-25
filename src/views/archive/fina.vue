<template>
  <div class="archive-container">

    <div>
      <AgenNameOption v-model="query.agenName" />
      <!-- agen name 组件中获取 -->
      <el-button
        :loading="downloadLoading"
        style="margin:0 0 20px 20px;"
        type="primary"
        icon="el-icon-document"
        @click="queryArchiveInfoByQuery(query)"
      >
        查询
      </el-button>
    </div>

    <div class="agen-archive-list">
      <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
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

        <el-table-column align="center" label="查看详细信息" min-width="120px">
          <template slot-scope="scope">
            <!-- 通过路由传递单位编码 -->
            <!-- 传递到子组件 传递整个对象  -->
            <router-link :to="{name:'info', query: {agenCode:scope.row.agenCode}}">
              <el-button type="primary" size="small" icon="el-icon-view">
                show
              </el-button>
            </router-link>
          </template>
        </el-table-column>

      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="queryArchiveInfos"
      />
    </div>

  </div>
</template>

<script>
import AgenNameOption from './components/AgenNameOption'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
// import ArchiveBaseInfo from './components/ArchiveBaseInfo'
import { fetchArchiveInfos } from '@/api/archive'

export default {
  name: 'Fina',
  components: {
    AgenNameOption,
    Pagination
    // ArchiveBaseInfo
  },
  data () {
    return {
      list: null,
      total: 0,
      // true 开启等待框
      listLoading: false,
      // 将以下2个query对象合并
      listQuery: {
        page: 1,
        limit: 10
      },
      query: {
        agenCode: null,
        agenName: null
      }
    }
  },
  // 初始化时加载归档总览信息
  created () {
    this.queryArchiveInfos(this.query)
  },
  methods: {
    // 获取全部单位的归档总览信息
    queryArchiveInfos (query) {
      this.listLoading = true
      fetchArchiveInfos(query).then(response => {
        this.list = response.data
        this.total = response.data.length
        this.listLoading = false
      })
    },

    // 根据公司编码或者公司名称进行模糊查询
    queryArchiveInfoByQuery (query) {
      this.listLoading = false
      fetchArchiveInfos(query).then(response => {
        this.list = response.data
        this.total = response.data.length
        this.listLoading = false
      })
    }

  }
}
</script>

<style scoped>
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
  </style>
