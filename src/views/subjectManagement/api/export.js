import request from '../request/request2'

export function download (data) {
  return request({
    url: '/subject/download',
    method: 'post',
    // params: { 'id': data.id, 'limit': data.limit, 'page': data.page, 'year': data.year },
    data,
    responseType: 'blob'
  })
}
