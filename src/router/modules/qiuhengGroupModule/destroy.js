/* Layout */
import Layout from '@/layout'

export default [{
  path: '/destroy',
  component: Layout,
  // redirect: '/user/user',
  name: 'Destroy',
  meta: {
    title: '票据销毁',
    icon: 'user'
  },
  children: [{
      path: 'destroyApply',
      component: () => import('@/views/qiuhengGroupViews/destroyApply'),
      name: 'PageDestroyApply',
      meta: {
        title: '票据销毁申请'
      }
      // roles: ['role_manager', 'admin']
    },
    {
      path: 'destroyConfirm',
      component: () => import('@/views/qiuhengGroupViews/destroyConfirm'),
      name: 'PageDestroyConfirm',
      meta: {
        title: '票据销毁审核',
        // roles: ['role_manager', 'admin']
      }
    }
  ]
}]
