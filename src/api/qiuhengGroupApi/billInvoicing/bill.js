import request from '@/utils/request'

const BASE_URL = 'http://localhost:8080'

export function getBillListByPage (query) {
  return request({
    url: BASE_URL + '/billInvoicing/getPage',
    method: 'get',
    params: query
  })
}
export function getOneBill (billId) {
  return request({
    url: BASE_URL + '/billInvoicing/getOne',
    method: 'get',
    params: { billId }
  })
}
export function addBillVerify (unitName) {
  return request({
    url: BASE_URL + '/billInvoicing/addVerify',
    method: 'get',
    params: { unitName }
  })
}
// 新增票据
export function addBill (data) {
  return request({
    url: BASE_URL + '/billInvoicing/addBill',
    method: 'post',
    data
  })
}
