import request from '@/utils/request'

export function setSource (data) {
  return request({
    url: 'pool/setSource',
    method: 'post',
    baseURL: 'http://localhost:8083',
    data
  })
}

export function addSource (data) {
  return request({
    url: 'pool/addSource',
    method: 'post',
    baseURL: 'http://localhost:8083',
    data
  })
}

export function deleteSource (data) {
  return request({
    url: 'pool/removeSource',
    method: 'post',
    baseURL: 'http://localhost:8083',
    data
  })
}

export function querySource (billTypeCode) {
  return request({
    url: 'pool/retrieveSetByCode',
    method: 'get',
    baseURL: 'http://localhost:8083',
    params: billTypeCode
  })
}

export function batchQuerySource () {
  return request({
    url: 'pool/retrieveSetList',
    method: 'get',
    baseURL: 'http://localhost:8083'
  })
}
