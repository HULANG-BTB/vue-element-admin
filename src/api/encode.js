import request from '@/utils/request'

export function createCode (data) {
  return request({
    url: 'create/single',
    method: 'post',
    data
  })
}

export function createBatchCode (batchCode) {
  return request({
    url: 'create/batch',
    method: 'post',
    data: batchCode
  })
}
