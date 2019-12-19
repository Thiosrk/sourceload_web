import Mock from 'mockjs'

const List = []
const count = 100

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    createTime: '@datetime',
    updateTime: '@datetime',
    creator: '@first',
    tableName: '@title(5, 10)',
    totalFromSource: 0,
    totalInLocal: 0,
    timestampField: 'mock data',
    updateTimestampValue: '@datetime',
    timeInterval: 0,
    systemId: 'mock data',
    requestUrl: 'mock data',
    startPage: 1,
    pageSize: 1000,
    tableSequence: 0,
    dataSource: 'mock data',
    'taskState|1': [ 0, 1, 2, 3, 4 ],
    'taskType|1': [ 0, 1, 2 ],
    // 'connState|1': ['success', 'fail'],
    comment_disabled: true,
    // image_uri,
    // platforms: ['a-platform']
  }))
}

export default [
  {
    url: '/api/task/list',
    type: 'get',
    response: config => {
      const { taskType, taskState, tableName, page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (taskType && item.taskType !== taskType) return false
        if (taskState && item.taskState !== taskState) return false
        if (tableName && item.tableName.indexOf(tableName) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/article/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const article of List) {
        if (article.id === +id) {
          return {
            code: 20000,
            data: article
          }
        }
      }
    }
  },

  {
    url: '/article/pv',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          pvData: [
            { key: 'PC', pv: 1024 },
            { key: 'mobile', pv: 1024 },
            { key: 'ios', pv: 1024 },
            { key: 'android', pv: 1024 }
          ]
        }
      }
    }
  },

  {
    url: '/article/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/article/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

