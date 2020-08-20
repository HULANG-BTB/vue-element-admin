import request from '@/utils/request'

export function getPdfListByPage (query) {
  return request({
    url: '/pdf/listByPage',
    method: 'get',
    params: query
  })
}

export function getAllPdf () {
  return request({
    url: '/printTemplate/list',
    method: 'get'
  })
}

export function getPdfByName (name) {
  return request({
    url: `/printTemplate/pdfByName/${name}`,
    method: 'get'
  })
}

export function deletePdf (id) {
  return request({
    url: `/printTemplate/remove/${id}`,
    method: 'delete'
  })
}
export function deletePdfBatch (data) {
  return request({
    url: `/printTemplate/removeBatch`,
    method: 'delete',
    data: data
  })
}
