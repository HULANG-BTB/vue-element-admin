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
      meta: { title: '项目维护', icon: 'icon' },
      roles: ['financial', 'admin']
    },
    {
      path: 'projectCheck',
      component: () => import('@/views/projectManager/projectCheck'),
      name: 'projectCheck',
      meta: { title: '项目审核', icon: 'link' },
      roles: ['admin']
    },
    {
      path: 'projectGroup',
      component: () => import('@/views/projectManager/projectGroup'),
      name: 'projectGroup',
      meta: { title: '项目分组', icon: 'link' },
      roles: ['admin']
    },
    {
      path: 'chargeStand',
      component: () => import('@/views/projectManager/chargeStand'),
      name: 'chargeStand',
      meta: { title: '项目标准管理', icon: 'tab' },
      roles: ['financial', 'admin']
    }
  ]
}

export default projectManager
