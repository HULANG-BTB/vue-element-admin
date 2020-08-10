import request from '@/utils/request'

export function getUserListByPage (data) {
  return request({
    url: '/item/listbypage',
    method: 'post',
    data: data
  })
}

export function addUser (data) {
  return request({
    url: `/item/save`,
    method: 'post',
    data: data
  })
}

export function updateUser (user) {
  return request({
    url: '/item/update',
    method: 'post',
    data: user
  })
}

export function deleteUser (data) {
  return request({
    url: `/item/delete`,
    method: 'post',
    data: { id: data }
  })
}

export function deleteUserBatch (data) {
  return request({
    url: `/item/batchDelete`,
    method: 'post',
    data: data
  })
}

