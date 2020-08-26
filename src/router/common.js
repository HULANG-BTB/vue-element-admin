/* Layout */
import Layout from '@/layout'

export default [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/error/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/indexCheck',
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '控制台', icon: 'dashboard', affix: false }
      }
    ]
  },

  {
    path: '/indexCheck',
    component: () => import('@/views/msg/check/indexCheck'),
    name: 'PageIndexCheck',
    meta: {
      title: '主页查验',
      icon: 'el-icon-message'
    }
  },

  {
    path: '/payInformational',
    component: () => import('@/views/payment/payInformational'),
    hidden: true
  },

  {
    path: '/pay',
    component: () => import('@/views/payment/index'),
    hidden: true
  },

  {
    path: '/payInformation',
    component: () => import('@/views/payment/payInformational'),
    hidden: true
  },

  {
    path: '/payment',
    component: () => import('@/views/payment/payment'),
    hidden: true
  },

  {
    path: '/paySuccess',
    component: () => import('@/views/payment/paySuccess'),
    hidden: true
  },

  {
    path: '/paySuccessPhone',
    component: () => import('@/views/payment/paySuccessPhone'),
    hidden: true
  }
]
