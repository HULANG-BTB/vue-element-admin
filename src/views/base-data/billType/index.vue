<!--
 * @Author: Raiz
 * @since: 2020-07-31 14:47:07
 * @lastTime: 2020-08-10 15:26:48
 * @LastEditors: Raiz
 * @Description:
-->
<template>
  <el-container style="height:100%;">
    <left-tree
      :left-side-data="leftSideData"
      @treeNodeSearch="treeNodeSearch"
    />
    <div>
      <form-table
        :search-form-data="searchFormData"
        :table-data="tableData"
        :table-column-data="tableColumnData"
        :total="total"
        @requestTableData="requestTableData"
        @tableHeadButtonClick="tableHeadButtonClick"
        @tableButtonClick="tableButtonClick"
      />
    </div>
    <DialogBorder
      v-model="detailVisible"
      :dialog-data="dialogData"
      @dialogOpen="dialogOpen"
      @dialogClose="dialogClose"
      @dialogBtnClick="dialogBtnClick"
    >
      <div class="detailClass">
        <el-row>
          <el-col :span="9">票据编码:{{ showDetailData.code }}</el-col>
          <el-col :span="9" class="rightCol">上级编码:{{ showDetailData.parentCode }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="9">票据名称:{{ showDetailData.name }}</el-col>
          <el-col :span="9" class="rightCol">种类编码:{{ showDetailData.typeCode }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="9">助记码:{{ showDetailData.memoryCode }}</el-col>
          <el-col :span="9" class="rightCol">是否分类:
            <span v-if="showDetailData.checkSort===0">种类</span>
            <span v-else>分类</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9">生效日期:{{ showDetailData.effDate }}</el-col>
          <el-col :span="9" class="rightCol">失效日期:{{ showDetailData.expDate }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="9">是否定额:
            <span v-if="showDetailData.checkQuota===1">是</span>
            <span v-else>否</span>
          </el-col>
          <el-col :span="9" class="rightCol">定额面值:{{ showDetailData.quotaAmount }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="9">法定保存年限:{{ showDetailData.safeYear }}</el-col>
          <el-col :span="9" class="rightCol">票据性质:
            <span v-if="showDetailData.checkSort===0">非税票据</span>
            <span v-else>其他</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            备注:{{ showDetailData.remark }}
          </el-col>
        </el-row>
      </div>
    </DialogBorder>
    <DialogBorder
      v-model="addDialogVisible"
      :dialog-data="addDialogData"
      @dialogOpen="addDialogOpen"
      @dialogClose="addDialogClose"
      @dialogBtnClick="addDialogBtnClick"
    >
      <el-form
        ref="form"
        :model="billType"
        label-width="100px"
        :rules="rules"
        class="formClass"
      >
        <el-row>
          <el-col :span="11">
            <el-form-item label="票据名称" prop="name">
              <el-input v-model="billType.name" />
            </el-form-item>
          </el-col>
          <el-col :span="11" class="rightCol">
            <el-form-item label="是否分类" prop="checkSort">
              <el-select v-model="billType.checkSort" placeholder="选择分类或者种类">
                <el-option
                  v-for="item in formOptions.checkSortOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="票据编码" prop="code">
              <el-input v-model="billType.code" />
            </el-form-item>
          </el-col>
          <el-col :span="11" class="rightCol">
            <el-form-item label="票据性质" prop="natureCode">
              <el-select v-model="billType.natureCode" placeholder="选择票据性质">
                <el-option
                  v-for="item in formOptions.natureCodeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="票据用途" prop="billNature">
              <el-select v-model="billType.billNature" placeholder="选择票据用途">
                <el-option
                  v-for="item in formOptions.billNatureOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                /></el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11" class="rightCol">
            <el-form-item label="助记码" prop="memoryCode">
              <el-input v-model="billType.memoryCode" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item v-if="billType.checkSort===0" label="父级票据分类" prop="pid">
              <el-select v-model="billType.pid" placeholder="选择票据分类">
                <el-option
                  v-for="item in formOptions.billSortOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11" class="rightCol">
            <el-form-item v-if="billType.checkSort===0" label="保存年限" prop="safeYear">
              <el-input v-model="billType.safeYear" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item v-if="billType.checkSort===0" label="是否定额" prop="checkQuota">
              <el-switch v-model="billType.checkQuota" />
            </el-form-item>
          </el-col>
          <el-col :span="11" class="rightCol">
            <el-form-item v-if="billType.checkQuota" label="定额面值" prop="quotaAmount">
              <el-input v-model="billType.quotaAmount" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="生效日期" prop="date">
            <el-date-picker
              v-model="billType.date"
              type="daterange"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="生效日期"
              end-placeholder="失效日期"
            />
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="备注">
              <el-input
                v-model="billType.remark"
                type="textarea"
                :rows="3"
              /></el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </DialogBorder>
  </el-container>
</template>
<script>
import LeftTree from '@/components/leftTree'
import FormTable from '@/components/formTable'
import DialogBorder from '@/components/Dialog/dialog-border'
import { queryBillTypeTree, queryByCondition, queryAllBillSort, add, update, deleteBillTypeRequest } from '@/api/billType/billType'
export default {
  components: {
    LeftTree,
    FormTable,
    DialogBorder
  },
  data () {
    return {
      detailVisible: false,
      addDialogVisible: false,
      showDetailData: {},
      billType: {},
      addDialog: true,
      safeYearShow: false,
      formOptions: {
        billNatureOptions: [
          {
            label: '通用票据',
            value: '通用票据'
          },
          {
            label: '专用票据',
            value: '专用票据'
          }
        ],
        checkSortOptions: [
          {
            label: '种类',
            value: 0
          },
          {
            label: '分类',
            value: 1
          }
        ],
        natureCodeOptions: [
          {
            label: '非税票据',
            value: 0
          },
          {
            label: '其他财政票据',
            value: 1
          }
        ],
        billSortOptions: []
      },
      dialogData: {
        headTitle: '票据种类信息',
        name: 'billTypeDetailDialog',
        footButton: [
          {
            name: '确定',
            type: 'primary'
          }
        ]
      },
      addDialogData: {
        headTitle: '添加票据种类',
        name: 'addBillTypeDialog',
        footButton: [
          {
            name: '取消'
          },
          {
            name: '确定',
            type: 'primary'
          }
        ]
      },
      leftSideData: {
        showSearch: false,
        showTitle: '票据种类',
        expand: true,
        key: 'id',
        treeProp: {
          children: 'children',
          label: 'name'
        },
        showCheckBox: false,
        showTreeData: []
      },
      billNatureOptions: [
        {
          value: '通用票据',
          label: '通用票据'
        },
        {
          value: '专用票据',
          label: '专用票据'
        }
      ],
      rules: {
        name: [
          { required: true, message: '请输入票据名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入票据编码', trigger: 'blur' }
        ],
        billNature: [
          { required: true, message: '请选择票据用途', trigger: 'change' }
        ],
        memoryCode: [
          { required: true, message: '请输入助记码', trigger: 'blur' }
        ],
        date: [
          { required: true, message: '请选择生效和失效日期', trigger: 'change' }
        ],
        checkSort: [
          { required: true, message: '请选择是否分类', trigger: 'change' }
        ],
        safeYear: [
          { required: true, message: '请输入法定保存年限', trigger: 'blur' }
        ],
        natureCode: [
          { required: true, message: '请选择票据性质', trigger: 'change' }
        ]
      },
      total: 0,
      page: {
        pageNum: 1,
        pageSize: 10
      },
      defaultPage: {
        pageNum: 1,
        pageSize: 10
      },
      showTree: false,
      searchFormData: [
        {
          label: '票据名称',
          prop: 'name',
          type: 'input'
        },
        {
          label: '助记码',
          prop: 'memoryCode',
          type: 'input'
        },
        {
          label: '票据用途',
          prop: 'billNature',
          type: 'select',
          options: []
        },
        {
          label: '是否分类',
          prop: 'checkSort',
          type: 'select',
          options: []
        }
      ],
      tableData: {
        headButtonData: [
          {
            name: '添加',
            type: 'primary',
            icon: 'el-icon-plus'
          }
        ],
        bodyData: []
      },
      // 表格列配置
      tableColumnData: {
        select: false,
        expand: true,
        column: [
          {
            prop: 'code',
            label: '票据编码'
          },
          {
            prop: 'name',
            label: '票据名称'
          },
          {
            prop: 'effDate',
            label: '生效日期',
            width: 150
          },
          {
            prop: 'expDate',
            label: '失效日期',
            width: 150
          },
          {
            prop: 'checkSort',
            label: '是否分类'
          },
          {
            prop: 'memoryCode',
            label: '助记码'
          },
          {
            prop: 'billNature',
            label: '票据用途',
            width: 80
          },
          {
            prop: 'natureCode',
            label: '票据性质',
            width: 80
          }
        ],
        operation: [
          {
            permission: ['default'],
            type: 'primary',
            name: '查看详细信息',
            hideName: true,
            icon: 'el-icon-document',
            circle: true
          },
          {
            permission: ['default'],
            type: 'primary',
            name: '编辑',
            hideName: true,
            icon: 'el-icon-edit',
            circle: true
          },
          {
            permission: ['default'],
            type: 'danger',
            name: '删除',
            hideName: true,
            icon: 'el-icon-delete',
            circle: true
          }
        ],
        reData: {
          props: ['natureCode', 'checkSort'],
          newData: {
            natureCode: {
              '0': '非税票据',
              '1': '其他财政票据'
            },
            checkSort: {
              '1': '分类',
              '0': '种类'
            }
          }
        },
        emptyText: '暂无数据'
      }

    }
  },
  mounted () {
    this.init()
  },
  methods: {
    transfer (item, treeData) {
      item.forEach((element, key) => {
        treeData[key] = {
          id: element.id,
          name: element.name,
          children: []
        }
        if (element.menuTree.length === 0 && element.menuList.length > 0) {
          const menuList = []
          element.menuList.forEach(menu => {
            const temp = {
              id: menu.id,
              name: menu.menuName
            }
            menuList.push(temp)
          })
          treeData[key].children = menuList
        } else if (element.menuTree.length > 0 && element.menuList.length === 0) {
          this.transfer(element.menuTree, treeData[key].children)
        } else {
          return
        }
      })
    },
    getCheckedKeys () {
      const checkedKeys = this.$refs.tree.getCheckedKeys(true)
      return checkedKeys
    },
    treeNodeSearch (id) {
      if (id.id === 0) {
        this.requestTableData(this.defaultPage)
      } else {
        const param = { ...this.defaultPage, ...id }
        this.requestTableData(param)
      }
    },
    requestTableData (param) {
      queryByCondition(param).then(response => {
        const data = response.query
        this.total = data.total
        this.tableData.bodyData = data.list
      })
    },
    getLeftTree () {
      queryBillTypeTree().then(response => {
        response.query.forEach(tree => {
          tree.name = tree.code + ' ' + tree.name
          if (tree.children.length > 0) {
            tree.children.forEach(child => {
              child.name = child.code + ' ' + child.name
            })
          }
        })
        const treeRoot = [
          {
            id: 0,
            name: '所有',
            children: response.query
          }
        ]
        this.leftSideData.showTreeData = treeRoot
      })
    },
    tableButtonClick (name, row) {
      const btnDo = {
        '查看详细信息': () => checkDetail.call(this),
        '编辑': () => edit.call(this),
        '删除': () => deleteBillType.call(this)
      }
      btnDo[name]()

      function checkDetail () {
        this.detailVisible = true
        this.showDetailData = row
      }

      function edit () {
        this.addDialog = false
        this.addDialogData.headTitle = '编辑票据种类'
        this.addDialogVisible = true
        this.billType = { ...row }
        this.billType.date = []
        this.billType.date[0] = row.effDate
        this.billType.date[1] = row.expDate
        this.billType.checkQuota === 1 ? this.billType.checkQuota = true : this.billType.checkQuota = false
      }

      function deleteBillType () {
        this.$confirm('此操作将删除当行票据种类?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const param = {
            id: row.id
          }
          deleteBillTypeRequest(param).then(response => {
            this.freshTreeAndTable()
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          })
        })
      }
    },
    dialogBtnClick (name) {
      const btnDo = {
        '确定': () => confirm.call(this)
      }
      btnDo[name]()

      // 关闭弹出层
      function confirm () {
        this.detailVisible = false
      }
    },
    addDialogBtnClick (name) {
      const btnDo = {
        '确定': () => confirm.call(this),
        '取消': () => cancel.call(this)
      }
      btnDo[name]()

      // 关闭弹出层
      function cancel () {
        this.addDialogVisible = false
      }

      // 确认添加
      function confirm () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            const form = { ...this.billType }
            form.effDate = form.date[0]
            form.expDate = form.date[1]
            if (form.checkQuota === true) {
              form.checkQuota = 1
            } else if (form.checkQuota === false) {
              form.checkQuota = 0
            }
            if (this.addDialog === true) {
              add(form).then(response => {
                this.freshTreeAndTable()
                this.addDialogVisible = false
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
              })
            } else {
              update(form).then(response => {
                this.freshTreeAndTable()
                this.addDialogVisible = false
                this.$message({
                  message: '更新成功',
                  type: 'success'
                })
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    tableHeadButtonClick (button) {
      const btnDo = {
        '添加': () => add.call(this)
      }
      btnDo[button.name]()

      // 关闭弹出层
      function add () {
        this.addDialog = true
        this.addDialogVisible = true
      }
    },
    dialogOpen () {

    },
    dialogClose () {

    },
    addDialogOpen () {
      queryAllBillSort().then(response => {
        response.query.forEach(element => {
          element.name = element.code + ' ' + element.name
        })
        this.formOptions.billSortOptions = response.query
      })
    },
    addDialogClose () {
      this.billType = {}
      this.$refs['form'].resetFields()
    },
    init () {
      this.freshTreeAndTable()
      this.searchFormData[2].options = this.formOptions.billNatureOptions
      this.searchFormData[3].options = this.formOptions.checkSortOptions
    },
    freshTreeAndTable () {
      this.getLeftTree()
      const param = this.page
      this.requestTableData(param)
    }
  }
}
</script>
<style lang="scss" scoped>
.detailClass{
  margin-left:15%;
  .el-row{
    margin-top:20px;
  }
  .rightCol{
    margin-left: 15%;
  }
}
.formClass{
  .el-row{
    margin-left:5%;
    .el-select{
      width: 100%;
    }
  }
  .rightCol{
    margin-left: 10px;
  }
}
</style>
