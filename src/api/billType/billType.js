/*
 * @Author: Raiz
 * @since: Do not edit
 * @lastTime: 2020-08-09 23:42:58
 * @LastEditors: Raiz
 * @Description:
 */
import request from '@/utils/request'

const baseUrl = '/billType/'

export function queryBillTypeTree (data) {
  return request({
    url: baseUrl + 'queryBillTypeTree',
    method: 'post',
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
    method: 'post'
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
