import request from '@/utils/request'
// 主管部门管理
export function getDapartListAll (data) {
  return request({
    url: '/dept/listAll',
    method: 'get',
    data: data
  })
}

export function getDapartListByPage (data) {
  return request({
    url: '/dept/listByPage',
    method: 'post',
    data: data
  })
}

export function addDapart (data) {
  return request({
    url: `/dept/save`,
    method: 'post',
    data: data
  })
}

export function updateDapart (user) {
  return request({
    url: '/dept/update',
    method: 'post',
    data: user
  })
}

export function deleteDapart (data) {
  return request({
    url: `/dept/remove`,
    method: 'post',
    data: { id: data }
  })
}

export function deleteDapartBatch (data) {
  return request({
    url: `/dept/removeBatch`,
    method: 'post',
    data: data
  })
}

// 单位管理
export function getUnitListByPage (data) {
  return request({
    url: '/agen/listByPage',
    method: 'post',
    data: data
  })
}

export function getUnitList () {
  return request({
    url: '/agen/listAll',
    method: 'get'
  })
}

export function addUnit (data) {
  return request({
    url: `/agen/save`,
    method: 'post',
    data: data
  })
}

export function updateUnit (user) {
  return request({
    url: '/agen/update',
    method: 'post',
    data: user
  })
}

export function deleteUnit (data) {
  return request({
    url: `/agen/remove`,
    method: 'post',
    data: { id: data }
  })
}

export function deleteUnitBatch (data) {
  return request({
    url: `/agen/removeBatch`,
    method: 'post',
    data: data
  })
}
