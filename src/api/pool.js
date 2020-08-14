import request from '@/utils/request'

export function settingPool (param) {
  return request({
    url: 'pool/setting',
    method: 'post',
    params: param
  })
}
