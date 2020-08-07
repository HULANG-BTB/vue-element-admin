module.exports = {
  // 模板标题
  title: 'Vue Admin Template',

  // 固定头部
  fixedHeader: true,

  // 是否显示侧边栏Logo
  sidebarLogo: true,

  // 是否显示标签栏
  tagsView: true,

  // auth相关
  auth: {
    // 本地token的键值
    tokenKey: 'Token',

    // 本地token过期时间 单位 天 默认1天
    tokenExpires: 1,

    // 请求提交时附带token的请求头
    header: 'Authenticate'
  },

  // 请求超时时间 单位毫秒
  requestTimeout: 10000

}
