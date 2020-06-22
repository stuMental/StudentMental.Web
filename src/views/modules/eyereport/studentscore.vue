<template>
  <div>
    <el-button v-if="show" @click="addline()">+</el-button>
    <el-table :data="dataList" border style="width: 100%;">
      <el-table-column v-if="!show" prop="id" header-align="center" align="center" width="80" label="ID">
      </el-table-column>
      <el-table-column v-if="!show" prop="student_number" header-align="center" align="center" width="80" label="学生ID">
      </el-table-column>
      <el-table-column v-if="!show" prop="student_name" header-align="center" align="center" label="学生姓名">
      </el-table-column>
      <el-table-column v-if="!show" prop="grade_name" header-align="center" align="center" label="年级名称">
      </el-table-column>
      <el-table-column v-if="!show" prop="class_name" header-align="center" align="center" label="班级名称">
      </el-table-column>
      <el-table-column prop="course_id" header-align="center" align="center" label="课程ID">
        <template slot-scope="scope">
          <el-input v-show="show" v-model="scope.row.course_id" @change="rtdata()"></el-input>
          <span v-if="!show">{{scope.row.course_id}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="course_name" header-align="center" align="center" label="课程名称">
        <template slot-scope="scope">
          <el-input v-show="show" v-model="scope.row.course_name" @change="rtdata()"></el-input>
          <span v-if="!show">{{scope.row.course_name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="score" header-align="center" align="center" label="考试成绩">
        <template slot-scope="scope">
          <el-input v-show="show" v-model="scope.row.score" @change="rtdata()"></el-input>
          <span v-if="!show">{{scope.row.score}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="dt" header-align="center" align="center" label="考试日期">
        <template slot-scope="scope">
          <el-input v-show="show" v-model="scope.row.dt" @change="rtdata()"></el-input>
          <span v-if="!show">{{scope.row.dt}}</span>
        </template>
      </el-table-column>
       <el-table-column header-align="center" align="center" label="操作">
        <template slot-scope="scope">
          <el-button @click="deline(scope.row)">-</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>
<script>
export default {
  name: "studentsore",
  props: {
    showbutton: {
      type: String,
      default: "false"
    }
  },
  data() {
    return {
      studentid:0,
      show: this.showbutton == "true" ? true : false,
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0
    };
  },
  activated() {
    this.getDataList();
  },
  methods: {
    
    deline(row) {
     var index=this.dataList.indexOf(row)
     
      if(index!==-1)
      {
        this.dataList.splice(index,1)
      }
    },
    //返回数据
    rtdata() {
      this.$emit("studentsore", this.dataList);
    },
    //添加一行
    addline() {
      this.dataList.push({
        course_id: "",
        course_name: "",
        score: "",
        dt: ""
      });
    },
    // 获取数据列表
    getDataList(id) {
     if(id==0)
     {
       return
     }
      if(id){
        this.studentid=id
      this.$http({
        url: this.$http.adornUrl("/eyereportdata/schoolperformanceinfo/list"),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          student_number:id
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list;
          this.totalPage = data.page.totalCount;
        } else {
          this.dataList = [];
          this.totalPage = 0;
        }
      });}else
      {
         this.dataList = [];
          this.totalPage = 0;
      }
      this.rtdata();
    },

    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList(this.studentid);
    },

    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList(this.studentid);
    }
  }
};
</script>

