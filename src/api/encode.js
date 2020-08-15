import request from '@/utils/request'

export function createCode (data) {
  return request({
    url: '/encode/createCode',
    method: 'post',
    data
  })
}
