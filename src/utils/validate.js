/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal (path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 验证是日期选择器
 *
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 * @param {*} source
 * @param {*} option
 * @param {*} other
 */
export function validateDatePicker (rule, value, callback, source, option, other) {
  const thisZero = new Date().setHours(0, 0, 0, 0)
  const input = new Date(value).setHours(0, 0, 0, 0)
  if (input < thisZero) {
    callback(new Error('日期不能在今天之前'))
  }
  if (other) {
    const otherDate = new Date(other).setHours(0, 0, 0, 0)
    if (otherDate > input) {
      callback(new Error('当前日期不能在开始日期之前'))
    }
  }
  callback()
}

export function validatePhoneNumber (rule, value, callback) {
  if (value.length !== 11) {
    callback(new Error('手机号码长度不正确!'))
  } else if (!(/^1[3456789]\d{9}$/.test(value))) {
    callback(new Error('手机号码格式错误!'))
  } else {
    callback()
  }
}
