import request from '@/utils/request'

const BASE_URL = 'http://localhost:8080'

/**
 * 查询所有数据
 * @param {*} query
 */
export function getStockReturnList (query) {
  return request({
    url: '/stock-return-po/getListStockReturnPage',
    method: 'post',
    data: query
  })
}

/**
 * 根据日期或者业务单号查询
 * @param {} query
 */
export function getListStockReturnByDateOrNo (query) {
  return request({
    url: '/stock-return-po/getListStockReturnByDateOrNo1',
    method: 'post',
    // params: { no: query.no, startTime: query.startTime, endTime: query.endTime }
    // params: query
    data: query
  })
}

/**
 * 新增退票信息
 * @param {} Stockreturn
 */
export function addStockReturn (Stockreturn) {
  return request({
    url: '/stock-return-po/addStockReturn',
    method: 'post',
    // params: { no: query.no, startTime: query.startTime, endTime: query.endTime }
    // params: query
    data: Stockreturn
  })
}

/**
 * 查询退票明细列表
 * @param {*} Stockreturn
 */
export function getStockReturnItems (Stockreturn) {
  return request({
    url: '/stock-return-po/getStockReturnByNo',
    // url: '/mail/updateStatus',
    method: 'post',
    data: Stockreturn
  })
}

/**
 * 删除单条信息
 * @param {*} Stockreturn
 */
export function deleteStockReturnByNo (Stockreturn) {
  return request({
    url: '/stock-return-po/deleteByNo',
    method: 'get',
    params: { no: Stockreturn.no }
  })
}

/**
 * 更新退票业务
 * @param {*} Stockreturn
 */
export function updateByNo (Stockreturn) {
  return request({
    url: '/stock-return-po/updateByNo',
    method: 'post',
    data: Stockreturn
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
