<template>
  <div>
    <el-button v-if="show" @click="addline()">添加一条</el-button>
    <el-table :data="dataList" border style="width: 100%;">
      <!-- <el-table-column v-if="show" prop="id" header-align="center" align="center" width="80" label="ID">
      </el-table-column>-->
      <el-table-column prop="courseId" header-align="center" align="center" label="课程">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.courseId"
            filterable
            placeholder="请选择课程"
            @change="rtdata()"
          >
            <el-option
              v-for="item in options"
              :key="item.paramKey"
              :label="item.paramValue"
              :value="item.paramKey"
            ></el-option>
          </el-select>
          <!-- <el-input v-show="show" v-model="scope.row.courseId" @change="rtdata()"></el-input> -->
          <span v-if="!show">{{scope.row.courseId}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="courseName" header-align="center" align="center" label="课程名称">
        <template slot-scope="scope">
          <el-input v-show="show" v-model="scope.row.courseName" @change="rtdata()"></el-input>
          <span v-if="!show">{{scope.row.courseName}}</span>
        </template>
      </el-table-column>-->
      <el-table-column prop="score" header-align="center" width="80" align="center" label="考试成绩">
        <template slot-scope="scope">
          <el-input v-show="show" v-model="scope.row.score" @change="rtdata()"></el-input>
          <span v-if="!show">{{scope.row.score}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="dt" header-align="center" align="center" width="240" label="考试日期">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.dt"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
            @change="rtdata()"
          ></el-date-picker>
          <!-- <el-input v-show="show" v-model="scope.row.dt" @change="rtdata()"></el-input> -->
          <span v-if="!show">{{scope.row.dt}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" width="80" align="center" label="操作">
        <template slot-scope="scope">
          <el-button @click="deline(scope.row)">-</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
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
      studentid: 0,
      show: this.showbutton == "true" ? true : false,
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      options: []
    };
  },
  activated() {},
  methods: {
    deline(row) {
      var index = this.dataList.indexOf(row);

      if (index !== -1) {
        this.dataList.splice(index, 1);
      }
      this.rtdata();
    },
    //返回数据
    rtdata() {
      var dt = [];
      console.log(this.dataList)
      this.dataList.forEach(element => {
        if(element.courseId){
        element.courseName = this.options.find(item => {
          return (item.paramKey == element.courseId);
        }).paramValue;}
        dt.push(element);
      });
      console.log(dt)
      this.$emit("studentsore", dt);
    },
    //添加一行
    addline() {
      this.dataList.push({
        courseId: "",
        courseName: "",
        score: "",
        dt: "",
        studentNumber: this.studentid
      });
    },
    // 获取数据列表
    getDataList(id) {
      //console.log(id)
      this.options = [];
      this.$http({
        url: this.$http.adornUrl("/sys/config/courselist"),
        methods: "get"
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            data.data.forEach(element => {
              if (element.paramKey) {
                this.options.push(element);
              }
            });
          } else {
            this.options = [];
          }
        })
        .then(() => {
          if (id) {
            this.studentid = id;
            this.$http({
              url: this.$http.adornUrl(
                "/datacenter/schoolperformanceinfo/list"
              ),
              method: "get",
              params: this.$http.adornParams({
                page: this.pageIndex,
                limit: this.pageSize,
                student_number: id
              })
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.dataList = data.page.list;
                this.totalPage = data.page.totalCount;
                this.rtdata();
              } else {
                this.dataList = [];
                this.totalPage = 0;
              }
            });
          } else {
            this.dataList = [];
            this.totalPage = 0;
          }
        });
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

