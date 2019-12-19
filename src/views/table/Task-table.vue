<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.tableName" placeholder="任务表名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.taskType" placeholder="任务类型" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in taskTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        <!--+'('+item.key+')'-->
      </el-select>
      <el-select v-model="listQuery.taskState" placeholder="任务状态" clearable style="width: 130px" class="filter-item">
        <el-option v-for="item in taskStateOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-input v-model="listQuery.dataSource" placeholder="数据源" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.creator" placeholder="创建者" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />

      <!--<el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">-->
        <!--<el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />-->
      <!--</el-select>-->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"  @click="handleCreate">
        添加
      </el-button>
      <!--<el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">-->
        <!--Export-->
      <!--</el-button>-->
      <!--<el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">-->
        <!--reviewer-->
      <!--</el-checkbox>-->
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="60" :class-name="getSortClass('id')">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务表名" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.tableName }}</span>
        </template>

      </el-table-column>
      <el-table-column label="任务类型"width="100px" align="center">
        <template slot-scope="scope">

          <!--<span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>-->
          <el-tag>{{ scope.row.taskType | taskTypeFilter }}</el-tag>

        </template>
      </el-table-column>

      <el-table-column label="任务状态" class-name="status-col" align="center" width="95">

        <template slot-scope="{row}">
          <el-tag :type="row.taskState | taskStateTypeFilter">
            {{ row.taskState | taskStateFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <!--<el-table-column label="连接地址" width="200px" align="center">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{ scope.row.url }}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column v-if="showReviewer" label="用户名" width="80px" align="center">-->
        <!--<template slot-scope="scope">-->
          <!--<span style="color:red;">{{ scope.row.reviewer }}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="数据源" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dataSource }}</span>
          <!--<svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" class="meta-item__icon" />-->
        </template>
      </el-table-column>

      <el-table-column label="创建者"  width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.creator }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="info" size="mini" @click="handleUpdate(row)">
            测试
          </el-button>
          <el-button size="mini" type="primary" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item v-if="dialogStatus==='update'" label="任务ID：" prop="id">
          <!--<el-input v-model="temp.id" :disabled="true"/>-->
          <span>{{ temp.id }}</span>
        </el-form-item>
        <el-form-item label="任务名称：" prop="tableName">
          <el-input v-model="temp.tableName" />
        </el-form-item>
        <el-form-item label="任务类型：" prop="taskType">
          <el-select v-model="temp.taskType" class="filter-item" placeholder="Please select">
            <el-option v-for="item in taskTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="任务状态：">
          <!--<el-select v-model="temp.connState" class="filter-item" placeholder="Please select" :disabled="true">-->
          <!--<el-option v-for="item in connStateOptions" :key="item.key" :label="item.display_name" :value="item.key" />-->
          <!--</el-select>-->
          <el-tag :type="temp.taskState | taskStateTypeFilter">
            {{ temp.taskState | taskStateFilter }}
          </el-tag>
        </el-form-item>
        <el-form-item label="数据源：" prop="dataSource" >
          <el-input v-model="temp.dataSource" />
        </el-form-item>
        <el-form-item label="创建者：" prop="creator">
          <!--<el-input v-model="temp.creator" :disabled="true"/>-->
          <span>{{ temp.creator }}</span>
        </el-form-item>
        <el-form-item label="创建时间：" prop="Date">
          <!--<el-date-picker v-model="temp.createTime" type="datetime" placeholder="Please pick a date" :disabled="true"/>-->
          <span >{{ temp.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </el-form-item>
        <el-form-item label="数据总量：" prop="totalFromSource">
          <!--<el-input v-model="temp.totalFromSource" />-->
          <span>{{ temp.totalFromSource }}</span>
        </el-form-item>
        <el-form-item label="本地数据量：" prop="totalInLocal">
          <!--<el-input v-model="temp.totalInLocal" />-->
          <span>{{ temp.totalInLocal }}</span>
        </el-form-item>
        <el-form-item label="更新时间：" prop="Date">
          <!--<el-date-picker v-model="temp.createTime" type="datetime" placeholder="Please pick a date" :disabled="true"/>-->
          <span >{{ temp.updateTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </el-form-item>
        <el-form-item label="时间戳字段：" prop="timestampField">
          <el-input v-model="temp.timestampField" />
        </el-form-item>
        <el-form-item label="最新时间戳：" prop="updateTimestampValue">
        <!--<el-input v-model="temp.updateTimestampValue" />-->
          <span>{{ temp.updateTimestampValue }}</span>
        </el-form-item>
        <el-form-item label="抽取时间间隔：" prop="timeInterval">
          <el-input v-model="temp.timeInterval" style="width: 250px;margin-right: 10px" />
          <label>天</label>
        </el-form-item>
        <el-form-item label="任务调用id：" prop="systemId">
          <el-input v-model="temp.systemId" />
        </el-form-item>
        <el-form-item label="请求地址：" prop="requestUrl">
          <el-input v-model="temp.requestUrl" />
        </el-form-item>
        <el-form-item label="开始页数：" prop="startPage">
          <el-input v-model="temp.startPage" />
        </el-form-item>
        <el-form-item label="每页数据量：" prop="pageSize">
          <el-input v-model="temp.pageSize" />
        </el-form-item>
        <el-form-item label="主键增量：" prop="tableSequence">
          <span>{{ temp.tableSequence }}</span>
        </el-form-item>




        <!--<el-form-item label="Imp">-->
          <!--<el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />-->
        <!--</el-form-item>-->
        <!--<el-form-item label="Remark">-->
          <!--<el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />-->
        <!--</el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <!--<el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">-->
      <!--<el-table :data="pvData" border fit highlight-current-row style="width: 100%">-->
        <!--<el-table-column prop="key" label="Channel" />-->
        <!--<el-table-column prop="pv" label="Pv" />-->
      <!--</el-table>-->
      <!--<span slot="footer" class="dialog-footer">-->
        <!--<el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>-->
      <!--</span>-->
    <!--</el-dialog>-->
  </div>
</template>

<script>
import { fetchPv, createArticle, updateArticle } from '@/api/article'
import { fetchList } from "@/api/Task";
import waves from '@/directive/waves' // waves directive
// import { parse_Time } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const taskTypeOptions = [
  { key: 0, display_name: '全量任务' },
  { key: 1, display_name: '定时任务' },
  { key: 2, display_name: '定量任务' }
];

// arr to obj, such as { CN : "China", US : "USA" }
const taskTypeKeyValue = taskTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc
}, {});

const taskStateOptions = [
  { key: 0, display_name: '正常结束' },
  { key: 1, display_name: '正在运行' },
  { key: 2, display_name: '异常' },
  { key: 3, display_name: '手动停止' },
  { key: 4, display_name: '未运行' }
];

const taskStateKeyValue = taskStateOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc
}, {});


