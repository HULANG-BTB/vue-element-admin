/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const billAccountRouter = {
  path: '/billAccount',
  component: Layout,
  redirect: '/ecds-bill-accounting',
  name: 'billAccount',
  meta: {
    title: '入账管理',
    icon: 'chart'
  },
  children: [{
    path: '/cbillaccounting',
    component: () => import('@/views/ecds-bill-accounting/cbillaccounting'),
    name: 'cbillaccounting',
    meta: { title: '入账信息' }
  },
  {
    path: '/voucher',
    component: () => import('@/views/ecds-bill-accounting/voucher'),
    name: 'voucher',
    meta: { title: '入账凭证' }
  },
  {
    path: '/billInterflow',
    component: () => import('@/views/ecds-bill-accounting/billInterflow'),
    name: 'billInterflow',
    meta: { title: '入账交互' }
  }
  ]
}
export default billAccountRouter
