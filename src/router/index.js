/**
 * 注意 此文件禁止修改
 */

import Vue from 'vue'
import Router from 'vue-router'
import staticRoutes from './common'
import dynamicRoutes from './modules'

Vue.use(Router)

export const constantRoutes = Object.assign([], staticRoutes)
export const asyncRoutes = Object.assign([], dynamicRoutes)

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
