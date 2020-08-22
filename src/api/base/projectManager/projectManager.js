import download from '@/utils/download'
import request from '@/utils/request'

const BASE_URL = '/base'

// 项目管理查询列表
export function getProjectListByPage (data) {
  return request({
    url: `${BASE_URL}/item/listByPage`,
    method: 'post',
    data: data
  })
}
// 树形菜单列表
export function getSubjectTree () {
  return request({
    url: `${BASE_URL}/item/getItemTree`,
    method: 'get'
  })
}
// 树形菜单列表
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
// 新增项目
export function addProject (data) {
  return request({
    url: `${BASE_URL}/item/save`,
    method: 'post',
    data: data
  })
}
// 修改项目
export function updateProject (user) {
  return request({
    url: `${BASE_URL}/item/update`,
    method: 'post',
    data: user
  })
}
// 删除项目
export function deleteProject (data) {
  return request({
    url: `${BASE_URL}/item/delete`,
    method: 'post',
    data: { id: data }
  })
}
// 批量删除项目
export function deleteProjectBatch (data) {
  return request({
    url: `${BASE_URL}/item/batchDelete`,
    method: 'post',
    data: data
  })
}
// 项目审核
export function projectCheck (data) {
  return request({
    url: `${BASE_URL}/item/batchVerify`,
    method: 'post',
    data: data
  })
}
// 导入
export function importExcel (data) {
  return request({
    url: `${BASE_URL}/item/import`,
    method: 'post',
    data: data
  })
}
// 导出
export function exportExcel (data) {
  return download({
    url: '/item/export',
    method: 'post',
    data: data
  })
}

// 项目标准列表
export function getStdListByPage (data) {
  return request({
    url: `${BASE_URL}/itemstd/listByPage`,
    method: 'post',
    data: data
  })
}
// 项目标准
export function getItemStd (data) {
  return request({
    url: `${BASE_URL}/itemstd/getItemStd`,
    method: 'post',
    data: { itemCode: data }
  })
}
// 新增标准
export function addStd (data) {
  return request({
    url: `${BASE_URL}/itemstd/save`,
    method: 'post',
    data: data
  })
}
// 修改标准
export function updateStd (user) {
  return request({
    url: `${BASE_URL}/itemstd/update`,
    method: 'post',
    data: user
  })
}
// 删除标准
export function deleteStd (data) {
  return request({
    url: `${BASE_URL}/itemstd/delete`,
    method: 'post',
    data: { id: data }
  })
}
// 批量删除标准
export function deleteStdBatch (data) {
  return request({
    url: `${BASE_URL}/itemstd/batchDelete`,
    method: 'post',
    data: data
  })
}
// 标准审核
export function projectStdCheck (data) {
  return request({
    url: `${BASE_URL}/itemstd/batchVerify`,
    method: 'post',
    data: data
  })
}

// 项目分组列表
export function getGroupListByPage (data) {
  return request({
    url: `${BASE_URL}/group/listByPage`,
    method: 'post',
    data: data
  })
}
// 新增分组
export function addGroup (data) {
  return request({
    url: `${BASE_URL}/group/save`,
    method: 'post',
    data: data
  })
}
// 删除分组
export function deleteGroup (data) {
  return request({
    url: `${BASE_URL}/group/delete`,
    method: 'post',
    data: { id: data }
  })
}
// 通过分组编码获得项目信息
export function getItemList (data) {
  return request({
    url: `${BASE_URL}/groupItem/getItemInfo`,
    method: 'post',
    data: { groupCode: data }
  })
}
// 删除项目分组关系
export function deleteItemFromGroup (data) {
  return request({
    url: `${BASE_URL}/groupItem/delete`,
    method: 'post',
    data: data
  })
}
