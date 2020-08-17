<template>
  <div>
    <el-header class="top">
      <el-row gutter="20">
        <el-col :span="2" :push="1">
          <svg-icon class="icon" icon-class="setting" />
        </el-col>
        <el-col :span="13" class="grid-content" push="1">
          <div><h3>票据池-设置</h3></div>
        </el-col>
        <el-col :span="3" :push="2">
          <el-button type="primary" icon="el-icon-circle-plus" @click="dialogFormVisible = true">
            创建票据池
          </el-button>
        </el-col>
      </el-row>

      <el-dialog
        title="创建票据池"
        :visible.sync="dialogFormVisible"
        width="28%"
        center
      >
        <el-form
          :model="poolData"
          class="divForm"
        >
          <el-form-item
            label="票据池代码"
            :label-width="formLabelWidth"
            class="divForm"
          >
            <el-input
              v-model="poolData.code"
              size="small"
              autocomplete="off"
              maxlength="6"
            />
          </el-form-item>
          <el-form-item
            label="票据池预警数量"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="poolData.minNumber"
              size="small"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="每次推送数量"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="poolData.pushNumber"
              size="small"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="操作人"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="poolData.operator"
              size="small"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="操作人ID"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="poolData.operatorId"
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
            @click="createPool"
          >创建</el-button>
        </div>
      </el-dialog>

    </el-header>

    <el-form
      ref="form"
      :model="form"
      label-width="120px"
      inline="true"
      class="form"
    >
      <el-form-item
        hide-required-asterisk="true"
        label="票据池编码"
        class="form-item"
      >
        <el-input
          v-model="poolData.code"
          type="text"
          size="15"
          placeholder="请输入票据编码"
          maxlength="6"
          class="input"
        />
      </el-form-item>
      <el-form-item class="form-item-button">
        <el-button type="primary" plain @click="query">查询</el-button>
      </el-form-item>
      <br />
      <br />
      <el-form-item label="票据池名称" class="form-item">
        <el-input
          v-model="poolData[0].poolName"
          :readonly="true"
          type="text"
          size="15"
          placeholder="票据池名称"
          maxlength="6"
          class="input"
        />
      </el-form-item>
    </el-form>

    <!-- <el-divider /> -->

    <h2 style="margin-left: 100px">票据池信息</h2>
    <el-table :data="poolData">
      <el-table-column prop="code" label="票据编码" width="200" />
      <el-table-column prop="minNumber" label="票据池预警数量" width="200" />
      <el-table-column prop="pushNumber" label="每次推送数量" width="200" />
      <el-table-column prop="available" label="是否可用" width="200" />
      <el-table-column label="  操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="check(scope.row)">查看</el-button>
          <el-button type="text" size="small" @click="editVisible = true">编辑</el-button>
          <el-button type="text" size="small" @click="deletePool">删除</el-button>
          <!-- <el-popconfirm
            title="该操作会使票据池不可用，确认删除？"
          >
            <el-button slot="reference" type="text" size="small" @click="deletePool">删除</el-button>
          </el-popconfirm> -->
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="票据池设置"
      :visible.sync="editVisible"
      width="30%"
      center
    >
      <el-form
        :model="poolData"
        class="divForm"
      >
        <el-form-item
          label="票据池代码"
          :label-width="formLabelWidth"
          class="divForm"
        >
          <el-input
            v-model="poolData.code"
            size="small"
            autocomplete="off"
            maxlength="6"
          />
        </el-form-item>
        <el-form-item
          label="票据池预警数量"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="poolData.operator"
            size="small"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="单次推送数量"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="poolData.operatorId"
            size="small"
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="createPool"
        >创建</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'PoolSetting',
  data () {
    return {
      dialogFormVisible: false,
      editVisible: false,
      formLabelWidth: '120px',
      poolData: [{
        code: '350505',
        poolName: '住院医疗票据',
        available: '可用',
        pushNumber: '500',
        minNumber: '3000',
        operator: '',
        operatorId: ''
      }],
      createPoolData: {
        code: '350505',
        available: '',
        pushNumber: '',
        minNumber: '',
        operator: '',
        operatorId: ''
      }
    }
  },
  methods: {
    createPool () {
      this.dialogFormVisible = true
    },
    query (poolData) {
      // 根据票据代码查询票据池
    },
    check () {
      // 查看票据池
    },
    editPool () {
      // 编辑票据池
    },
    deletePool () {
      // 删除票据池
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped>
.divForm{
text-align: center;
}
.form {
  margin-top: 30px;
}
.form-item {
  margin-left: 100px;
}
.form-item-button {
  margin-left: 50px;
}
.input {
  width: 350px;
}
.top {
  margin-top: 20px;
}
.icon {
  height: 50px;
  width: 50px;
  margin-left: 5px;
  margin-top: -5px;
}
.el-row {
  margin-bottom: 20px;
  /* &:last-child {
    margin-bottom: 0;
  } */
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.el-table {
  margin-left: 100px;
}
.el-input {
  padding-right: 30px;
  width: 200px;
}
</style>
