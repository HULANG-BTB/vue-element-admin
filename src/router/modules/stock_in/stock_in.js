/* Layout */
import Layout from '@/layout'

export default [
  {
    path: '/stockIn',
    component: Layout,
    redirect: '/stockIn/stockInList',
    name: 'stockIn',
    meta: {
      title: '票据入库',
      icon: 'user',
      roles: ['financial', 'financial_check', 'admin']
    },
    children: [
      {
        path: 'stockInList',
        component: () => import('@/views/stockIn/stockInList'),
        name: 'stockInList',
        meta: {
          title: '入库单列表',
          roles: ['financial', 'admin']
        }
      },
      {
        path: 'addStockIn',
        component: () => import('@/views/stockIn/addStockIn'),
        name: 'addStockIn',
        meta: {
          title: '新建入库单',
          roles: ['financial', 'admin']
        }
      },
      {
        path: 'editStockIn/:id',
        component: () => import('@/views/stockIn/addStockIn'),
        name: 'editStockIn',
        meta: {
          title: '编辑入库单',
          roles: ['financial', 'admin']
        },
        hidden: true
      },
      {
        path: 'changeStockIn',
        component: () => import('@/views/stockIn/changeStockIn'),
        name: 'changeStockIn',
        meta: {
          title: '入库单审核',
          roles: ['financial_check', 'admin']
        }
      }
    ]
  }
]
