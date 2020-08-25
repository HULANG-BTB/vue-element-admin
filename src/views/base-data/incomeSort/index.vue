<!--
 * @Author: Jianbinbing
 * @since: 2020-08-01 15:47:07
 * @lastTime: 2020-08-25 17:34:34
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
          <el-col :span="9">收入编码:{{ showDetailData.code }}</el-col>
          <el-col :span="11" class="rightCol">上级ID:{{ showDetailData.parentId }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="9">级次:{{ showDetailData.level }}</el-col>

          <el-col :span="9" class="rightCol">是否底级:
            <span v-if="showDetailData.leaf===true">是</span>
            <span v-else>否</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">收入类别名称:{{ showDetailData.name }}</el-col>
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
        :model="incomeSort"
        label-width="100px"
        :rules="rules"
        class="formClass"
      >
        <el-row>
          <el-col :span="11">
            <el-form-item label="上级" prop="parentId">
              <el-select v-model="incomeSort.parentId" style="width:100%;">
                <el-option
                  v-for="item in formOptions.parentIncomeSorts"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="收入编码" prop="code">
              <el-input v-model="incomeSort.code" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="收入名称" prop="name">
              <el-input v-model="incomeSort.name" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="备注">
              <el-input
                v-model="incomeSort.remark"
                type="textarea"
                :rows="3"
              /></el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </DialogBorder>
    <DialogBorder
      v-model="updateDialogVisible"
      :dialog-data="updateDialogData"
      @dialogOpen="updateDialogOpen"
      @dialogClose="updateDialogClose"
      @dialogBtnClick="updateDialogBtnClick"
    >
      <el-form
        ref="updateForm"
        :model="incomeSort"
        label-width="100px"
        :rules="rules"
        class="formClass"
      >
        <el-row>
          <el-col :span="11">
            <el-form-item label="收入名称" prop="name">
              <el-input v-model="incomeSort.name" />
            </el-form-item>
          </el-col>
          <el-col :span="11" class="rightCol">
            <el-form-item label="是否底级" prop="leaf">
              <el-select v-model="incomeSort.leaf" style="width:100%;">
                <el-option
                  v-for="item in formOptions.checkLeaf"
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
            <el-form-item label="收入编码" prop="code">
              <el-input v-model="incomeSort.code" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="22">
            <el-form-item label="备注">
              <el-input
                v-model="incomeSort.remark"
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
// import { getRSAKey } from '@/utils/jsEncrypt'
// import { Decrypt, Encrypt } from '@/utils/cryptoJS'
// import { getDecryptJson } from '@/utils/data'
import { getIncomeTree, queryByCondition, queryAllIncomeSort, add, update, deleteIncomeSort } from '@/api/incomeSort/incomeSort'
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
      incomeSort: {},
      addDialog: true,
      updateDialogVisible: false,
      updateDialog: true,
      safeYearShow: false,
      formOptions: {

        checkLeaf: [
          {
            label: '非底级',
            value: false
          },
          {
            label: '底级',
            value: true
          }
        ],
        parentIncomeSorts: [],
        billSortOptions: []
      },
      dialogData: {
        headTitle: '收入种类信息',
        name: 'incomeSortDetailDialog',
        footButton: [
          {
            name: '确定',
            type: 'primary'
          }
        ]
      },
      addDialogData: {
        headTitle: '添加收入种类',
        name: 'addIncomeSortDialog',
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
      updateDialogData: {
        headTitle: '修改收入种类',
        name: 'updateIncomeSort',
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
        showTitle: '收入种类',
        expand: true,
        key: 'id',
        treeProps: {
          children: 'incomeSortDTOList',
          label: 'name'
        },
        showCheckBox: false,
        showTreeData: []
      },
      rules: {
        name: [
          { required: true, message: '请输入收入名称', trigger: 'blur' },
          { pattern: /[\u4e00-\u9fa5]/, message: '只能输入中文' }
        ],
        leaf: [
          { required: true, message: '请选择是否是底级', trigger: 'change' }
        ],
        code: [
          { required: true, message: '请输入编码', trigger: 'change' },
          { pattern: /^(\d{1,3})$/, message: '编码为1或3位' }
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
          label: '类别编码',
          prop: 'code',
          type: 'input'
        },
        {
          label: '类别名称',
          prop: 'name',
          type: 'input'
        }

      ],
      tableData: {
        headButtonData: [
          {
            name: '添加',
            type: 'primary',
            icon: 'el-icon-plus',
            permission: ['admin', 'financial_check']
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
            label: '编码',
            width: 130
          },
          {
            prop: 'name',
            label: '名称',
            width: 260
          },
          {
            prop: 'leaf',
            label: '是否底级',
            width: 150

          },
          {
            prop: 'level',
            label: '级次',
            width: 100
          }
        ],
        operation: [
          {
            type: 'primary',
            name: '查看详细信息',
            hideName: true,
            icon: 'el-icon-document',
            circle: true
          },
          {
            permission: ['admin', 'financial_check'],
            type: 'primary',
            name: '编辑',
            hideName: true,
            icon: 'el-icon-edit',
            circle: true
          },
          {
            permission: ['admin', 'financial_check'],
            type: 'danger',
            name: '删除',
            hideName: true,
            icon: 'el-icon-delete',
            circle: true
          }
        ],
        reData: {
          props: ['leaf'],
          newData: {
            leaf: {
              'true': '是',
              'false': '否'
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
    init () {
      this.freshTreeAndTable()
      this.searchFormData[2].options = this.formOptions.natureCodeOptions
    },
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
        const data = response.data
        this.total = data.total
        this.tableData.bodyData = data.list
      })
    },
    getLeftTree () {
      getIncomeTree().then(response => {
        response.data.list.forEach(tree => {
          tree.name = tree.code + ' ' + tree.name
          if (tree.incomeSortDTOList.length > 0) {
            tree.incomeSortDTOList.forEach(child => {
              child.name = child.code + ' ' + child.name
            })
          }
        })
        const treeRoot = [
          {
            id: 0,
            name: '所有',
            incomeSortDTOList: response.data.list
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
        this.updateDialog = true
        this.updateDialogData.headTitle = '编辑收入种类'
        this.updateDialogVisible = true
        this.incomeSort = { ...row }
      }

      function deleteBillType () {
        this.$confirm('是否删除当行收入种类?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const param = {
            id: row.id
          }
          deleteIncomeSort(param).then(response => {
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
            const form = { ...this.incomeSort }
            if (this.addDialog === true) {
              add(form).then(response => {
                this.freshTreeAndTable()
                this.addDialogVisible = false
                this.$message({
                  message: '添加成功',
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

    updateDialogBtnClick (name) {
      const btnDo = {
        '确定': () => confirm.call(this),
        '取消': () => cancel.call(this)
      }
      btnDo[name]()
      // 关闭弹出层
      function cancel () {
        this.updateDialogVisible = false
      }
      // 确认添加
      function confirm () {
        this.$refs['updateForm'].validate((valid) => {
          if (valid) {
            const form = { ...this.incomeSort }
            if (this.updateDialog === true) {
              update(form).then(response => {
                this.freshTreeAndTable()
                this.updateDialogVisible = false
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
      console.log(button)
      const btnDo = {
        '添加': () => add.call(this)
      }
      btnDo[button.name]()

      // 关闭弹出层
      function add () {
        this.addDialog = true
        this.addDialogVisible = true
        console.log('添加')
      }
    },
    dialogOpen () {

    },
    dialogClose () {

    },
    addDialogOpen () {
      queryAllIncomeSort().then(response => {
        response.data.list.forEach(element => {
          element.name = element.code + ' ' + element.name
        })
        this.formOptions.parentIncomeSorts = response.data.list
      })
    },
    addDialogClose () {
      this.incomeSort = {}
      this.$refs['form'].resetFields()
    },
    updateDialogOpen () {
    },
    updateDialogClose () {
      this.incomeSort = {}
      this.$refs['updateForm'].resetFields()
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
      margin-left:5%
    }
    .rightCol{
      margin-left: 10px;
    }
  }
</style>
