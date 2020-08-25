import request from '@/utils/request'
export function payLogin (data) {
  return request({
    url: '/pay/payLogin',
    method: 'post',
    data
  })
}

export function getQrCode () {
  return request({
    url: '/pay/getQrCode',
    method: 'post'
  })
}

export function addAccIntoInfoDto (data) {
  return request({
    url: '/pay/addAccIntoInfoDto',
    method: 'post',
    data
  })
}

export function getUUid (data) {
  return request({
    url: '/pay/getUUid',
    method: 'post',
    data
  })
}

