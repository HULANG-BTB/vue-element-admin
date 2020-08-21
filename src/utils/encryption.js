/*
 * @Author: Jianbinbing
 * @since: Do not edit
 * @lastTime: 2020-08-16 23:42:58
 * @LastEditors: Jianbinbing
 * @Description:
 */

import request from '@/utils/request'
import { RSAencrypt, RSAdencrypt, getRSAKey } from '@/utils/jsEncrypt'
import { getEncryptedJson } from '@/utils/data'

const baseUrl = '/base/encryption/'

/**
 * 获取后端公钥
 * @param data
 */
export function getRSAPublicKey (data) {
  return request({
    url: baseUrl + 'getRSAPublicKey',
    method: 'get'
  })
}

/**
 * 发送前端公钥
 * @param data
 */
export function addRSAPublicKey (data) {
  // 获取前端公钥
  const key = getRSAKey()
  data = {
    'publicKey': key
  }
  // 用后端公钥加密
  data = getEncryptedJson(data)
  return request({
    url: baseUrl + 'addRSAPublicKey',
    method: 'post',
    data
  })
}

