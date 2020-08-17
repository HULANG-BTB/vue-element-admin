import request from '@/utils/request'

export function getPdfListByPage (query) {
  return request({
    url: '/pdf/listByPage',
    method: 'get',
    params: query
  })
}

export function deletePdf (id) {
  return request({
    url: `/pdf/remove/${id}`,
    method: 'delete'
  })
}
export function deletePdfBatch (data) {
  return request({
    url: `/pdf/removeBatch`,
    method: 'delete',
    data: data
  })
}
