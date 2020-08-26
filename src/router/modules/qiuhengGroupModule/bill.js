/**
 * layout
 */
import Layout from '@/layout'

export default [
  {
    path: '/voicingbill',
    component: Layout,
    redirect: '/voicingbill/ticket',
    name: 'voicingbill',
    meta: {
      title: '票据管理',
      icon: 'el-icon-s-ticket',
      roles: ['unit', 'financial']
    },
    alwaysShow: true,
    children: [
      {
        path: 'voicingbill',
        component: () => import('@/views/qiuhengGroupViews/bill-invoicing/Home.vue'),
        name: 'voicingbill',
        meta: {
          title: '开票',
          roles: ['unit']
          // roles: ['user_manager', 'editor']
        }
      },
      {
        path: 'verify',
        component: () => import('@/views/qiuhengGroupViews/verify/Verify.vue'),
        name: 'verify',
        meta: {
          title: '开票审验',
          roles: ['unit']
          // roles: ['user_manager', 'editor']
        }
      },
      {
        path: '/ticket',
        component: () => import('@/views/qiuhengGroupViews/bill-invoicing/Ticket.vue'),
        name: 'ticket',
        meta: {
          title: '新增开票',
          roles: ['unit']
        },
        hidden: true
      },
      {
        path: '/paybook',
        component: () => import('@/views/qiuhengGroupViews/bill-invoicing/PayBook.vue'),
        name: 'paybook',
        props: true,
        meta: {
          title: '缴款书',
          roles: ['unit']
        },
        hidden: true
      }
    ]
  }
]

