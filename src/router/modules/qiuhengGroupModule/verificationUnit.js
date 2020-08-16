/* Layout */
import Layout from '@/layout'

export default [
  {
    path: '/bills',
    component: Layout,
    redirect: '/bills/verificationUnit',
    name: 'Bills',
    meta: {
      title: '票据管理',
      icon: 'clipboard'
    },
    children: [
      {
        path: 'verificationUnit',
        component: () => import('@/views/qiuhengGroupViews/writeOff/verificationUnit'),
        name: 'PageVerificationUnit',
        meta: {
          title: '票据核销',
          roles: ['role_manager', 'admin']
        }
      },
      // 增加二级菜单用
      {
        path: 'role',
        component: () => import('@/views/user/role'),
        name: 'PageRole',
        meta: {
          title: '角色管理',
          roles: ['role_manager', 'admin']
        }
      }
    ]
  }
]
