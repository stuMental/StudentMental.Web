<template>
  <div>
    <div v-show="show" style="padding-bottom:20px">
      <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
      <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
    </div>
    <el-table :data="dataList" border style="width: 100%;"  @selection-change="selectionChangeHandle">
      <el-table-column v-if="show" type="selection" header-align="center" align="center" width="50">
      </el-table-column>
      <el-table-column prop="id" header-align="center" align="center" width="80" label="ID">
      </el-table-column>
      <el-table-column prop="course_id" header-align="center" align="center" width="80" label="课程ID">
      </el-table-column>
      <el-table-column prop="room_id" header-align="center" align="center" width="80" label="教室ID">
      </el-table-column>
      <el-table-column prop="course_name" header-align="center" align="center" label="课程名称">
      </el-table-column>
      <el-table-column v-if="!show" prop="tea_id" header-align="center" align="center" label="教师ID">
      </el-table-column>
      <el-table-column prop="tea_name" header-align="center" align="center" label="教师名称">
      </el-table-column>
      <el-table-column  v-if="!show"  prop="class_name" header-align="center" align="center" label="班级名称">
      </el-table-column>
      <el-table-column  v-if="!show"  prop="grade_name" header-align="center" align="center" label="年级名称">
      </el-table-column>
      <el-table-column prop="start_time" header-align="center" align="center" label="开始时间">
      </el-table-column>
      <el-table-column prop="end_time" header-align="center" align="center" label="结束时间">
      </el-table-column>
       <el-table-column prop="weekday" header-align="center" align="center" label="星期">
      </el-table-column>
      <el-table-column prop="dt" header-align="center" align="center" label="录入日期">
      </el-table-column>     
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作" v-if="show">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList(clsid)"></add-or-update>
  </div>
</template>
<script>
import AddOrUpdate from './classtable-add-or-update'
export default {  
  name: "classtable",
  props: {
    showbutton: {
      type: String,
      default: "false"
    }
  },
  components: {
      AddOrUpdate
    },
  data() {
    return {
      show: this.showbutton == "true" ? true : false,
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      addOrUpdateVisible: false,
      dataListSelections: [],
      clsid:0
    };
  },
  activated() {
    this.getDataList(this.clsid);
  },
  methods: {
    // 新增 / 修改
      addOrUpdateHandle (id) {
        // console.log(this.clsid)
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id,this.clsid)
        })
      },
    // 获取数据列表
    getDataList(id) {
      // console.log(123)
      this.clsid=id||0;
      this.$http({
        url: this.$http.adornUrl("/eyereportdata/schoolcourseinfo/list"),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          dept_id:this.clsid
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
         // console.log(data)
          this.dataList = data.page.list;
          this.totalPage = data.page.totalCount;
        } else {
          this.dataList = [];
          this.totalPage = 0;
        }
      });
    },
 // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
         //删除
    deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/eyereportdata/schoolcourseinfo/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList(this.clsid)
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList(this.clsid);
    },

    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList(this.clsid);
    }
  }
};
</script>

