/*
 * @Author: Jianbinbing
 * @since: Do not edit
 * @lastTime: 2020-08-09 23:42:58
 * @LastEditors: Jianbinbing
 * @Description:
 */
import request from '@/utils/request';
import {Decrypt,Encrypt,GetKey} from "@/utils/cryptoJS";
import {RSAencrypt,RSAdencrypt,getRSAKey} from "@/utils/jsEncrypt";
import {getEncryptedJson} from "@/utils/data"


const baseUrl = '/incomeSort/'

export function getRSAPublicKey(){
  return request({
    url: baseUrl + 'getRSAPublicKey',
    method: 'get',
  })
}

export function getIncomeTree (data) {
  return request({
    url: baseUrl + 'getAll',
    method: 'get',
    data
  })
}

export function queryByCondition (data) {
  //数据加密
  data=getEncryptedJson(data)
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
  //数据加密
  data=getEncryptedJson(data)
  return request({
    url: baseUrl + 'insert',
    method: 'post',
    data
  })
}

export function update (data) {
//数据加密
  data=getEncryptedJson(data)
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
