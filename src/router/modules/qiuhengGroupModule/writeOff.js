/* Layout */
import Layout from '@/layout'

export default [
  {
    path: '/bill',
    component: Layout,
    redirect: '/bill/verification',
    name: 'VerificationOfBill',
    meta: {
      title: '票据核销管理',
      icon: 'el-icon-document'
    },
    children: [
      {
        path: 'main',
        component: () => import('@/views/user/user'),
        name: 'PageUser',
        meta: { title: '用户管理' }
      },
      {
        path: 'verification',
        component: () => import('@/views/qiuhengGroupViews/verification/index'),
        name: 'MainOfVerification',
        meta: {
          title: '票据核销',
          roles: ['role_manager', 'admin']
        }
      }
    ]
  }
]
