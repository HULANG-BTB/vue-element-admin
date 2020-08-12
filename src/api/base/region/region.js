import http from './public'
import query_string from 'querystring'

export const region_category = () => {
  return http.requestQuickGet('/api/region/category')
}

export const region_list = (page, size, params) => {
  const querys = query_string.stringify(params)
  return http.requestQuickGet('/api/region/list/' + page + '/' + size + '?' + querys)
}

export const region_province = () => {
  return http.requestQuickGet('/api/region/province')
}

export const region_city = () => {
  return http.requestQuickGet('/api/region/city')
}

export const addRegion = (params) => {
  return http.requestPost('/api/region/add', params)
}

export const editRegion = (params) => {
  return http.requestPut('/api/region/edit', params)
}

export const deleteRegion = (id) => {
  return http.requestDelete('/api/region/delete/' + id)
}

export const getGrandId = (pid) => {
  return http.requestQuickGet('/api/region/getGrandId/' + pid)
}
