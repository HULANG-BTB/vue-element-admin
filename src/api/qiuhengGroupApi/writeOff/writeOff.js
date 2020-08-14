import request from '@/utils/request'

export function savePermission (data) {
  return request({
    url: `/permission/save`,
    method: 'post',
    data
  })
}