
import Layout from '@/layout'

export default [
  {
    path: '/subjectManagement',
    component: Layout,
    redirect: '/subjectManagement/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/subjectManagement/index'),
        name: 'SubjectManagement',
        meta: { title: '预算科目管理', icon: 'edit' }
      }
    ]
  }
]
