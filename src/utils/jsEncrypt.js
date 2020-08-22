/*
 * @Author: Jianbinbing
 * @since: Do not edit
 * @lastTime: 2020-08-16 23:42:58
 * @LastEditors: Jianbinbing
 * @Description:
 */

import JsEncrypt from 'jsencrypt/bin/jsencrypt'

/**
 * 生成rsa密钥对，并去除头尾
 * @returns {*}
 */
export function getRSAKey () {
  var jse = new JsEncrypt({
    default_key_size: 1024
  })
  // 公钥
  let publicKey = jse.getPublicKey()
  // 私钥
  let privateKey = jse.getPrivateKey()
  publicKey = getNewKey(publicKey)
  privateKey = getNewKey(privateKey)
  localStorage.setItem('privateKey', privateKey)
  return publicKey
}

/**
 *  rsa加密
 * @param pas
 * @returns {*}
 * @constructor
 */
export function RSAencrypt (pas) {
  var jse = new JsEncrypt()
  jse.setPublicKey(localStorage.getItem('publicKey'))
  return jse.encrypt(pas)
}

/**
 *  rsa解密
 * @param pas
 * @returns {*}
 * @constructor
 */
export function RSAdencrypt (pas) {
  var jse = new JsEncrypt()
  jse.setPrivateKey(localStorage.getItem('privateKey'))
  return jse.decrypt(pas)
}

/**
 * 去除头尾
 * @param data
 * @returns {*}
 */
export function getNewKey (data) {
  data = data.replace(/\n/g, '')
  data = data.replace('-----BEGIN PUBLIC KEY-----', '')
  data = data.replace('-----END PUBLIC KEY-----', '')
  return data
}
