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
      meta: { title: '单位管理', roles: ['financial', 'admin', 'financial_check'] }
    },
    {
      path: 'unitManagerDetail/:id',
      component: () => import('@/views/unitManager/unitManagerDetail'),
      name: 'unitManagerDetail',
      props: (route) => ({
        id: route.params.id
      }),
      hidden: true,
      meta: { title: '单位信息' }
    },
    {
      path: 'unitManagerDetailUnit',
      component: () => import('@/views/unitManager/unitManagerDetailUnit'),
      name: 'unitManagerDetailUnit',
      meta: { title: '单位信息', roles: ['unit'] }
    },
    {
      path: 'unitCheck',
      component: () => import('@/views/unitManager/unitCheck'),
      name: 'unitCheck',
      meta: { title: '单位审核', roles: ['financial_check', 'admin'] }
    },
    {
      path: 'adminDepart',
      component: () => import('@/views/unitManager/adminDepart'),
      name: 'adminDepart',
      meta: { title: '主管部门管理', roles: ['financial', 'financial_check', 'admin'] }
    },
    {
      path: 'purchLicense',
      component: () => import('@/views/unitManager/purchLicense'),
      name: 'purchLicense',
      meta: { title: '准购证管理', roles: ['financial', 'financial_check', 'admin'] }
    },
    {
      path: 'purchLicenseCheck',
      component: () => import('@/views/unitManager/purchLicenseCheck'),
      name: 'purchLicenseCheck',
      meta: { title: '准购证审核', roles: ['financial_check', 'admin'] }
    },
    {
      path: 'unitPayer',
      component: () => import('@/views/unitManager/unitPayer'),
      name: 'unitPayer',
      meta: { title: '缴款人管理', roles: ['unit'] }
    },
    {
      path: 'unitPlaceManager',
      component: () => import('@/views/unitManager/unitPlaceManager'),
      name: 'unitPlaceManager',
      meta: { title: '开票点管理', roles: ['unit'] }
    },
    {
      path: 'projectGroup',
      component: () => import('@/views/projectManager/projectGroup'),
      name: 'projectGroup',
      meta: { title: '分组管理', roles: ['unit'] },
      roles: ['admin']
    },
    {
      path: 'unitBillManager',
      component: () => import('@/views/unitManager/unitBillManager'),
      name: 'unitBillManager',
      meta: { title: '可用票据', roles: ['unit'] }
    },
    {
      path: 'unitItemManager',
      component: () => import('@/views/unitManager/unitItemManager'),
      name: 'unitItemManager',
      meta: { title: '可用项目', roles: ['unit'] }
    }
  ]
}

export default unitManager

