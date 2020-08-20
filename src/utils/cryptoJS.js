/*
 * @Author: Jianbinbing
 * @since: Do not edit
 * @lastTime: 2020-08-16 23:42:58
 * @LastEditors: Jianbinbing
 * @Description:
 */

import CryptoJS from 'crypto-js/crypto-js'

/**
 * AES加密 ：字符串 key iv  返回base64
 */
export function Encrypt (word, key) {
  const srcs = CryptoJS.enc.Utf8.parse(word)
  key = CryptoJS.enc.Utf8.parse(key) // 十六位十六进制数作为密钥
  var encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
}

/**
 * AES 解密 ：字符串 key iv  返回base64
 *
 */
export function Decrypt (word, key) {
  key = CryptoJS.enc.Utf8.parse(key) // 十六位十六进制数作为密钥

  const base64 = CryptoJS.enc.Base64.parse(word)
  const src = CryptoJS.enc.Base64.stringify(base64)

  var decrypt = CryptoJS.AES.decrypt(src, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
  return decryptedStr.toString()
}

/**
 * 生成16位密钥
 */
export function GetKey (len) {
  len = len || 32
  const random = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let str = ''
  for (let i = 0; i < len; i++) {
    str = str + random.charAt(Math.random() * random.length)
  }
  return str
}
