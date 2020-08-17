<template>
  <div>
    <el-button
      type="primary"
      class="btn-create"
      icon="el-plus"
      @click="dialogFormVisible = true"
    >创建</el-button>

    <el-dialog
      title="创建票据代码"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        inline="true"
        :model="code"
      >
        <el-form-item
          label="区划编码"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="code.fregiId"
            size="small"
            autocomplete="off"
            maxlength="2"
            minlength="2"
          />
        </el-form-item>
        <el-form-item
          label="分类编码"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="code.fsortId"
            size="small"
            autocomplete="off"
            maxlength="2"
            minlength="2"
          />
        </el-form-item>
        <el-form-item
          label="种类编码"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="code.ftypeId"
            size="small"
            autocomplete="off"
            this.value="this.value.replace(/\D/g,'')"
            maxlength="2"
            minlength="2"
          />
        </el-form-item>
        <el-form-item
          label="年度编码"
          :label-width="formLabelWidth"
          maxlength="2"
          minlength="2"
        >
          <el-input
            v-model="code.fannualId"
            size="small"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="操作人"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="code.foperator"
            size="small"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="操作人ID"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="code.foperatorId"
            size="small"
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="createNewCode"
        >创建</el-button>
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
        // 返回msg
        encodeMessage: '',
        // 返回状态码
        responseStatus: ''
      },

      formLabelWidth: '120px'
    }
  },
  methods: {
    createNewCode () {
      this.dialogFormVisible = false
      this.$confirm('此操作将创建新的票据代码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.code.fregiId.length === 0 || this.code.fsortId.length === 0 || this.code.ftypeId.length === 0 || this.code.fannualId.length === 0) {
          this.$message.error('数据不能为空')
        } else {
          createCode(this.code).then(response => {
            this.code.encodeMessage = response.message
            this.code.responseStatus = response.code
            if (this.code.responseStatus === 200) {
              this.$message({
                message: this.code.encodeMessage,
                type: 'success'
              })
            } else {
              this.$message({
                message: this.code.encodeMessage,
                type: 'warning'
              })
            }
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消创建'
        })
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
