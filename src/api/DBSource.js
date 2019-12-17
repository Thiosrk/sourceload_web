import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/dataSource/list',
    method: 'get',
    params: query
  })
}