export default {
  name: 'Task-table',
  components: { Pagination },
  directives: { waves },
  filters: {

    taskStateTypeFilter(state) {
      const statusMap = {
        0: 'primary',
        1: 'success',
        2: 'danger',
        3: 'warning',
        4: 'info'
      };
      return statusMap[state]
    },

    taskStateFilter(state) {
      return taskStateKeyValue[state]
    },
    taskTypeFilter(taskType) {
      return taskTypeKeyValue[taskType]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        taskState: undefined,
        creator: undefined,
        tableName: undefined,
        taskType: undefined,
        dataSource: undefined,
        sort: '+id'
      },
      taskTypeOptions,
      taskStateOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      // showReviewer: false,
      temp: {
        id: undefined,
        tableName: '',
        taskType: '',
        taskState: '',
        dataSource:'',
        creator:'',
        createTime: new Date(),
        updateTime: new Date(),
        totalFromSource: '',
        totalInLocal: '',
        timestampField: '',
        updateTimestampValue: '',
        timeInterval: '',
        systemId: '',
        requestUrl: '',
        startPage: '',
        pageSize: '',
        tableSequence: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新建任务'
      },
      // dialogPvVisible: false,
      // pvData: [],
      rules: {
        tableName: [{ required: true, message: '任务表名不能为空', trigger: 'blur' }],
        // createTime: [{ type: 'date', required: true, message: 'createTime is required', trigger: 'change' }],
        dataSource: [{ required: true, message: '数据源不能为空', trigger: 'blur' }],
        systemId: [{ required: true, message: '任务调用ID不能为空', trigger: 'blur' }],
        requestUrl: [{ required: true, message: '请求地址不能为空', trigger: 'blur' }],
        startPage: [{ required: true, message: '开始页数不能为空', trigger: 'blur' }],
        pageSize: [{ required: true, message: '每页数据量不能为空', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      // console.log(process.env.NODE_ENV)
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        // console.log(this.list.length)
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        tableName: '',
        taskType: 0,
        taskState: 4,
        dataSource:'',
        creator:this.$store.getters.name,
        createTime: new Date(),
        updateTime: new Date(),
        totalFromSource: 0,
        totalInLocal: 0,
        timestampField: '',
        updateTimestampValue: '',
        timeInterval: 0,
        systemId: '',
        requestUrl: '',
        startPage: 1,
        pageSize: 1000,
        tableSequence: 0
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      // this.$router.push({ path: '/dataSource/add' })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      // this.temp.createTime = new Date(this.temp.createTime)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {

      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
      // console.log(this.listQuery.length)
    },
    // handleFetchPv(pv) {
    //   fetchPv(pv).then(response => {
    //     this.pvData = response.data.pvData
    //     this.dialogPvVisible = true
    //   })
    // },
    // handleDownload() {
    //   this.downloadLoading = true
    //   import('@/vendor/Export2Excel').then(excel => {
    //     const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
    //     const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
    //     const data = this.formatJson(filterVal, this.list)
    //     excel.export_json_to_excel({
    //       header: tHeader,
    //       data,
    //       filename: 'table-list'
    //     })
    //     this.downloadLoading = false
    //   })
    // },
    // formatJson(filterVal, jsonData) {
    //   return jsonData.map(v => filterVal.map(j => {
    //     if (j === 'timestamp') {
    //       return parseTime(v[j])
    //     } else {
    //       return v[j]
    //     }
    //   }))
    // },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}`
        ? 'ascending'
        : sort === `-${key}`
          ? 'descending'
          : ''
    }
  }
}
</script>
