import request from '@/utils/request'

export function getBillAll (data) {
  return request({
    url: '/agenBill/getBillAll',
    method: 'post',
    data
  })
}
