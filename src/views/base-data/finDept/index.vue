<template>
  <div class="content">
    <el-form ref="searchForm" :inline="true" :model="queryData">
      <el-form-item label="部门名称：" prop="findeptName">
        <el-input
          v-model="queryData.findeptName"
          placeholder="部门名称"
          size="small"
          style="width:200px"
        />
      </el-form-item>

      <el-form-item label="是否启用：" prop="isEnable">
        <el-select v-model="queryData.isEnable" placeholder="请选择部门状态 " size="small">
          <el-option label="启用" value="true" />
          <el-option label="禁用" value="false" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button plain size="small" type="primary" @click="query">查询</el-button>
        <el-button plain size="small" type="primary" @click="handleAdd">新增</el-button>
        <el-button plain size="small" type="primary" @click="clearSearchForm">清空</el-button>
      </el-form-item>
    </el-form>
    <!-- 弹出框 -->
    <el-dialog :title="formTitle" :visible.sync="dialogFormVisible" @close="handleClose">
      <el-form ref="popForm" :model="saveData" :rules="popForm.rules" label-width="120px">
        <el-form-item label="部门名称" prop="findeptName">
          <el-input v-model="saveData.findeptName" style="width:86% " />
        </el-form-item>
        <el-form-item label="部门编码" prop="findeptCode">
          <el-input v-model="saveData.findeptCode" style="width:86% " />
        </el-form-item>
        <el-form-item label="区划编码" prop="rgnCodeArray">
          <el-cascader
            v-model="saveData.rgnCodeArray"
            :options="cascader.data"
            :props="cascader.props"
            :show-all-levels="true"
          />
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="saveData.linkman" style="width:86% " />
        </el-form-item>
        <el-form-item label="联系人电话" prop="linkTel">
          <el-input v-model="saveData.linkTel" style="width:86% " />
        </el-form-item>
        <el-form-item label="地址" prop="addr">
          <el-input v-model="saveData.addr" style="width:86% " />
        </el-form-item>
        <el-form-item label="是否启用" prop="isEnable">
          <el-switch v-model="saveData.isEnable" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('popForm')">确 定</el-button>
      </div>

      <el-dialog :visible.sync="popForm.innerVisible" append-to-body title="提示" width="30%">
        <span>表单信息有误，请修改后重新提交</span>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="popForm.innerVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </el-dialog>

    <!-- 数据表格 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="部门编码" prop="findeptCode" />
      <el-table-column label="部门名称" prop="findeptName" />
      <el-table-column label="区划编码" prop="rgnCode" />
      <el-table-column label="联系人" prop="linkman" />
      <el-table-column label="联系人电话" prop="linkTel" />
      <el-table-column label="经办人" prop="operator" />
      <el-table-column label="创建时间" prop="createTime" :formatter="dateFormat" />
      <el-table-column label="地址" prop="addr" />
      <el-table-column :formatter="isEnable" label="是否启用" prop="isEnable" />
      <el-table-column fixed="right" label="操作" width="150px">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="text" @click="open(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页插件 -->
    <!-- total:数据总量  page-sizes页容量 current-page当前页 -->
    <el-pagination :total="total" layout="prev, pager, next" />
  </div>
</template>

<script>
import { queryFinDept, queryRngCode, saveFinDept, deleteById } from '@/api/finDept/finDept'

