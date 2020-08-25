/* Layout */
import Layout from '@/layout'

export default [{
  path: '/user',
  component: Layout,
  redirect: '/user/user',
  name: 'User',
  meta: {
    title: '用户管理',
    icon: 'user'
  }
}]
