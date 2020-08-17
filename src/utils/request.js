import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import NProgress from 'nprogress'
import Config from '@/settings'

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
      // 请求头附带token
      config.headers[Config.auth.header] = getToken()
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

    //   // 401: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    if (res.code === 401 || res.code === 402 || res.code === 403) {
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
