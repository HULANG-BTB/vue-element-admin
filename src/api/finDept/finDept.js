/*
 * @Author: Raiz
 * @since: Do not edit
 * @lastTime: 2020-08-09 23:42:58
 * @LastEditors: Raiz
 * @Description:
 */
import request from '@/utils/request'

const baseUrl = '/base/fabFinDept/'

export function queryFinDept (data) {
  return request({
    url: baseUrl + 'list',
    method: 'post',
    data
  })
}

export function queryRngCode () {
  return request({
    url: '/base/region/category',
    method: 'get'
  })
}

export function saveFinDept (data) {
  return request({
    url: baseUrl + 'save',
    method: 'post',
    data
  })
}

export function deleteById (data) {
  return request({
    url: baseUrl + 'delete' + '/' + data,
    method: 'delete'
  })
}

