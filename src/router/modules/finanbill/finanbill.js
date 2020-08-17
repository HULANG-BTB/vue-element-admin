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
      icon: 'user'
    },
    children: [
      {
        path: '/out-manage',
        component: () => import('@/views/finanbill/out-manage'),
        name: 'OutManage',
        meta: { title: '出库管理' }
      },
      {
        path: '/out-check',
        component: () => import('@/views/finanbill/out-check'),
        name: 'CheckManage',
        meta: { title: '出库审核' }
      },
      {
        path: '/out-record',
        component: () => import('@/views/finanbill/out-record'),
        name: 'OutRecord',
        meta: { title: '出库记录' }
      },
      {
        path: '/change-record',
        component: () => import('@/views/finanbill/change-record'),
        name: 'ChangeRecord',
        meta: { title: '变动记录' }
      }
    ]
  }
]
