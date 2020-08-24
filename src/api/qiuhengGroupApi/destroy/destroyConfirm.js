import request from '@/utils/request'

// const BASE_URL = '/bill-destroy'
const BASE_URL = 'http://49.234.214.122:9538'

export function refresh () {
  return request({
    url: BASE_URL + '/apply/getApplyList',
    method: 'get'
  })
}

export function getItemListByDestroyNo (fDestroyNo) {
  return request({
    url: BASE_URL + '/apply/getItemListByDestroyNo',
    method: 'get',
    params: {
      fDestroyNo
    }
  })
}

export function destroyStockBill (fAgenIdCode, fBillBatchCode, fWarehouseId, fBillNo1, fBillNo2) {
  return request({
    url: BASE_URL + '/confirm/destroyStockBill',
    method: 'delete',
    params: {
      fAgenIdCode,
      fBillBatchCode,
      fWarehouseId,
      fBillNo1,
      fBillNo2
    }
  })
}

