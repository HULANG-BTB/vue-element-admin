<template>
  <div class="bk">
    <el-card class="bg">
      <el-header class="header">
        <i v-cloak class="el-icon-date" />交易日期 : {{ date_format }}
        <el-divider direction="vertical" />
        <i v-cloak class="el-icon-user" />缴款人 : {{ pay_person }}
        <el-divider direction="vertical" />
        <i v-cloak class="el-icon-coin" />缴费金额 : {{ pay_money }}
        <a style="color:blue" @click="route_payInformation">【订单详情】</a>
        <a style="color:blue" @click="route_index">【返回首页】</a>
      </el-header>
      <el-divider><span style="color:yellow">请选择你的支付方式</span></el-divider>
      <div class="box">
        <el-radio-group v-for="item in pay_mode_name" :key="item" v-model="pay_mode_default">
          <el-radio :label="item" class="radio">
            <svg-icon :icon-class="item" class="icon" />
          </el-radio>
        </el-radio-group>
      </div>
      <el-divider class="break1" />
      <div>
        <el-checkbox-group v-model="pay_button_flag" class="checkbox">
          <el-checkbox v-cloak size="small" @change="change_status_pay">{{ msg3 }}</el-checkbox>
        </el-checkbox-group>
        <el-button type="primary" :disabled="pay_button_use" @click="payment_visible = true">点我支付</el-button>
      </div>

      <el-dialog :visible.sync="payment_visible" title="支付方式">
        <el-button type="primary" class="button" @click="password_pay()">密码支付</el-button>
        <el-button type="primary" class="button" @click="picture_pay()">二维码支付</el-button>
      </el-dialog>

      <el-dialog :visible.sync="password_visible" title="付款详情">
        <div class="money">支付总金额:{{ money }}</div>
        <el-divider><span style="color:red">请输入密码</span></el-divider>
        <div class="code-input-main">
          <div v-for="(item,index) in codeList" :key="index" class="code-input-main-item">{{ code_format[index] }}</div>
          <input v-model="code" maxlength="6" class="code-input-input" type="password" />
        </div>
        <div class="msg">
          <span v-cloak v-if="code_length" style="color:red">{{ msg }}</span>
        </div>
        <div style="text-align:center;">
          <el-button type="primary" size="small" @click="password_yes">确认支付</el-button>
          <el-button type="danger" size="small" @click="password_no">取消</el-button>
        </div>
      </el-dialog>

      <el-dialog :visible.sync="picture_visible" title="二维码支付" @close="reset">
        <span v-if="Qrcode_NO2" style="color:red">{{ msg4 }}</span>
        <img v-if="Qrcode" :src="image" />
        <div v-if="Qrcode_NO3" style="color:red;margin-top:15px">二维码还有{{ num }}s失效</div>
        <span v-if="Qrcode_NO" style="color:red">{{ msg2 }}</span>
      </el-dialog>
    </el-card>
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

      // 总缴入金额
      money: '',

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

      // 支付方式
      pay_mode_default: 'Alipay',
      pay_mode_name: ['Alipay', 'Wechat_Payment', 'ICBC', 'Construction_Bank',
        'Agricultural_Bank', 'China', 'Postal_Savings_Bank', 'CITIC',
        'China_Everbright_Bank', 'Huaxia_Bank', 'Merchants_Bank', 'Pudong_Development_Bank'],

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
      Dytimer: '',

      // 二维码支付显示
      Qrcode: false,
      Qrcode_NO: false,
      msg2: '',

      // 勾选信息
      msg3: '勾选并阅读缴费系统相关协议',

      // 二维码失效
      num: 30,
      msg4: '',
      Qrcode_NO2: false,
      Qrcode_NO3: false
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
    this.info = JSON.parse(decodeURIComponent(this.$route.params.data))
    const payInformation = JSON.parse(decodeURIComponent(this.$route.params.data))
    // 获取缴款人电话
    this.pay_phone = payInformation.fpayerTel
    // 获取缴款人总计缴费金额
    this.pay_money = payInformation.money
    // 获取缴款人校验码
    this.pay_checkcode = payInformation.checkCode
    // 获取缴款人姓名
    this.pay_person = payInformation.payDto.payerName

    this.money = '￥' + payInformation.money
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
        this.msg3 = '您已同意并阅读缴费系统相关协议'
        this.pay_button_use = false
      } else {
        this.msg3 = '勾选并阅读缴费系统相关协议'
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
      this.code = ''
      this.password_visible = true
    },

    // 密码支付确认按钮
    password_yes () {
      const regex = /\d{6}$/
      if (this.code.length !== 6) {
        this.msg = '请输入6位支付密码'
        this.code_length = true
      } else if (!regex.test(this.code)) {
        this.code_length = false
        this.msg = '请输入数字'
        this.code_length = true
      } else {
        this.code_length = false
        this.loading = true
        addAccIntoInfoDto({
          billSerialId: this.pay_checkcode,
          payerTel: this.pay_phone,
          account: this.pay_money,
          accountType: this.getArrayIndex(this.pay_mode_default),
          time: this.date_formatr()
        }).then((response) => {
          if (response.code === 10000) {
            this.$router.push({ name: 'PaySuccess', params: {}})
          } else if (response.code === 111160) {
            this.msg = response.message
            this.code_length = true
            this.loading = false
          } else if (response.code === 111200) {
            this.msg = response.message
            this.code_length = true
            this.loading = false
          } else if (response.code === 111201) {
            this.msg = response.message
            this.code_length = true
            this.loading = false
          } else {
            this.msg = '服务请求失败，请联系工作人员'
            console.log(response.code)
            this.code_length = true
            this.loading = false
          }
        })
      }
    },

    // 二维码支付函数
    picture_pay () {
      clearInterval(this.timer)
      this.num = 30
      this.Qrcode_NO2 = false
      this.Qrcode_NO = false
      this.Qrcode_NO3 = false
      this.Qrcode = true
      this.getPicture()
      this.picture_visible = true
      const _this = this
      this.timer = setInterval(function () {
        _this.num--
        getUUid({ uuid: _this.UUid }).then((response) => {
          if (response.data === 'Yes') {
            addAccIntoInfoDto({
              billSerialId: _this.pay_checkcode,
              payerTel: _this.pay_phone,
              account: _this.pay_money,
              accountType: _this.getArrayIndex(_this.pay_mode_default),
              time: _this.date_formatr()
            })
            clearInterval(_this.timer)
            _this.route()
          } else {
            console.log(response.data)
          }
        })
        if (_this.num === 0) {
          _this.Qrcode_NO3 = false
          _this.Qrcode = false
          clearInterval(_this.timer)
          _this.msg4 = '二维码已经失效请重新获取'
          _this.Qrcode_NO2 = true
        }
      }, 1000)
    },

    // 隐藏密码支付框按钮
    password_no () {
      this.password_visible = false
    },

    // 路由到支付成功页面
    route () {
      clearInterval(this.timer)
      this.$router.push({ name: 'PaySuccess', params: {}})
    },

    // 获取二维码函数
    getPicture () {
      getQrCode().then((response) => {
        if (response.code === 10000) {
          this.image = 'data:image/png;base64,' + response.data.image
          this.UUid = response.data.uuid
          this.Qrcode_NO3 = true
          console.log(this.UUid)
        } else {
          this.msg2 = '二维码获取失败请重试'
          this.num = 0
          this.Qrcode_NO = true
          this.loading = false
        }
      })
    },

    // 返回首页函数
    route_index () {
      clearInterval(this.timer)
      this.$router.push({ name: 'PayIndex', params: {}})
    },

    // 返回项目详情页面
    route_payInformation () {
      clearInterval(this.timer)
      this.$router.push({ name: 'PayInformation', params: { data: JSON.stringify(this.info) }})
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
    date_formatr () {
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
.checkbox{
  margin-bottom: 2% ;
}
.header{
  margin-top: 3%;
}
  /*支付图片样式*/
.icon {
  padding-top: 60px;
  font-size: 120px;
}

.radio {
  margin-right:15px;
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
  margin: 0 2px;
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
  margin-left: 8%;
  margin-bottom: 2%;
}

.lab{
  padding-top: 10px;
  color: yellow;
}

.msg{
  padding: 3%;
}

.bg {
  text-align: center;
}
.bk {
  width: 100%;
  height: 100%;
  padding-top: 3%;
  padding-left: 5%;
  padding-right: 5%;
}
.money{
  font-size:40px;
  margin-bottom: 40px;
}
.break1{
  margin-top: 5%;
  margin-bottom: 3%;
}
[v-cloak]{
  display:none;
}
</style>
