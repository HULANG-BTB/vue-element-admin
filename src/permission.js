import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // 白名单 直接跳转
  if (whiteList.indexOf(to.path) !== -1) {
    next()
  } else {
    const hasToken = getToken()
    // 已经登录 有Token 检查角色
    if (hasToken) {
      if (to.path === '/login') {
        next({ path: '/' })
        // NProgress.done()
      } else {
        const hasRoles = store.getters.roles && store.getters.roles.length > 0
        // 有角色 直接跳转
        if (hasRoles) {
          next()
        } else {
          try {
            // 没有角色 获取角色信息
            const { roles } = await store.dispatch('user/getInfo')
            // 获取动态路由
            const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
            // 添加动态路由
            router.options.routes = store.getters.permission_routes
            router.addRoutes(accessRoutes)
            next({ ...to, replace: true })
          } catch (error) {
            await store.dispatch('user/resetToken')
            Message.error(error || 'Has Error')
            next(`/login?redirect=${to.path}`)
            // NProgress.done()
          }
        }
      }
    } else {
      // 没有Token 跳转登录页
      next(`/login?redirect=${to.path}`)
      // NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
