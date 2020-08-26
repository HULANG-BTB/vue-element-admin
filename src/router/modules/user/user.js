/* Layout */
import Layout from '@/layout'

export default [{
  path: '/user',
  component: Layout,
  redirect: '/user/user',
  name: 'User',
  alwaysShow: true,
  meta: {
    title: '用户管理',
    roles: ['admin', 'financial', 'financial_ckeck']
  },
  children: [
    {
      path: 'user',
      component: () => import('@/views/user/user'),
      name: 'UserManage',
      meta: {
        title: '用户管理',
        roles: ['admin', 'user_manager'] }
    },
    {
      path: 'role',
      component: () => import('@/views/user/role'),
      name: 'RoleManage',
      meta: {
        title: '角色管理',
        roles: ['role_manager', 'admin']
      }
    },
    {
      path: 'permission',
      component: () => import('@/views/user/permission'),
      name: 'PermissionManage',
      meta: {
        title: '权限管理',
        roles: ['permission_manager', 'admin']
      }
    }
  ]
}]
