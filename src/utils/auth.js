import Cookies from 'js-cookie'
import Config from '@/settings'

const TokenKey = Config.auth.tokenKey

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token, remember) {
  if (remember) {
    return Cookies.set(TokenKey, token, { expires: Config.auth.tokenExpires })
  } else {
    return Cookies.set(TokenKey, token)
  }
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}
