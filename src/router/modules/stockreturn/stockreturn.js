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
      icon: 'user',
      role: ['financial_check', 'unit']
    },
    children: [
      {
        path: '/stockreturn1',
        component: () => import('@/views/stockreturn/stockreturn'),
        name: 'PageStockReturn1',
        meta: { title: '票据申退', role: ['unit'] }
      },
      {
        path: '/stockreturn2',
        component: () => import('@/views/stockreturn/stockreturncheck'),
        name: 'PageStockReturn2',
        meta: { title: '票据申退审核', role: ['financial_check'] }
      }
    ]
  }
]
