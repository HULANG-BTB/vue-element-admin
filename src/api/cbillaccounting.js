import request from '@/utils/request'

// 分页查询全部，有关键词则进行模糊查询
export function listByPage (data) {
  return request({
    url: '/accountQuery/listByPage',
    method: 'post',
    data
  })
}

// 删除单条信息
export function deleteById (data) {
  return request({
    url: '/account/delete',
    method: 'post',
    data
  })
}

// 批量删除信息
export function batchDelete (data) {
  return request({
    url: '/account/batchDelete',
    method: 'post',
    data
  })
}

// 修改单条信息
export function update (data) {
  return request({
    url: '/accountQuery/updateBill',
    method: 'post',
    data
  })
}

// 插入单条信息
export function insert (data) {
  return request({
    url: '/accountQuery/insertBill',
    method: 'post',
    data
  })
}

// 批量插入信息
export function batchInsert (data) {
  return request({
    url: '/accountQuery/batchInsert',
    method: 'post',
    data
  })
}

// 修改状态
export function updateStatus (data) {
  return request({
    url: '/account/updateStatus',
    method: 'put',
    data
  })
}

// 开票前插入信息
export function insertAccount (data) {
  return request({
    url: '/account/insertAccount',
    method: 'post',
    data
  })
}

// 查询代缴金额
export function getAccount (data) {
  return request({
    url: '/account/getAccount',
    method: 'post',
    data
  })
}

// 缴费单位传值
export function updateAccount (data) {
  return request({
    url: '/account/updateAccount',
    method: 'post',
    data
  })
}

// 查询入账状态
export function getStatus (data) {
  return request({
    url: '/account/getStatus',
    method: 'post',
    data
  })
}

// 插入发票信息并生成入账凭证
export function updateBillInfo (data) {
  return request({
    url: '/account/updateBillInfo',
    method: 'post',
    data
  })
}
