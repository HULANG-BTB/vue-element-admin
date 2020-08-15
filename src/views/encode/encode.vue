<template>
  <div>
    <el-button type="primary" class="btn-create" icon="el-plus" @click="dialogFormVisible = true">创建</el-button>

    <el-dialog title="创建票据代码" :visible.sync="dialogFormVisible">
      <el-form :model="code" inline="true">
        <el-form-item label="区划编码" :label-width="formLabelWidth">
          <el-input v-model="code.fregiId" size="small" autocomplete="off" />
        </el-form-item>
        <el-form-item label="分类编码" :label-width="formLabelWidth">
          <el-input v-model="code.fsortId" size="small" autocomplete="off" />
        </el-form-item>
        <el-form-item label="种类编码" :label-width="formLabelWidth">
          <el-input v-model="code.ftypeId" size="small" autocomplete="off" />
        </el-form-item>
        <el-form-item label="年度编码" :label-width="formLabelWidth">
          <el-input v-model="code.fannualId" size="small" autocomplete="off" />
        </el-form-item>
        <el-form-item label="操作人" :label-width="formLabelWidth">
          <el-input v-model="code.foperator" size="small" autocomplete="off" />
        </el-form-item>
        <el-form-item label="操作人ID" :label-width="formLabelWidth">
          <el-input v-model="code.foperatorId" size="small" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="createNewCode">创建</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createCode } from '@/api/encode'
export default {
  name: 'Encode',
  data () {
    return {
      dialogFormVisible: false,
      code: {
        // 区划编码
        fregiId: '',
        // 分类编码
        fsortId: '',
        // 种类编码
        ftypeId: '',
        // 年度编码
        fannualId: '',
        // 操作人姓名
        foperator: '',
        // 操作人Id
        foperatorId: '',
        encodeMessage: ''
      },

      formLabelWidth: '120px'
    }
  },
  methods: {
    // 赋码
    createNewCode () {
      createCode(this.code).then(response => {
        this.dialogFormVisible = false
        this.encodeMessage = response.msg
        alert(this.encodeMessage)
      })
    }
  }
}
</script>

<style scoped>
.btn-create {
  margin-left: 1200px;
  margin-top: 20px;
}
.el-input {
  padding-right: 30px;
  width: 200px;
}
</style>

