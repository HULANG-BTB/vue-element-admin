import request from '@/utils/request'

const BASE_URL = 'http://localhost:8888'
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

<<<<<<< HEAD
export function result(data) {
=======
export function pass (data) {
>>>>>>> c39973e095219a9781128697d399f87f9d08207d
  return request({
    url: BASE_URL + '/financial/result',
    method: 'post',
    data: data
  })
}

<<<<<<< HEAD
=======
export function unPass (data) {
  return request({
    url: BASE_URL + '/financial/unPass',
    method: 'post',
    data: data
  })
}
>>>>>>> c39973e095219a9781128697d399f87f9d08207d
