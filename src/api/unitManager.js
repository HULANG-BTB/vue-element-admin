import request from '@/utils/request'

const BASE_URL = '/base'

// 主管部门管理
export function getDapartListAll (data) {
  return request({
    url: `${BASE_URL}/dept/listAll`,
    method: 'get',
    data: data
  })
}

export function getDapartListByPage (data) {
  return request({
    url: `${BASE_URL}/dept/listByPage`,
    method: 'post',
    data: data
  })
}

export function addDapart (data) {
  return request({
    url: `${BASE_URL}/dept/save`,
    method: 'post',
    data: data
  })
}

export function updateDapart (user) {
  return request({
    url: `${BASE_URL}/dept/update`,
    method: 'post',
    data: user
  })
}

export function deleteDapart (data) {
  return request({
    url: `${BASE_URL}/dept/remove`,
    method: 'post',
    data: { id: data }
  })
}

export function deleteDapartBatch (data) {
  return request({
    url: `${BASE_URL}/dept/removeBatch`,
    method: 'post',
    data: data
  })
}

// 单位管理
export function getUnitListByPage (data) {
  return request({
    url: `${BASE_URL}/agen/listByPage`,
    method: 'post',
    data: data
  })
}

export function getCheckList (data) {
  return request({
    url: `${BASE_URL}/agen/checkListByPage`,
    method: 'post',
    data: data
  })
}

export function getCheckBatch (data) {
  return request({
    url: `${BASE_URL}/agen/checkBatch`,
    method: 'post',
    data: data
  })
}

export function getUnitList () {
  return request({
    url: `${BASE_URL}/agen/listAll`,
    method: 'get'
  })
}

export function addUnit (data) {
  return request({
    url: `${BASE_URL}/agen/save`,
    method: 'post',
    data: data
  })
}

export function updateUnit (user) {
  return request({
    url: `${BASE_URL}/agen/update`,
    method: 'post',
    data: user
  })
}

export function deleteUnit (data) {
  return request({
    url: `${BASE_URL}/agen/remove`,
    method: 'post',
    data: { id: data }
  })
}

export function deleteUnitBatch (data) {
  return request({
    url: `${BASE_URL}/agen/removeBatch`,
    method: 'post',
    data: data
  })
}

// 获取单位已经有的票据种类
export function getAgenBillType (data) {
  return request({
    url: `${BASE_URL}/agenBill/getBillAll`,
    method: 'post',
    data
  })
}

// 查询所有票据种类
export function getBillAllType () {
  return request({
    url: `${BASE_URL}/billType/queryAllBillType`,
    method: 'post'
  })
}

// 批量添加单位可用票据种类
export function updateAgenBillBatch (data) {
  return request({
    url: `${BASE_URL}/agenBill/updateBatch`,
    method: 'post',
    data
  })
}

// 查询单位已经拥有的项目
export function getAgenItemList (data) {
  return request({
    url: `${BASE_URL}/agenItem/getItemAll`,
    method: 'post',
    data
  })
}

// 查询所有项目列表
export function getAllItemList () {
  return request({
    url: `${BASE_URL}/item/getItemAll`,
    method: 'get'
  })
}

// 批量更新单位可用项目
export function updateAgenItemBatch (data) {
  return request({
    url: `${BASE_URL}/agenItem/updateBatch`,
    method: 'post',
    data
  })
}
