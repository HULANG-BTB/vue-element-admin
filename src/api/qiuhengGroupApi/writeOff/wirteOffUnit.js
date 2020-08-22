import request from '@/utils/request'

const BASE_URL = '/writeoff-service'
// const BASE_URL = 'http://123.56.247.54:7000/writeoff-service'

export function getApplyList (queryInfo) {
  return request({
    url: BASE_URL + '/unit/selectApply',
    method: 'get',
    params: queryInfo
  })
}

export function deleteApply (no) {
  return request({
    url: BASE_URL + `/unit/deleteApply/${no}`,
    method: 'delete'
  })
}

export function uploadApply (noList) {
  return request({
    url: BASE_URL + '/unit/uploadApply',
    method: 'put',
    data: noList
  })
}

export function rescindApply (noList) {
  return request({
    url: BASE_URL + '/unit/rescindApply',
    method: 'put',
    data: noList
  })
}

export function getItems (queryInfo) {
  return request({
    url: BASE_URL + '/unit/selectItem',
    method: 'get',
    params: queryInfo
  })
}

export function getIncomes (queryInfo) {
  return request({
    url: BASE_URL + '/unit/selectIncome',
    method: 'get',
    params: queryInfo
  })
}

export function getBillInfo (queryInfo) {
  return request({
    url: BASE_URL + '/unit/getBillInfo',
    method: 'get',
    params: queryInfo
  })
}

export function saveApply (data) {
  return request({
    url: BASE_URL + '/unit/addOrUpdateApply',
    method: 'post',
    data: data
  })
}
