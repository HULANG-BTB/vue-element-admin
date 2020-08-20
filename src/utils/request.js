import Config from '@/settings'
import store from '@/store'
import { getToken } from '@/utils/auth'
import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import NProgress from 'nprogress'



// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // 跨域请求时发送cookies
  timeout: Config.requestTimeout // 请求超时时间
})

// 请求 拦截器
service.interceptors.request.use(
  config => {
    // 请求发送前修改
    NProgress.start()
    if (store.getters.token) {
      config.headers['Content-Type'] = "application/json;charset=UTF-8";
      // 请求头附带token
      config.headers[Config.auth.header] = `Basic ${getToken()}`
    }
    return config
  },
  error => {
    NProgress.done()
    // 请求失败处理
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  /**
   * 如果想获得响应信息，如响应头
   * 请返回 response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    NProgress.done()
    // 注释放弃了原本封装中的一切请求结果判断的逻辑 后期如需要使用可以自行概念加

    // 40001 : 认证失败 用户登录认证失败 或认证失效
    if (res.code === 40001) {
      // to re-login
      MessageBox.confirm('登录状态失效，点击取消保持在当前界面，点击重新登录进入登录界面', '确认登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
      return Promise.reject(new Error(res.msg || 'Error'))
    }
    // 操作不成功 返回失败信息
    if (res.code !== 10000) {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.message || 'Error'))
    }
    return res
  },
  error => {
    NProgress.done()
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
