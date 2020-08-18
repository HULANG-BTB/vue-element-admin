/* Layout */
import Layout from '@/layout'

export default [
  {
    path: '/stockreturn',
    component: Layout,
    redirect: '/stockreturn/list',
    name: 'StockReturn',
    meta: {
      title: '申领退票',
      icon: 'user'
    },
    children: [
      {
        path: '/stockreturn1',
        component: () => import('@/views/stockreturn/stockreturn'),
        name: 'PageStockReturn1',
        meta: { title: '票据申退' }
      },
      {
        path: '/stockreturn2',
        component: () => import('@/views/stockreturn/stockreturnadd'),
        name: 'PageStockReturn2',
        meta: { title: '添加票据申请' }
      }
    ]
  }
]
