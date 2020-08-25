import request from '@/utils/request'

const BASE_URL_FINAN = 'finan-stock-management'
const BASE_URL_USM = 'nacos-service-usm'
// const BASE_URL = 'http://120.27.3.74:8085'
/**
 * 查询所有数据
 * @param {*} query
 */
export function getStockReturnList (query) {
  return request({
    url: BASE_URL_USM + '/stock-return-po/getListStockReturnPage',
    method: 'post',
    data: query
  })
}

export function getNo () {
  return request({
    url: BASE_URL_USM + '/stock-return-po/getNo',
    method: 'get',
    data: null
  })
}
/**
 * 根据日期或者业务单号查询
 * @param {} query
 */
export function getListStockReturnByDateOrNo (query) {
  return request({
    url: BASE_URL_USM + '/stock-return-po/getListStockReturnByDateOrNo1',
    method: 'post',
    // params: { no: query.no, startTime: query.startTime, endTime: query.endTime }
    // params: query
    data: query
  })
}

/**
 * 新增退票信息
 * @param {} Stockreturn
 */
export function addStockReturn (Stockreturn) {
  return request({
    url: BASE_URL_USM + '/stock-return-po/addStockReturn',
    method: 'post',
    // params: { no: query.no, startTime: query.startTime, endTime: query.endTime }
    // params: query
    data: Stockreturn
  })
}

/**
 * 查询退票明细列表
 * @param {*} Stockreturn
 */
export function getStockReturnItems (Stockreturn) {
  return request({
    url: BASE_URL_USM + '/stock-return-po/getStockReturnByNo',
    // url: '/mail/updateStatus',
    method: 'post',
    data: Stockreturn
  })
}

/**
 * 删除单条信息
 * @param {*} Stockreturn
 */
export function deleteStockReturnByNo (Stockreturn) {
  return request({
    url: BASE_URL_USM + '/stock-return-po/deleteByNo',
    method: 'get',
    params: { no: Stockreturn.no }
  })
}

/**
 * 更新退票业务
 * @param {*} Stockreturn
 */
export function updateByNo (Stockreturn) {
  return request({
    url: BASE_URL_USM + '/stock-return-po/updateByNo',
    method: 'post',
    data: Stockreturn
  })
}

/**
 * 单位提交退票申请
 * @param {*} Stockreturn
 */
export function putSubmit (Stockreturn) {
  return request({
    url: BASE_URL_USM + '/stock-return-po/updateSubmitStatus',
    method: 'put',
    params: { no: Stockreturn.no }
  })
}

/**
 *
 * @param {*} query
 */
export function getFinanStockReturnList (query) {
  return request({
    url: BASE_URL_FINAN + '/finan-stock-return-po/getListStockReturnByDate',
    method: 'post',
    data: query
  })
}

/**
 * 财政端审核退票申请（获取已提交的退票详细信息）
 */
export function getFinanStockReturnItems (query) {
  return request({
    url: BASE_URL_FINAN + '/finan-stock-return-po/getStockReturnByNo',
    method: 'post',
    data: query
  })
}

/**
 * 财政端审核退票（审核是否通过退票申请）
 */
export function getCheckStateByNo (query) {
  return request({
    url: BASE_URL_FINAN + '/finan-stock-return-po/CheckStatusByNo',
    method: 'post',
    data: query
  })
}
