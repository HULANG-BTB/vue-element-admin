import request from '@/utils/request'

export function getRoleList () {
  return request({
    url: '/role/list',
    method: 'get'
  })
}

export function getRoleListByUserId (id) {
  return request({
    url: '/role/listByUserId',
    method: 'get',
    params: { id }
  })
}

export function getRoleListByPage (query) {
  return request({
    url: '/role/listByPage',
    method: 'get',
    params: query
  })
}

export function updateRole (role) {
  return request({
    url: '/role/update',
    method: 'put',
    data: role
  })
}

export function deleteRole (id) {
  return request({
    url: `/role/remove/${id}`,
    method: 'delete'
  })
}

export function deleteRoleBatch (data) {
  return request({
    url: `/role/removeBatch`,
    method: 'delete',
    data: data
  })
}

export function addRole (data) {
  return request({
    url: `/role/save`,
    method: 'post',
    data
  })
}
