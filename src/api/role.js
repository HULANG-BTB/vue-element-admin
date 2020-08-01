import request from '@/utils/request'

const BASE_URL = 'http://localhost:8001'

export function getRoleList () {
  return request({
    url: BASE_URL + '/role/list',
    method: 'get'
  })
}

export function updateRole (role) {
  return request({
    url: BASE_URL + '/role/update',
    method: 'put',
    data: role
  })
}

export function deleteRole (id) {
  return request({
    url: `${BASE_URL}/role/remove/${id}`,
    method: 'delete'
  })
}

export function addRole (data) {
  return request({
    url: `${BASE_URL}/role/save`,
    method: 'post',
    data
  })
}
