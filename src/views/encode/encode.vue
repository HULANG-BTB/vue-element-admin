<template>
  <div>
    <el-button
      type="primary"
      class="btn-create"
      icon="el-plus"
      size="mini"
      @click="dialogFormVisible = true"
    >创建</el-button>

    <el-button
      type="primary"
      class="btn-create"
      icon="el-plus"
      size="mini"
      @click="batchDialogFormVisible = true"
    >批量创建</el-button>

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
            v-model="code.regiId"
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
            v-model="code.sortId"
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
            v-model="code.typeId"
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
            v-model="code.annualId"
            size="small"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="操作人"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="code.operator"
            size="small"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="操作人ID"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="code.operatorId"
            size="small"
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          size="small"
          @click="createNewCode"
        >创建</el-button>
      </div>
    </el-dialog>

    <!-- 批量创建 -->
    <el-dialog
      title="创建票据代码"
      :visible.sync="batchDialogFormVisible"
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
            v-model="batchCode.regiId"
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
            v-model="batchCode.sortId"
            size="small"
            autocomplete="off"
            maxlength="2"
            minlength="2"
          />
        </el-form-item>

        <el-form-item
          label="起始种类编码"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="batchCode.typeStartId"
            size="small"
            autocomplete="off"
            this.value="this.value.replace(/\D/g,'')"
            maxlength="2"
            minlength="2"
          />
        </el-form-item>
        <el-form-item
          label="终止种类编码"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="batchCode.typeEndId"
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
            v-model="batchCode.annualId"
            size="small"
            autocomplete="off"
          />
        </el-form-item>

        <el-form-item
          label="操作人"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="batchCode.operator"
            size="small"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="操作人ID"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="batchCode.operatorId"
            size="small"
            autocomplete="off"
          />
        </el-form-item>

      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button size="small" @click="batchDialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          size="small"
          @click="createNewBatchCode"
        >创建</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createCode, createBatchCode } from '@/api/encode'
export default {
  name: 'Encode',
  data () {
    return {
      dialogFormVisible: false,
      batchDialogFormVisible: false,
      code: {
        // 区划编码
        regiId: '',
        // 分类编码
        sortId: '',
        // 种类编码
        typeId: '',
        // 年度编码
        annualId: '',
        // 操作人姓名
        operator: '',
        // 操作人Id
        operatorId: '',
        // 返回msg
        encodeMessage: '',
        // 是否成功
        successFlag: false
      },
      batchCode: {
        // 区划编码
        regiId: '',
        // 分类编码
        sortId: '',
        // 起始种类编码
        typeStartId: '',
        // 终止种类编码
        typeEndId: '',
        // 年度编码
        annualId: '',
        // 操作人姓名
        operator: '',
        // 操作人Id
        operatorId: '',
        // 返回msg
        encodeMessage: '',
        // 是否成功
        successFlag: false
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
        if (this.code.regiId.length === 0 || this.code.sortId.length === 0 || this.code.typeId.length === 0 || this.code.annualId.length === 0) {
          this.$message.error('数据不能为空')
        } else {
          createCode(this.code).then(response => {
            this.code.encodeMessage = response.message
            this.code.responseStatus = response.code
            this.code.successFlag = response.success
            if (this.code.successFlag === true) {
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
    },
    createNewBatchCode () {
      this.dialogFormVisible = false
      this.$confirm('此操作将创建新的票据代码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.batchCode.regiId.length === 0 || this.batchCode.sortId.length === 0 || this.batchCode.typeStartId.length === 0 || this.batchCode.typeEndId === 0 || this.batchCode.annualId.length === 0) {
          this.$message.error('数据不能为空')
        } else {
          createBatchCode(this.batchCode).then(response => {
            console.log(this)
            this.batchCode.encodeMessage = response.message
            this.batchCode.responseStatus = response.code
            this.batchCode.successFlag = response.success
            if (this.code.successFlag === true) {
              this.$message({
                message: this.batchCode.encodeMessage,
                type: 'success'
              })
            } else {
              this.$message({
                message: this.batchCode.encodeMessage,
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
  margin-left: 30px;
  margin-top: 20px;
}
.el-input {
  padding-right: 30px;
  width: 200px;
}
</style>
