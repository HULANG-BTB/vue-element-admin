import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { Message } from 'element-ui'
// import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import router from './router'
import store from './store'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  // NProgress.start()

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
          if (store.state.addRoutes && store.state.permission.addRoutes.length === 0) {
            try {
            // 没有权限路由 加载权限路由
              const roles = store.getters.roles
              // 获取动态路由
              const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
              // 添加动态路由
              router.options.routes = store.getters.permission_routes
              router.addRoutes(accessRoutes)
              next({ ...to, replace: true })
            } catch (error) {
              // 有错误 重新登陆
              await store.dispatch('user/resetToken')
              Message.error(error || 'Has Error')
              next(`/login?redirect=${to.path}`)
            }
          } else {
            // 有权限路由 下一步
            next()
          }
        } else {
          try {
            // 没有角色 获取角色信息
            await store.dispatch('user/getInfo')
            // 需要通过getter获取role列表
            const roles = store.getters.roles
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
  // NProgress.done()
})
