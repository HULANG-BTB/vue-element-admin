import request from '@/utils/request'

// const BASE_URL = 'http://192.168.21.182:8080/stock-out/'
// const BASE_URL = 'http://47.97.155.84/prod-api/stock-out/'
// 120.27.3.74
const BASE_URL = 'finan-stock-management/'
// const BASE_URL = 'http://120.27.3.74:8085/'

/* 票据相关 */

/**
 * 获取票据代码可用的票号段
 * @param {*} billPrecode 票据代码
 */
export function getValid (billPrecode) {
  return request({
    url: BASE_URL + 'finan-bill/getValid',
    method: 'get',
    params: { billPrecode: billPrecode }
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
