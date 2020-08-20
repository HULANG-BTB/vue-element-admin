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
export function getRSAKey() {
  var jse = new JsEncrypt({
    default_key_size:1024,
  })
  // 公钥
  let publicKey = jse.getPublicKey()
  // 私钥
  let privateKey = jse.getPrivateKey()
  publicKey=getNewKey(publicKey)
  privateKey=getNewKey(privateKey)
  localStorage.setItem('privateKey',privateKey)
  return publicKey
}

/**
 *  rsa加密
 * @param pas
 * @returns {*}
 * @constructor
 */
export function RSAencrypt(pas) {
  var jse = new JsEncrypt()
  jse.setPublicKey(localStorage.getItem("publicKey"))
  return jse.encrypt(pas)
}

/**
 *  rsa解密
 * @param pas
 * @returns {*}
 * @constructor
 */
export function RSAdencrypt(pas) {
  var jse = new JsEncrypt()
  // let privateKey="MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAJYw5FjT6Cjvg9a9p4Hn+ZCf7fuqJscXPbmWlZy9LpIZ28inRw2OluEw/gVTglG5tTDbXrnoOtlpUXk+W6HPod6HTZl7gbO13W7cDJO/190fgX/7pdqJxfGOk9DJ9FkbQjIW/nhFoRCf8F/PkRZ2CorlGtftc9AORz2xMbDor4iBAgMBAAECgYBtPjDJn5DtPZIivx448jdnh7x9Yj0EcRY3iJ1YPY7DPEXOBEY9SSrbr1wFGcHfmfl+CQI0rQMpIl7dlorl/nWYnUQO/e1CoaQA50m3eYNduLWSWLATp3QvnR3Xx7gGllkK2tWRQSFhWXQpEAzoiddO0Jh6F8Yf6ikjB3j0pBhzcQJBANdsootabg3WfxRa0SiGqCDRAki4f/Mt9OuRtTh7LyU1OgeIC0Zb2fwRTcC2mGVVGweXNpKs6yEIAFny2Fqv9rUCQQCyetL/62D3F3KVokSUXqc0wFayrCfg30Gysq+Wsb/0FkvVWlwZJZGT0m0JSNmuAJH71s2GRpZNlJQ/BRTmtf4dAkEA0dK9C1BcK1xF0LSYTonBzpzlRaF29oxHpv737PiGtg3+5IEMwk4KpurPuangC6r2NdGB1SFZr4WUmgff1YzYlQJAK/aDKNTC0rps2BzbRay3BRBniqVLQWHc3faTt8va23XuggQ68VrGrCHGB+Zw8CJl0yHLCEs01LFHfupyho3HpQJBANbynaGNvQZ985JFlkLbphcD/zlLeyHSEAdR58/4k7Rv1LO0ghBZ2WtN/VkOUrChzkeMvAuMbBccFk8/TN6mXhU=";
  jse.setPrivateKey(localStorage.getItem('privateKey'))
  return jse.decrypt(pas)
}

/**
 * 去除头尾
 * @param data
 * @returns {*}
 */
export function getNewKey(data) {
  data=data.replace(/\n/g,'')
  data = data.replace('-----BEGIN PUBLIC KEY-----','')
  data = data.replace('-----END PUBLIC KEY-----','')
  return data
}
