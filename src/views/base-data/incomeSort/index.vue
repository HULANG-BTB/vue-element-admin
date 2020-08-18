<!--
 * @Author: Raiz
 * @since: 2020-07-31 14:47:07
 * @lastTime: 2020-08-11 16:21:06
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
          <el-col :span="9">收入类别编码:{{ showDetailData.code }}</el-col>
          <el-col :span="11" class="rightCol">上级编码:{{ showDetailData.parentId }}</el-col>
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
              <el-select v-model="incomeSort.parentId">
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
              <el-select v-model="incomeSort.leaf">
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
import { getIncomeTree, queryByCondition, queryAllBillSort, add, update, deleteBillTypeRequest } from '@/api/incomeSort/incomeSort'
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
          { required: true, message: '请输入票据名称', trigger: 'blur' }
        ],
        leaf: [
          { required: true, message: '请选择是否是底级', trigger: 'change' }
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
        console.log('tableCloum', data.list)
      })
    },
    getLeftTree () {
      getIncomeTree().then(response => {
        console.log('data', response.data.list)
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
        console.log('treeRoot', treeRoot)
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
        console.log('row', row)
        this.incomeSort = { ...row }
        console.log('insort', this.incomeSort)
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
          // deleteBillTypeRequest(param).then(response => {
          //   this.freshTreeAndTable()
          //   this.$message({
          //     message: '删除成功',
          //     type: 'success'
          //   })
          // })
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
            console.log('add', form)
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
              console.log('update', form)
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
      queryAllBillSort().then(response => {
        response.data.list.forEach(element => {
          element.name = element.code + ' ' + element.name
        })
        console.log('list', response.data.list)
        this.formOptions.parentIncomeSorts = response.data.list
      })
    },
    addDialogClose () {
      this.incomeSort = {}
      this.$refs['form'].resetFields()
    },
    updateDialogOpen () {
      console.log('updateDialogOpen')
    },
    updateDialogClose () {
      this.incomeSort = {}
      this.$refs['updateForm'].resetFields()
    },
    init () {
      this.freshTreeAndTable()
      this.searchFormData[2].options = this.formOptions.natureCodeOptions
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
