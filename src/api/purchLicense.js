import request from '@/utils/request'

// 准购证管理
export function getCrtListByPage (data) {
  return request({
    url: '/crt/listByPage',
    method: 'post',
    data: data
  })
}

// 获取准购证审核列表
export function checkCrtListByPage (data) {
  return request({
    url: '/crt/checkListByPage',
    method: 'post',
    data: data
  })
}

// 新增准购证
export function addCrt (data) {
  return request({
    url: `/crt/save`,
    method: 'post',
    data: data
  })
}

// 修改准购证
export function updateCrt (data) {
  return request({
    url: `/crt/update`,
    method: 'post',
    data: data
  })
}

// 批量审核准购证
export function checkBatch (data) {
  return request({
    url: `/crt/checkBatch`,
    method: 'post',
    data: data
  })
}

// 删除准购证
export function deleteCrt (data) {
  return request({
    url: '/crt/remove',
    method: 'post',
    data: { id: data }
  })
}

// 批量删除准购证
export function deleteCrtBatch (data) {
  return request({
    url: `/crt/removeBatch`,
    method: 'post',
    data: data
  })
}

// 获取准购证列表
export function listCrt () {
  return request({
    url: `/crt/listAll`,
    method: 'get'
  })
}

// 通过单位名称获取准购证
export function getAgenName () {
  return request({
    url: '/agen/listAll',
    method: 'get'
  })
}

// 通过准购证id获取准购证
export function getCrtById (data) {
  return request({
    url: `/crt/getById`,
    method: 'post',
    data: { id: data }
  })
}
