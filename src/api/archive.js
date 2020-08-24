import request from '@/utils/request'

const BASE_URL = '/ecds-archive'
/**
 * 归档总览信息
 * query 是分页对象
 * agenCode
 * agenName
 */

// 财政首页
export function fetchArchiveInfos (query) {
  return request({
    url: BASE_URL + '/archive/fina/allInfo',
    method: 'post',
    data: query
  })
}

// 根据单位代码，获取单位的详细信息
export function fetchAgenArchiveDetail (query) {
  return request({
    url: BASE_URL + '/archive/unit/info',
    method: 'post',
    data: query
  })
}

// 获取票据领购记录
export function fetchBillApply (query) {
  return request({
    url: BASE_URL + '/archive/apply/info',
    method: 'post',
    data: query
  })
}

// 获取可用票据记录
export function fetchBillAvailable (query) {
  return request({
    url: BASE_URL + '/archive/available/info',
    method: 'post',
    data: query
  })
}

// 获取可用票据记录
export function fetchItemAvailable (query) {
  return request({
    url: BASE_URL + '/archive/item/info',
    method: 'post',
    data: query
  })
}

// 获取票据预警记录
export function fetchBillWarn (query) {
  return request({
    url: BASE_URL + '/archive/warn/info',
    method: 'post',
    data: query
  })
}

// 获取票据审核记录
export function fetchBillCheck (query) {
  return request({
    url: BASE_URL + '/archive/check/info',
    method: 'post',
    data: query
  })
}

// 获取票据缴款记录
export function fetchBillPay (query) {
  return request({
    url: BASE_URL + '/archive/pay/info',
    method: 'post',
    data: query
  })
}

