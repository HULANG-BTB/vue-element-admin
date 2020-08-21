import request from '@/utils/request'

const BASE_URL = '/base'

export function getunitPlaceListByPage (data) {
  return request({
    url: `${BASE_URL}/place/listByPage`,
    method: 'post',
    data: data
  })
}

export function addUnitPlace (data) {
  return request({
    url: `${BASE_URL}/place/save`,
    method: 'post',
    data: data
  })
}

export function updateUnitPlace (data) {
  return request({
    url: `${BASE_URL}/place/update`,
    method: 'post',
    data: data
  })
}

export function deleteUnitPlace (data) {
  return request({
    url: `${BASE_URL}/place/delete`,
    method: 'post',
    data: { id: data }
  })
}

export function deleteUnitPlaceBatch (data) {
  return request({
    url: `${BASE_URL}/place/batchDelete`,
    method: 'post',
    data: data
  })
}

