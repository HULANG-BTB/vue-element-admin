/* Layout */
import Layout from '@/layout'

export default [
  {
    path: '/report',
    component: Layout,
    redirect: '/report/index',
    name: 'Report',
    meta: {
      title: '财政报表',
      icon: 'documentation'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/report/index'),
        name: 'PageIndex',
        meta: { title: '财政报表' }
      },
      {
        path: 'info',
        component: () => import('@/views/report/info'),
        name: 'PageInfo',
        meta: {
          title: '详细信息'
        }
      },
      {
        path: 'stockin',
        component: () => import('@/views/report/stockin'),
        name: 'PageStockIn',
        hidden: true,
        meta: {
          title: '票据入库明细'
        }
      },
      {
        path: 'stockout',
        component: () => import('@/views/report/stockout'),
        name: 'PageStockOut',
        hidden: true,
        meta: {
          title: '票据出库明细'
        }
      },
      {
        path: 'stockdestroy',
        component: () => import('@/views/report/stockdestroy'),
        name: 'PageStockDestory',
        hidden: true,
        meta: {
          title: '票据库存销毁明细'
        }
      },
      {
        path: 'stockbill',
        component: () => import('@/views/report/stockbill'),
        name: 'PageStockBill',
        hidden: true,
        meta: {
          title: '票据库存明细表'
        }
      },
      {
        path: 'life',
        component: () => import('@/views/report/life'),
        name: 'PageLife',
        hidden: true,
        meta: {
          title: '生命周期'
        }
      },
      {
        path: 'billsummary',
        component: () => import('@/views/report/billsummary'),
        name: 'PageBillSummary',
        hidden: true,
        meta: {
          title: '开票汇总'
        }
      },
      {
        path: 'stockpay',
        component: () => import('@/views/report/stockpay'),
        name: 'Stockpay',
        hidden: true,
        meta: { title: '缴款明细表详细' }
      }
    ]
  }
]
