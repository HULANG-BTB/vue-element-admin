import request from '@/utils/request'

export function getTemplateListByPage (query) {
  return request({
    url: '/template/listByPage',
    method: 'get',
    params: query
  })
}

export function getAllTemplate () {
  return request({
    url: '/printTemplate/list',
    method: 'get'
  })
}

export function getTemplateByName (name) {
  return request({
    url: `/printTemplate/templateByName/${name}`,
    method: 'get'
  })
}

export function deleteTemplate (id) {
  return request({
    url: `/printTemplate/remove/${id}`,
    method: 'delete'
  })
}
export function deleteTemplateBatch (data) {
  return request({
    url: `/printTemplate/removeBatch`,
    method: 'delete',
    data: data
  })
}