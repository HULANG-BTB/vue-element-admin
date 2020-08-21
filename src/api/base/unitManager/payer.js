import request from '@/utils/request'

export function addPayer (data) {
  return request({
    url: '/payer/save',
    method: 'post',
    data: data
  })
}

export function listPayerByPage (query) {
  return request({
    url: '/payer/listByPage',
    method: 'get',
    params: query
  })
}

export function removePayer (id) {
  return request({
    url: `/payer/remove/${id}`,
    method: 'delete'
  })
}

export function updatePayer (data) {
  return request({
    url: '/payer/update',
    method: 'put',
    data: data
  })
}

export function removePayerBatch (data) {
  return request({
    url: '/payer/removeBatch',
    method: 'delete',
    data: data
  })
}
