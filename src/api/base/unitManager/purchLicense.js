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
    url: `${BASE_URL}/crt/getByAgenCode`,
    method: 'post',
    data: data
  })
}

// 获取准购证审核列表
export function checkCrtListByPage (data) {
  return request({
    url: `${BASE_URL}/crt/checkListByPage`,
    method: 'post',
    data: data
  })
}

// 新增准购证
export function addCrt (data) {
  return request({
    url: `${BASE_URL}/crt/save`,
    method: 'post',
    data: data
  })
}

// 修改准购证
export function updateCrt (data) {
  return request({
    url: `${BASE_URL}/crt/update`,
    method: 'post',
    data: data
  })
}

// 批量审核准购证
export function checkBatch (data) {
  return request({
    url: `${BASE_URL}/crt/checkBatch`,
    method: 'post',
    data: data
  })
}

// 删除准购证
export function deleteCrt (data) {
  return request({
    url: `${BASE_URL}/crt/remove`,
    method: 'post',
    data: { id: data }
  })
}

// 批量删除准购证
export function deleteCrtBatch (data) {
  return request({
    url: `${BASE_URL}/crt/removeBatch`,
    method: 'post',
    data: data
  })
}

// 获取准购证列表
export function listCrt () {
  return request({
    url: `${BASE_URL}/crt/listAll`,
    method: 'get'
  })
}

// 通过单位名称获取准购证
export function getAgenName () {
  return request({
    url: `${BASE_URL}/agen/listAll`,
    method: 'get'
  })
}

// 通过准购证id获取准购证
export function getCrtById (data) {
  return request({
    url: `${BASE_URL}/crt/getById`,
    method: 'post',
    data: { id: data }
  })
}
