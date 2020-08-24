<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" size="small" placeholder="请输入搜索内容" style="width: 200px;margin-right: 20px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.accountType" size="small" placeholder="入账方式" clearable class="filter-item" style="width: 110px;margin-right: 20px;">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" size="small" placeholder="排序方式" style="width: 110px;margin-right: 20px;" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves size="small" style="margin-right: 10px" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves size="small" style="margin-right: 10px" class="filter-item" type="primary" icon="el-icon-delete" :disabled="multiple" @click="handleBatchDelete">
        删除
      </el-button>
      <el-button v-waves size="small" class="filter-item" style="margin-right: 10px;" type="primary" icon="el-icon-refresh" @click="handleFilter">
        刷新
      </el-button>
      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:10px;" @change="tableKey=tableKey+1">
        操作人
      </el-checkbox>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;margin-top:20px"
      height="620px"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
    >
      <!--复选框-->
      <el-table-column type="selection" align="center" />
      <!--入账凭证号-->
      <el-table-column label="入账凭证号" prop="accountId" sortable="custom" align="center" width="175px" :class-name="getSortClass('accountId')">
        <template slot-scope="{row}">
          <span>{{ row.accountId }}</span>
        </template>
      </el-table-column>
      <!--票据号码-->
      <el-table-column label="票据号码" align="center" width="100px">
        <template slot-scope="{row}">
          <span>{{ row.billNo }}</span>
        </template>
      </el-table-column>
      <!--开票时间-->
      <el-table-column label="开票时间" width="165px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.agenTime }}</span>
        </template>
      </el-table-column>
      <!--单位名称+单位代码-->
      <el-table-column label="开票单位" width="200px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.agenName }}</span>
          <span> | </span>
          <!--单位代码-->
          <el-tag>{{ row.agenIdcode }}</el-tag>
        </template>
      </el-table-column>
      <!--票据校验码-->
      <el-table-column label="票据校验码" align="center" width="100px">
        <template slot-scope="{row}">
          <span>{{ row.billSerialId }}</span>
        </template>
      </el-table-column>
      <!--开票点(id)-->
      <el-table-column label="开票点" width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.placeId }}</span>
        </template>
      </el-table-column>
      <!--操作人-->
      <el-table-column v-if="showReviewer" label="操作人" width="80px" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.operator }}</span>
        </template>
      </el-table-column>
      <!--应缴金额-->
      <el-table-column label="应缴金额" align="center" width="100px">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.waitAccount }}</span>
        </template>
      </el-table-column>
      <!--入账金额-->
      <el-table-column label="入账金额" align="center" width="100px">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.account }}</span>
        </template>
      </el-table-column>
      <!--入账方式-->
      <el-table-column label="入账方式" align="center" width="100px">
        <template slot-scope="{row}">
          <span v-if="row.accountType == 1">支付宝</span>
          <span v-if="row.accountType == 2">微信</span>
          <span v-if="row.accountType == 3">现金</span>
          <span v-if="row.accountType == 4">其它</span>
        </template>
      </el-table-column>
      <el-table-column label="行为" align="center" min-width="150px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" style="padding: 0; position: absolute; right: 20px" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!--修改信息子页面-->
    <el-dialog title="修改入账凭证信息" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="入账类型" prop="accountType">
          <el-select v-model="temp.accountType" class="filter-item" placeholder="选择入账类型">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="单位编码" prop="agenIdcode">
          <el-input v-model="temp.agenIdcode" />
        </el-form-item>
        <el-form-item label="单位名称" prop="agenName">
          <el-input v-model="temp.agenName" />
        </el-form-item>
        <el-form-item label="开票地点" prop="placeId">
          <el-input v-model="temp.placeId" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listByPage, deleteById, batchDelete, updateVoucher } from '@/api/voucher'
import waves from './directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: '1', display_name: '支付宝' },
  { key: '2', display_name: '微信' },
  { key: '3', display_name: '现金' },
  { key: '4', display_name: '其它' }
]

const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    typeFilter (type) {
      return calendarTypeKeyValue[type]
    }
  },
  data () {
    return {
      // 不选择单个就禁用
      single: true,
      // 不选择多个就禁用
      multiple: true,
      // 选中数组
      accountIds: [],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      // 用于查询
      listQuery: {
        page: 1,
        limit: 10,
        keyword: undefined,
        accountType: undefined,
        sort: '+accountId'
      },
      calendarTypeOptions,
      sortOptions: [{ label: '升序', key: '+accountId' }, { label: '降序', key: '-accountId' }],
      showReviewer: false,
      // 用于修改时保存表单信息
      temp: {
        accountId: undefined,
        accountType: '',
        agenIdcode: '',
        agenName: '',
        placeId: ''
      },
      dialogFormVisible: false,
      rules: {
        agenIdcode: [{ required: true, message: '必须填写单位代码', trigger: 'change' }],
        accountType: [{ required: true, message: '必须选择入账类型', trigger: 'change' }],
        agenName: [{ required: true, message: '单位名称必须填写', trigger: 'blur' }],
        placeId: [{ required: true, message: '开票地址必须填写', trigger: 'change' }]
      },
      downloadLoading: false
    }
  },
  created () {
    this.getList()
  },
  methods: {
    // 初始化页面数据
    getList () {
      this.listLoading = false
      listByPage(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter () {
      this.listQuery.page = 1
      this.getList()
    },
    // 单行删除
    handleDelete (row) {
      const deleteData = { accountId: row.accountId }
      this.$confirm('是否确认删除角色编号为"' + row.accountId + '"的数据项?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return deleteById(deleteData)
      }).then(response => {
        response.message
      }).then(() => {
        this.getList()
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      }).catch(function () {
      })
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.accountIds = selection.map(item => item.accountId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 批量删除
    handleBatchDelete () {
      const accountIds = this.accountIds
      // 对象数组
      var Obj = []
      for (let index = 0; index < accountIds.length; index++) {
        Obj.push({ accountId: accountIds[index] })
      }
      this.$confirm('是否确认删除角色编号为"' + accountIds + '"的数据项?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return batchDelete(Obj)
      }).catch(function () {
      }).then(() => {
        this.getList()
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },
    sortChange (data) {
      const { prop, order } = data
      if (prop === 'accountId') {
        this.sortByID(order)
      }
    },
    sortByID (order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+accountId'
      } else {
        this.listQuery.sort = '-accountId'
      }
      this.handleFilter()
    },
    resetTemp () {
      this.temp = {
        keyword: undefined
      }
    },
    // 更新数据
    handleUpdate (row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.agenTime = new Date((this.temp.agenTime).String)
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateVoucher(tempData).then(() => {
            const index = this.list.findIndex(v => v.accountId === this.temp.accountId)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 20000
            })
          })
        }
      })
    },
    getSortClass: function (key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}

</script>

