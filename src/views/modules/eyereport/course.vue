
<template>
  <div>
    <div v-show="show" style="padding-bottom:20px">
      <el-form :model="dataForm" :inline="true">
        <el-form-item >
           <el-input v-model="dataForm.studentNumber" placeholder="学号"></el-input>
        </el-form-item>
        <el-form-item >
           <el-input v-model="dataForm.studentName" placeholder="学生姓名"></el-input>
        </el-form-item>
        <el-form-item >
           <el-button  @click="getDataList()">查询</el-button>
          <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
          <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table :data="dataList" border style="width: 100%;"  @selection-change="selectionChangeHandle">
        <el-table-column v-if="show" type="selection" header-align="center" align="center" width="50">
        </el-table-column>
        <el-table-column prop="studentNumber" header-align="center" align="center" width="80" label="学号">
        </el-table-column>
        <el-table-column prop="studentName" header-align="center" align="center" label="学生名称">
        </el-table-column>
        <el-table-column prop="gradeName" header-align="center" align="center" label="年级">
        </el-table-column>
        <el-table-column  prop="collegeName" header-align="center" align="center" label="学院">
        </el-table-column>
        <el-table-column prop="className" header-align="center" align="center" label="班级">
        </el-table-column>
        <el-table-column prop="courseId" header-align="center" align="center" label="课堂ID">
        </el-table-column>
        <el-table-column prop="courseName" header-align="center" align="center" label="课堂名称">
        </el-table-column>
        <el-table-column prop="teacherId" header-align="center" align="center" label="教师编号">
        </el-table-column>
        <el-table-column prop="teacherName" header-align="center" align="center" label="教师名称">
        </el-table-column>
        <el-table-column prop="startTime" header-align="center" align="center" label="开始时间">
        </el-table-column>
        <el-table-column prop="endTime" header-align="center" align="center" label="结束时间">
        </el-table-column>
        <el-table-column prop="roomId" header-align="center" align="center" label="教室编号">
        </el-table-column>
        <el-table-column prop="roomAddr" header-align="center" align="center" label="教室地址">
        </el-table-column>
        <el-table-column prop="weekday" header-align="center" align="center" label="星期">
           <template slot-scope="scope">
          <div v-if="scope.row.weekday == 1" size="small">星期日</div>
          <div v-if="scope.row.weekday == 2" size="small">星期一</div>
          <div v-if="scope.row.weekday == 3" size="small">星期二</div>
          <div v-if="scope.row.weekday == 4" size="small">星期三</div>
          <div v-if="scope.row.weekday == 5" size="small">星期四</div>
          <div v-if="scope.row.weekday == 6" size="small">星期五</div>
          <div v-if="scope.row.weekday == 7" size="small">星期六</div>
        </template>
        </el-table-column>
        <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作" v-if="show">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row)">修改</el-button>
            <el-button type="text" size="small" @click="deleteHandle(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
       <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList(clsid)"></add-or-update>
    </div>
  </div>
</template>

<script>
import AddOrUpdate from './course-add-or-update'
export default {  
  name: "course",
  props: {
    showbutton: {
      type: String,
      default: "true"
    }
  },
   components: {
      AddOrUpdate
    },
  data() {
    return {
      dataForm:{},
      show: this.showbutton == "true" ? true : false,
      clsid:0,
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      addOrUpdateVisible: false,
      dataListSelections: []
    };
  },
  activated() {
    this.getDataList();
  },
  methods: {
    // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
    // 获取数据列表
    getDataList(id) {
      this.$http({
        url: this.$http.adornUrl("/course/list"),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          studentNumber:this.dataForm.studentNumber,
          studentName:this.dataForm.studentName
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list;
          this.totalPage = data.page.totalCount;
        } else {
          this.dataList = [];
          this.totalPage = 0;
        }
      })
    },
     // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      //删除
    deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item
        })
        this.$confirm(`确定进行删除操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/course/delete'),
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

