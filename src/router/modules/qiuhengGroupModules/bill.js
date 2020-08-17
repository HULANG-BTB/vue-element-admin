/**
 * layout
 */
import Layout from '@/layout'

export default [
  {
    path: '/bill',
    component: Layout,
    redirect: '/bill/ticket',
    name: 'bill',
    meta: {
      title: '票据管理',
      icon: 'el-icon-s-ticket'
    },
    children: [
      {
        path: 'bill',
        component: () => import('@/views/qiuhengGroupViews/bill-invoicing/Home.vue'),
        name: 'bill',
        meta: {
          title: '开票',
          roles: ['user_manager', 'editor']
        }
      },
      {
        path: 'verify',
        component: () => import('@/views/qiuhengGroupViews/verify/Verify.vue'),
        name: 'verify',
        meta: { title: '开票审验',
          roles: ['user_manager', 'editor']
        }
      },
      {
        path: '/ticket',
        component: () => import('@/views/qiuhengGroupViews/bill-invoicing/Ticket.vue'),
        name: 'ticket',
        title: '新增开票'
      }
    ]
  }
]

