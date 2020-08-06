/* Layout */
import Layout from '@/layout'

export default [
  {
    path: '/user',
    component: Layout,
    redirect: '/user/user',
    name: 'User',
    meta: {
      title: 'User',
      icon: 'user'
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/user/user'),
        name: 'PageUser',
        meta: { title: 'User' }
      },
      {
        path: 'role',
        component: () => import('@/views/user/role'),
        name: 'PageRole',
        meta: {
          title: 'Role',
          roles: ['role_manager', 'admin']
        }
      },
      {
        path: 'permission',
        component: () => import('@/views/user/permission'),
        name: 'PagePermissions',
        meta: {
          title: 'Permissions',
          roles: ['permission_manager', 'admin']
        }
      }
    ]
  }
]
