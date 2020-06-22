<template>
  <div>
    <div v-show="show" style="padding-bottom:20px">
      <el-form :model="dataForm" :inline="true">
        <el-form-item label="教室">
          <el-select clearable
            v-model="dataForm.roomId"
            filterable
            placeholder="请选择教室"
            @change="getdatalistt()"
          >
            <el-option
              v-for="item in options"
              :key="item.paramKey"
              :label="item.paramValue"
              :value="item.paramKey"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程">
          <el-select clearable
            v-model="dataForm.courseId"
            filterable
            placeholder="点击选择课程"
            @change="getdatalistt()"
          >
            <el-option
              v-for="item in courselist"
              :key="item.paramKey"
              :label="item.paramValue"
              :value="item.paramKey"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="deptName" label="班级">
          <el-popover placement="bottom-start" trigger="click" ref="deptpopover">
            <el-tree
              :data="deptList"
              :props="deptListTreeProps"
              node-key="deptId"
              ref="deptListTree"
              @current-change="deptListTreeCurrentChangeHandle"
              :default-expand-all="false"
              :highlight-current="true"
              :expand-on-click-node="false"
            ></el-tree>
            <el-input clearable
              v-model="dataForm.deptName"
              slot="reference"
              :readonly="true"
              placeholder="点击选择班年级"
              @change="getdatalistt()"
            ></el-input>
          </el-popover>
        </el-form-item>
        <el-form-item label="学生">
          <el-select clearable
            v-model="dataForm.studentNumber"
            filterable
            placeholder="点击选择学生"
            @change="getdatalistt()"
          >
            <el-option
              v-for="item in studentlist"
              :key="item.studentNumber"
              :label="item.studentName+'|'+item.studentNumber"
              :value="item.studentNumber"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="教师">
          <el-select clearable
            v-model="dataForm.teacherId"
            filterable
            placeholder="点击选择教师"
            @change="getdatalistt()"
          >
            <el-option
              v-for="item in teacherlist"
              :key="item.userId"
              :label="item.username+'|'+item.name"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="星期">
          <el-select v-model="dataForm.weekday" clearable filterable placeholder="星期" @change="getdatalistt()">
            <el-option label="星期一" value="2"></el-option>
            <el-option label="星期二" value="3"></el-option>
            <el-option label="星期三" value="4"></el-option>
            <el-option label="星期四" value="5"></el-option>
            <el-option label="星期五" value="6"></el-option>
            <el-option label="星期六" value="7"></el-option>
            <el-option label="星期日" value="1"></el-option>
            <el-option label="全部" value></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课堂时间">
          <el-select clearable
            v-model="dataForm.mood"
            filterable
            placeholder="点击选择课堂时间"
            @change="getdatalistt()"
          >
            <el-option
              v-for="item in moodlist"
              :key="item.paramKey"
              :label="item.paramValue"
              :value="item.paramKey"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">查询</el-button>
          <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
          <el-button
            type="danger"
            @click="deleteHandle()"
            :disabled="dataListSelections.length <= 0"
          >批量删除</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table
        :data="dataList"
        border
        style="width: 100%;"
        @selection-change="selectionChangeHandle"
      >
        <el-table-column
          v-if="show"
          type="selection"
          header-align="center"
          align="center"
          width="50"
        ></el-table-column>
        <el-table-column prop="id" header-align="center" align="center" width="80" label="ID"></el-table-column>
        <el-table-column
          prop="studentNumber"
          header-align="center"
          align="center"
          width="80"
          label="学号"
        ></el-table-column>
        <el-table-column prop="studentName" header-align="center" align="center" label="学生名称">
          <template slot-scope="scope">{{ formatstudent(scope.row.studentNumber)}}</template>
        </el-table-column>
        <el-table-column prop="deptName" header-align="center" align="center" label="班级">
          <template slot-scope="scope">{{ formatdeptname(scope.row.deptId)}}</template>
        </el-table-column>
        <el-table-column prop="courseName" header-align="center" align="center" label="课堂名称">
          <template slot-scope="scope">{{ formatcourse(scope.row.courseId)}}</template>
        </el-table-column>
        <el-table-column prop="teacherId" header-align="center" align="center" label="教师编号">
           <template slot-scope="scope">{{ formatteacherusername(scope.row.teacherId)}}</template>
        </el-table-column>
        <!-- <el-table-column prop="teacherId" header-align="center" align="center" label="教师编号"></el-table-column> -->
        <el-table-column prop="teacherName" header-align="center" align="center" label="教师名称">
          <template slot-scope="scope">{{ formatteacher(scope.row.teacherId)}}</template>
        </el-table-column>
        <el-table-column prop="moodname" header-align="center" align="center" label="课堂时间">
          <template slot-scope="scope">{{ formatmood(scope.row.mood)}}</template>
        </el-table-column>
        <el-table-column prop="roomAddr" header-align="center" align="center" label="教室地址">
          <template slot-scope="scope">{{ formatroom(scope.row.roomId)}}</template>
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
        <el-table-column
          fixed="right"
          header-align="center"
          align="center"
          width="150"
          label="操作"
          v-if="show"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row)">修改</el-button>
            <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
      <add-or-update
        v-if="addOrUpdateVisible"
        ref="addOrUpdate"
        @refreshDataList="getDataList(clsid)"
      ></add-or-update>
    </div>
  </div>
