import request from '@/utils/request'

// 项目管理
export function getProjectListByPage (data) {
  return request({
    url: '/item/listByPage',
    method: 'post',
    data: data
  })
}

export function getSubjectTree () {
  return request({
    url: '/item/getItemTree',
    method: 'get'
  })
}

export function getIncomSortName (data) {
  return request({
    url: '/item/getIncomSortName',
    method: 'get',
    params: { 'code': data }
  })
}

export function getBySubjectId (data) {
  return request({
    url: '/incomeSort/getBySubjectId',
    method: 'get',
    params: { 'subjectId': data }
  })
}

export function addProject (data) {
  return request({
    url: '/item/save',
    method: 'post',
    data: data
  })
}

export function updateProject (user) {
  return request({
    url: '/item/update',
    method: 'post',
    data: user
  })
}

export function deleteProject (data) {
  return request({
    url: '/item/delete',
    method: 'post',
    data: { id: data }
  })
}

export function deleteProjectBatch (data) {
  return request({
    url: '/item/batchDelete',
    method: 'post',
    data: data
  })
}

export function projectCheck (data) {
  return request({
    url: '/item/batchVerify',
    method: 'post',
    data: data
  })
}

export function importExcel (data) {
  return request({
    url: '/item/import',
    method: 'post',
    data: data
  })
}

// 项目标准
export function getStdListByPage (data) {
  return request({
    url: '/itemstd/listByPage',
    method: 'post',
    data: data
  })
}

export function getItemStd (data) {
  return request({
    url: '/itemstd/getItemStd',
    method: 'post',
    data: { itemCode: data }
  })
}

export function addStd (data) {
  return request({
    url: '/itemstd/save',
    method: 'post',
    data: data
  })
}

export function updateStd (user) {
  return request({
    url: '/itemstd/update',
    method: 'post',
    data: user
  })
}

export function deleteStd (data) {
  return request({
    url: '/itemstd/delete',
    method: 'post',
    data: { id: data }
  })
}

export function deleteStdBatch (data) {
  return request({
    url: '/itemstd/batchDelete',
    method: 'post',
    data: data
  })
}

export function projectStdCheck (data) {
  return request({
    url: '/itemstd/batchVerify',
    method: 'post',
    data: data
  })
}

// 项目管理
export function getGroupListByPage (data) {
  return request({
    url: '/group/listByPage',
    method: 'post',
    data: data
  })
}
export function addGroup (data) {
  return request({
    url: '/group/save',
    method: 'post',
    data: data
  })
}

export function deleteGroup (data) {
  return request({
    url: '/group/delete',
    method: 'post',
    data: { id: data }
  })
}

export function getItemList (data) {
  return request({
    url: '/groupItem/getItemInfo',
    method: 'post',
    data: { groupCode: data }
  })
}

export function deleteItemFromGroup (data) {
  return request({
    url: '/groupItem/delete',
    method: 'post',
    data: data
  })
}
