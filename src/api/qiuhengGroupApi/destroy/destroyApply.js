import request from '@/utils/request'

const BASE_URL = 'http://localhost:9538'

export function addDestroyApply (applyVo) {
  return request({
    url: BASE_URL + '/apply/insertApplyInfo',
    method: 'post',
    data: applyVo
  })
}

export function updateApplyInfo (applyVo) {
  return request({
    url: BASE_URL + '/apply/updateApplyInfo',
    method: 'get',
    data: applyVo
  })
}

export function getApplyListByAgenIdCode (agenIdCode) {
  return request({
    url: BASE_URL + '/apply/getApplyListByAgenIdCode',
    method: 'get',
    params: {
      agenIdCode
    }
  })
}

export function getApplyInfoByDestroyNo (fDestroyNo) {
  return request({
    url: BASE_URL + '/apply/getApplyInfoByDestroyNo',
    method: 'get',
    params: {
      fDestroyNo
    }
  })
}

export function deleteApplyInfoByDestroyNo (fDestroyNo) {
  return request({
    url: BASE_URL + '/apply/deleteApplyInfoByDestroyNo',
    method: 'get',
    params: {
      fDestroyNo
    }
  })
}

export function deleteItemInfoByDestroyNo (fDestroyNo) {
  return request({
    url: BASE_URL + '/apply/deleteItemInfoByDestroyNo',
    method: 'get',
    params: {
      fDestroyNo
    }
  })
}
