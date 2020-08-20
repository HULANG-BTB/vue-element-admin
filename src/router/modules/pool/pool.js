/* Layout */
import Layout from '@/layout'

export default [
  {
    path: '/pool',
    component: Layout,
    redirect: '/pool/pool',
    name: 'pool',
    meta: {
      title: '票据池',
      icon: 'pool'
    },
    children: [
      {
        path: 'setting',
        component: () => import('@/views/bill-pool/setting'),
        name: 'setting',
        meta: { title: '票据池设置' }
      }]
  }
]
