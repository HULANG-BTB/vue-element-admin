/* Layout */
import Layout from '@/layout'

export default [{
  path: '/destroy',
  component: Layout,
  // redirect: '/user/user',
  name: 'Destroy',
  meta: {
    title: '票据销毁',
    icon: 'el-icon-s-management'
  },
  children: [{
    path: 'destroyApply',
    component: () => import('@/views/qiuhengGroupViews/destroyApply/destroyApply.vue'),
    name: 'PageDestroyApply',
    meta: {
      title: '票据销毁申请（单位端）'
    }
    // roles: ['role_manager', 'admin']
  },
  {
    path: 'destroyConfirm',
    component: () => import('@/views/qiuhengGroupViews/destroyConfirm/destroyConfirm.vue'),
    name: 'PageDestroyConfirm',
    meta: {
      title: '票据销毁审核（财政端）'
      // roles: ['role_manager', 'admin']
    }
  }
  ]
}]
