/* Layout */
import Layout from '@/layout'

export default [
  {
    path: '/stockIn',
    component: Layout,
    redirect: '/stockIn/stockInList',
    name: 'User',
    meta: {
      title: '票据入库',
      icon: 'user'
    },
    children: [
      {
        path: 'stockInList',
        component: () => import('@/views/stockIn/stockInList'),
        name: 'stockInList',
        meta: { title: '入库单列表' }
      },
      {
        path: 'addStockIn',
        component: () => import('@/views/stockIn/addStockIn'),
        name: 'addStockIn',
        meta: {
          title: '新建入库单',
          roles: ['role_manager', 'admin']
        }
      },
      {
        path: 'editStockIn/:id',
        component: () => import('@/views/stockIn/addStockIn'),
        name: 'editStockIn',
        meta: {
          title: '编辑入库单',
          roles: ['role_manager', 'admin']
        },
        hidden: true
      },
      {
        path: 'changeStockIn',
        component: () => import('@/views/stockIn/changeStockIn'),
        name: 'changeStockIn',
        meta: {
          title: '入库单审核',
          roles: ['permission_manager', 'admin']
        }
      }
    ]
  }
]
