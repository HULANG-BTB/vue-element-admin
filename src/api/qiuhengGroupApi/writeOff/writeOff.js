import request from '@/utils/request'

const BASE_URL = "http://localhost:8888"
// http://localhost:8888/financial/receive?fAgenIdCode=1
export function receive (data) {
  return request({
    url: BASE_URL + '/financial/receive',
    method: 'post',
    data: data
  })
}

export function sendBack (data) {
  return request({
    url: BASE_URL + '/financial/sendBack',
    method: 'post',
    data: data
  })
}

export function getDetails (data) {
  return request({
    url: BASE_URL + '/financial/getDetails',
    method: 'post',
    data: data
  })
}

export function getUnitDetails (data) {
  return request({
    url: BASE_URL + '/financial/getUnitDetails',
    method: 'post',
    data: data
  })
}

export function setResult (data) {
  return request({
    url: BASE_URL + '/financial/setResult',
    method: 'post',
    data: data
  })
}

export function search (data) {
  return request({
    url: BASE_URL + '/financial/search',
    method: 'post',
    data: data
  })
}