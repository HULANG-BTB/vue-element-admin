import request from '@/utils/request'
import download from '@/utils/download'

export function getImageTemplate () {
  return download({
    url: `/image/template`,
    method: 'get',
    responseType: 'blob'
  })
}

export function generateImage (data) {
  return download({
    url: `/image/genImage`,
    method: 'post',
    responseType: 'blob',
    data
  })
}

export function getRemoteAddress (data) {
  return request({
    url: `/image/getRemoteAddress`,
    method: 'post',
    data
  })
}

