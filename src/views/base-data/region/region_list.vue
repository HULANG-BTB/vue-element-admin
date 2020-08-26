<template>
  <div>
    <el-container style="height:100%;">
      <el-aside width="250px" style="height:100vh">
        <left-tree :left-side-data="leftSideData" @treeNodeSearch="treeNodeSearch" />
      </el-aside>
      <el-main style=" border: 1px solid #eee">
        <el-form ref="ruleForm" :inline="true">
          <el-form-item label="区划编码:" prop="code">
            <el-input v-model="params.code" style="width: 200px" size="small" placeholder="区划编码" />
          </el-form-item>
          <el-form-item label="名称:" prop="name">
            <el-input v-model="params.name" style="width: 200px" size="small" placeholder="名称" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" icon="el-icon-search" @click="query">查询</el-button>
            <el-button type="primary" size="mini" @click="reset">重置</el-button>
          </el-form-item><br />
          <el-button v-permission="['admin', 'financial_check']" type="primary" size="mini" icon="el-icon-plus" @click="add">新增</el-button>
        </el-form>

        <el-table :data="regionData" style="width: 100%">
          <el-table-column prop="code" label="编码" />
          <el-table-column prop="name" label="名称" width="120px" />
          <el-table-column prop="orgName" label="主管机构名称" />
          <el-table-column label="是否分类">
            <template v-if="scope.row.assortment" slot-scope="scope">
              <i style="color:lightgreen; font-size:25px" class="el-icon-check" />
            </template>
          </el-table-column>
          <el-table-column prop="leaf" label="是否底级">
            <template v-if="scope.row.leaf" slot-scope="scope">
              <i style="color:lightgreen; font-size:25px" class="el-icon-check" />
            </template>
          </el-table-column>
          <el-table-column prop="enabled" label="是否启用">
            <template v-if="scope.row.enabled" slot-scope="scope">
              <i style="color:lightgreen; font-size:25px" class="el-icon-check" />
            </template>
          </el-table-column>
          <el-table-column prop="topRegion" label="是否系统最高区划">
            <template v-if="scope.row.topRegion" slot-scope="scope">
              <i style="color:lightgreen; font-size:25px" class="el-icon-check" />
            </template>
          </el-table-column>

          <el-table-column
            fixed="right"
            label="操作"
            width="200px"
          >
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="查看" placement="top">
                <el-button size="mini" type="success" @click="look(scope.row)"><i style="font-size:10px" class="el-icon-tickets" /></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="修改" placement="top">
                <el-button v-permission="['admin', 'financial_check']" size="mini" type="primary" @click="edit(scope.row)"><i style="font-size:10px" class="el-icon-edit" /></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <el-button v-permission="['admin', 'financial_check']" type="danger" size="mini" @click="del(scope.row.id)"><i style="font-size:10px" class="el-icon-delete" /></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          :page-size="size"
          layout="prev, pager, next"
          :current-page="page"
          :total="total"
          style="float:right;"
          @current-change="change"
        />
      </el-main>
    </el-container>

    <el-dialog title="更新" :visible.sync="editDialogVisible">
      <el-form ref="regionForm" :model="regionForm" :rules="regionFormRules" label-width="140px">

        <el-form-item label="编码" prop="code">
          <el-input v-model="regionForm.code" auto-complete="off" />
        </el-form-item>

        <el-form-item label="名称" prop="name">
          <el-input v-model="regionForm.name" auto-complete="off" />
        </el-form-item>

        <el-form-item label="助记码" prop="mnem">
          <el-input v-model="regionForm.mnem" auto-complete="off" />
        </el-form-item>

        <el-form-item label="主管机构名称" prop="orgName">
          <el-input v-model="regionForm.orgName" auto-complete="off" />
        </el-form-item>

        <el-form-item label="区划树级次" prop="level">
          <el-radio-group v-model="regionForm.level" @change="levelChange">
            <el-radio class="radio" :label="1">省</el-radio>
            <el-radio class="radio" :label="2">市</el-radio>
            <el-radio class="radio" :label="3">区/县</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="是否分类" prop="assortment">
          <el-radio-group v-model="regionForm.assortment" @change="assortChange">
            <el-radio class="radio" :label="true">是</el-radio>
            <el-radio class="radio" :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <template v-if="regionForm.id != 1 && regionForm.level && (!regionForm.assortment || regionForm.level != 1) ">
          <el-form-item label="所属区划" prop="parentId">
            <el-cascader
              v-model="categoryActive"
              expand-trigger="hover"
              :options="categoryList"
              :props="props"
            />
          </el-form-item>
        </template>

        <template v-if="regionForm.id != 1 && !regionForm.assortment ">
          <el-form-item label="业务上级区划" prop="busParentId">
            <el-cascader
              v-model="busActive"
              expand-trigger="hover"
              :options="busList"
              :props="props"
            />
          </el-form-item>
        </template>

        <el-form-item label="是否底级" prop="leaf">
          <el-radio-group v-model="regionForm.leaf">
            <el-radio class="radio" :label="true">是</el-radio>
            <el-radio class="radio" :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="是否启用" prop="enabled">
          <el-radio-group v-model="regionForm.enabled">
            <el-radio class="radio" :label="true">是</el-radio>
            <el-radio class="radio" :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="是否为系统最高区划" prop="topRegion">
          <el-radio-group v-model="regionForm.topRegion">
            <el-radio class="radio" :label="true">是</el-radio>
            <el-radio class="radio" :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="regionForm.remark" auto-complete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editForm">提交</el-button>
        <el-button type="primary" @click="editDialogVisible = false">返回</el-button>
      </div>
    </el-dialog>

    <el-dialog title="详细信息" :visible.sync="dialogTableVisible">
      <el-form :model="dialogData" label-width="120px">
        <el-form-item label="名称：">
          {{ dialogData.name }}
        </el-form-item>
        <el-form-item label="编码：">
          <span>{{ dialogData.code }}</span>
        </el-form-item>
        <el-form-item label="级次：">
          <span v-if="dialogData.level === 1">县级</span>
          <span v-if="dialogData.level === 2">市级</span>
          <span v-if="dialogData.level === 3">县（区）级</span>
        </el-form-item>
        <el-form-item label="主管机构名称：" :disabled="true">
          {{ dialogData.orgName }}
        </el-form-item>
        <el-form-item label="备注：" :disabled="true">
          <span v-if="dialogData.remark">{{ dialogData.remark }}</span>
          <span v-else>无</span>
        </el-form-item>
        <el-form-item label="操作人：" :disabled="true">
          {{ dialogData.operator }}
        </el-form-item>
        <el-form-item label="创建时间：" :disabled="true">
          <span>{{ dialogData.createTime | formatDate }}</span>
        </el-form-item>
        <el-form-item label="更新时间：" :disabled="true">
          {{ dialogData.updateTime | formatDate }}
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style>
</style>

