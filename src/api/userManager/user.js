import request from '@/utils/request'
import qs from 'querystring'

const BASE_URL = '/base'

export function login (data) {
  return request({
    url: `/user/login`,
    method: 'post',
    data: qs.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function getInfo (token) {
  return request({
    url: `${BASE_URL}/user/info`,
    method: 'get'
  })
}

export function logout () {
  return request({
    url: `/user/logout`,
    method: 'post'
  })
}

export function getUserList () {
  return request({
    url: `${BASE_URL}/user/list`,
    method: 'get'
  })
}

export function getUserListByPage (query) {
  return request({
    url: `${BASE_URL}/user/listByPage`,
    method: 'get',
    params: query
  })
}

export function updateUser (user) {
  return request({
    url: `${BASE_URL}/user/update`,
    method: 'put',
    data: user
  })
}

export function deleteUser (id) {
  return request({
    url: `${BASE_URL}/user/remove/${id}`,
    method: 'delete'
  })
}

export function deleteUserBatch (data) {
  return request({
    url: `${BASE_URL}/user/removeBatch`,
    method: 'delete',
    data: data
  })
}

export function addUser (data) {
  return request({
    url: `${BASE_URL}/user/save`,
    method: 'post',
    data
  })
}

export function resetPassword (data) {
  return request({
    url: `${BASE_URL}/user/resetPassword`,
    method: 'put',
    data: data
  })
}
