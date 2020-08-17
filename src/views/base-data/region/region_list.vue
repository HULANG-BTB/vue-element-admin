<template>
  <div>
    <el-container style="border: 1px solid #eee" >
      <el-aside width="230px"  style="height:100vh; background-color: rgb(238, 241, 246)">
        <el-menu  >
          <template v-for="province in category">
            <el-submenu v-if="province.assortment" :index="province.id.toString()">
              <template slot="title" ><p @click="show(province.id)"><i class="el-icon-menu" ></i>{{province.name}}</p></template>
              <template v-for="city in province.children">
                <el-submenu v-if="city.assortment" :index="city.id.toString()">
                <template slot="title"><p @click="show(city.id)"><i class="el-icon-menu" ></i>{{city.name}}</p></template>
                <template v-for="area in city.children">
                 <el-menu-item @click="show(area.id)" :index="area.id.toString()"><i class="el-icon-document" ></i>{{area.name}}</el-menu-item>
                </template>
              </el-submenu>
                <el-menu-item v-else :index="city.id.toString()" @click="show(city.id)"><i class="el-icon-document" ></i>{{city.name}}</el-menu-item>
              </template>
            </el-submenu>
            <el-menu-item v-else :index="province.id.toString()" @click="show(province.id)"><i class="el-icon-document" ></i>{{province.name}}</el-menu-item>
          </template>
        </el-menu>
      </el-aside>
      <el-container >
        <el-header>
          <el-form ref="form" >
            区划编码：<el-input style="width: 200px" v-model="params.code" placeholder="区划编码" />
            名称：<el-input style="width: 200px" v-model="params.name" placeholder="名称" />
            <el-button type="primary" @click="query" >查询</el-button>
            <div class="right-items" style="float: right;">
            <el-button type="primary" @click="add" >新增</el-button>
            </div>
          </el-form>
        </el-header>
        <el-main >
          <el-table :data="regionData" style="width: 100%">
            <el-table-column prop="code" label="编码" >
            </el-table-column>
            <el-table-column prop="name" label="名称" width="120px" >
            </el-table-column>
            <el-table-column prop="orgName" label="主管机构名称" >
            </el-table-column>
            <el-table-column   label="是否分类" >
              <template slot-scope="scope" v-if="scope.row.assortment">
                <i  style="color:lightgreen; font-size:35px"  class="el-icon-check"></i>
              </template>
            </el-table-column>
            <el-table-column prop="leaf" label="是否底级" >
              <template slot-scope="scope" v-if="scope.row.leaf">
                <i  style="color:lightgreen; font-size:35px" class="el-icon-check"></i>
              </template>
            </el-table-column>
            <el-table-column prop="enabled" label="是否启用" >
              <template slot-scope="scope" v-if="scope.row.enabled">
                <i  style="color:lightgreen; font-size:35px" class="el-icon-check"></i>
              </template>
            </el-table-column>
            <el-table-column prop="topRegion" label="是否系统最高区划" >
              <template slot-scope="scope" v-if="scope.row.topRegion">
                <i  style="color:lightgreen; font-size:35px" class="el-icon-check"></i>
              </template>
            </el-table-column>

            <el-table-column
              fixed="right"
              label="操作"
              width="200px"
            >
              <template slot-scope="scope">
                <el-button  size="mini" type="success" @click="look(scope.row)"><i style="font-size:10px" class="el-icon-tickets"></i></el-button>
                <el-button  size="mini" type="primary" @click="edit(scope.row)"><i style="font-size:10px" class="el-icon-edit"></i></el-button>
                <el-button  type="danger" size="mini" @click="del(scope.row.id)"><i style="font-size:10px" class="el-icon-delete"></i></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            :page-size="size"
            layout="prev, pager, next"
            v-on:current-change="change"
            :current-page="page"
            :total="total" style="float:right;">
          </el-pagination>
        </el-main>
      </el-container>
    </el-container>

    <el-dialog title="更新" :visible.sync="editDialogVisible">
      <el-form  ref="regionForm" :model="regionForm" :rules="regionFormRules" label-width="140px"  >

        <el-form-item label="编码" prop="code">
          <el-input v-model="regionForm.code" auto-complete="off"  ></el-input>
        </el-form-item>

        <el-form-item label="名称" prop="name">
          <el-input v-model="regionForm.name" auto-complete="off" ></el-input>
        </el-form-item>

        <el-form-item label="助记码" prop="mnem">
          <el-input v-model="regionForm.mnem" auto-complete="off" ></el-input>
        </el-form-item>

        <el-form-item label="主管机构名称" prop="orgName">
          <el-input v-model="regionForm.orgName" auto-complete="off" ></el-input>
        </el-form-item>

        <el-form-item label="区划树级次" prop="level">
          <el-radio-group v-model="regionForm.level" v-on:change="levelChange">
            <el-radio class="radio" :label="1">省</el-radio>
            <el-radio class="radio" :label="2">市</el-radio>
            <el-radio class="radio" :label="3">区/县</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="是否分类" prop="assortment">
          <el-radio-group v-model ="regionForm.assortment" v-on:change="assortChange">
            <el-radio class="radio" :label="true">是</el-radio>
            <el-radio class="radio" :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <template v-if=" regionForm.level && (!regionForm.assortment || regionForm.level != 1) ">
          <el-form-item label="所属区划" prop="parentId">
            <el-cascader
              expand-trigger="hover"
              :options="categoryList"
              :value="categoryActive"
              :props="props">
            </el-cascader>
          </el-form-item>
        </template>

        <template v-if=" regionForm.level && (regionForm.assortment!=1 || regionForm.level != 1) ">
        <el-form-item label="业务上级区划" prop="busParentId">
          <el-cascader
            expand-trigger="hover"
            :options="busList"
            :value="busActive"
            :props="props">
          </el-cascader>
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
          <el-input v-model="regionForm.remark" auto-complete="off" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editForm" >提交</el-button>
        <el-button type="primary" @click="editDialogVisible = false" >返回</el-button>
      </div>
    </el-dialog>

    <el-dialog title="详细信息" :visible.sync="dialogTableVisible">
      <el-form  :model="dialogData" label-width="120px">
        <el-form-item label="名称：" >
          {{dialogData.name}}
        </el-form-item>
        <el-form-item label="编码：" >
          <span>{{dialogData.code}}</span>
        </el-form-item>
        <el-form-item label="级次：" >
            <span v-if="dialogData.level === 1">县级</span>
            <span v-if="dialogData.level === 2" >市级</span>
            <span v-if="dialogData.level === 3" >县（区）级</span>
        </el-form-item>
        <el-form-item label="主管机构名称：" :disabled="true">
          {{dialogData.orgName}}
        </el-form-item>
        <el-form-item label="备注：" :disabled="true">
          <span v-if="dialogData.remark">{{dialogData.remark}}</span>
          <span v-else>无</span>
        </el-form-item>
        <el-form-item label="操作人：" :disabled="true">
          {{dialogData.operator}}
        </el-form-item>
        <el-form-item label="创建时间：" :disabled="true">
          <span>{{dialogData.createTime | formatDate}}</span>
        </el-form-item>
        <el-form-item label="更新时间：" :disabled="true">
          {{dialogData.updateTime | formatDate}}
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    line-height: 100%;
  }
