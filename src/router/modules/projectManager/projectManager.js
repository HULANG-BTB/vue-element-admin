/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const projectManager = {
  path: '/projectManager',
  component: Layout,
  redirect: '/projectManager/projectManager',
  meta: { title: '项目管理', icon: 'form' },
  children: [
    {
      path: 'projectManager',
      component: () => import('@/views/projectManager/projectManager'),
      name: 'projectManager',
      meta: { title: '项目维护', icon: 'icon' }
    },
    {
      path: 'projectCheck',
      component: () => import('@/views/projectManager/projectCheck'),
      name: 'projectCheck',
      meta: { title: '项目审核', icon: 'link' }
    },
    {
      path: 'chargeStand',
      component: () => import('@/views/projectManager/chargeStand'),
      name: 'chargeStand',
      meta: { title: '收费标准管理', icon: 'tab' }
    }
  ]
}

export default projectManager
