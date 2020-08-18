import request from '@/utils/request'

/* stockreturn相关 */
export function getStockReturnList (query) {
  return request({
    url: '/stock-return-po/getListStockReturnPage',
    method: 'post',
    data: query
  })
}
export function getListStockReturnByDateOrNo (query) {
  return request({
    url: '/stock-return-po/getListStockReturnByDateOrNo1',
    method: 'post',
    // params: { no: query.no, startTime: query.startTime, endTime: query.endTime }
    // params: query
    data: query
  })
}

/* stoackteturnitem 相关 */
export function getSmsList (query) {
  return request({
    url: '/sms/list',
    method: 'post',
    data: query
  })
}
export function updateSmsStatus (sms) {
  return request({
    url: '/sms/updateStatus',
    method: 'put',
    data: sms
  })
}
export function getBill (query) {
  return request({
    url: '/sms/getBill',
    method: 'get',
    params: { tel: query.tel, verifyCode: query.verifyCode }
  })
}
/* 统一方法 */
export const util = {
  jsonFormat: function (src) {
    const jsonStr = src
    return jsonStr.replace('"', '').replace('{', '').replace('}', '')
  },
  dateFormat: function (date) {
    const dateTime = new Date(date)
    const YY = dateTime.getFullYear()
    const MM =
      dateTime.getMonth() + 1 < 10
        ? '0' + (dateTime.getMonth() + 1)
        : dateTime.getMonth() + 1
    const D =
      dateTime.getDate() < 10 ? '0' + dateTime.getDate() : dateTime.getDate()
    const hh =
      dateTime.getHours() < 10
        ? '0' + dateTime.getHours()
        : dateTime.getHours()
    const mm =
      dateTime.getMinutes() < 10
        ? '0' + dateTime.getMinutes()
        : dateTime.getMinutes()
    const ss =
      dateTime.getSeconds() < 10
        ? '0' + dateTime.getSeconds()
        : dateTime.getSeconds()
    return `${YY}-${MM}-${D}  ${hh}:${mm}:${ss}`
  }
}
