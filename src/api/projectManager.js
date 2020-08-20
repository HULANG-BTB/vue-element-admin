import request from '@/utils/request'

const BASE_URL = '/base'

// 项目管理
export function getProjectListByPage (data) {
  return request({
    url: `${BASE_URL}/item/listByPage`,
    method: 'post',
    data: data
  })
}

export function getSubjectTree () {
  return request({
    url: `${BASE_URL}/item/getItemTree`,
    method: 'get'
  })
}

export function getIncomSortName (data) {
  return request({
    url: `${BASE_URL}/item/getIncomSortName`,
    method: 'get',
    params: { 'code': data }
  })
}

export function getBySubjectId (data) {
  return request({
    url: `${BASE_URL}/incomeSort/getBySubjectId`,
    method: 'get',
    params: { 'subjectId': data }
  })
}

export function addProject (data) {
  return request({
    url: `${BASE_URL}/item/save`,
    method: 'post',
    data: data
  })
}

export function updateProject (user) {
  return request({
    url: `${BASE_URL}/item/update`,
    method: 'post',
    data: user
  })
}

export function deleteProject (data) {
  return request({
    url: `${BASE_URL}/item/delete`,
    method: 'post',
    data: { id: data }
  })
}

export function deleteProjectBatch (data) {
  return request({
    url: `${BASE_URL}/item/batchDelete`,
    method: 'post',
    data: data
  })
}

export function projectCheck (data) {
  return request({
    url: `${BASE_URL}/item/batchVerify`,
    method: 'post',
    data: data
  })
}

export function importExcel (data) {
  return request({
    url: `${BASE_URL}/item/import`,
    method: 'post',
    data: data
  })
}

// 项目标准
export function getStdListByPage (data) {
  return request({
    url: `${BASE_URL}/itemstd/listByPage`,
    method: 'post',
    data: data
  })
}

export function getItemStd (data) {
  return request({
    url: `${BASE_URL}/itemstd/getItemStd`,
    method: 'post',
    data: { itemCode: data }
  })
}

export function addStd (data) {
  return request({
    url: `${BASE_URL}/itemstd/save`,
    method: 'post',
    data: data
  })
}

export function updateStd (user) {
  return request({
    url: `${BASE_URL}/itemstd/update`,
    method: 'post',
    data: user
  })
}

export function deleteStd (data) {
  return request({
    url: `${BASE_URL}/itemstd/delete`,
    method: 'post',
    data: { id: data }
  })
}

export function deleteStdBatch (data) {
  return request({
    url: `${BASE_URL}/itemstd/batchDelete`,
    method: 'post',
    data: data
  })
}

export function projectStdCheck (data) {
  return request({
    url: `${BASE_URL}/itemstd/batchVerify`,
    method: 'post',
    data: data
  })
}

// 项目管理
export function getGroupListByPage (data) {
  return request({
    url: `${BASE_URL}/group/listByPage`,
    method: 'post',
    data: data
  })
}
export function addGroup (data) {
  return request({
    url: `${BASE_URL}/group/save`,
    method: 'post',
    data: data
  })
}

export function deleteGroup (data) {
  return request({
    url: `${BASE_URL}/group/delete`,
    method: 'post',
    data: { id: data }
  })
}

export function getItemList (data) {
  return request({
    url: `${BASE_URL}/groupItem/getItemInfo`,
    method: 'post',
    data: { groupCode: data }
  })
}

export function deleteItemFromGroup (data) {
  return request({
    url: `${BASE_URL}/groupItem/delete`,
    method: 'post',
    data: data
  })
}
