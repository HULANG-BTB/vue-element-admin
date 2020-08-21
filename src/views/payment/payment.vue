<template>
  <div class="bg">
    <div class="app-container" style="text-align:center">
      <el-header>
        <i class="el-icon-date" />交易日期 : {{ date_format }}
        <i class="el-icon-user" />交款人 : {{ pay_person }}
        <i class="el-icon-coin" />缴费金额 : {{ pay_money }}
        <a style="color:blue" @click="route_payInformation">【订单详情】</a>
        <a style="color:blue" @click="route_index">【返回首页】</a>
      </el-header>
      <div class="box">
        <div class="lab">选择您的支付方式</div>
        <el-radio-group v-for="item in pay_mode_name" :key="item" v-model="pay_mode_default">
          <el-radio :label="item" style="margin-right:15px">
            <svg-icon :icon-class="item" class="icon" />
          </el-radio>
        </el-radio-group>
      </div>
      <div style="pay_ok">
        <el-checkbox-group v-model="pay_button_flag">
          <el-checkbox label="我已阅读相关协议" @change="change_status_pay" />
        </el-checkbox-group>
        <br />
        <el-button type="primary" :disabled="pay_button_use" @click="payment_visible = true">点我支付</el-button>
      </div>

      <el-dialog :visible.sync="payment_visible" title="支付方式">
        <el-button type="primary" class="button" @click="password_pay()">密码支付</el-button>
        <el-button type="primary" class="button" @click="picture_pay()">二维码支付</el-button>
      </el-dialog>

      <el-dialog :visible.sync="password_visible" title="密码支付">
        <div class="code-input-main">
          <div v-for="(item,index) in codeList" :key="index" class="code-input-main-item">{{ code_format[index] }}</div>
          <input v-model="code" maxlength="6" class="code-input-input" type="password" />
        </div>
        <div class="msg">
          <span v-if="code_length" style="color:red">{{ msg }}</span>
        </div>
        <div style="text-align:center;">
          <el-button type="primary" @click="password_yes">确认支付</el-button>
          <el-button type="primary" @click="password_no">取消</el-button>
        </div>
      </el-dialog>

      <el-dialog :visible.sync="picture_visible" title="二维码支付" @close="reset">
        <img :src="image" />
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getQrCode, addAccIntoInfoDto, getUUid } from '@/api/payment'
export default {
  name: 'Payment',
  // 密码支付
  props: {
    codeLength: {
      default: 6,
      type: Number
    }
  },
  data () {
    return {

      // 传输的数据整体
      info: '',

      // 识别码
      UUid: '',

      // 缴款人信息
      pay_date: new Date(),
      pay_person: '',
      pay_money: '',
      pay_checkcode: '',
      pay_phone: '',

      // 订单详情
      pay_items: [],

      // 分割线
      slider: 100,

      // 支付方式
      pay_mode_default: '支付宝',
      pay_mode_name: ['支付宝', '微信支付', '中国工商银行', '中国建设银行',
        '中国农业银行', '中国银行', '中国邮政储蓄银行', '中信银行',
        '中国光大银行', '华夏银行', '招商银行', '浦发银行'],

      // 点击支付按钮
      pay_button_flag: [],
      pay_button_use: true,

      // 支付方式弹出框
      payment_visible: false,
      password_visible: false,
      picture_visible: false,

      // 密码支付
      codeList: [],
      code: '',
      code_length: false,

      // 二维码支付
      image: '',

      // Axios获取不到数据的提示信息
      msg: '',

      // 轮询定时器
      timer: '',

      // 动态显示时间定时器
      Dytimer: ''
    }
  },
  computed: {

    // 将输入的数字转为密码点
    code_format: function () {
      const codeL = []
      for (let i = 0; i < this.code.length; i++) {
        codeL.push('●')
      }
      return codeL
    },

    date_format: function () {
      // 当前时间格式化处理
      let str = ''
      const weekDay = [
        '星期天',
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六'
      ]
      str += this.setZero(this.pay_date.getFullYear()) + '年' // 获取年份
      str += this.setZero(this.pay_date.getMonth() + 1) + '月' // 获取月份
      str += this.setZero(this.pay_date.getDate()) + '日' // 获取日
      str += ' ' + weekDay[this.pay_date.getDay()] // 获取星期
      str += ' ' + this.setZero(this.pay_date.getHours()) + ':' // 获取时
      str += ' ' + this.setZero(this.pay_date.getMinutes()) + ':' // 获取分
      str += this.setZero(this.pay_date.getSeconds()) // 获取秒
      return str
    }
  },
  watch: {
    // 截取字符长度（密码支付）
    code () {
      if (this.code.length > this.codeLength) {
        this.code = this.code.substring(0, this.codeLength)
      }
    }
  },
  mounted () {
    // 定义一个数组用于循环（密码支付）
    this.codeList = new Array(this.codeLength).fill('')
    this.Dytime()
  },
  created () {
    // 获取前一个页面路由的数据
    this.info = JSON.parse(decodeURIComponent(this.$route.query.data))
    const payInformation = JSON.parse(decodeURIComponent(this.$route.query.data))
    // 获取项目列表
    this.pay_items = payInformation.PayList
    // 获取缴款人电话
    this.pay_phone = payInformation.payTel
    // 获取缴款人总计缴费金额
    this.pay_money = payInformation.money
    // 获取缴款人校验码
    this.pay_checkcode = payInformation.billSerialld
    // 获取缴款人姓名
    this.pay_person = payInformation.persion
  },

  destroyed () {
    clearInterval(this.timer) // 在Vue实例销毁前，清除当前日期定时器
    clearInterval(this.Dytimer)
  },

  methods: {

    // 获取数组的索引
    getArrayIndex (val) {
      for (let i = 0; i < this.pay_mode_name.length; i++) {
        if (this.pay_mode_name[i] === val) {
          return i
        }
      }
    },

    // 切换支付按钮是否可用
    change_status_pay () {
      if (this.pay_button_flag.length === 1) {
        this.pay_button_use = false
      } else {
        this.pay_button_use = true
      }
    },

    // 获取密码
    getCode () {
      return this.code
    },

    // 点击显示密码支付弹窗函数
    password_pay () {
      this.code_length = false
      this.msg = '请输入6位支付密码'
      this.code = ''
      this.password_visible = true
    },

    // 密码支付确认按钮
    password_yes () {
      if (this.code.length !== 6) {
        this.code_length = true
      } else {
        this.code_length = false
        this.loading = true
        addAccIntoInfoDto({
          billSerialId: this.pay_checkcode,
          payerTel: this.pay_phone,
          account: this.pay_money,
          accountType: this.getArrayIndex(this.pay_mode_default),
          time: this.date_formatr(this.pay_date)
        }).then((response) => {
          if (response.status === 200) {
            this.$router.push({ path: '/paySuccess', query: {}})
          } else {
            this.msg = '密码错误，请重试或联系工作人员'
            this.loading = false
          }
        })
      }
    },

    // 二维码支付函数
    picture_pay () {
      clearInterval(this.timer)
      this.getPicture()
      this.picture_visible = true
      const _this = this
      this.timer = setInterval(function () {
        getUUid(_this.UUid).then((response) => {
          if (response.msg === 'Yes') {
            addAccIntoInfoDto({
              billSerialId: _this.pay_checkcode,
              payerTel: _this.pay_phone,
              account: _this.pay_money,
              accountType: _this.getArrayIndex(_this.pay_mode_default),
              time: _this.date_formatr(_this.pay_date)
            })
            clearInterval(_this.timer)
            _this.route()
          } else {
            console.log(response.msg)
          }
        })
      }, 1000)
    },

    // 隐藏密码支付框按钮
    password_no () {
      this.password_visible = false
    },

    // 路由到支付成功页面
    route () {
      clearInterval(this.timer)
      this.$router.push({ path: '/paySuccess', query: {}})
    },

    // 获取二维码函数
    getPicture () {
      getQrCode().then((response) => {
        if (response.status === 200) {
          this.image = 'data:image/png;base64,' + response.data.image
          this.UUid = response.data.UUid
          console.log(this.UUid)
        } else {
          console.log('失败')
          this.loading = false
        }
      })
    },

    // 返回首页函数
    route_index () {
      clearInterval(this.timer)
      this.$router.push({ path: '/pay', query: {}})
    },

    // 返回项目详情页面
    route_payInformation () {
      clearInterval(this.timer)
      this.$router.push({ path: '/payInformation', query: { data: JSON.stringify(this.info) }})
    },

    // 二维码支付模态框销毁时清除定时器
    reset () {
      clearInterval(this.timer)
    },

    Dytime () {
      var _this = this
      this.Dytimer = setInterval(() => {
        _this.pay_date = new Date() // 修改日期数据
      }, 1000)
    },

    setZero (a) { // 设置小于10的数字在加0
      return a < 10 ? '0' + a : a
    },

    // 日期格式化
    date_formatr (val) {
      let str = ''
      str += this.setZero(this.pay_date.getFullYear()) + '-' // 获取年份
      str += this.setZero(this.pay_date.getMonth() + 1) + '-' // 获取月份
      str += this.setZero(this.pay_date.getDate()) + '' // 获取日
      str += ' ' + this.setZero(this.pay_date.getHours()) + ':' // 获取时
      str += this.setZero(this.pay_date.getMinutes()) + ':' // 获取分
      str += this.setZero(this.pay_date.getSeconds()) // 获取秒
      return str
    }
  }
}
</script>
<style scoped>
  /*支付图片样式*/
.icon {
  padding-top: 90px;
  font-size: 150px;
}

.button {
  height: 50px;
  width: 200px;
}

/*密码支付的样式*/
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}

.code-input-main {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  position: relative;
}

.code-input-input {
  height: 44px;
  width: 100%;
  position: absolute;
  border: none;
  outline: none;
  color: transparent;
  background-color: transparent;
  text-shadow: 0 0 0 transparent;
}

.code-input-main-item {
  width: 34px;
  height: 44px;
  margin: 0 5px;
  padding-bottom: 0;
  opacity: 0.8;
  border-bottom: solid #323232 1px;
  text-align: center;
  font-size: 30px;
  color: #323232;
}

.box{
  width: 80%;
  height: 20%;
  margin-left: 10%;
  margin-bottom: 2%;
}

.lab{
  padding-top: 10px;
  color: yellow;
}

.app-container{
  padding-top:12%;
}

.msg{
  padding: 5%;
}

.bg {
  /* width: 100%;
  height: 100%;
  background:url(../../assets/payment/bg.jpg) no-repeat;
  background-size: 100%; */
  background:rgb(196, 214, 247);
  background-size: 100%;
  width: 100%;
  height: 100%;
}

</style>
