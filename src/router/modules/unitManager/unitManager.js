/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const unitManager = {
  path: '/unitManager',
  component: Layout,
  redirect: '/unitManager/unitManager',
  meta: { title: '单位管理', icon: 'table' },
  children: [
    {
      path: 'unitManager',
      component: () => import('@/views/unitManager/unitManager'),
      name: 'unitManager',
      meta: { title: '单位管理', icon: 'icon' }
    },
    {
      path: 'unitCheck',
      component: () => import('@/views/unitManager/unitCheck'),
      name: 'unitCheck',
      meta: { title: '单位审核', icon: 'icon' }
    },
    {
      path: 'adminDepart',
      component: () => import('@/views/unitManager/adminDepart'),
      name: 'adminDepart',
      meta: { title: '主管部门管理', icon: 'link' }
    },
    {
      path: 'purchLicense',
      component: () => import('@/views/unitManager/purchLicense'),
      name: 'purchLicense',
      meta: { title: '准购证管理', icon: 'edit' }
    },
    {
      path: 'purchLicenseCheck',
      component: () => import('@/views/unitManager/purchLicenseCheck'),
      name: 'purchLicenseCheck',
      meta: { title: '准购证审核', icon: 'link' }
    },
    {
      path: 'unitPayer',
      component: () => import('@/views/unitManager/unitPayer'),
      name: 'unitPayer',
      meta: { title: '缴款人管理', icon: 'icon' }
    },
    {
      path: 'unitPlaceManager',
      component: () => import('@/views/unitManager/unitPlaceManager'),
      name: 'unitPlaceManager',
      meta: { title: '开票点管理', icon: 'icon' }
    },
    {
      path: 'projectGroup',
      component: () => import('@/views/projectManager/projectGroup'),
      name: 'projectGroup',
      meta: { title: '项目分组', icon: 'link' },
      roles: ['admin']
    }
  ]
}

export default unitManager
