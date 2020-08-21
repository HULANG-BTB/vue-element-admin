import request from '@/utils/request'

export function getImageTemplate () {
  return request({
    url: `/image/template`,
    method: 'get',
    responseType: 'blob'
  })
}

export function getRemoteAddress (data) {
  return request({
    url: `/image/getRemoteAddress`,
    method: 'post',
    data
  })
}

export function generateImage (data) {
  return request({
    url: `/image/genImage`,
    method: 'post',
    responseType: 'blob',
    data
  })
}
