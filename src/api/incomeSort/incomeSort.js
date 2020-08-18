/*
 * @Author: Jianbinbing
 * @since: Do not edit
 * @lastTime: 2020-08-09 23:42:58
 * @LastEditors: Jianbinbing
 * @Description:
 */
import request from '@/utils/request';
import {Decrypt,Encrypt} from "@/api/incomeSort/cryptoJS";


const baseUrl = '/incomeSort/'

export function getIncomeTree (data) {
  return request({
    url: baseUrl + 'getAll',
    method: 'get',
    data
  })
}

export function queryByCondition (data) {
  // console.log("加密测试")
  // data=Encrypt(JSON.stringify(data));
  return request({
    url: baseUrl + 'pageQueryById',
    method: 'post',
    data
    // data:{
    //   data:data,
    //   aesKey:"1",
    //   publicKey:"233"
    // }
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
