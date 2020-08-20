/* Layout */

export default [
  {
    path: '/check',
    redirect: '/indexCheck',
    name: 'Check',
    meta: {
      title: '主页查验',
      icon: 'user'
    }},

  {
    path: '/indexCheck',
    component: () => import('@/views/msg/check/indexCheck'),
    hidden: true,
    name: 'PageIndexCheck',
    meta: { title: '主页查验' }
  }

]
