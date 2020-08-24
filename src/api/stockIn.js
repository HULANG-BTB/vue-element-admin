import request from '@/utils/request'

// 入库模块

// const BASE_URL = 'http://120.27.3.74:8085'
const BASE_URL = 'finan-stock-management/'

// 分页查询入库单
export function getStockListPage (page) {
  return request({
    url: BASE_URL + '/stockIn/listPage',
    method: 'post',
    data: page
  })
}

// 生成业务单号
export function getBillNumber () {
  return request({
    url: BASE_URL + '/stockIn/getId',
    method: 'get'
  })
}

// 新增入库单
export function addStockIn (stockIn) {
  return request({
    url: BASE_URL + '/stockIn/add',
    method: 'post',
    data: stockIn
  })
}

// 删除入库单
export function deleteStockIn (removeDto) {
  return request({
    url: BASE_URL + '/stockIn/delete',
    method: 'post',
    data: removeDto
  })
}

// 根据id查询入库单详情
export function getStockInInfo (id) {
  return request({
    url: BASE_URL + '/stockIn/getStockInInfo/' + id,
    method: 'get'
  })
}

// 更新入库单
export function updateStockIn (stockIn) {
  return request({
    url: BASE_URL + '/stockIn/update',
    method: 'post',
    data: stockIn
  })
}

// 赋码
export function getCodeFunction (getCode) {
  // return request({
  //   url: BASE_URL + '/create/single'
  //   method: 'post',
  //   data: getCode
  // })
  return { 'beginCode': 2501, 'endCode': 3000 }
}

// 审核入库单
export function change (stockChangeDTO) {
  return request({
    url: BASE_URL + '/stockIn/change',
    method: 'post',
    data: stockChangeDTO
  })
}

// 入库
export function store (deleteDto) {
  return request({
    url: BASE_URL + '/stockIn/store',
    method: 'post',
    data: deleteDto
  })
}
