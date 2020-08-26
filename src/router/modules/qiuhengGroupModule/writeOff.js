/* Layout */
import Layout from '@/layout'

export default [
  {
    path: '/writeoff',
    component: Layout,
    redirect: '/writeoff/verificationUnit',
    name: 'VerificationOfBill',
    meta: {
      title: '票据核销',
      icon: 'el-icon-document',
      roles: ['unit', 'financial']

    },
    alwaysShow: true,
    children: [
      {
        path: 'verificationUnit',
        component: () => import('@/views/qiuhengGroupViews/writeOff/verificationUnit'),
        name: 'PageVerificationUnit',
        meta: {
          title: '票据核销申请',
          roles: ['unit']
          // roles: ['role_manager', 'admin']
        }
      },
      {
        path: 'verificationFinancial',
        component: () => import('@/views/qiuhengGroupViews/writeOff/index'),
        name: 'MainOfVerification',
        meta: {
          title: '票据核销审核',
          roles: ['financial']
          // roles: ['role_manager', 'admin']
        }
      }
    ]
  }
]
