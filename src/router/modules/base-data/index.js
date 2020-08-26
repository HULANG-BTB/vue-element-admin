/*
 * @Author: Raiz
 * @since: Do not edit
 * @lastTime: 2020-08-25 16:38:13
 * @LastEditors: Raiz
 * @Description:
 */
import Layout from '@/layout'

export default [
  {
    path: '/base-data',
    component: Layout,
    redirect: '/base-data',
    name: 'base-data',
    meta: {
      title: '基础信息',
      icon: 'el-icon-document'
    },
    children: [
      {
        path: 'billType',
        component: () => import('@/views/base-data/billType/index'),
        name: 'billType',
        meta: {
          title: '票据种类管理',
          icon: 'el-icon-folder',
          roles: ['admin', 'financial_check', 'financial'] }
      },
      {
        path: 'finDept',
        component: () => import('@/views/base-data/finDept/index'),
        name: 'finDept',
        meta: {
          title: '归口财政管理',
          icon: 'el-icon-coin',
          roles: ['admin', 'financial_check', 'financial']
        }
      },
      {
        path: 'incomeSort',
        component: () => import('@/views/base-data/incomeSort/index'),
        name: 'incomeSort',
        meta: {
          title: '收入类别管理',
          icon: 'el-icon-bank-card',
          roles: ['admin', 'financial_check', 'financial']
        }
      },
      {
        path: 'projectBill',
        component: () => import('@/views/base-data/projectBill/index'),
        name: 'projectBill',
        meta: {
          title: '项目票据关系管理',
          icon: 'el-icon-document-copy',
          roles: ['admin', 'financial_check', 'financial']
        }
      },
      {
        path: 'region',
        name: 'region',
        component: () => import('@/views/base-data/region/index'),
        meta: {
          title: '区划管理',
          icon: 'el-icon-location-information',
          roles: ['admin', 'financial_check', 'financial', 'unit']
        },
        children: [
          { path: 'list',
            name: '区划列表',
            component: () => import('@/views/base-data/region/region_list'),
            hidden: false,
            meta: {
              title: '区划列表'
            }
          },
          { path: 'add',
            name: '新增区划',
            component: () => import('@/views/base-data/region/region_add'),
            hidden: true,
            meta: {
              title: '新增区划'
            }
          }
        ]
      },
      {
        path: 'subjectManagement',
        component: () => import('@/views/subjectManagement/index'),
        name: 'SubjectManagement',
        meta: {
          title: '预算科目管理',
          roles: ['admin', 'financial', 'financial_check', 'unit']
        }
      }
    ]
  }
]
