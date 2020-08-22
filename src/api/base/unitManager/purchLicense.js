import request from '@/utils/request'

const BASE_URL = '/base'

// 准购证管理
export function getCrtListByPage (data) {
  return request({
    url: `${BASE_URL}/crt/listByPage`,
    method: 'post',
    data: data
  })
}
// 根据单位编码查询领购证
export function getCrtByAgenCode (data) {
  return request({
    url: '/crt/getByAgenCode',
    method: 'post',
    data: data
  })
}

export function checkCrtListByPage (data) {
  return request({
    url: `${BASE_URL}/crt/checkListByPage`,
    method: 'post',
    data: data
  })
}

export function addCrt (data) {
  return request({
    url: `${BASE_URL}/crt/save`,
    method: 'post',
    data: data
  })
}

export function updateCrt (data) {
  return request({
    url: `${BASE_URL}/crt/update`,
    method: 'post',
    data: data
  })
}

export function checkBatch (data) {
  return request({
    url: `${BASE_URL}/crt/checkBatch`,
    method: 'post',
    data: data
  })
}

export function deleteCrt (data) {
  return request({
    url: `${BASE_URL}/crt/remove`,
    method: 'post',
    data: { id: data }
  })
}

export function deleteCrtBatch (data) {
  return request({
    url: `${BASE_URL}/crt/removeBatch`,
    method: 'post',
    data: data
  })
}

export function listCrt () {
  return request({
    url: `${BASE_URL}/crt/listAll`,
    method: 'get'
  })
}

export function getAgenName () {
  return request({
    url: `${BASE_URL}/agen/listAll`,
    method: 'get'
  })
}

export function getCrtById (data) {
  return request({
    url: `${BASE_URL}/crt/getById`,
    method: 'post',
    data: { id: data }
  })
}
