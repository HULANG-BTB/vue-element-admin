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
                <el-button  size="mini" type="success" @click="edit(scope.row)"><i style="font-size:10px" class="el-icon-tickets"></i></el-button>
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
        }
      }
    },
    methods:{
        show(id){
          this.id = id;
        },
        query(){
          regionApi.region_list(this.page,this.size,this.params).then(res => {
            if(res.success){
              this.regionData = res.query.list;
              this.total = res.query.total
            }
          })
          this.params.code = ''
          this.params.name = ''
        },
        change(page){
          this.page = page;
          this.query();
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
          this.$store.dispatch('region/setRegion',row).then(res => {
            this.$router.push({
              path:'/base-data/region/edit',
              query:{
                  parentId:this.params.parentId
              }
            })
          })
        },
        del(id){
          this.$confirm('确认删除吗？', '提示', {}).then(res => {
              regionApi.deleteRegion(id).then(res => {
                  if(res.success){
                      this.$message.success("删除成功")
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
      regionApi.region_category().then(res => {
          if(res.success){
              this.category = res.query;
          }else if(res.message){
            this.$message.error(res.message)
          }else{
            this.$message.error("页面数据加载失败，请刷新重试！")
          }
      })
      this.params.parentId = this.$route.query.parentId || '';
      this.query();
    }
  };
</script>
