/*
 * @Author: Raiz
 * @since: Do not edit
 * @lastTime: 2020-08-10 12:21:02
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
      icon: 'user'
    },
    children: [
      {
        path: 'billType',
        component: () => import('@/views/base-data/billType/index'),
        name: 'billType',
        meta: { title: '票据种类管理' }
      },
      {
        path: 'dept',
        component: () => import('@/views/base-data/dept/index'),
        name: 'dept',
        meta: {
          title: '归口财政管理'
        }
      },
      {
        path: 'incomeSort',
        component: () => import('@/views/base-data/incomeSort/index'),
        name: 'incomeSort',
        meta: {
          title: '收入类别管理'
        }
      },
      {
        path: 'projectBill',
        component: () => import('@/views/base-data/projectBill/index'),
        name: 'projectBill',
        meta: {
          title: '项目票据关系管理'
        }
      },
      {
        path: 'region',
        name: 'region',
        component: () => import('@/views/base-data/region/index'),
        meta: {
          title: '区划管理'
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
      }
    ]
  }
]
