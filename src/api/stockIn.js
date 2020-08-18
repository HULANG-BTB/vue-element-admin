import request from '@/utils/request'

export function getStockList () {
  return request({
    url: '/stockIn/list',
    method: 'get'
  })
}

export function getStockListPage (page) {
  return request({
    url: '/stockIn/listPage',
    method: 'post',
    data: page
  })
}

export function getBillNumber () {
  return request({
    url: '/stockIn/getId',
    method: 'get'
  })
}

export function addStockIn (stockIn) {
  return request({
    url: '/stockIn/add',
    method: 'post',
    data: stockIn
  })
}

export function deleteStockIn (removeDto) {
  return request({
    url: '/stockIn/delete',
    method: 'post',
    data: removeDto
  })
}
