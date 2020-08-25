/* Layout */
import Layout from '@/layout'

export default [
  {
    path: '/archive',
    component: Layout,
    redirect: '/archive/fina',

    meta: {
      title: '归档管理',
      roles: ['admin', 'financial', 'unit'],
      icon: 'el-icon-folder'
    },
    children: [
      {
        path: 'fina',
        component: () => import('@/views/archive/fina'),
        name: 'fina',
        meta: {
          title: '财政归档',
          roles: ['admin', 'financial'],
          icon: 'el-icon-coordinate'
        }
      },
      {
        path: 'unit',
        component: () => import('@/views/archive/unit'),
        name: 'unit',
        meta: {
          title: '单位归档',
          roles: ['admin', 'unit'],
          icon: 'el-icon-office-building'
        }
      },
      {
        path: 'info',
        component: () => import('@/views/archive/components/ArchiveBaseInfo'),
        name: 'info',
        hidden: true,
        meta: {
          title: '单位详细信息',
          roles: ['admin', 'financial', 'unit']
        }
      }
    ]
  }
]
