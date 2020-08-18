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
/* 不提供自定义修改接口 */
export function updateMail (mail) {
  return request({
    url: '/mail/updateMail',
    method: 'put',
    data: mail
  })
}
export function addMail (mail) {
  return request({
    url: '/mail/addMail',
    method: 'post',
    data: mail
  })
}
export function deleteMail (mailId) {
  return request({
    url: '/mail/deleteMail',
    method: 'delete',
    params: { id: mailId }
  })
}
export function deleteMailBatch (mails) {
  return request({
    url: '/mail/deleteMailBatch',
    method: 'delete',
    data: mails
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
/* 票据查验 */
export function billCheck (query) {
  return request({
    url: '/check/billCheck',
    method: 'get',
    params: { billId: query.billId, checkCode: query.checkCode }
  })
}

/* 查验记录相关  */
export function getCheckRecordList (query) {
  return request({
    url: '/checkRecord/list',
    method: 'post',
    data: query
  })
}
export function addCheckRecord (record) {
  return request({
    url: '#',
    method: 'post'
  })
}
export function updateCheckRecord (record) {
  return request({
    url: '#',
    method: 'put'
  })
}
export function deleteCheckRecordBatch (records) {
  return request({
    url: '/checkRecord/deleteCheckRecordBatch',
    method: 'post',
    data: records
  })
}
export function deleteCheckRecord (recordId) {
  return request({
    url: '/checkRecord/deleteCheckRecord',
    method: 'delete',
    params: { id: recordId }
  })
}
/* 统一方法 */
export const util = {
  jsonFormat: function (src) {
    const jsonStr = src
    return jsonStr.replace(new RegExp('"', 'g'), '').replace('{', '').replace('}', '')
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
