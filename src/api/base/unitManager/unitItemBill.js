import request from '@/utils/request'

const BASE_URL = '/base'

export function getunitItemListByPage (data) {
  return request({
    url: `${BASE_URL}/agenItem/listByPage`,
    method: 'post',
    data: data
  })
}

export function getunitBillListByPage (data) {
  return request({
    url: `${BASE_URL}/agenBill/listByPage`,
    method: 'post',
    data: data
  })
}

export function getGroupByCode (data) {
  return request({
    url: '/group/getGroupByCode',
    method: 'post',
    data: data
  })
}

export function addItemGroup (data) {
  return request({
    url: '/groupItem/save',
    method: 'post',
    data: data
  })
}

