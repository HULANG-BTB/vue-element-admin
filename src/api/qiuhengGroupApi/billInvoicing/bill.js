import request from '@/utils/request'

const BASE_URL = '/bill-invocing'

// 获取单位开票记录
export function getBillListByPage (query) {
  return request({
    url: BASE_URL + '/billInvoicing/getPage',
    method: 'get',
    params: query
  })
}
// 查询单张票据
export function getOneBill (billNo) {
  return request({
    url: BASE_URL + '/billInvoicing/getUneCbillById',
    method: 'get',
    params: { billNo }
  })
}
// 新增票据前验证
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
// 获取通过单位端审核通过的票据信息
export function getPassBillList (query) {
  return request({
    url: BASE_URL + '/billInvoicing/getPassBill',
    method: 'get',
    params: query
  })
}
// 获取模板图片的url
export function getImageUrl (billId, billNo) {
  return request({
    url: BASE_URL + '/billInvoicing/getImgUrl',
    method: 'get',
    params: { billId, billNo }
  })
}
// 获取盖章模板
export function pdfSign (billId, billNo) {
  return request({
    url: BASE_URL + '/verify/sign',
    method: 'get',
    params: { billId, billNo }
  })
}
// 获取可用票据信息
export function getAvaBill () {
  return request({
    url: BASE_URL + '/billInvoicing/getAvaBill',
    method: 'get'
  })
}
// 获取收费项目
export function getItemInfo (unitName) {
  return request({
    url: BASE_URL + '/billInvoicing/getItemInfo',
    method: 'get',
    params: unitName
  })
}
// 发邮件
export function sendMail (billNo) {
  return request({
    url: BASE_URL + '/billInvoicing/sendMail',
    method: 'get',
    params: { billNo }
  })
}
// 发短信
export function sendSms (billNo) {
  return request({
    url: BASE_URL + '/billInvoicing/sendSms',
    method: 'get',
    params: { billNo }
  })
}
// 修改票据目前的状态
export function updateState (billNo, state) {
  return request({
    url: BASE_URL + '/billInvoicing/update',
    method: 'get',
    params: { billNo, state }
  })
}
