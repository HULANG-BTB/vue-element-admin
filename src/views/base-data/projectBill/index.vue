<!--
* @Author: wuliming
* @since: 2020-08-11 8:59
 * @lastTime: 2020-08-25 20:01:11
 * @LastEditors: Raiz
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
        @tableButtonClick="tableButtonClick"
      />
    </div>
    <el-dialog :title="billName" :visible.sync="addDialogVisible" center>
      <div>
        <span><b>项目名称:</b></span>
        <el-input v-model="addItemCondition" size="mini" placeholder="请输入" style="width: 200px; margin-left: 10px;" />
        <el-button type="primary" icon="el-icon-search" size="mini" style="margin-left: 10px;" @click="selectAddItemInfo()" />
        <span><b /></span>
        <el-button :disabled="addItemDisabled" type="primary" icon="el-icon-plus" size="mini" style="margin-left: 10px; float: right;" @click="addItem()">关联</el-button>
      </div>
      <div id="addItemTable">
        <el-table id="addNoItem" ref="multipleTable" :data="tableItemData" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column property="id" label="id" width="50" />
          <el-table-column property="itemId" label="项目编码" width="100" />
          <el-table-column property="itemName" label="项目名称" />
          <el-table-column label="创建时间">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime | formatDate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="更新时间">
            <template slot-scope="scope">
              <span>{{ scope.row.updateTime | formatDate }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          layout="total, prev, pager, next, jumper"
          :current-page="noContactBillItem.pageNum"
          :page-size="noContactBillItem.pageSize"
          :total="addItemTotal"
          @current-change="addItemPageChange"
        />
      </div>
    </el-dialog>

    <DialogBorder
      v-model="detailVisible"
      :dialog-data="dialogData"
    >
      <div class="detailClass">
        <el-row>
          <el-col :span="9">关系id:{{ showDetailData.id }}</el-col>
          <el-col :span="11" class="rightCol">票据种类编码:{{ showDetailData.billCode }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="9">操作人:{{ showDetailData.operator }}</el-col>
          <el-col :span="9" class="rightCol">
            项目id: {{ showDetailData.itemId }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9">
            项目是否启用: {{ showDetailData.itemIsEnabled }}
          </el-col>
          <el-col :span="9" class="rightCol">
            项目名称: {{ showDetailData.itemName }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9">
            创建时间:{{ showDetailData.createTime }}
          </el-col>
          <el-col :span="9" class="rightCol">更新时间:{{ showDetailData.updateTime }}</el-col>
        </el-row>
      </div>
    </DialogBorder>
  </el-container>
</template>
<script>
import LeftTree from '@/components/leftTree'
import FormTable from '@/components/formTable'
import DialogBorder from '@/components/Dialog/dialog-border'
import {
  queryBillTypeTree,
  queryByCondition,
  turnenabled,
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
  data () {
    return {
      detailVisible: false,
      addItemDisabled: true,
      addItemTotal: 0,
      addItemCondition: '',
      addDialogVisible: false,
      showDetailData: {},
      billName: '',
      billCode: '',
      multipleSelection: [],
      enablePermission: ['admin', 'financial_check'],
      addItemData: {
        billCode: '',
        itemIds: []
      },
      dialogData: {
        headTitle: '关系详细信息',
        name: 'realizeDetailDialog'

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
        pageSize: 10
      },
      noContactBillItem: {
        billCode: '',
        itemName: '',
        pageNum: 1,
        pageSize: 5
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
          icon: 'el-icon-plus',
          permission: ['admin', 'financial_check']
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
        ]
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
          prop: 'itemName',
          label: '项目名称',
          width: 150
        },
        {
          prop: 'enabled',
          label: '关系启用',
          width: 80
        },
        {
          prop: 'itemIsEnabled',
          label: '项目启用',
          width: 80
        },
        {
          prop: 'updateTime',
          label: '更新时间',
          width: 140
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
    treeNodeSearch (node) {
      this.billCode = node.code
      this.billName = node.name
      this.contactBillItem.billCode = node.code
      this.noContactBillItem.pageNum = 1
      this.contactBillItem.pageNum = 1
      this.requestTableData(this.contactBillItem)
    },
    handleSelectionChange (val) {
      if (val.length === 0) {
        this.addItemDisabled = true
      } else {
        this.addItemDisabled = false
      }

      this.multipleSelection = val
      // this.$refs.multipleTable.clearSelection(); 全部取消
    },
    selectAddItemInfo () {
      this.noContactBillItem.billCode = this.billCode
      this.noContactBillItem.itemName = this.addItemCondition
      this.requestTableItemData(this.noContactBillItem)
    },
    addItemPageChange (val) {
      this.noContactBillItem.pageNum = val
      this.requestTableItemData(this.noContactBillItem)
    },
    addItem () {
      const param = {
        billCode: this.billCode,
        itemIds: []
      }
      this.multipleSelection.forEach(element => {
        param.itemIds.push(element.itemId)
      })

      addBillItem(param).then(response => {
        const result = response.data
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

    requestTableData (param) {
      param.billCode = this.contactBillItem.billCode

      queryByCondition(param).then(response => {
        const data = response.data
        this.total = data.total
        this.tableData.bodyData = data.records
      })
    },
    requestTableItemData (param) {
      queryItemByCondition(param).then(response => {
        const data = response.data
        this.addItemTotal = data.total
        this.tableItemData = data.records
      })
    },

    getLeftTree () {
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
    tableButtonClick (name, row) {
      const btnDo = {
        '查看详细信息': () => checkDetail.call(this),
        '删除': () => deleteItemBill.call(this)
      }
      btnDo[name]()

      function checkDetail () {
        this.detailVisible = true
        this.showDetailData = row
      }

      function deleteItemBill () {
        this.$confirm('此操作将删除关系?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
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

    tableHeadButtonClick (button) {
      const btnDo = {
        '添加': () => add.call(this)
      }
      btnDo[button.name]()

      // 关闭弹出层
      function add () {
        const name = this.billName
        const bill = this.billCode
        const checkname = name === '' || name === undefined || name === '所有'
        const checkbill = bill === '' || bill === undefined
        if (checkname || checkbill) {
          this.addDialogVisible = false
          this.$message('请先选择左侧票据种类再添加项目！')
        } else {
          this.addDialogVisible = true
          this.noContactBillItem.billCode = this.billCode
          this.requestTableItemData(this.noContactBillItem)
        }
      }
    },
    tableTagClick (name, row) {
      const param = {
        id: row.id
      }

      const btnDo = {
        'enabled': () => enable.call(this)
      }
      // 判断是否有权限
      let check = false
      const roles = this.$store.getters.roles
      this.enablePermission.forEach(element => {
        if (roles.includes(element)) {
          check = true
        }
      })
      if (check) {
        btnDo[name](this)
      } else {
        this.$message(
          {
            type: 'error',
            message: '没有启用和禁用的权限'
          }
        )
      }

      // 停启用关联
      function enable () {
        turnenabled(param).then(response => {
          const successful2 = response.success
          const status = response.data
          let message2 = ''
          let type2 = 'success'
          this.requestTableData(this.contactBillItem)
          if (status) {
            message2 = '更改为启用状态'
          } else {
            message2 = '更改为禁用状态'
          }
          if (!successful2) {
            message2 = '状态更新失败'
            type2 = 'error'
          }
          this.$message({
            message: message2,
            type: type2
          })
          return successful2
        })
      }
    },

    init () {
      this.freshTreeAndTable()
    },
    freshTreeAndTable () {
      this.getLeftTree()
      this.requestTableData(this.defaultPage)
    }
  }
}
</script>
<style lang="scss" scoped>
  .detailClass{
    margin-left:15%;
    margin-bottom: 5%;
    .el-row{
      margin-top:20px;
    }
    .rightCol{
      margin-left: 15%;
    }
  }
  #addItemTable {
    margin-top: 10px;
  }
#addNoItem{
  width: 60vw;
}
</style>
