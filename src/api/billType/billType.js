/*
 * @Author: Raiz
 * @since: Do not edit
 * @lastTime: 2020-08-19 14:58:40
 * @LastEditors: Raiz
 * @Description:
 */
import request from '@/utils/request'

const baseUrl = '/billType/'

export function queryBillTypeTree (data) {
  return request({
    url: baseUrl + 'queryBillTypeTree',
    method: 'get',
    data
  })
}

export function queryByCondition (data) {
  return request({
    url: baseUrl + 'queryByCondition',
    method: 'post',
    data
  })
}

export function queryAllBillSort () {
  return request({
    url: baseUrl + 'queryAllBillSort',
    method: 'get'
  })
}

export function add (data) {
  return request({
    url: baseUrl + 'add',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: baseUrl + 'update',
    method: 'put',
    data
  })
}

export function deleteBillTypeRequest (data) {
  return request({
    url: baseUrl + 'delete',
    method: 'delete',
    data
  })
}
