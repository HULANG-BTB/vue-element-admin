import request from '@/utils/request'

// 准购证管理
export function getCrtListByPage (data) {
  return request({
    url: '/crt/listByPage',
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
    url: '/crt/checkListByPage',
    method: 'post',
    data: data
  })
}

export function addCrt (data) {
  return request({
    url: `/crt/save`,
    method: 'post',
    data: data
  })
}

export function updateCrt (data) {
  return request({
    url: `/crt/update`,
    method: 'post',
    data: data
  })
}

export function checkBatch (data) {
  return request({
    url: `/crt/checkBatch`,
    method: 'post',
    data: data
  })
}

export function deleteCrt (data) {
  return request({
    url: '/crt/remove',
    method: 'post',
    data: { id: data }
  })
}

export function deleteCrtBatch (data) {
  return request({
    url: `/crt/removeBatch`,
    method: 'post',
    data: data
  })
}

export function listCrt () {
  return request({
    url: `/crt/listAll`,
    method: 'get'
  })
}

export function getAgenName () {
  return request({
    url: '/agen/listAll',
    method: 'get'
  })
}

export function getCrtById (data) {
  return request({
    url: `/crt/getById`,
    method: 'post',
    data: { id: data }
  })
}
