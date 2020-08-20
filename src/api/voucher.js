import request from '@/utils/request'

// 分页查询全部，有关键词则进行模糊查询
export function listByPage (data) {
  return request({
    url: '/voucher/listByPage',
    method: 'post',
    data
  })
}

// 删除单条信息
export function deleteById (data) {
  return request({
    url: '/voucher/delete',
    method: 'post',
    data
  })
}

// 批量删除信息
export function batchDelete (data) {
  return request({
    url: '/voucher/batchDelete',
    method: 'post',
    data
  })
}

// 修改单条信息
export function updateVoucher (data) {
  return request({
    url: '/voucher/updateVoucher',
    method: 'put',
    data
  })
}
