import request from '@/utils/request'
import download from '@/utils/download'

export function getTemplateListByPage (query) {
  return request({
    url: '/printTemplate/listPage',
    method: 'get',
    params: query
  })
}

export function getTemplate (id) {
  return download({
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

export function searchList (data) {
  return request({
    url: '/printTemplate/searchList',
    method: 'get',
    params: data
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

export function uploadTemplate (data) {
  return request({
    url: `printTemplate/uploadTemplate`,
    method: 'post',
    data
  })
}

export function uploadExcel (data) {
  return request({
    url: `printTemplate/uploadExcel`,
    method: `post`,
    data
  })
}
