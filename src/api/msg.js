import request from '@/utils/request'

const BASE_URL = 'boss-ecds-bill-message'
/* mail相关 */
export function getMailList (query) {
  return request({
    url: BASE_URL + '/mail/list',
    method: 'post',
    data: query
  })
}
export function updateStatus (mail) {
  return request({
    url: BASE_URL + '/mail/updateStatus',
    method: 'put',
    data: mail
  })
}
/* 不提供自定义修改接口 */
export function updateMail (mail) {
  return request({
    url: BASE_URL + '/mail/updateMail',
    method: 'put',
    data: mail
  })
}
export function addMail (mail) {
  return request({
    url: BASE_URL + '/mail/addMail',
    method: 'post',
    data: mail
  })
}
export function deleteMail (mailId) {
  return request({
    url: BASE_URL + '/mail/deleteMail',
    method: 'delete',
    params: { id: mailId }
  })
}
export function deleteMailBatch (mails) {
  return request({
    url: BASE_URL + '/mail/deleteMailBatch',
    method: 'delete',
    data: mails
  })
}

/* sms 相关 */
export function getSmsList (query) {
  return request({
    url: BASE_URL + '/sms/list',
    method: 'post',
    data: query
  })
}
export function updateSmsStatus (sms) {
  return request({
    url: BASE_URL + '/sms/updateStatus',
    method: 'put',
    data: sms
  })
}
export function getBill (query) {
  return request({
    url: BASE_URL + '/sms/getBill',
    method: 'get',
    params: { tel: query.tel, verifyCode: query.verifyCode }
  })
}
/* 票据查验 */
export function billCheck (query) {
  return request({
    url: BASE_URL + '/check/billCheck',
    method: 'get',
    params: { billId: query.billId, checkCode: query.checkCode }
  })
}

/* 查验记录相关  */
export function getCheckRecordList (query) {
  return request({
    url: BASE_URL + '/checkRecord/list',
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
    url: BASE_URL + '/checkRecord/deleteCheckRecordBatch',
    method: 'delete',
    data: records
  })
}
export function deleteCheckRecord (recordId) {
  return request({
    url: BASE_URL + '/checkRecord/deleteCheckRecord',
    method: 'delete',
    params: { id: recordId }
  })
}
/* 统一方法 */
export const util = {
  prettyJson: function (str) {
    // 设置缩进为2个空格
    // str = JSON.stringify(JSON.parse(str), null, 2)
    str = str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    let target = str.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      // var cls = 'number'
      // if (/^"/.test(match)) {
      //   if (/:$/.test(match)) {
      //     cls = 'key'
      //   } else {
      //     cls = 'string'
      //   }
      // } else if (/true|false/.test(match)) {
      //   cls = 'boolean'
      // } else if (/null/.test(match)) {
      //   cls = 'null'
      // }
      return '<ul>' + match + '</ul>'
    })
    target = target.replace(new RegExp(',', 'g'), '').replace(new RegExp(':</ul> <ul>', 'g'), '').replace(new RegExp(':</ul><ul>', 'g'), '')
    return target
  },
  jsonFormat: function (src) {
    const jsonStr = src.replace(new RegExp('"', 'g'), '').replace('{', '').replace('}', '')
    return jsonStr
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
