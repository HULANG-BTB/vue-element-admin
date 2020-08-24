import request from '@/utils/request'

const baseUrl = '/base'

export function getTableList (data) {
  return request({
    url: baseUrl + '/subject/listPage',
    method: 'post',
    data
  })
}

export function edit (data) {
  return request({
    url: baseUrl + '/subject/update',
    method: 'post',
    data
  })
}

export function del (data) {
  return request({
    url: baseUrl + '/subject/delete',
    method: 'post',
    data
  })
}

export function add (data) {
  return request({
    url: baseUrl + '/subject/add',
    method: 'post',
    data
  })
}

export function upload (data) {
  return request({
    url: baseUrl + '/subject/upload',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}

export function copy (data) {
  return request({
    url: baseUrl + '/subject/copy',
    method: 'post',
    data
  })
}

// export function download(data) {
//   return request({
//     url: '/subject/download',
//     method: 'post',
//     // params: { 'id': data.id, 'limit': data.limit, 'page': data.page, 'year': data.year },
//     data,
//     responseType: 'blob'
//   })
// }
