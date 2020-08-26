/* Layout */
import Layout from '@/layout'

export default [{
  path: '/template',
  component: Layout,
  redirect: '/template/template',
  name: 'Template',
  meta: {
    title: '模板管理',
    icon: 'el-icon-tickets',
    roles: ['admin', 'financial']
  },
  children: [{
    path: 'image',
    component: () =>
      import('@/views/template/image'),
    name: 'Image',
    meta: {
      title: '显示模板',
      roles: ['admin', 'financial']
    }
  },
  {
    path: 'showTemplate',
    component: () => import('@/views/template/ShowTemplate'),
    name: 'showTemplate',
    meta: {
      title: '管理模板',
      roles: ['admin', 'financial']
    }
  }
  ]
}]
