import request from '@/utils/request'

export function getReportBill () {
  return request({
    url: '/ecds-report-analysis/report/bill',
    method: 'get'
  })
}

export function selectSearch (data) {
  return request({
    url: '/ecds-report-analysis/report/search',
    method: 'post',
    data: data
  })
}

export function selectNum () {
  return request({
    url: '/ecds-report-analysis/report/num',
    method: 'get'
  })
}

export function selectDestroyNum () {
  return request({
    url: '/ecds-report-analysis/report/desnum',
    method: 'get'
  })
}
