/* Layout */
import Layout from '@/layout'

export default [{
  path: '/user',
  component: Layout,
  redirect: '/user/user',
  name: 'User',
  meta: {
    title: '用户管理',
    icon: 'user'
  },
  children: [{
      path: 'user',
      component: () => import('@/views/user/user'),
      name: 'PageUser',
      meta: {
        title: '用户管理'
      }
    },
    {
      path: 'role',
      component: () => import('@/views/user/role'),
      name: 'PageRole',
      meta: {
        title: '角色管理',
        roles: ['role_manager', 'admin']
      }
    },
    {
      path: 'permission',
      component: () => import('@/views/user/permission'),
      name: 'PagePermissions',
      meta: {
        title: '权限管理',
        roles: ['permission_manager', 'admin']
      }
    }
  ]
}]
