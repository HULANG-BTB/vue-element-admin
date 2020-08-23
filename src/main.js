// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import * as filters from '@/api/base/region/filter'
import '@/assets/styles/index.scss' // global css
import permission from '@/directive/permission/index.js'
import '@/icons' // icon
import '@/permission' // permission control
import ElementUI from 'element-ui'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

Vue.use(permission)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */

// if (process.env.NODE_ENV !== 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
Vue.use(ElementUI, { locale: zhLocale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

new Vue({
  el: '#app',
  data () {
    return {
      eventBus: new Vue()
    }
  },
  router,
  store,
  render: h => h(App)
})
