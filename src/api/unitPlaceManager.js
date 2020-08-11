import request from '@/utils/request'

export function getunitPlaceListByPage (data) {
  return request({
    url: '/place/listbypage',
    method: 'post',
    data: data
  })
}

export function addUnitPlace (data) {
  return request({
    url: `/place/save`,
    method: 'post',
    data: data
  })
}

export function updateUnitPlace (user) {
  return request({
    url: '/place/update',
    method: 'post',
    data: user
  })
}

export function deleteUnitPlace (data) {
  return request({
    url: `/place/delete`,
    method: 'post',
    data: { id: data }
  })
}

export function deleteUnitPlaceBatch (data) {
  return request({
    url: `/place/batchDelete`,
    method: 'post',
    data: data
  })
}

