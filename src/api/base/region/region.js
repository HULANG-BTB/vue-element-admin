import query_string from 'querystring'
import request from '@/utils/request'

const baseUrl = '/base/region/'

export const region_category = () => {
  return request({
    url: baseUrl + 'category',
    method: 'get'
  })
}

export const region_list = (page, size, params) => {
  const querys = query_string.stringify(params)
  return request({
    url: baseUrl + 'list/' + page + '/' + size + '?' + querys,
    method: 'get'
  })
}

export const region_province = () => {
  return request({
    url: baseUrl + 'province',
    method: 'get'
  })
}

export const region_city = () => {
  return request({
    url: baseUrl + 'city',
    method: 'get'
  })
}

export const addRegion = (data) => {
  console.log(data)
  return request({
    url: baseUrl + 'add',
    method: 'post',
    data
  })
}

export const editRegion = (data) => {
  return request({
    url: baseUrl + 'edit',
    method: 'put',
    data
  })
}

export const deleteRegion = (id) => {
  return request({
    url: baseUrl + 'delete/' + id,
    method: 'delete'
  })
}

export const getGrandId = (pid) => {
  return request({
    url: baseUrl + 'getGrandId/' + pid,
    method: 'get'
  })
}

export const getBusIds = (pid) => {
  return request({
    url: baseUrl + 'getBusIds/' + pid,
    method: 'get'
  })
}
