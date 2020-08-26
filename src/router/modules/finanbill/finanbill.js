/* Layout */
import Layout from '@/layout'

export default [
  {
    path: '/stock-out',
    component: Layout,
    redirect: '/stock-out/finanbill',
    name: 'StockOut',
    meta: {
      title: '票据出库管理',
      icon: 'user',
      roles: ['admin', 'financial', 'financial_check']
    },
    children: [
      {
        path: '/out-manage',
        component: () => import('@/views/finanbill/out-manage'),
        name: 'OutManage',
        meta: { title: '出库管理', roles: ['admin', 'financial'] }
      },
      {
        path: '/out-check',
        component: () => import('@/views/finanbill/out-check'),
        name: 'CheckManage',
        meta: { title: '出库审核', roles: ['admin', 'financial_check'] }
      },
      {
        path: '/out-record',
        component: () => import('@/views/finanbill/out-record'),
        name: 'OutRecord',
        meta: { title: '变动记录', roles: ['admin', 'financial', 'financial_check'] }
      }
    ]
  }
]
