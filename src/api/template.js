import request from '@/utils/request'

export function getTemplateListByPage (query) {
  return request({
    url: '/printTemplate/listPage',
    method: 'get',
    params: query
  })
}

export function getTemplate (id) {
  return request({
    url: `/printTemplate/content/${id}.html`,
    method: 'get'
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

export function getTemplateById (id) {
  return request({
    url: `/printTemplate/templateById/${id}`,
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
