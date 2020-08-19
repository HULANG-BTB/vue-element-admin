/*
 * @Author: Jianbinbing
 * @since: Do not edit
 * @lastTime: 2020-08-09 23:42:58
 * @LastEditors: Jianbinbing
 * @Description:
 */
import request from '@/utils/request';
import {Decrypt,Encrypt,GetKey} from "@/api/common/cryptoJS";
import {RSAencrypt,RSAdencrypt,getRSAKey} from "@/api/common/jsEncrypt";
import {getEncryptedJson} from "@/api/common/data"


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
