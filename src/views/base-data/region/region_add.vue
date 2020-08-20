<template>
  <div>
    <el-form  ref="regionForm" :model="regionForm" :rules="regionFormRules" label-width="140px"  >

      <el-form-item label="编码" prop="code">
        <el-input v-model="regionForm.code" auto-complete="off" placeholder="请输入六位数字以内的区划编码"  ></el-input>
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

      <template v-if="regionForm.assortment != null &&  regionForm.level && (!regionForm.assortment || regionForm.level != 1) ">
      <el-form-item label="所属区划" prop="parentId">
        <el-cascader
          expand-trigger="hover"
          :options="categoryList"
          v-model="categoryActive"
          :props="props">
        </el-cascader>
      </el-form-item>
      </template>

      <template v-if="regionForm.assortment != null && regionForm.level && !regionForm.assortment">
      <el-form-item label="业务上级区划" prop="busParentId">
        <el-cascader
          expand-trigger="hover"
          :options="busList"
          v-model="busActive"
          :props="props">
        </el-cascader>
      </el-form-item>
      </template>

      <el-form-item label="是否底级" prop="leaf">
        <el-radio-group v-model="regionForm.leaf">
          <el-radio class="radio" label="true">是</el-radio>
          <el-radio class="radio" label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="是否启用" prop="enabled">
        <el-radio-group v-model="regionForm.enabled">
          <el-radio class="radio" label="true">是</el-radio>
          <el-radio class="radio" label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="是否为系统最高区划" prop="topRegion">
        <el-radio-group v-model="regionForm.topRegion">
          <el-radio class="radio" label="true">是</el-radio>
          <el-radio class="radio" label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input v-model="regionForm.remark" auto-complete="off" ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click.native="save" >提交</el-button>
    </div>
  </div>

</template>

<script>
  import * as regionApi from "@/api/base/region/region"
  export default{
      data(){
          return{
            props: {
              value: 'id',
              label:'name',
              children:'children'
            },
            parentId:'',
            provinceList: [],
            cityList: [],
            categoryList: [],
            categoryActive:[],
            busList: [],
            busActive:[],
            regionForm:{
              code:'',
              name:'',
              mnem:'',
              parentId:'',
              level:'',
              assortment: null,
              leaf:'',
              enabled:'',
              topRegion:'',
              busParentId:'',
              orgName:'',
              remark:''
            },
            regionFormRules: {
              code: [
                {required: true,
                  validator: (rule, value, callback) => {
                    const reg = /^[0-9]+$/
                    if (!value) {
                      return callback(new Error('请输入区划编码'))
                    }
                    setTimeout(() => {
                      if (!Number.isInteger(+value)) {
                        callback(new Error('请输入数字编码值'))
                      }else if(reg.test(value) && value.length <= 6){
                        callback()
                      }else{
                        callback(new Error('区划编码格式错误'))
                      }
                    }, 1000)
                  },
                  trigger: 'blur'
                }
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
      queryCategory() {
        regionApi.region_category().then(res => {
          if(res.success){
            this.busList = res.data
          }else if(res.message){
            this.$message.error(res.message)
          }else{
            this.$message.error("页面数据加载失败，请刷新重试！")
          }
        })
        regionApi.region_province().then(res => {
          if(res.success){
            this.provinceList = res.data;
          }
        })
        regionApi.region_city().then(res => {
          if(res.success){
            this.cityList = res.data;
          }
        })
      },
      save(){
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
              this.regionForm.busParentId = ''
              if(!this.regionForm.assortment){
                this.regionForm.busParentId = this.busActive[this.busActive.length-1]
              }
              regionApi.addRegion(this.regionForm).then(res => {
                  if(res.success){
                    this.$message.success("添加成功")
                    this.regionForm = {};
                  }else if(res.message){
                    this.$message.error(res.message)
                  }else{
                    this.$message.error("提交失败")
                  }
              })
            })
          }
        })
      },
      levelChange(val){
        debugger
        if(val === 3){
          this.regionForm.assortment = false;
          this.categoryList = this.cityList
        }
        if(this.regionForm.assortment){
          if(val == 2){
            this.categoryList = this.provinceList
          }
        }else if(!this.regionForm.assortment){
          if(val === 1){
            this.categoryList = this.provinceList
          }else if(val === 2){
            this.categoryList = this.cityList
          }
        }
        this.categoryActive = [];
      },
      assortChange(val){
        if(val){
          if(this.regionForm.level === 3){
            this.regionForm.assortment = false;
            this.categoryList = this.cityList
          }else if(this.regionForm.level === 2){
            this.categoryList = this.provinceList
          }
        }else{
          if(this.regionForm.level === 1){
            this.categoryList = this.provinceList
          }else  if(this.regionForm.level === 2){
            this.categoryList = this.cityList
          }
        }
        this.categoryActive = [];
      }
    },
    created(){
      this.queryCategory()
    }
  }
</script>
