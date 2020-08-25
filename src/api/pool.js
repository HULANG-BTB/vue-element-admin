import request from '@/utils/request'

const baseURL = '/ecds-bill-pool'

export function setSource (data) {
  return request({
    url: baseURL + '/pool/setSource',
    method: 'post',
    data
  })
}

export function addSource (data) {
  return request({
    url: baseURL + '/pool/addSource',
    method: 'post',
    data
  })
}

export function deleteSource (data) {
  return request({
    url: baseURL + '/pool/removeSource',
    method: 'post',
    data
  })
}

export function querySource (billTypeCode) {
  return request({
    url: baseURL + '/pool/retrieveSetByCode',
    method: 'get',
    params: billTypeCode
  })
}

export function batchQuerySource () {
  return request({
    url: baseURL + '/pool/retrieveSetList',
    method: 'get'
  })
}
