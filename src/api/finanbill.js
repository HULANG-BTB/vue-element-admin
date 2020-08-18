import request from '@/utils/request'

/* 出库相关 */

/**
 * 获得出库列表
 * @param {*} query 出库vo，包含编制人，审核状态等信息
 */
export function getAll (query) {
  return request({
    url: '/stock-out/showAll',
    method: 'post',
    data: query
  })
}

/**
 * 获得出库中的明细
 * @param {pid} pid 父id，即出库id
 */
export function getItem (pid) {
  return request({
    url: '/stock-out/getItem',
    // url: '/mail/updateStatus',
    method: 'get',
    params: { pid: pid }
  })
}

/**
 * 新增出库记录
 * @param {*} author 编制人
 */
export function addOut (author) {
  return request({
    url: '/stock-out/add',
    method: 'get',
    params: { author: author }
  })
}

/**
 * 提交保存请求
 * @param {*} query 出库即其明细
 */
export function save (query) {
  return request({
    url: '/stock-out/save',
    method: 'post',
    data: query
  })
}

/**
 * 提交请求，即：将保存状态变更为待审核状态checkState
 * @param {*} query 提交vo
 */
export function submit (id) {
  return request({
    url: '/stock-out/submit',
    method: 'put',
    params: { id: id }
  })
}

/* 出库审核相关 */

export function check (query) {
  return request({
    url: '/stock-out/check',
    method: 'post',
    data: query
  })
}

// /* sms 相关 */
// export function getSmsList (query) {
//   return request({
//     url: '/sms/list',
//     method: 'post',
//     data: query
//   })
// }
// export function updateSmsStatus (sms) {
//   return request({
//     url: '/sms/updateStatus',
//     method: 'put',
//     data: sms
//   })
// }
// export function getBill (query) {
//   return request({
//     url: '/sms/getBill',
//     method: 'get',
//     params: { tel: query.tel, verifyCode: query.verifyCode }
//   })
// }
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