</style>

<script>
  import * as regionApi from "@/api/base/region/region"
  export default {
    data() {
      return {
        category:[],
        regionData:[],
        id:'',
        total:0,
        page:1,//页码
        size:8,//每页显示个数
        params:{
          parentId:'',
          code:'',
          name:''
        },
        dialogTableVisible: false,
        dialogData:{},
        editDialogVisible: false,
        props: {
          value: 'id',
          label:'name',
          children:'children'
        },
        categoryList: [],
        categoryActive:[],
        busList: [],
        busActive:[],
        regionForm:{
          id:'',
          code:'',
          name:'',
          mnem:'',
          parentId:'',
          level:'',
          assortment:'',
          leaf:'',
          enabled:'',
          topRegion:'',
          busParentId:'',
          orgName:'',
          remark:''
        },
        regionFormRules: {
          code: [
            {required: true, message: '请输入区划编码', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入区划名称', trigger: 'blur'}
          ],
          mnem: [
            {required: true, message: '请输入助记码', trigger: 'blur'}
          ],
          level: [
            {required: true, message: '请选择区划树级次', trigger: 'blur'}
          ],
          assortment: [
            {required: true, message: '请选择是否分类', trigger: 'blur'}
          ],
          leaf: [
            {required: true, message: '请选择是否底级', trigger: 'blur'}
          ],
          enabled: [
            {required: true, message: '请选择是否启用', trigger: 'blur'}
          ],
          topRegion: [
            {required: true, message: '请选择是否为系统最高区划', trigger: 'blur'}
          ],
          /*parentId: [
           {required: true, message: '请选择所属区划', trigger: 'blur'}
           ],*/
          /*busParentId: [
           {required: true, message: '请选择业务上级区划', trigger: 'blur'}
           ],*/
          orgName: [
            {required: true, message: '请输入主管机构名称', trigger: 'blur'}
          ]
        }
      }
    },
    methods:{
        show(id){
          this.id = id;
        },
        queryCategory() {
          regionApi.region_category().then(res => {
            if(res.success){
              this.category = res.data;
            }else if(res.message){
              this.$message.error(res.message)
            }else{
              this.$message.error("页面数据加载失败，请刷新重试！")
            }
          })
        },
        query(){
          regionApi.region_list(this.page,this.size,this.params).then(res => {
            if(res.success){
              this.regionData = res.data.list;
              this.total = res.data.total
            }
          })
          this.params.code = ''
          this.params.name = ''
        },
        change(page){
          this.page = page
          this.query()
        },
        look(row) {
            this.dialogData = row
            this.dialogTableVisible = true
        },
        add(){
          this.$router.push({
            path:'/base-data/region/add',
            query:{
              parentId:this.params.parentId
            }
          })
        },
        edit(row){
          /*this.$store.dispatch('region/setRegion',row).then(res => {
            this.$router.push({
              path:'/base-data/region/edit',
              query:{
                  parentId:this.params.parentId
              }
            })
          })*/
          this.regionForm = Object.assign({}, row)
          let level = this.regionForm.level
          let assort = this.regionForm.assortment
          this.categoryActive = []
          if(assort || (!assort && level == 1) ){
            regionApi.region_province().then(res => {
              if(res.success){
                this.categoryList = res.data;
              }
              this.categoryActive.push(this.regionForm.parentId)
            })
          }else{
            regionApi.region_city().then(res => {
              if(res.success){
                this.categoryList = res.data;
              }
            })
            regionApi.getGrandId(this.regionForm.parentId).then(res => {
              if(res.success){
                this.categoryActive.push(res.data)
                this.categoryActive.push(this.regionForm.parentId)
                console.log(this.categoryActive)
              }
            })
          }
          regionApi.region_category().then(res => {
            if (res.success) {
              this.busList = res.data
            }
          })
          regionApi.getBusIds(this.regionForm.busParentId).then(res => {
            if (res.success) {
              this.busActive = res.data
            }
          })
          this.editDialogVisible = true;
        },
        levelChange(val){//树级次
          if(val == 3){
            this.regionForm.assortment = false;
            regionApi.region_city().then(res => {
              if(res.success){
                this.categoryList = res.data;
              }
            })
          }
          if(this.regionForm.assortment){
            if(val == 2){
              regionApi.region_province().then(res => {
                if(res.success){
                  this.categoryList = res.data;
                }
              })
            }
          }else if(!this.regionForm.assortment){
            if(val == 1){
              regionApi.region_province().then(res => {
                if(res.success){
                  this.categoryList = res.data;
                }
              })
            }else if(val == 2){
              regionApi.region_city().then(res => {
                if(res.success){
                  this.categoryList = res.data;
                }
              })
            }
          }
          this.categoryActive = [];
        },
        assortChange(val){//是否分类
          if(val){
            if(this.regionForm.level == 3){
              this.regionForm.assortment = false;
              regionApi.region_city().then(res => {
                if(res.success){
                  this.categoryList = res.data;
                }
              })
            }else if(this.regionForm.level == 2){
              regionApi.region_province().then(res => {
                if(res.success){
                  this.categoryList = res.data;
                }
              })
            }
          }else{
            if(this.regionForm.level == 1){
              regionApi.region_province().then(res => {
                if(res.success){
                  this.categoryList = res.data;
                }
              })
            }else  if(this.regionForm.level == 2){
              regionApi.region_city().then(res => {
                if(res.success){
                  this.categoryList = res.data;
                }
              })
            }
          }
          this.categoryActive = [];
        },
        editForm(){
          this.$refs.regionForm.validate((valid) => {
            if(valid){
              if((!this.regionForm.assortment || this.regionForm.level != 1) && this.categoryActive.length == 0){
                alert("请选择所属区划")
                return
              }
              this.$confirm('确认提交吗？', '提示', {}).then(() => {
                if(this.regionForm.assortment && this.regionForm.level == 1){
                  this.regionForm.parentId = 0
                }else{
                  this.regionForm.parentId = this.categoryActive[this.categoryActive.length-1]
                }
                regionApi.editRegion(this.regionForm).then(res => {
                  if(res.success){
                    this.$message.success("更新成功")
                    this.editDialogVisible = false
                    this.query()
                  }else if(res.message){
                    this.$message.error(res.message)
                  }else{
                    this.$message.error("更新失败")
                  }
                })
              })
            }
          })
        },
        del(id){
          this.$confirm('确认删除吗？', '提示', {}).then(res => {
              regionApi.deleteRegion(id).then(res => {
                  if(res.success){
                      this.$message.success("删除成功")
                      this.queryCategory()
                      this.query()
                  }else if(res.message){
                      this.$message.error(res.message)
                  }else{
                      this.$message.error("删除失败，请重试")
                  }
              })
          })
        }
    },
    watch:{
      id(val){
          this.params.parentId = val
          this.query();
      }
    },
    created(){
      this.queryCategory()
      this.params.parentId = this.$route.query.parentId || '';
      this.query();
    }
  };
</script>
