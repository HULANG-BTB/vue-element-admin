import request from '@/utils/request'

const BASE_URL = 'http://localhost:8081'

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

/**
 * 单位提交退票申请
 * @param {*} Stockreturn
 */
export function putSubmit (Stockreturn) {
  return request({
    url: '/stock-return-po/updateSubmitStatus',
    method: 'put',
    params: { no: Stockreturn.no }
  })
}

/**
 * 财政端审核退票申请（获取已提交的退票列表信息）
 * @param {*} query
 */
export function getFinanStockReturnList (query) {
  return request({
    url: BASE_URL + '/finan-stock-return-po/getListStockReturnByDate',
    method: 'post',
    data: query
  })
}

/**
 * 财政端审核退票申请（获取已提交的退票详细信息）
 */
export function getFinanStockReturnItems (query) {
  return request({
    url: BASE_URL + '/finan-stock-return-po/getStockReturnByNo',
    method: 'post',
    data: query
  })
}

/**
 * 财政端审核退票（审核是否通过退票申请）
 */
export function getCheckStateByNo (query) {
  return request({
    url: BASE_URL + '/finan-stock-return-po/CheckStatusByNo',
    method: 'post',
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
