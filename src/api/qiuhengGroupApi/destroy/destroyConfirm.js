import request from '@/utils/request'

const BASE_URL = 'http://localhost:9538'

export function refresh () {
  return request({
    url: BASE_URL + '/apply/getApplyList',
    method: 'get'
  })
}
