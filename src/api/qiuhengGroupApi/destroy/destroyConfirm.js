import request from '@/utils/request'

const BASE_URL = 'http://localhost:9538'

// eslint-disable-next-line space-before-function-paren
export function refresh() {
  return request({
    url: BASE_URL + '/apply/getApplyList',
    method: 'get'
  })
}

// eslint-disable-next-line space-before-function-paren
export function getItemListByDestroyNo(fDestroyNo) {
  return request({
    url: BASE_URL + '/apply/getItemListByDestroyNo',
    method: 'get',
    params: {
      fDestroyNo
    }
  })
}
