/*
 * @Author: Raiz
 * @since: Do not edit
 * @lastTime: 2020-08-09 23:42:58
 * @LastEditors: Raiz
 * @Description:
 */
import request from '@/utils/request'

const baseUrl = '/incomeSort/'

export function getIncomeTree (data) {
  return request({
    url: baseUrl + 'getAll',
    method: 'get',
    data
  })
}

export function queryByCondition (data) {
  return request({
    url: baseUrl + 'pageQueryById',
    method: 'post',
    data
  })
}

export function queryAllBillSort () {
  return request({
    url: baseUrl + 'getFirst',
    method: 'post'
  })
}

export function add (data) {
  return request({
    url: baseUrl + 'insert',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: baseUrl + 'update',
    method: 'post',
    data
  })
}

export function deleteBillTypeRequest (data) {
  return request({
    url: baseUrl + 'delete',
    method: 'post',
    data
  })
}
