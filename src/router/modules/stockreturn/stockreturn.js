/* Layout */
import Layout from '@/layout'

export default [
  {
    path: '/stockreturn',
    component: Layout,
    redirect: '/stockreturn/list',
    name: 'StockReturn',
    meta: {
      title: '申请退票',
      icon: 'user',
      roles: ['financial_check', 'admin', 'unit']
    },
    children: [
      {
        path: '/stockreturn1',
        component: () => import('@/views/stockreturn/stockreturn'),
        name: 'PageStockReturn1',
        meta: {
          title: '票据申退',
          roles: ['admin', 'unit']
        }
      },
      {
        path: '/stockreturn2',
        component: () => import('@/views/stockreturn/stockreturncheck'),
        name: 'PageStockReturn2',
        meta: {
          title: '票据申退审核',
          roles: ['financial_check', 'admin']
        }
      }
    ]
  }
]
