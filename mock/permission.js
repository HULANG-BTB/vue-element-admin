const permissionList = [
  {
    "id": 1,
    "name": "增加用户",
    "url": "/user/save"
  },
  {
    "id": 2,
    "name": "修改用户",
    "url": "/user/update"
  },
  {
    "id": 3,
    "name": "删除用户",
    "url": "/user/remove"
  },
  {
    "id": 4,
    "name": "查询用户",
    "url": "/user/list"
  },
  {
    "id": 5,
    "name": "增加角色",
    "url": "/role/add"
  },
  {
    "id": 6,
    "name": "修改角色",
    "url": "/role/update"
  },
  {
    "id": 7,
    "name": "删除角色",
    "url": "/role/remove"
  },
  {
    "id": 8,
    "name": "查询角色",
    "url": "/role/list"
  },
  {
    "id": 9,
    "name": "增加权限",
    "url": "/permission/save"
  },
  {
    "id": 10,
    "name": "修改权限",
    "url": "/permission/update"
  },
  {
    "id": 11,
    "name": "删除权限",
    "url": "/permission/remov"
  },
  {
    "id": 12,
    "name": "查询权限",
    "url": "/permission/list"
  }
]

module.exports = [
  {
    url: 'role/getRoleList',
    type: 'GET',
    response: config => {
      return {
        status: 200,
        data: permissionList
      }
    }
  }
]