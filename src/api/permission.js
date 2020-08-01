import request from '@/utils/request'

const BASE_URL = 'http://localhost:8001'

export function getPermissionList () {
  return request({
    url: BASE_URL + '/permission/list',
    method: 'get'
  })
}

export function getPermissionTreeList () {
  return request({
    url: BASE_URL + '/permission/getTreeList',
    method: 'get'
  })
}

export function updatePermission (data) {
  return request({
    url: BASE_URL + '/permission/update',
    method: 'put',
    data: data
  })
}

export function deletePermission (id) {
  return request({
    url: `${BASE_URL}/permission/remove/${id}`,
    method: 'delete'
  })
}

export function addPermission (data) {
  return request({
    url: `${BASE_URL}/permission/save`,
    method: 'post',
    data
  })
}
