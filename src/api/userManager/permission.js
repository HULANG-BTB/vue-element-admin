import request from '@/utils/request'

const BASE_URL = '/base'

export function savePermission (data) {
  return request({
    url: `${BASE_URL}/permission/save`,
    method: 'post',
    data
  })
}

export function removePermission (id) {
  return request({
    url: `${BASE_URL}/permission/remove/${id}`,
    method: 'delete'
  })
}

export function removePermissionBatch (data) {
  return request({
    url: `${BASE_URL}/permission/removeBatch`,
    method: 'delete',
    data: data
  })
}

export function updatePermission (data) {
  return request({
    url: `${BASE_URL}/permission/update`,
    method: 'put',
    data: data
  })
}

export function getPermissionById (id) {
  return request({
    url: `${BASE_URL}/permission/getById`,
    method: 'get',
    params: { id }
  })
}

export function getPermissionByRid (id) {
  return request({
    url: `${BASE_URL}/permission/getByRid/` + id,
    method: 'get'
  })
}

export function getPermissionList () {
  return request({
    url: `${BASE_URL}/permission/list`,
    method: 'get'
  })
}

export function getPermissionListByTree () {
  return request({
    url: `${BASE_URL}/permission/listByTree`,
    method: 'get'
  })
}

export function getPermissionListByPage (query) {
  return request({
    url: `${BASE_URL}/permission/listByPage`,
    method: 'get',
    params: query
  })
}
