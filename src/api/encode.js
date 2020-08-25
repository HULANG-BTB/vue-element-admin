import request from '@/utils/request'

const baseURL = 'ecds-finan-stock-management/'

export function createCode (data) {
  return request({
    url: baseURL + 'create/single',
    method: 'post',
    data
  })
}

export function createBatchCode (batchCode) {
  return request({
    url: baseURL + 'create/batch',
    method: 'post',
    data: batchCode
  })
}
