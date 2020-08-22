import request from '@/utils/request'

const BASE_URL = 'http://192.168.21.182:8080/out-change/'

/* 出库相关 */

/**
 * 获得出库列表
 * @param {*} query 出库vo，包含编制人，审核状态等信息
 */
export function getAll (query) {
  return request({
    url: BASE_URL + 'showAll',
    method: 'post',
    data: query
  })
}

/**
 * 删除多选
 */
export function deleteAll (query) {
  return request({
    url: BASE_URL + 'deleteAll',
    method: 'put',
    data: query
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
