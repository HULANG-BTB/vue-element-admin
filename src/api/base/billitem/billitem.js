/*
 * @Author: Raiz
 * @since: Do not edit
 * @lastTime: 2020-08-09 23:42:58
 * @LastEditors: Raiz
 * @Description:
 */
import request from '@/utils/request'

const baseUrl = '/itembill/'
const treebaseUrl = '/billType/'
export function queryBillTypeTree (data) {
  return request({
    url: treebaseUrl + 'queryBillTypeTree',
    method: 'post',
    data
  })
}
//查询与票据无关联的项目
export function  queryItemByCondition(data){
  return request({
    url: baseUrl + 'getnocontactitem',
    method: 'post',
    data
  })
}
//查询与票据有关联的项目
export function queryByCondition (data) {
  return request({
    url: baseUrl + 'getitemwithbillcode',
    method: 'post',
    data
  })
}
//添加或批量添加关联
export function addBillItem (data) {
  return request({
    url: baseUrl + 'insertbatch',
    method: 'post',
    data
  })
}


export function turnenabled (data) {
  return request({
    url: baseUrl + 'turnenabled',
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
//删除票据项目关系
export function deleteItemBillRequest (data) {
  return request({
    url: baseUrl + 'delete',
    method: 'post',
    data
  })
}
