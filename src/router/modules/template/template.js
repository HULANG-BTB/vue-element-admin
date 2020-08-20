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
    path: 'showTemplate',
    component: () => import('@/views/template/ShowTemplate'),
    name: 'showTemplate',
    meta: { title: '管理模板' }
  }
  ]
}]
