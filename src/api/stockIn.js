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

export function getStockInInfo (id) {
  return request({
    url: '/stockIn/getStockInInfo/' + id,
    method: 'get'
  })
}

export function updateStockIn (stockIn) {
  return request({
    url: '/stockIn/update',
    method: 'post',
    data: stockIn
  })
}

export function getCodeFunction (getCode) {
  return { 'beginCode': 2501, 'endCode': 3000 }
}

export function change (stockChangeDTO) {
  return request({
    url: '/stockIn/change',
    method: 'post',
    data: stockChangeDTO
  })
}

export function store (deleteDto) {
  return request({
    url: '/stockIn/store',
    method: 'post',
    data: deleteDto
  })
}