</template>

<script>
import AddOrUpdate from "./course-add-or-update";
import { treeDataTranslate } from "@/utils";
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
      dataForm: {
        roomId: "",
        courseId: "",
        deptId: "",
        deptName: "",
        studentNumber: "",
        teacherId: "",
        weekday: "",
        mood: ""
      },
      show: this.showbutton == "true" ? true : false,
      clsid: 0,
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      options: [],
      courselist: [],
      teacherlist: [],
      moodlist: [],
      addOrUpdateVisible: false,
      dataListSelections: [],
      deptList: [],
      deptlist: [],
      studentlist: [],
      deptListTreeProps: {
        label: "name",
        children: "children"
      }
    };
  },
  activated() {
    this.getDataList();
    this.getroom();
    this.init();
    this.getstudent();
    this.getcoursedict();
    this.getteacherlist();
    this.getmood();
  },
  methods: {
    getdatalistt()
    {
      this.  pageIndex= 1,
      this.pageSize=10,
      this.totalPage= 0,
      this.getDataList();

    },
    formatroom(roomId) {
      let list = this.options.filter(x => x.paramKey == roomId);
      if (list && list.length > 0) return list[0].paramValue;
    },
    formatmood(mood) {
      let list = this.moodlist.filter(x => x.paramKey == mood);
      if (list && list.length > 0) return list[0].paramValue;
    },
    formatteacher(teacherId) {
      let list = this.teacherlist.filter(x => x.userId == teacherId);
      if (list && list.length > 0) return list[0].name;
    },
     formatteacherusername(teacherId) {
      let list = this.teacherlist.filter(x => x.userId == teacherId);
      if (list && list.length > 0) return list[0].username;
    },
    formatcourse(courseId) {
      let list = this.courselist.filter(x => x.paramKey == courseId);
      if (list && list.length > 0) return list[0].paramValue;
    },
    formatstudent(studentNumber) {
      let list = this.studentlist.filter(x => x.studentNumber == studentNumber);
      if (list && list.length > 0) return list[0].studentName;
    },
    formatdeptname(deptId) {
      let list = this.deptlist.filter(x => x.deptId == deptId);
      if (list && list.length > 0) return list[0].name;
    },
    deptchange() {
      this.getstudent();
      this.getteacherlist();
      this.getDataList();
    },
    getmood() {
      this.$http({
        url: this.$http.adornUrl("/sys/config/mood"),
        methods: "get"
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.moodlist = data.data;
        } else {
          this.moodlist = [];
        }
      });
    },
    getteacherlist() {
      this.$http({
        url: this.$http.adornUrl("/sys/user/dict"),
        methods: "get" //,
        // params: this.$http.adornParams({
        //   deptId: this.dataForm.deptId
        // })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.teacherlist = data.data;
        } else {
          this.teacherlist = [];
        }
      });
    },
    getcoursedict() {
      this.$http({
        url: this.$http.adornUrl("/sys/config/courselist"),
        methods: "get"
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.courselist = data.data;
        } else {
          this.courselist = [];
        }
      });
    },
    init() {
      this.$http({
        url: this.$http.adornUrl("/sys/dept/select"),
        method: "get",
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.deptlist = data.deptList;
        this.deptList = treeDataTranslate(data.deptList, "deptId");
      });
    },
    getstudent() {
      this.$http({
        url: this.$http.adornUrl("/datacenter/schoolstudent/dict"),
        methods: "get",
        params: this.$http.adornParams({
          deptId: this.dataForm.deptId
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.studentlist = data.data;
        } else {
          this.studentlist = [];
        }
      });
    },
    getroom() {
      this.$http({
        url: this.$http.adornUrl("/sys/config/roomlist"),
        methods: "get"
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.options = data.data;
        } else {
          this.options = [];
        }
      });
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      if (id) {
        id.deptName = this.formatdeptname(id.deptId);
      }
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id);
      });
    },
    // 获取数据列表
    getDataList(id) {
      this.$http({
        url: this.$http.adornUrl("/datacenter/StudentCourseInfo/list"),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          roomId: this.dataForm.roomId,
          courseId: this.dataForm.courseId,
          deptId: this.dataForm.deptId,
          studentNumber: this.dataForm.studentNumber,
          teacherId: this.dataForm.teacherId,
          weekday: this.dataForm.weekday,
          mood: this.dataForm.mood
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list;
          this.totalPage = data.page.totalCount;
        } else {
          this.dataList = [];
          this.totalPage = 0;
        }
      });
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    //删除
    // 删除
    deleteHandle(id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
            return item.id;
          });
      this.$confirm(
        `确定对[id=${ids.join(",")}]进行[${id ? "删除" : "批量删除"}]操作?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$http({
            url: this.$http.adornUrl("/datacenter/StudentCourseInfo/delete"),
            method: "post",
            data: this.$http.adornData(ids, false)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.getDataList();
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        })
        .catch(() => {});
    },

    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList(this.clsid);
    },
    deptListTreeCurrentChangeHandle(data, node) {
      this.dataForm.deptId = data.deptId;
      this.dataForm.deptName = data.name;
      this.$refs["deptpopover"].doClose();
      this.deptchange();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList(this.clsid);
    }
  }
};
</script>

