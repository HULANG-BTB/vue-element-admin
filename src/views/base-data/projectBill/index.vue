<!--
* @Author: wuliming
* @since: 2020-08-11 8:59
* @lastTime: 2020-08-11 23:51:00
* @LastEditors: wuliming
* @Description:
-->

<template>
  <el-container style="height:100%;">
    <left-tree :left-side-data="leftSideData" @treeNodeSearch="treeNodeSearch" />

    <div>
      <form-table
        :search-form-data="searchFormData"
        :table-data="tableData"
        :table-column-data="tableColumnData"
        :total="total"
        @requestTableData="requestTableData"
        @tableTagClick="tableTagClick"
        @tableHeadButtonClick="tableHeadButtonClick"
        @tableButtonClick="tableButtonClick" />
    </div>
    <el-dialog :title=billName :visible.sync="addDialogVisible" center>
      <div>
        <span><b>项目名称:</b></span>
        <el-input v-model="addItemCondition" size="mini" placeholder="请输入" style="width: 200px; margin-left: 10px;" />
        <el-button type="primary" icon="el-icon-search" size="mini" style="margin-left: 10px;" @click="selectAddItemInfo()" />
        <span><b /></span>
        <el-button :disabled="addItemDisabled" type="primary" icon="el-icon-plus" size="mini" style="margin-left: 10px; float: right;" @click="addItem()">关联</el-button>
      </div>
      <div id="addItemTable">
        <el-table ref="multipleTable" :data="tableItemData" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column property="id" label="id" width="150" />
          <el-table-column property="itemId" label="项目编码" width="200" />
          <el-table-column property="itemName" label="项目名称" />
          <el-table-column property="operator" label="经办人" />
        </el-table>
        <el-pagination
          layout="total, prev, pager, next, jumper"
          :current-page="noContactBillItem.pageNum"
          :page-size="noContactBillItem.pageSize"
          :total="addItemTotal"
          @current-change="addItemPageChange" />
      </div>
    </el-dialog>
  </el-container>
