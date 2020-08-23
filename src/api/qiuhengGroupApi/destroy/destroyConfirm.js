import request from '@/utils/request'

// const BASE_URL = '/bill-destroy'
const BASE_URL = 'http://localhost:9538'

export function refresh () {
  return request({
    url: BASE_URL + '/apply/getApplyList',
    method: 'get'
  })
}

export function getItemListByDestroyNo (fDestroyNo) {
  return request({
    url: BASE_URL + '/apply/getItemListByDestroyNo',
    method: 'get',
    params: {
      fDestroyNo
    }
  })
}
