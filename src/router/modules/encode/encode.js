/* Layout */
import Layout from '@/layout'

export default [
  {
    path: '/encode',
    component: Layout,
    redirect: '/encode/encode',
    name: 'encode',
    meta: {
      title: '赋码',
      icon: 'encode'
    },
    children: [
      {
        path: 'encode',
        component: () => import('@/views/encode/encode'),
        name: 'encode',
        meta: { title: '赋码' }
      }
    ]
  }
]
