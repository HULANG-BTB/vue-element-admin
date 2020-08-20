/* Layout */
import Layout from '@/layout'

export default [
  {
    path: '/msg',
    component: Layout,
    redirect: '/mail/list',
    name: 'Msg',
    meta: {
      title: '消息推送',
      icon: 'user'
    },
    children: [
      {
        path: '/mail',
        component: () => import('@/views/msg/mail'),
        name: 'PageMail',
        meta: { title: '邮件管理' }
      },
      {
        path: '/sms',
        component: () => import('@/views/msg/sms'),
        name: 'PageSms',
        meta: { title: '短信管理' }
      },
      {
        path: '/smsCheck',
        component: () => import('@/views/msg/smsCheck'),
        name: 'PageSmsCheck',
        meta: { title: '短信查验' }
      },
      {
        path: '/verify',
        component: () => import('@/views/msg/verify'),
        name: 'PageVerify',
        meta: { title: '票据查验' }
      }
    ]
  }
]
