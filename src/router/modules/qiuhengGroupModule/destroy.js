/* Layout */
import Layout from '@/layout'

export default [{
  path: '/destroy',
  component: Layout,
  // redirect: '/user/user',
  name: 'Destroy',
  meta: {
    title: '票据销毁',
    icon: 'el-icon-s-management',
    roles: ['unit', 'financial']
  },
  alwaysShow: true,
  children: [{
    path: 'destroyApply',
    component: () => import('@/views/qiuhengGroupViews/destroyApply/destroyApply.vue'),
    name: 'PageDestroyApply',
    meta: {
      title: '票据销毁申请',
      roles: ['unit']
    }
  },
  {
    path: 'destroyConfirm',
    component: () => import('@/views/qiuhengGroupViews/destroyConfirm/destroyConfirm.vue'),
    name: 'PageDestroyConfirm',
    meta: {
      title: '票据销毁审核',
      // roles: ['role_manager', 'admin']
      roles: ['financial']
    }
  }
  ]
}]
