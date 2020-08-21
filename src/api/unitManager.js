import request from '@/utils/request'
// 主管部门管理
export function getDapartListAll (data) {
  return request({
    url: '/dept/listAll',
    method: 'get',
    data: data
  })
}
// 通过页码查找部门列表
export function getDapartListByPage (data) {
  return request({
    url: '/dept/listByPage',
    method: 'post',
    data: data
  })
}
// 新增部门
export function addDapart (data) {
  return request({
    url: '/dept/save',
    method: 'post',
    data: data
  })
}
// 修改部门
export function updateDapart (user) {
  return request({
    url: '/dept/update',
    method: 'post',
    data: user
  })
}
// 删除部门
export function deleteDapart (data) {
  return request({
    url: '/dept/remove',
    method: 'post',
    data: { id: data }
  })
}
// 批量删除部门
export function deleteDapartBatch (data) {
  return request({
    url: '/dept/removeBatch',
    method: 'post',
    data: data
  })
}

// 单位管理查找单位列表
export function getUnitListByPage (data) {
  return request({
    url: '/agen/listByPage',
    method: 'post',
    data: data
  })
}
// 未审核单位查询
export function getCheckList (data) {
  return request({
    url: '/agen/checkListByPage',
    method: 'post',
    data: data
  })
}
// 批量审核单位
export function getCheckBatch (data) {
  return request({
    url: '/agen/checkBatch',
    method: 'post',
    data: data
  })
}
// 查看单位列表
export function getUnitList () {
  return request({
    url: '/agen/listAll',
    method: 'get'
  })
}
// 新增单位
export function addUnit (data) {
  return request({
    url: '/agen/save',
    method: 'post',
    data: data
  })
}
// 修改单位
export function updateUnit (user) {
  return request({
    url: '/agen/update',
    method: 'post',
    data: user
  })
}
// 删除单位
export function deleteUnit (data) {
  return request({
    url: '/agen/remove',
    method: 'post',
    data: { id: data }
  })
}
// 批量删除
export function deleteUnitBatch (data) {
  return request({
    url: '/agen/removeBatch',
    method: 'post',
    data: data
  })
}

// 根据ID查询单位
export function getAgenById (data) {
  return request({
    url: '/agen/getById',
    method: 'post',
    data: data
  })
}
// 根据部门编码查询部门下属单位数
export function getAgenCount (data) {
  return request({
    url: '/agen/getAgenCount',
    method: 'post',
    data: data
  })
}

// 获取单位已经有的票据种类
export function getAgenBillType (data) {
  return request({
    url: '/agenBill/getBillAll',
    method: 'post',
    data
  })
}

// 查询所有票据种类
export function getBillAllType () {
  return request({
    url: '/billType/queryAllBillType',
    method: 'get'
  })
}

// 批量添加单位可用票据种类
export function updateAgenBillBatch (data) {
  return request({
    url: '/agenBill/updateBatch',
    method: 'post',
    data
  })
}

// 查询单位已经拥有的项目
export function getAgenItemList (data) {
  return request({
    url: '/agenItem/getItemAll',
    method: 'post',
    data
  })
}

// 查询所有项目列表
export function getAllItemList () {
  return request({
    url: '/item/getItemAll',
    method: 'get'
  })
}

// 批量更新单位可用项目
export function updateAgenItemBatch (data) {
  return request({
    url: '/agenItem/updateBatch',
    method: 'post',
    data
  })
}
