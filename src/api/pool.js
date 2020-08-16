import request from '@/utils/request'

export function settingPool (data) {
  return request({
    url: 'pool/setting',
    method: 'post',
    params: data
  })
}

export function query (data) {
  return request({
    url: 'pool/setting',
    method: 'post',
    params: data
  })
}
