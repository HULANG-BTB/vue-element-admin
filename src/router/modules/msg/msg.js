/* Layout */
import Layout from '@/layout'

export default [
  {
    path: '/msg',
    component: Layout,
    redirect: '/mail',
    name: 'Msg',
    meta: {
      title: '消息推送',
      icon: 'el-icon-s-promotion'
    },
    children: [
      {
        path: '/mail',
        component: () => import('@/views/msg/record/mail'),
        name: 'PageMail',
        meta: {
          title: '邮件记录',
          icon: 'el-icon-message'

        }
      },
      {
        path: '/sms',
        component: () => import('@/views/msg/record/sms'),
        name: 'PageSms',
        meta: {
          title: '短信记录',
          icon: 'el-icon-chat-line-round'

        }
      },
      {
        path: '/smsCheck',
        component: () => import('@/views/msg/check/smsCheck'),
        name: 'PageSmsCheck',
        hidden: true,
        meta: { title: '短信查验' }
      },
      {
        path: '/billCheck',
        component: () => import('@/views/msg/check/billCheck'),
        name: 'PageVerify',
        hidden: true,
        meta: { title: '票据查验' }
      },
      {
        path: '/checkRecord',
        component: () => import('@/views/msg/record/checkRecord'),
        name: 'PageCheckRecord',
        meta: {
          title: '票据查验记录',
          icon: 'el-icon-document-copy'
        }
      }
    ]
  }
]