export default {
  data () {
    return {
      // 列表显示数据
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          enable: '1'
        }
      ],
      // 级联框数据配置
      cascader: {
        data: [
          {
            id: 1,
            code: '000000',
            name: '中央',
            parentId: 0,
            assortment: false,
            children: null
          },
          {
            id: 2,
            code: '36',
            name: '江西省',
            parentId: 0,
            assortment: true,
            children: [
              {
                id: 3,
                code: '360000',
                name: '江西省本级',
                parentId: 2,
                assortment: false,
                children: []
              },
              {
                id: 4,
                code: '360100',
                name: '南昌市',
                parentId: 2,
                assortment: true,
                children: [
                  {
                    id: 5,
                    code: '360101',
                    name: '南昌市本级',
                    parentId: 4,
                    assortment: false,
                    children: null
                  },
                  {
                    id: 6,
                    code: '360102',
                    name: '南昌市东湖区',
                    parentId: 4,
                    assortment: false,
                    children: null
                  },
                  {
                    id: 7,
                    code: '360103',
                    name: '南昌市西湖区',
                    parentId: 4,
                    assortment: false,
                    children: null
                  },
                  {
                    id: 8,
                    code: '360104',
                    name: '南昌市青云谱区',
                    parentId: 4,
                    assortment: false,
                    children: null
                  },
                  {
                    id: 9,
                    code: '360105',
                    name: '南昌市湾里区',
                    parentId: 4,
                    assortment: false,
                    children: null
                  },
                  {
                    id: 10,
                    code: '360111',
                    name: '南昌市青山湖区',
                    parentId: 4,
                    assortment: false,
                    children: null
                  },
                  {
                    id: 11,
                    code: '360112',
                    name: '南昌市新建区',
                    parentId: 4,
                    assortment: false,
                    children: null
                  },
                  {
                    id: 12,
                    code: '360113',
                    name: '南昌市南昌县',
                    parentId: 4,
                    assortment: false,
                    children: null
                  }
                ]
              }
            ]
          },
          {
            id: 13,
            code: '41',
            name: '河南省',
            parentId: 0,
            assortment: true,
            children: [
              {
                id: 14,
                code: '410001',
                name: '河南省本级',
                parentId: 13,
                assortment: false,
                children: []
              }
            ]
          }
        ],
        props: {
          value: 'code',
          label: 'name'
        }
      },
      // 需要保存的数据
      saveData: {
        findeptName: '',
        findeptCode: '',
        linkTel: '',
        linkman: '',
        rgnCode: '',
        rgnCodeArray: '',
        isEnable: true,
        addr: ''
      },
      // 查询条件数据
      queryData: {
        // 每页显示数量
        pageSize: 10,
        // 当前页
        pageNumber: 1,
        // 数据总数
        total: 50,
        findeptName: '',
        isEnable: null
      },
      // 弹出框配置
      popForm: {
        rules: {
          findeptName: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          findeptCode: [
            { required: true, message: '请输入部门编码', trigger: 'change' }
          ],
          rgnCodeArray: [
            { required: true, message: '请选择区划编码', trigger: 'change' }
          ],
          linkTel: [
            {
              required: true,
              validator: (rule, value, callback) => {
                const phoneReg = /^1[3|4|5|6|7|8][0-9]{9}$/
                if (!value) {
                  return callback(new Error('电话号码不能为空'))
                }
                setTimeout(() => {
                  if (!Number.isInteger(+value)) {
                    callback(new Error('请输入数字值'))
                  } else {
                    if (phoneReg.test(value)) {
                      callback()
                    } else {
                      callback(new Error('电话号码格式不正确'))
                    }
                  }
                }, 1000)
              },
              trigger: 'blur'
            }
          ],
          isEnable: [{ required: true }]
        },
        // 内层嵌套的dialog
        innerVisible: false
      },
      // 新增模态框是否弹出
      dialogFormVisible: false,
      // 添加，修改弹出框标题
      formTitle: '',
      total: 0
    }
  },
  mounted () {
    this.query()
    // this.getRngCode()
  },
  methods: {
    // msg弹框
    open (row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.del(row)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
        })
    },
    // 查询条件接口
    query () {
      queryFinDept(this.queryData).then(response => {
        let list = []
        list = response.data.list
        for (let i = 0; i < list.length; i++) {
          this.transferRgnArrayToCode(list[i])
        }
        this.tableData = list
        this.total = response.data.total
      })
    },
    transferRgnArrayToCode (item) {
      let codeArray = []
      codeArray = item.rgnCode.split(',')
      item.rgnCodeArray = codeArray
      item.rgnCode = codeArray[codeArray.length - 1]
    },
    // 编辑按钮操作
    handleEdit (row) {
      this.formTitle = '编辑'
      this.dialogFormVisible = true
      this.saveData = row
    },
    handleAdd () {
      // this.saveData = {};
      this.formTitle = '新增'
      this.dialogFormVisible = true
    },
    // 删除
    del (row) {
      deleteById(row.id).then(response => {
        this.query()
      })
    },
    // 保存
    submitForm (formName) {
      const data = this.saveData

      this.$refs[formName]
        .validate()
        .then(() => {
          saveFinDept(data).then((response) => {
            if (response.success === true) {
              this.dialogFormVisible = false
              this.$message({
                type: 'success',
                message: '保存成功!'
              })
              this.query()
            } else {
              this.popForm.innerVisible = true
            }
          })
        })
        .catch((response) => {
          this.popForm.innerVisible = true
        })
    },
    // 表格数据格式化
    isEnable (row, column, cellValue, index) {
      if (cellValue === undefined) {
        return null
      }
      if (cellValue === true) {
        return '启用'
      } else {
        return '禁用'
      }
    },
    dateFormat: function (row, column, cellValue, index) {
      // row 表示一行数据, updateTime 表示要格式化的字段名称
      var t = new Date(cellValue)
      return t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + t.getDate()
    },
    // 对话框关闭事件
    handleClose () {
      this.$refs['popForm'].resetFields()
    },
    getRngCode () {
      queryRngCode().then((response) => {
        // this.cascader.data = response.query.data
      })
    },
    clearSearchForm () {
      this.$refs['searchForm'].resetFields()
      this.query()
    }

  }
}
</script>

<style scoped>
  .content {
    margin-left: 1%;
  }
</style>
