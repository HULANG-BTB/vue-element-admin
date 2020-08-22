/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const billAccountRouter = {
  path: '/billAccount',
  component: Layout,
  redirect: '/ecds-bill-accounting',
  name: 'billAccount',
  meta: {
    title: '入账管理',
    roles: ['admin', 'financial', 'financial_check'],
    icon: 'chart'
  },
  children: [{
    path: '/cbillaccounting',
    component: () => import('@/views/ecds-bill-accounting/cbillaccounting'),
    name: 'cbillaccounting',
    roles: ['admin', 'financial', 'financial_check'],
    meta: { title: '入账信息' }
  },
  {
    path: '/voucher',
    component: () => import('@/views/ecds-bill-accounting/voucher'),
    name: 'voucher',
    roles: ['admin', 'financial', 'financial_check'],
    meta: { title: '入账凭证' }
  },
  {
    path: '/billInterflow',
    component: () => import('@/views/ecds-bill-accounting/billInterflow'),
    name: 'billInterflow',
    roles: ['admin', 'financial', 'financial_check'],
    meta: { title: '入账交互' }
  }
  ]
}
export default billAccountRouter
