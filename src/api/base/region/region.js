import http from './public'
import query_string from 'querystring'
import request from '@/utils/request'

const baseUrl = '/region/'

export const region_category = () => {
  // return http.requestQuickGet('/api/region/category')
  return request({
    url: baseUrl + 'category',
    method: 'get'
  })
}

export const region_list = (page, size, params) => {
  const querys = query_string.stringify(params)
  // return http.requestQuickGet('/api/region/list/' + page + '/' + size + '?' + querys)
  return request({
    url: baseUrl + 'list/' + page + '/' + size + '?' + querys,
    method: 'get'
  })
}

export const region_province = () => {
  // return http.requestQuickGet('/api/region/province')
  return request({
    url: baseUrl + 'province',
    method: 'get'
  })
}

export const region_city = () => {
  // return http.requestQuickGet('/api/region/city')
  return request({
    url: baseUrl + 'city',
    method: 'get'
  })
}

export const addRegion = (data) => {
  // return http.requestPost('/api/region/add', params)
  console.log(data)
  return request({
    url: baseUrl + 'add',
    method: 'post',
    data
  })
}

export const editRegion = (data) => {
  // return http.requestPut('/api/region/edit', params)
  return request({
    url: baseUrl + 'edit',
    method: 'put',
    data
  })
}

export const deleteRegion = (id) => {
  // return http.requestDelete('/api/region/delete/' + id)
  return request({
    url: baseUrl + 'delete/' + id,
    method: 'delete'
  })
}

export const getGrandId = (pid) => {
  // return http.requestQuickGet('/api/region/getGrandId/' + pid)
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
