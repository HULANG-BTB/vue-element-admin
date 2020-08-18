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
        meta: { title: '邮件记录' }
      },
      {
        path: '/sms',
        component: () => import('@/views/msg/sms'),
        name: 'PageSms',
        meta: { title: '短信记录' }
      },
      {
        path: '/smsCheck',
        component: () => import('@/views/msg/smsCheck'),
        name: 'PageSmsCheck',
        meta: { title: '短信查验' }
      },
      {
        path: '/check',
        component: () => import('@/views/msg/check'),
        name: 'PageVerify',
        meta: { title: '票据查验' }
      },
      {
        path: '/checkRecord',
        component: () => import('@/views/msg/checkRecord'),
        name: 'PageCheckRecord',
        meta: { title: '票据查验记录' }
      }
    ]
  }
]
