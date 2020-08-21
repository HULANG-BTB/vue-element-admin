import request from '@/utils/request'

export function getunitItemListByPage (data) {
  return request({
    url: '/agenItem/listByPage',
    method: 'post',
    data: data
  })
}

export function getunitBillListByPage (data) {
  return request({
    url: '/agenBill/listByPage',
    method: 'post',
    data: data
  })
}
