import request from '@/utils/request'

export function getProjectListByPage (data) {
  return request({
    url: '/item/listbypage',
    method: 'post',
    data: data
  })
}

export function addProject (data) {
  return request({
    url: `/item/save`,
    method: 'post',
    data: data
  })
}

export function updateProject (user) {
  return request({
    url: '/item/update',
    method: 'post',
    data: user
  })
}

export function deleteProject (data) {
  return request({
    url: `/item/delete`,
    method: 'post',
    data: { id: data }
  })
}

export function deleteProjectBatch (data) {
  return request({
    url: `/item/batchDelete`,
    method: 'post',
    data: data
  })
}

