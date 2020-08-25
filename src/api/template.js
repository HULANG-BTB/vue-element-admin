import request from '@/utils/request'
import download from '@/utils/download'

const baseURL = '/ecds-template'

export function getTemplateListByPage (query) {
  return request({
    url: baseURL + '/printTemplate/listPage',
    method: 'get',
    params: query
  })
}

export function getTemplate (id) {
  return download({
    url: baseURL + `/printTemplate/content/${id}.html`,
    method: 'get'
  })
}

export function getAllTemplate () {
  return request({
    url: baseURL + '/printTemplate/list',
    method: 'get'
  })
}

export function searchList (data) {
  return request({
    url: baseURL + '/printTemplate/searchList',
    method: 'get',
    params: data
  })
}

export function getTemplateByName (name) {
  return request({
    url: baseURL + `/printTemplate/templateByName/${name}`,
    method: 'get'
  })
}

export function getTemplateById (id) {
  return request({
    url: baseURL + `/printTemplate/templateById/${id}`,
    method: 'get'
  })
}

export function deleteTemplate (id) {
  return request({
    url: baseURL + `/printTemplate/remove/${id}`,
    method: 'delete'
  })
}

export function deleteTemplateBatch (data) {
  return request({
    url: baseURL + `/printTemplate/removeBatch`,
    method: 'delete',
    data
  })
}

export function uploadTemplate (data) {
  return request({
    url: baseURL + `/printTemplate/uploadTemplate`,
    method: 'post',
    data
  })
}

export function uploadExcel (data) {
  return request({
    url: baseURL + `/printTemplate/uploadExcel`,
    method: `post`,
    data
  })
}

export function setDefaultTemplate (data) {
  return request({
    url: baseURL + `/printTemplate/setDefault`,
    method: `post`,
    params: data
  })
}

export function isDefault (data) {
  return request({
    url: baseURL + `/printTemplate/isDefault`,
    method: `get`,
    params: data
  })
}

export function updateTemplate (data) {
  return request({
    url: baseURL + `/printTemplate/update`,
    method: `put`,
    data
  })
}


