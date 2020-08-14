/* Layout */
import Layout from '@/layout'

export default [{
  path: '/template',
  component: Layout,
  redirect: '/template/template',
  name: 'User',
  meta: {
    title: '模板管理',
    icon: 'user'
  },
  children: [{
    path: 'image',
    component: () =>
      import('@/views/template/image'),
    name: 'Image',
    meta: { title: '显示模板' }
  },
  {
    path: 'role',
    component: () =>
      import('@/views/user/role'),
    name: 'PageRole',
    meta: {
      title: '角色管理',
      roles: ['role_manager', 'admin']
    }
  }
  ]
}]
