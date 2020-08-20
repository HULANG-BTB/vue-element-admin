import request from '@/utils/request'

export function getReportBill() {
  return request({
    url: '/report/bill',
    method: 'get'
  })
}

export function selectSearch(data) {
  return request({
    url: '/report/search',
    method: 'post',
    data: data
  })
}

export function selectNum() {
  return request({
    url: '/report/num',
    method: 'get'
  })
}
