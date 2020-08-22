import request from '@/utils/request'

const BASE_URL = 'bill-invocing'

export function getBillListByPage (query) {
  return request({
    url: BASE_URL + '/billInvoicing/getPage',
    method: 'get',
    params: query
  })
}
export function getOneBill (billId) {
  return request({
    url: BASE_URL + '/billInvoicing/getUneCbillById',
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
export function getPassBillList (query) {
  return request({
    url: BASE_URL + '/billInvoicing/getPassBill',
    method: 'get',
    params: query
  })
}
export function getImageUrl (billId, billNo) {
  return request({
    url: BASE_URL + '/billInvoicing/getImgUrl',
    method: 'get',
    params: { billId, billNo }
  })
}
export function pdfSign (billId, billNo) {
  return request({
    url: BASE_URL + '/verify/sign',
    method: 'get',
    params: { billId, billNo }
  })
}
export function getBill () {
  return request({
    url: BASE_URL + '/billInvoicing/getBillInfo',
    method: 'get'
  })
}
