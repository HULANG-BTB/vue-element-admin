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

export function getSevenYearNum (type) {
  return request({
    url: `/ecds-report-analysis/report/yeardesnum/${type}`,
    method: 'get'
  })
}

export function getAllMonth (data) {
  return request({
    url: '/ecds-report-analysis/report/monthdesnum',
    method: 'post',
    data: data
  })
}

export function getMultiBillNum (date) {
  return request({
    url: `/ecds-report-analysis/report/multibilldesnum/${date}`,
    method: 'get'
  })
}

export function getSevenYearNum1 (type) {
  return request({
    url: `/ecds-report-analysis/report/yearnum/${type}`,
    method: 'get'
  })
}

export function getAllMonth1 (data) {
  return request({
    url: '/ecds-report-analysis/report/monthnum',
    method: 'post',
    data: data
  })
}

export function getMultiBillNum1 (date) {
  return request({
    url: `/ecds-report-analysis/report/multibillnum/${date}`,
    method: 'get'
  })
}

export function getNumIn () {
  return request({
    url: '/ecds-report-analysis/report/stockIn/getNum',
    method: 'get'
  })
}

export function getBarIn () {
  return request({
    url: '/ecds-report-analysis/report/stockIn/getBar',
    method: 'get'
  })
}

export function getNumIndexIn () {
  return request({
    url: '/ecds-report-analysis/report/stockIn/getNumIndex',
    method: 'get'
  })
}

export function getNumOut () {
  return request({
    url: '/ecds-report-analysis/report/stockOut/getNum',
    method: 'get'
  })
}

export function getBarOut () {
  return request({
    url: '/ecds-report-analysis/report/stockOut/getBar',
    method: 'get'
  })
}

export function getNumIndexOut () {
  return request({
    url: '/ecds-report-analysis/report/stockOut/getNumIndex',
    method: 'get'
  })
}

// +++++++++++++++++++++

export function selectTodayBillSummary () {
  return request({
    url: '/ecds-report-analysis/report/todayBillSummary',
    method: 'get'
  })
}

export function selectTodayBillKind () {
  return request({
    url: '/ecds-report-analysis/report/todayBillKind',
    method: 'get'
  })
}

export function selectWeekBillSummary () {
  return request({
    url: '/ecds-report-analysis/report/weekBillSummary',
    method: 'get'
  })
}

// 缴费明细表函数
export function getAllByFTime (data) {
  return request({
    url: '/ecds-report-analysis/report/getAllByFTime',
    method: 'post',
    data
  })
}
export function getAll (data) {
  return request({
    url: '/ecds-report-analysis/report/getAll',
    method: 'post',
    data
  })
}
export function getWeek () {
  return request({
    url: '/ecds-report-analysis/report/getWeek',
    method: 'post'
  })
}

export function getLifeList (data) {
  return request({
    url: '/ecds-report-analysis/report/life/getLifeList',
    method: 'post',
    data: data
  })
}
