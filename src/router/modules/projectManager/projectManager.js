/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const projectManager = {
  path: '/projectManager',
  component: Layout,
  redirect: '/projectManager/projectManager',
  meta: { title: '项目管理', icon: 'form', roles: ['financial', 'financial_check', 'admin'] },
  children: [
    {
      path: 'projectManager',
      component: () => import('@/views/projectManager/projectManager'),
      name: 'projectManager',
      meta: { title: '项目维护', roles: ['financial', 'admin', 'financial_check'] }

    },
    {
      path: 'projectCheck',
      component: () => import('@/views/projectManager/projectCheck'),
      name: 'projectCheck',
      meta: { title: '项目审核', roles: ['financial_check', 'admin'] }

    },
    {
      path: 'chargeStand',
      component: () => import('@/views/projectManager/chargeStand'),
      name: 'chargeStand',
      meta: { title: '项目标准管理', roles: ['financial_check', 'admin'] }

    }
  ]
}

export default projectManager
