/* Layout */
import Layout from '@/layout'

export default [
  {
    path: '/apply',
    component: Layout,
    redirect: '/mail/list',
    meta: {
      title: '票据申领入库',
      icon: 'user'
    },
    children: [
      {
        path: 'apply',
        component: () => import('@/views/apply/apply'),
        name: 'PageApply',
        meta: { title: '票据申领' }
      },
      {
        path: 'check',
        component: () => import('@/views/apply/check'),
        name: 'PageCheck',
        meta: { title: '申领审核' }
      }
    ]
  }
]
