import request from '@/utils/request'

export function savePermission (data) {
  return request({
    url: `/permission/save`,
    method: 'post',
    data
  })
}

export function removePermission (id) {
  return request({
    url: `/permission/remove/${id}`,
    method: 'delete'
  })
}

export function removePermissionBatch (data) {
  return request({
    url: `/permission/removeBatch`,
    method: 'delete',
    data: data
  })
}

export function updatePermission (data) {
  return request({
    url: '/permission/update',
    method: 'put',
    data: data
  })
}

export function getPermissionById (id) {
  return request({
    url: '/permission/getById',
    method: 'get',
    params: { id }
  })
}

export function getPermissionByRid (id) {
  return request({
    url: '/permission/getByRid/' + id,
    method: 'get'
  })
}

export function getPermissionList () {
  return request({
    url: '/permission/list',
    method: 'get'
  })
}

export function getPermissionListByTree () {
  return request({
    url: '/permission/listByTree',
    method: 'get'
  })
}

export function getPermissionListByPage (query) {
  return request({
    url: '/permission/listByPage',
    method: 'get',
    params: query
  })
}
