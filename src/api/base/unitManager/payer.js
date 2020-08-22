import request from '@/utils/request'

const BASE_URL = '/base'

export function addPayer (data) {
  return request({
    url: `${BASE_URL}/payer/save`,
    method: 'post',
    data: data
  })
}

export function listPayerByPage (query) {
  return request({
    url: `${BASE_URL}/payer/listByPage`,
    method: 'get',
    params: query
  })
}

export function removePayer (id) {
  return request({
    url: `${BASE_URL}/payer/remove/${id}`,
    method: 'delete'
  })
}

export function updatePayer (data) {
  return request({
    url: `${BASE_URL}/payer/update`,
    method: 'put',
    data: data
  })
}

export function removePayerBatch (data) {
  return request({
    url: `${BASE_URL}/payer/removeBatch`,
    method: 'delete',
    data: data
  })
}
