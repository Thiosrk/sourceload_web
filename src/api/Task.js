import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/task/list',
    method: 'get',
    params: query
  })
}
