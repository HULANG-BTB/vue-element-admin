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
  children: [
    {
      path: 'user',
      component: () => import('@/views/user/user'),
      name: 'UserManage',
      meta: { title: '用户管理', icon: 'el-icon-user' }
    },
    {
      path: 'role',
      component: () => import('@/views/user/role'),
      name: 'RoleManage',
      meta: {
        title: '角色管理',
        icon: 'el-icon-wallet',
        roles: ['role_manager', 'admin']
      }
    },
    {
      path: 'permission',
      component: () => import('@/views/user/permission'),
      name: 'PermissionManage',
      meta: {
        title: '权限管理',
        icon: 'el-icon-link',
        roles: ['permission_manager', 'admin']
      }
    }
  ]
}]
