<template>
  <el-container style="height:670.4px">
    <left-tree
      :left-side-data="leftSideData"
      :year="object.year"
      @treeNodeSearch="treeNodeSearch"
    />
    <div id="right">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="科目名称">
          <el-input v-model="searchForm.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="年份">
          <el-input v-model="searchForm.year" placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          <el-button type="primary" icon="el-icon-edit" style="margin-left: 10px" @click="addCreate()">添加</el-button>
          <el-button type="primary" icon="el-icon-edit" style="margin-left: 10px" @click="copyCreate">复制</el-button>
          <!-- <el-button :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownload">下载</el-button> -->
          <el-upload
            class="upload-demo"
            style="display: inline-block;"
            action=""
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            :on-change="leading"
            :auto-upload="false"
            :show-file-list="false"
          >
            <!-- <el-button size="small" type="primary">点击上传</el-button> -->
            <el-button type="primary" icon="el-icon-download" style="margin-left: 10px">导入</el-button>
          </el-upload>
          <!-- <el-button type="primary" icon="el-icon-download" @click="importData">导入</el-button> -->
          <el-button type="primary" icon="el-icon-upload2" style="margin-left: 10px" @click="exportData">导出</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        style="width: 100%"
        height="535px"
        border
      >
        <el-table-column
          fixed
          prop="year"
          label="年度"
          width="120"
        />
        <el-table-column
          prop="code"
          label="科目编码"
          width="120"
        />
        <el-table-column
          prop="name"
          label="科目名称"
          width="180"
        />
        <el-table-column
          prop="level"
          label="级次"
          width="100"
        />
        <el-table-column
          prop="leaf"
          label="是否底级"
          width="100"
        />
        <el-table-column
          prop="enable"
          label="是否启用"
          width="100"
        />
        <el-table-column
          prop="remark"
          label="备注"
          width="200"
        />
        <el-table-column
          fixed="right"
          prop="operation"
          label="操作"
          width="150"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="editHandleClick(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="delHandleClick(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-show="total>0"
        :current-page="currentPage4"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <el-dialog title="添加" :visible.sync="addDialogVisible" center>
        <el-form ref="addForm" :rules="rules" :model="addForm" :label-width="formLabelWidth" :inline="true">
          <el-form-item label="年度" prop="year">
            <el-input v-model="addForm.year" autocomplete="off" :disabled="true" />
          </el-form-item>
          <el-form-item label="上级预算科目" prop="usperSubName">
            <el-input v-model="addForm.usperSubName" autocomplete="off" :disabled="true" />
          </el-form-item>
          <el-form-item label="科目编码" prop="subCode">
            <el-input v-model="addForm.subCode" autocomplete="off" />
          </el-form-item>
          <el-form-item label="科目名称" prop="subName">
            <el-input v-model="addForm.subName" autocomplete="off" />
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input v-model="addForm.remarks" type="textarea" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addDetermine('addForm')">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="编辑" :visible.sync="editDialogVisible" center>
        <el-form :model="editForm" :inline="true">
          <el-form-item label="科目名称" :label-width="formLabelWidth">
            <el-input v-model="editForm.subName" autocomplete="off" :disabled="true" />
          </el-form-item>
          <el-form-item label="是否底级" :label-width="formLabelWidth">
            <el-select v-model="editForm.isLeaf" placeholder="请输入">
              <el-option label="是" value="true" />
              <el-option label="否" value="false" />
            </el-select>
          </el-form-item>
          <el-form-item label="是否启用" :label-width="formLabelWidth">
            <el-select v-model="editForm.isEnable" placeholder="请输入">
              <el-option label="是" value="true" />
              <el-option label="否" value="false" />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" :label-width="formLabelWidth">
            <el-input v-model="editForm.remarks" type="textarea" autocomplete="off" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editDetermine">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </el-container>
</template>

<script>

import LeftTree from './components/LeftTree'
import { getTableList, edit, add, del, upload, copy } from './api/subject'
import { download } from './api/export'

export default {
  components: {
    LeftTree
  },
  data () {
    return {
      leftSideData: {
        showSearch: true,
        showTitle: '预算科目种类',
        defaultExpand: [],
        key: 'id',
        treeProps: {
          children: 'children',
          label: 'label'
        },
        showCheckBox: false,
        showTreeData: [
        //   {
        //   id: 1,
        //   label: '一级 1',
        //   children: [{
        //     id: 4,
        //     label: '二级 1-1',
        //     children: [{
        //       id: 9,
        //       label: '三级 1-1-1'
        //     }, {
        //       id: 10,
        //       label: '三级 1-1-2'
        //     }]
        //   }]
        // }
        ]
      },
      searchForm: {
        name: '',
        year: '2020'
      },
      tableData: [],
      currentPage4: 1,
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        fid: '',
        pid: '',
        year: '',
        usperSubName: '',
        subCode: '',
        subName: '',
        remarks: ''
      },
      rules: {
        subCode: [
          { required: true, message: '请输入科目编码', trigger: 'blur' }
        ],
        subName: [
          { required: true, message: '请输入科目名称', trigger: 'blur' }
        ]
      },
      editForm: {
        subName: '',
        isLeaf: '',
        isEnable: '',
        remarks: ''
      },
      formLabelWidth: '100px',
      total: null,
      pageSize: 10,
      year: '',
      object: {
        id: 0,
        limit: 10,
        name: '',
        page: 1,
        year: '' },
      row: {},
      parentId: '',
      parentName: ''
    }
  },
  mounted () {
    this.freshTree(this.object)
    this.init(this.object)
  },
  methods: {
    // 复制数据
    copyCreate () {
      if (this.parentId.length === 0) {
        this.$message.error('请先点击左侧的树选择要复制的数据')
        return
      }
      const data = {}
      data.id = this.parentId
      copy(data).then(res => {
        this.$message({
          message: '复制成功',
          type: 'success' }
        )
      }).catch(err => {
        console.log(err)
      })
    },
    addCreate () {
      if (this.parentId.length === 0) {
        this.$message.error('请先点击左侧的树选择要创建在哪个分支下')
        return
      }
      this.addDialogVisible = true
      this.addForm.year = this.searchForm.year
      this.addForm.usperSubName = this.parentName
    },
    // 添加数据
    addDetermine () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          const data = {}
          data.code = this.addForm.subCode
          data.name = this.addForm.subName
          data.parentId = this.parentId
          data.remark = this.addForm.remarks
          data.year = this.searchForm.year
          console.log(data)
          add(data).then(res => {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            setTimeout(() => { location.reload() }, 1000)
          }).catch(err => console.log(err))
          this.addDialogVisible = false
          this.addForm = {}
        } else {
          return false
        }
      })
      // const data = {}
      // data.code = this.addForm.subCode
      // data.name = this.addForm.subName
      // data.parentId = this.parentId
      // data.remark = this.addForm.remarks
      // data.year = this.searchForm.year
      // add(data).then(res => {
      //   this.$message({
      //     message: '添加成功',
      //     type: 'success'
      //   })
      //   setTimeout(() => { location.reload() }, 1000)
      // }).catch(err => console.log(err))
      // this.addDialogVisible = false
      // this.addForm = {}
    },
    editHandleClick (row) {
      this.editDialogVisible = true
      console.log(row)
      this.editForm.subName = row.name
      this.editForm.remarks = row.remark
      if (row.enable === '是') {
        this.editForm.isEnable = 'true'
      } else {
        this.editForm.isEnable = 'false'
      }
      if (row.leaf === '是') {
        this.editForm.isLeaf = 'true'
      } else {
        this.editForm.isLeaf = 'false'
      }
      this.row = row
    },
    // 修改数据
    editDetermine () {
      const data = {}
      data.id = this.row.id
      data.enable = this.editForm.isEnable
      data.leaf = this.editForm.isLeaf
      data.name = this.editForm.subName
      data.remark = this.editForm.remarks
      edit(data).then(() => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        setTimeout(() => { location.reload() }, 1000)
      }).catch(() => {
        this.$message('修改失败')
      })
      this.editDialogVisible = false
      this.editForm = {}
    },
    // 删除数据
    delHandleClick (row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {}
        data.id = row.id
        del(data).then(() => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          setTimeout(() => { location.reload() }, 1000)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 导入数据
    leading (file) {
      console.log(file)
      if (this.parentId.length === 0) {
        this.$message.error('请先点击左侧的树选择要导入到哪个分支下')
        return
      }
      const formData = new FormData()
      formData.append('file', file.raw)
      formData.append('id', this.parentId)
      console.log(formData)
      upload(formData).then(res => {
        console.log(res)
        this.$message({
          message: '导入成功',
          type: 'success'
        })
        setTimeout(() => {
          location.reload()
        }, 1000)
      }).catch(err => {
        console.log(err)
      })
    },
    // 导出数据
    exportData () {
      if (this.parentId.length === 0) {
        this.$message.error('请先点击左侧的树选择要导出哪个分支下的数据')
        return
      }
      const data = {}
      data.id = this.parentId
      data.limit = this.object.limit
      data.page = this.object.page
      data.year = this.searchForm.year
      console.log(data)
      download(data).then(res => {
        // 自定义时间格式转换方法
        function dateFormat (fmt, date) {
          let ret
          const opt = {
            'Y+': date.getFullYear().toString(), // 年
            'm+': (date.getMonth() + 1).toString(), // 月
            'd+': date.getDate().toString(), // 日
            'H+': date.getHours().toString(), // 时
            'M+': date.getMinutes().toString(), // 分
            'S+': date.getSeconds().toString() // 秒
            // 有其他格式化字符需求可以继续添加，必须转化成字符串
          }
          for (const k in opt) {
            ret = new RegExp('(' + k + ')').exec(fmt)
            if (ret) {
              fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
            }
          }
          return fmt
        }

        const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })// 创建二进制流流接受对象
        const date = new Date()
        const format = dateFormat('YYYY年mm月dd日HH时MM分SS秒', date)
        const fileName = this.parentName + format + '.xlsx'
        const linkNode = document.createElement('a')
        linkNode.download = fileName // a标签的download属性规定下载文件的名称
        linkNode.style.display = 'none'
        linkNode.href = URL.createObjectURL(blob) // 生成一个Blob URL
        document.body.appendChild(linkNode)
        linkNode.click() // 模拟在按钮上的一次鼠标单击
        URL.revokeObjectURL(linkNode.href) // 释放URL 对象
        document.body.removeChild(linkNode)
      }).catch(err => {
        console.log(err)
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      console.log(`每页 ${val} 条`)
      this.object.limit = this.pageSize
      this.init(this.object)
    },
    handleCurrentChange (val) {
      this.object.page = val
      console.log(`当前页: ${val}`)
      this.init(this.object)
    },

    // 点击左侧树节点，获取右侧表格数据
    treeNodeSearch (object) {
      this.object.page = 1
      this.object.id = object.id
      this.parentId = object.id
      this.parentName = object.label
      this.init(this.object)
    },
    // 初始化数据
    init (object) {
      object.name = this.searchForm.name
      object.year = this.searchForm.year
      getTableList(object).then(res => {
        const right = res.data.rightList
        const data = []
        for (let i = 0; i < right.length; i++) {
          data[i] = {}
          data[i].id = right[i].id
          data[i].year = right[i].year
          data[i].code = right[i].code
          data[i].name = right[i].name
          data[i].parentId = right[i].parentId
          data[i].level = right[i].level
          if (right[i].leaf === true) {
            data[i].leaf = '是'
          } else {
            data[i].leaf = '否'
          }
          if (right[i].enable === true) {
            data[i].enable = '是'
          } else {
            data[i].enable = '否'
          }
          data[i].remark = right[i].remark
        }
        this.tableData = data
        this.total = res.data.total
      })
    },
    // 刷新左侧的树数据
    freshTree (object) {
      object.year = this.searchForm.year
      console.log(object)
      getTableList(object).then(res => {
        const tree = []
        const left = res.data.leftList
        // 遍历左边的树的数据
        for (let i = 0; i < left.length; i++) {
          tree[i] = {}
          if (i === 0) {
            tree[i].id = 0
          } else {
            tree[i].id = left[i].id
          }
          tree[i].label = left[i].name
          if (left[i].subjectVOS.length > 0) {
            tree[i].children = []
            for (let j = 0; j < left[i].subjectVOS.length; j++) {
              tree[i].children[j] = {}
              tree[i].children[j].id = left[i].subjectVOS[j].id
              tree[i].children[j].label = left[i].subjectVOS[j].name
              if (left[i].subjectVOS[j].subjectVOS.length > 0) {
                tree[i].children[j].children = []
                for (let k = 0; k < left[i].subjectVOS[j].subjectVOS.length; k++) {
                  tree[i].children[j].children[k] = {}
                  tree[i].children[j].children[k].id = left[i].subjectVOS[j].subjectVOS[k].id
                  tree[i].children[j].children[k].label = left[i].subjectVOS[j].subjectVOS[k].name
                  if (left[i].subjectVOS[j].subjectVOS[k].subjectVOS.length > 0) {
                    tree[i].children[j].children[k].children = []
                    for (let l = 0; l < left[i].subjectVOS[j].subjectVOS[k].subjectVOS.length; l++) {
                      tree[i].children[j].children[k].children[l] = {}
                      tree[i].children[j].children[k].children[l].id = left[i].subjectVOS[j].subjectVOS[k].subjectVOS[l].id
                      tree[i].children[j].children[k].children[l].label = left[i].subjectVOS[j].subjectVOS[k].subjectVOS[l].name
                    }
                  }
                }
              }
            }
          }
        }
        this.leftSideData.showTreeData = tree
      })
    },
    // 按输入框的条件搜索右侧数据
    search () {
      this.object.page = 1
      this.init(this.object)
      this.freshTree(this.object)
    }
  }
}
</script>

<style scoped>
#right{
  height: 100%;
  width: 1079px;
}

.demo-form-inline{
  padding-top: 20px;
  padding-left: 10px;
}

.el-pagination{
  /* margin-top: 40px; */
  position: absolute;
  right: 0;
}

</style>