<script>
import LeftTree from '@/components/leftTree'
import * as regionApi from '@/api/base/region/region'
export default {
  components: {
    LeftTree
  },
  data () {
    return {
      leftSideData: {
        showSearch: false,
        showTitle: '区划',
        expand: true,
        key: 'id',
        treeProp: {
          children: 'children',
          label: 'name'
        },
        showCheckBox: false,
        showTreeData: []
      },
      category: [],
      regionData: [],
      id: '',
      total: 0,
      page: 1, // 页码
      size: 8, // 每页显示个数
      params: {
        parentId: '',
        code: '',
        name: ''
      },
      dialogTableVisible: false,
      dialogData: {},
      editDialogVisible: false,
      props: {
        value: 'id',
        label: 'name',
        children: 'children'
      },
      provinceList: [],
      cityList: [],
      categoryList: [],
      categoryActive: [],
      busList: [],
      busActive: [],
      regionForm: {
        id: '',
        code: '',
        name: '',
        mnem: '',
        parentId: '',
        level: '',
        assortment: '',
        leaf: '',
        enabled: '',
        topRegion: '',
        busParentId: '',
        orgName: '',
        remark: ''
      },
      regionFormRules: {
        code: [
          { required: true,
            validator: (rule, value, callback) => {
              const reg = /^[0-9]+$/
              if (!value) {
                return callback(new Error('请输入区划编码'))
              }
              setTimeout(() => {
                if (!Number.isInteger(+value)) {
                  callback(new Error('请输入数字编码值'))
                } else if (reg.test(value) && value.length <= 6) {
                  callback()
                } else {
                  callback(new Error('区划编码格式错误'))
                }
              }, 1000)
            },
            trigger: 'blur'
          }
        ],
        name: [
          { required: true, message: '请输入区划名称', trigger: 'blur' }
        ],
        mnem: [
          { required: true, message: '请输入助记码', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '请选择区划树级次', trigger: 'blur' }
        ],
        assortment: [
          { required: true, message: '请选择是否分类', trigger: 'blur' }
        ],
        leaf: [
          { required: true, message: '请选择是否底级', trigger: 'blur' }
        ],
        enabled: [
          { required: true, message: '请选择是否启用', trigger: 'blur' }
        ],
        topRegion: [
          { required: true, message: '请选择是否为系统最高区划', trigger: 'blur' }
        ],
        /* parentId: [
           {required: true, message: '请选择所属区划', trigger: 'blur'}
           ],*/
        /* busParentId: [
           {required: true, message: '请选择业务上级区划', trigger: 'blur'}
           ],*/
        orgName: [
          { required: true, message: '请输入主管机构名称', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    id (val) {
      this.params.parentId = val
      this.query()
    }
  },
  created () {
    this.queryCategory()
    this.params.parentId = this.$route.query.parentId || ''
    this.query()
  },
  methods: {
    treeNodeSearch (object) {
      this.id = object.id
    },
    queryCategory () {
      regionApi.region_category().then(res => {
        if (res.success) {
          this.leftSideData.showTreeData = res.data
          this.busList = res.data
        } else if (res.message) {
          this.$message.error(res.message)
        } else {
          this.$message.error('页面数据加载失败，请刷新重试！')
        }
      })
      regionApi.region_province().then(res => {
        if (res.success) {
          this.provinceList = res.data
        }
      })
      regionApi.region_city().then(res => {
        if (res.success) {
          this.cityList = res.data
        }
      })
    },
    query () {
      regionApi.region_list(this.page, this.size, this.params).then(res => {
        if (res.success) {
          this.regionData = res.data.list
          this.total = res.data.total
        }
      })
    },
    reset () {
      this.params.code = ''
      this.params.name = ''
    },
    change (page) {
      this.page = page
      this.query()
    },
    look (row) {
      this.dialogData = row
      this.dialogTableVisible = true
    },
    add () {
      this.$router.push({
        path: '/base-data/region/add',
        query: {
          parentId: this.params.parentId
        }
      })
    },
    edit (row) {
      this.regionForm = Object.assign({}, row)
      const level = this.regionForm.level
      const assort = this.regionForm.assortment

      this.busActive = []
      if (assort || (!assort && level === 1)) {
        this.categoryList = this.provinceList
        this.categoryActive = []
        this.categoryActive.push(this.regionForm.parentId)
      } else {
        this.categoryList = this.cityList
        regionApi.getGrandId(this.regionForm.parentId).then(res => {
          if (res.success) {
            this.categoryActive = []
            this.categoryActive.push(res.data)
            this.categoryActive.push(this.regionForm.parentId)
          }
        })
      }
      if (!assort) {
        regionApi.getBusIds(this.regionForm.busParentId).then(res => {
          if (res.success) {
            this.busActive = res.data
          }
        })
      }
      this.editDialogVisible = true
    },
    levelChange (val) {
      if (val === 3) {
        this.regionForm.assortment = false
        this.categoryList = this.cityList
      }
      if (this.regionForm.assortment) {
        if (val === 2) {
          this.categoryList = this.provinceList
        }
      } else if (!this.regionForm.assortment) {
        if (val === 1) {
          this.categoryList = this.provinceList
        } else if (val === 2) {
          this.categoryList = this.cityList
        }
      }
      this.categoryActive = []
    },
    assortChange (val) {
      if (val) {
        if (this.regionForm.level === 3) {
          this.regionForm.assortment = false
          this.categoryList = this.cityList
        } else if (this.regionForm.level === 2) {
          this.categoryList = this.provinceList
        }
      } else {
        if (this.regionForm.level === 1) {
          this.categoryList = this.provinceList
        } else if (this.regionForm.level === 2) {
          this.categoryList = this.cityList
        }
      }
      this.categoryActive = []
    },
    editForm () {
      this.$refs.regionForm.validate((valid) => {
        if (valid) {
          if ((!this.regionForm.assortment || this.regionForm.level !== 1) && this.categoryActive.length === 0) {
            alert('请选择所属区划')
            return
          }
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            if (this.regionForm.assortment && this.regionForm.level === 1) {
              this.regionForm.parentId = 0
            } else {
              this.regionForm.parentId = this.categoryActive.pop()
            }
            this.regionForm.busParentId = ''
            if (!this.regionForm.assortment) {
              this.regionForm.busParentId = this.busActive.pop()
            }
            regionApi.editRegion(this.regionForm).then(res => {
              if (res.success) {
                this.$message.success('更新成功')
                this.editDialogVisible = false
                this.query()
              } else if (res.message) {
                this.$message.error(res.message)
              } else {
                this.$message.error('更新失败')
              }
            })
          })
        }
      })
    },
    del (id) {
      this.$confirm('确认删除吗？', '提示', {}).then(res => {
        regionApi.deleteRegion(id).then(res => {
          if (res.success) {
            this.$message.success('删除成功')
            this.queryCategory()
            this.query()
          } else if (res.message) {
            this.$message.error(res.message)
          } else {
            this.$message.error('删除失败，请重试')
          }
        })
      })
    }
  }
}
</script>
