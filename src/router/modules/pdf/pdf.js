/* Layout */
import Layout from '@/layout'

export default [
  {
    path: '/pdf',
    component: Layout,
    redirect: '/pdf/pdf',
    name: 'pdf',
    meta: {
      title: 'PDF',
      icon: 'pdf'
    },
    children: [
      {
        path: 'createPdf',
        component: () => import('@/views/pdf/CreatePdf'),
        name: 'createPdf',
        meta: { title: '录入PDF' }
      },
      {
        path: 'showPdf',
        component: () => import('@/views/pdf/ShowPdf'),
        name: 'showPdf',
        meta: { title: '管理PDF' }
      }
    ]
  }
]
