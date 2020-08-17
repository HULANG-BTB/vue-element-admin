import request from '@/utils/request'

const BASE_URL = 'http://localhost:9538'

export function addDestroyApply(applyVo) {
  return request({
    url: BASE_URL + '/apply/insertApplyInfo',
    method: 'post',
    data: applyVo
  })
}

export function getApplyListByAgenIdCode(agenIdCode) {
  return request({
    url: BASE_URL + '/apply/getApplyListByAgenIdCode',
    method: 'get',
    params: {
      agenIdCode
    }
  })
}
