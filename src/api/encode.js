import request from '@/utils/request'

export function createCode (code) {
  return request({
    url: '/encode/createCode',
    method: 'post',
    code
  })
}
