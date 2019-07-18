import request from '@/utils/request'

export function getToken() {
  return request({
    url: '/qiniu/upload/token', // 七牛云获取token
    method: 'get'
  })
}
