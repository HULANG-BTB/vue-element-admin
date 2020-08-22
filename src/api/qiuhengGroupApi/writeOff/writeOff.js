import request from '@/utils/request'

const BASE_URL = '/writeoff-service'
// const BASE_URL = 'http://123.56.247.54:7000/writeoff-service'

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

export function result (data) {
  return request({
    url: BASE_URL + '/financial/result',
    method: 'post',
    data: data
  })
}

