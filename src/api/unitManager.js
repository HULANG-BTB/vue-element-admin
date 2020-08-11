import request from '@/utils/request'
// 主管部门管理
export function getDapartListByPage (data) {
  return request({
    url: '/fabDept/listByPage',
    method: 'post',
    data: data
  })
}

export function addDapart (data) {
  return request({
    url: `/fabDept/save`,
    method: 'post',
    data: data
  })
}

export function updateDapart (user) {
  return request({
    url: '/fabDept/update',
    method: 'post',
    data: user
  })
}

export function deleteDapart (data) {
  return request({
    url: `/fabDept/remove`,
    method: 'post',
    data: { id: data }
  })
}

export function deleteDapartBatch (data) {
  return request({
    url: `/fabDept/removeBatch`,
    method: 'post',
    data: data
  })
}

// 单位管理
export function getUnitListByPage (data) {
  return request({
    url: '/fabAgen/listByPage',
    method: 'post',
    data: data
  })
}

export function addUnit (data) {
  return request({
    url: `/fabAgen/save`,
    method: 'post',
    data: data
  })
}

export function updateUnit (user) {
  return request({
    url: '/fabAgen/update',
    method: 'post',
    data: user
  })
}

export function deleteUnit (data) {
  return request({
    url: `/fabAgen/remove`,
    method: 'post',
    data: { id: data }
  })
}

export function deleteUnitBatch (data) {
  return request({
    url: `/fabAgen/removeBatch`,
    method: 'post',
    data: data
  })
}
