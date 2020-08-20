import request from '@/utils/request'

/* mail相关 */
export function getMailList (query) {
  return request({
    url: '/mail/list',
    method: 'post',
    data: query
  })
}
export function updateStatus (mail) {
  return request({
    url: '/mail/updateStatus',
    method: 'put',
    data: mail
  })
}

/* sms 相关 */
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
