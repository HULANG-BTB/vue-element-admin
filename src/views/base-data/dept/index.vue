<template>
  <div class="content">
    <el-form :inline="true" :model="queryData">
      <el-form-item label="部门名称：">
        <el-input
          v-model="queryData.fFindeptName"
          placeholder="部门名称"
          size="small"
          style="width:200px"
        />
      </el-form-item>

      <el-form-item label="是否启用：">
        <el-select placeholder="请选择部门状态 " size="small" v-model="queryData.fIsEnable">
          <el-option label="启用" value="1"/>
          <el-option label="停用" value="0"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="query" plain size="small" type="primary">查询</el-button>
        <el-button @click="handleAdd" plain size="small" type="primary">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 弹出框 -->
    <el-dialog :title="formTitle" :visible.sync="dialogFormVisible" @close="handleClose">
      <el-form :model="saveData" :rules="popForm.rules" label-width="120px" ref="popForm">
        <el-form-item label="部门名称" prop="fFindeptName">
          <el-input style="width:86% " v-model="saveData.fFindeptName"/>
        </el-form-item>
        <el-form-item label="部门编码" prop="fFindeptCode">
          <el-input style="width:86% " v-model="saveData.fFindeptCode"/>
        </el-form-item>
        <el-form-item label="区划编码" prop="fRgnCode">
          <el-cascader
            v-model="saveData.fRgnCode"
            :options="cascader.data"
            :props="cascader.props"
            :show-all-levels="false"
          />
        </el-form-item>
        <el-form-item label="联系人" prop="fLinkman">
          <el-input style="width:86% " v-model="saveData.fLinkman"/>
        </el-form-item>
        <el-form-item label="联系人电话" prop="fLinkTel">
          <el-input style="width:86% " v-model="saveData.fLinkTel"/>
        </el-form-item>
        <el-form-item label="是否启用" prop="fIsEnable">
          <el-switch v-model="saveData.fIsEnable"/>
        </el-form-item>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button @click="submitForm('popForm')" type="primary">确 定</el-button>
      </div>

      <el-dialog :visible.sync="popForm.innerVisible" append-to-body title="提示" width="30%">
        <span>表单信息有误，请修改后重新提交</span>
        <div class="dialog-footer" slot="footer">
          <el-button @click="popForm.innerVisible = false" type="primary">确 定</el-button>
        </div>
      </el-dialog>
    </el-dialog>

    <!-- 数据表格 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="部门编码" prop="fFindeptCode"/>
      <el-table-column label="部门名称" prop="fFindeptName"/>
      <el-table-column label="区划编码" prop="fRgnCode"/>
      <el-table-column label="联系人" prop="fLinkman"/>
      <el-table-column label="联系人电话" prop="fLinkTel"/>
      <el-table-column label="经办人" prop="fOperator"/>
      <el-table-column label="创建时间" prop="fCreateTime"/>
      <el-table-column :formatter="isEnable" label="是否启用" prop="fIsEnable"/>
      <el-table-column fixed="right" label="操作" width="150px">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row)" size="small" type="text">编辑</el-button>
          <el-button @click="open(scope.row)" size="small" type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页插件 -->
    <!-- total:数据总量  page-sizes页容量 current-page当前页 -->
    <el-pagination :total="queryData.total" layout="prev, pager, next"/>
  </div>
</template>

<script>
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
              children: []
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
          fFindeptName: '',
          fFindeptCode: '',
          fLinkman: '',
          fLinkTel: '',
          fRgnCode: '',
          fIsEnable: true
        },
        // 查询条件数据
        queryData: {
          // 每页显示数量
          pageCount: 10,
          // 当前页
          pageNumber: 1,
          // 数据总数
          total: 50,
          fFindeptName: '',
          fIsEnable: null
        },
        // 弹出框配置
        popForm: {
          rules: {
            fFindeptName: [
              { required: true, message: '请输入名称', trigger: 'blur' }
            ],
            fFindeptCode: [
              { required: true, message: '请输入部门编码', trigger: 'change' }
            ],
            fRgnCode: [
              { required: true, message: '请选择区划编码', trigger: 'change' }
            ],
            fLinkTel: [
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
            fIsEnable: [{ required: true }]
          },
          // 内层嵌套的dialog
          innerVisible: false
        },
        // 新增模态框是否弹出
        dialogFormVisible: false,
        // 添加，修改弹出框标题
        formTitle: ''
      }
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
      },
      // 保存
      submitForm (formName) {
        this.$refs[formName]
          .validate()
          .then(() => {
            this.submitData().then(() => {
              this.dialogFormVisible = false
              this.$message({
                type: 'success',
                message: '保存成功!'
              })
            })
          })
          .catch(() => {
            this.popForm.innerVisible = true
          })
      },
      // 提交保存，修改数据
      submitData () {
        return new Promise(function (resolve, reject) {
          var req = new XMLHttpRequest()
          // 发送请求
          // 请求成功
          if (true) {
            resolve()
          } else {
            // 请求失败
            reject()
          }
        })
      },
      // 表格数据格式化
      isEnable (row, column, cellValue, index) {
        console.log(cellValue)
        if (cellValue == true) {
          return '启用'
        } else {
          return '禁用'
        }
      },
      // 对话框关闭事件
      handleClose () {
        this.$refs['popForm'].resetFields()
      }
    }
  }
</script>

<style scoped>
  .content {
    margin-left: 1%;
  }
</style>
