/* Layout */
import Layout from '@/layout'

export default [
  {
    path: '/writeoff',
    component: Layout,
    redirect: '/writeoff/verificationUnit',
    name: 'VerificationOfBill',
    meta: {
      title: '票据核销管理',
      icon: 'el-icon-document'
    },
    children: [
      {
        path: 'verificationUnit',
        component: () => import('@/views/qiuhengGroupViews/writeOff/verificationUnit'),
        name: 'PageVerificationUnit',
        meta: {
          title: '票据核销(单位端)',
          roles: ['role_manager', 'admin']
        }
      },
      {
        path: 'verificationFinancial',
        component: () => import('@/views/qiuhengGroupViews/writeOff/index'),
        name: 'MainOfVerification',
        meta: {
          title: '票据核销(财政端)',
          roles: ['role_manager', 'admin']
        }
      }
    ]
  }
]
