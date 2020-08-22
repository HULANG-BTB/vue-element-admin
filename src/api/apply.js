import request from '@/utils/request'

/* apply相关 */
export function getApplyList (query) {
  return request({
    url: 'fbeStockFinanceapply/getAll',
    method: 'get',
    data: query
  })
}

export function deleteApply (applyId) {
  return request({
    url: 'fbeStockFinanceapply',
    method: 'delete',
    params: { id: applyId }
  })
}

export function getItemList (rowId) {
  return request({
    url: '/fbeStockFinanceapply/items',
    method: 'get',
    params: { id: rowId }
  })
}

export function deleteItemById (itemId) {
  return request({
    url: 'fbeStockFinanceapplyItem',
    method: 'delete',
    params: { id: itemId }
  })
}

export function saveItem (item) {
  return request({
    url: 'fbeStockFinanceapplyItem',
    method: 'post',
    params: item
  })
}

export function updateItem (item) {
  return request({
    url: 'fbeStockFinanceapplyItem',
    method: 'put',
    params: item
  })
}

export function submitApply (apply) {
  return request({
    url: 'fbeStockFinanceapply/submit',
    method: 'put',
    params: apply
  })
}

export function createApply (apply) {
  return request({
    url: 'fbeStockFinanceapply',
    method: 'post',
    params: apply
  })
}

export function getApplyCheckList (query) {
  return request({
    url: 'fbeStockFinanceapplyCheck/getAll',
    method: 'get',
    data: query
  })
}

export function passApply (applyId, changeSitu) {
  return request({
    url: 'fbeStockFinanceapplyCheck/pass',
    method: 'put',
    params: {
      id: applyId,
      changeSitu: changeSitu
    }
  })
}

export function returnApply (applyId, changeSitu) {
  return request({
    url: 'fbeStockFinanceapplyCheck/return',
    method: 'put',
    params: {
      id: applyId,
      changeSitu: changeSitu
    }
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