</template>
<script>
/* eslint-disable */
  import LeftTree from '@/components/leftTree'
  import FormTable from '@/components/formTable'
  import DialogBorder from '@/components/Dialog/dialog-border'
  import {
    queryBillTypeTree,
    queryByCondition,
    turnenabled,
    update,
    deleteItemBillRequest,
    queryItemByCondition,
    addBillItem
  } from '@/api/base/billitem/billitem.js'
  export default {
    components: {
      LeftTree,
      FormTable,
      DialogBorder
    },
    data() {
      return {
        addItemDisabled: true,
        noContactBillItem: 5,
        addItemTotal: 0,
        addItemCondition: '',
        addDialogVisible: false,
        showDetailData: {},
        billName: '',
        billCode: '',
        multipleSelection: [],
        addItemData: {
          billCode: '',
          itemIds: []
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
        total: 0,
        itemTotal: 0,
        page: {
          pageNum: 1,
          pageSize: 10
        },
        defaultPage: {
          pageNum: 1,
          pageSize: 10
        },
        contactBillItem: {
          billCode: '',
          itemName: '',
          pageNum: 1,
          pageSize: 10,
        },
        noContactBillItem: {
          billCode: '',
          itemName: '',
          pageNum: 1,
          pageSize: 5,
        },
        showTree: false,
        searchFormData: [{
            label: '项目名称',
            prop: 'itemName',
            type: 'input'
          }

        ],
        searchFormItemData: [{
            label: '票据编码',
            prop: 'billCode',
            type: 'input'
          },
          {
            label: '项目名称',
            prop: 'itemName',
            type: 'input'
          }

        ],
        tableData: {
          headButtonData: [{
            name: '添加',
            type: 'primary',
            icon: 'el-icon-plus'
          }],
          bodyData: []
        },
        tableItemData: [],
        tableColumnItemData: {
          select: true,
          expand: true,
          column: [{
              prop: 'itemId',
              label: '项目编码'

            },

            {
              prop: 'rgnId',
              label: '区划id'
            },
            {
              prop: 'itemName',
              label: '项目名称'
            },
            {
              prop: 'operator',
              label: '经办人'
            }
          ],
        },
        // 表格列配置
        tableColumnData: {
          select: false,
          expand: true,
          column: [{
              prop: 'id',
              label: '关联id'
            },
            {
              prop: 'billCode',
              label: '票据种类编码'
            },
            {
              prop: 'itemId',
              label: '项目id',
              width: 150
            },
            {
              prop: 'itemName',
              label: '项目名称',
              width: 150
            },
            {
              prop: 'operator',
              label: '操作人'
            },
            {
              prop: 'enabled',
              label: '关系启用'
            },
            {
              prop: 'itemIsEnabled',
              label: '项目启用',
              width: 80
            }
          ],
          operation: [{
            permission: ['default'],
            type: 'danger',
            name: '删除',
            hideName: true,
            icon: 'el-icon-delete',
            circle: true
          }],
          showTag: {
            props: ['enabled'],
            tagType: {
              enabled: {
                'false': 'danger',
                'true': 'success'
              }
            }
          },
          reData: {
            props: ['enabled'],
            newData: {
              enabled: {
                'false': '禁用',
                'true': '启用'
              }
            }
          },
          emptyText: '暂无数据'
        }
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      transfer(item, treeData) {
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
      getCheckedKeys() {
        const checkedKeys = this.$refs.tree.getCheckedKeys(true)
        return checkedKeys
      },
      treeNodeSearch(node) {
        this.billCode = node.code
        this.billName = node.name
        // console.log(this.billCode)
        console.log("billCode" + node.code + " billName" + node.name)
        this.contactBillItem.billCode = node.code;
        this.noContactBillItem.pageNum=1
        this.contactBillItem.pageNum=1
        this.requestTableData(this.contactBillItem)

        // console.log(node)
      },
      handleSelectionChange(val) {
        console.log(val)
        if (val.length == 0) {
          this.addItemDisabled = true
        } else {
          this.addItemDisabled = false
        }

        this.multipleSelection = val;
        //this.$refs.multipleTable.clearSelection(); 全部取消
      },
      selectAddItemInfo() {
        console.log("无关项目查询")
        this.noContactBillItem.billCode = this.billCode;
        this.noContactBillItem.itemName = this.addItemCondition;
        this.requestTableItemData(this.noContactBillItem)

      },
      addItemPageChange(val) {
        this.noContactBillItem.pageNum = val
           console.log('页面更改'+this.noContactBillItem.pageNum)
        this.requestTableItemData(this.noContactBillItem)
      },
      addItem() {
        const param = {
          billCode: this.billCode,
          itemIds: []
        }
        this.multipleSelection.forEach(element => {
          param.itemIds.push(element.itemId)
        })
        console.log(param)

        addBillItem(param).then(response => {
          let result = response.data
          if (result) {
            this.$message({
              message: '关联成功',
              type: 'success'
            })
            this.noContactBillItem.pageNum = 1
            this.requestTableItemData(this.noContactBillItem)
          } else {
            this.$message({
              message: '关联失败',
              type: 'error'
            })
          }
        })
        this.addItemData.itemIds = []
      },

      requestTableData(param) {

        param.billCode = this.contactBillItem.billCode;

        queryByCondition(param).then(response => {
          const data = response.data
          this.total = data.total
          this.tableData.bodyData = data.records
        })
      },
      requestTableItemData(param) {

        queryItemByCondition(param).then(response => {
          const data = response.data
          this.addItemTotal = data.total
          console.log("页面大小"+data.total)
          this.tableItemData = data.records
        })
      },

      getLeftTree() {
        queryBillTypeTree().then(response => {
          response.data.forEach(tree => {
            tree.name = tree.code + ' ' + tree.name
            if (tree.children.length > 0) {
              tree.children.forEach(child => {
                child.name = child.code + ' ' + child.name
              })
            }
          })
          const treeRoot = [{
            id: 0,
            name: '所有',
            children: response.data
          }]
          this.leftSideData.showTreeData = treeRoot
        })
      },
      tableButtonClick(name, row) {
        const btnDo = {
          '删除': () => deleteItemBill.call(this)
        }
        btnDo[name]()

        function deleteItemBill() {
          this.$confirm('此操作将删除关系?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            console.log("删除关联")
            console.log(row)
            const param = {
              id: row.id
            }
            deleteItemBillRequest(param).then(response => {
              this.requestTableData(this.contactBillItem)
              this.$message({
                message: '删除成功',
                type: 'success'
              })
            })
          })
        }
      },

      tableHeadButtonClick(button) {
        const btnDo = {
          '添加': () => add.call(this)
        }
        btnDo[button.name]()

        // 关闭弹出层
        function add() {
          let name = this.billName
          let bill = this.billCode
          let checkname = name == '' || name == undefined || name == '所有'
          let checkbill = bill == '' || bill == undefined
          if (checkname || checkbill) {
            this.addDialogVisible = false
            this.$message('请先选择左侧票据种类再添加项目！');
          } else {
            this.addDialogVisible = true
            this.noContactBillItem.billCode = this.billCode;
            this.requestTableItemData(this.noContactBillItem)
          }
        }
      },

      tableTagClick(name, row) {
        const _this = this
        const param = {
          id: row.id
        }
        console.log("状态" + row.id)
        const btnDo = {
          'enabled': () => enable().call(this)
        }
        btnDo[name]()
        //停启用关联
        function enable() {
          console.log("开启更改")
          turnenabled(param).then(response => {
            let successful2 = response.success
            let status = response.data
            let message2=''
            let type2='success'
            _this.requestTableData(_this.contactBillItem)
             if(status){
               message2='更改为启用状态'
             }else{
               message2='更改为禁用状态'
             }
             if(!successful2){
               message2='状态更新失败'
               type2='error'
             }
            _this.$message({
              message: message2,
              type: type2
            })
            return successful2


          })

        }
      },


      init() {
        this.freshTreeAndTable()
        this.searchFormData[2].options = this.formOptions.natureCodeOptions
      },
      freshTreeAndTable() {
        this.getLeftTree()
        this.requestTableData(this.defaultPage)
      }
    }
  }
  /* eslint-enable */
</script>
<style lang="scss" scoped>
  #addItemTable {
    margin-top: 10px;
  }
</style>
