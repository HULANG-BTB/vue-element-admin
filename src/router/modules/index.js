/**
 * 注意，请不要对这个文件有任何修改操作
 */

let asyncRoutes = []

const modulesFiles = require.context('.', true, /\.js$/)

modulesFiles.keys().forEach(key => {
  if (key !== './index.js') {
    asyncRoutes = asyncRoutes.concat(modulesFiles(key).default)
  }
})

/**
 * 最后加入 404 以免前期匹配到404 不再继续
 */
asyncRoutes = asyncRoutes.concat([{ path: '*', redirect: '/404', hidden: true }])

export default asyncRoutes
