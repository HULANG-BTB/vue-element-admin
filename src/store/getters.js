const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  size: state => state.app.size,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  permission_routes: state => state.permission.routes,
  roles: state => state.user.roles.map(item => item.role),
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.nickname,
  errorLogs: state => state.errorLog.logs,
  region: state => state.region.region
}
export default getters
