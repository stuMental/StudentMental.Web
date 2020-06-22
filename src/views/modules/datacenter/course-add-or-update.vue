<template>
  <el-dialog
    :title="!dataForm.studentNumber ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
    >
      <el-form-item label="教室">
        <el-select v-model="dataForm.roomId" filterable placeholder="请选择教室" style="display: block;">
          <el-option
            v-for="item in options"
            :key="item.paramKey"
            :label="item.paramValue"
            :value="item.paramKey"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="课程">
        <el-select
          v-model="dataForm.courseId"
          filterable
          placeholder="点击选择课程"
          style="display: block;"
        >
          <el-option
            v-for="item in courselist"
            :key="item.paramKey"
            :label="item.paramValue"
            :value="item.paramKey"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班级">
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
          <el-input
            v-model="dataForm.deptName"
            slot="reference"
            :readonly="true"
            placeholder="点击选择班年级"
          ></el-input>
        </el-popover>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="switchclass" @change="changeswitch">按班级添加</el-checkbox>
      </el-form-item>
      <el-form-item label="学生">
        <el-select :disabled="switchclass"
          v-model="dataForm.studentNumber"
          filterable clearable
          placeholder="点击选择学生"
          style="display: block;"
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
          style="display: block;"
        >
          <el-option
            v-for="item in teacherlist"
            :key="item.userId"
            :label="item.username+'|'+item.name"
            :value="item.userId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="课堂时间">
        <el-select
          v-model="dataForm.mood"
          filterable
          placeholder="点击选择课堂时间"
          style="display: block;"
        >
          <el-option
            v-for="item in moodlist"
            :key="item.paramKey"
            :label="item.paramValue"
            :value="item.paramKey"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="星期" prop="weekday">
        <el-select v-model="dataForm.weekday" placeholder="星期" style="display: block;">
          <el-option label="星期一" value="2"></el-option>
          <el-option label="星期二" value="3"></el-option>
          <el-option label="星期三" value="4"></el-option>
          <el-option label="星期四" value="5"></el-option>
          <el-option label="星期五" value="6"></el-option>
          <el-option label="星期六" value="7"></el-option>
          <el-option label="星期日" value="1"></el-option>
        </el-select>
        <!-- <el-input v-model="dataForm.weekday" placeholder="星期"></el-input> -->
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from "@/utils";
export default {
  data() {
    return {
      switchclass:true,
      disabled: false,
      visible: false,
      dataForm: {
        roomId: "",
        courseId: "",
        deptId: 0,
        deptName: "",
        studentNumber: "",
        teacherId: "",
        weekday: "",
        mood: ""
      },
      options: [],
      courselist: [],
      teacherlist: [],
      moodlist: [],
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
    this.getroom();
    this.initdept();
    this.getstudent();
    this.getcoursedict();
    this.getteacherlist();
    this.getmood();
  },
  methods: {
    changeswitch(){
      this.dataForm.studentNumber="";
    },
    deptchange() {
      //console.log(this.dataForm)
      this.getstudent();
     // this.getteacherlist();
    },
    getmood() {
      this.$http({
        url: this.$http.adornUrl("/sys/config/mood"),
        methods: "get"
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.moodlist = [];
          data.data.forEach(element => {
            if (element.paramKey) {
              this.moodlist.push(element);
            }
          });
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
          console.log(this.teacherlist)
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
          this.courselist = [];
          data.data.forEach(element => {
            if (element.paramKey) {
              this.courselist.push(element);
            }
          });
        } else {
          this.courselist = [];
        }
      });
    },
    initdept() {
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
          this.options = [];
          data.data.forEach(element => {
            if (element.paramKey) {
              this.options.push(element);
            }
          });
          // console.log(this.options)
        } else {
          this.options = [];
        }
      });
    },

    init(id) {
      this.getroom();
      this.initdept();
      this.getstudent();
      this.getcoursedict();
      this.getteacherlist();
      this.getmood();
      if (id) {
        this.dataForm = { ...id };
        console.log(this.dataForm)
        this.switchclass=false;
        this.disabled = true;
      } else {
        this.dataForm = {
          roomId: "",
          courseId: "",
          deptId: 0,
          deptName: "",
          studentNumber: "",
          teacherId: "",
          weekday: "",
          mood: ""
        };
        this.disabled = false;
        this.switchclass=true;
      }
      this.visible = true;
    },
    deptListTreeCurrentChangeHandle(data, node) {
      this.dataForm.deptId = data.deptId;
      this.dataForm.deptName = data.name;
      this.dataForm.studentNumber = "";
      this.dataForm.teacherId = "";
      this.deptchange();
      this.$refs["deptpopover"].doClose();
    },
    deptListTreeSetCurrentNode() {
      this.$refs.deptListTree.setCurrentKey(this.dataForm.deptId);
      this.dataForm.deptName = (this.$refs.deptListTree.getCurrentNode() || {})[
        "name"
      ];
    },
    // 表单提交
    dataFormSubmit() {
      // console.log(this.dataForm)
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/datacenter/StudentCourseInfo/${
                !this.dataForm.id ? "save" : "update"
              }`
            ),
            method: "post",
            data: this.$http.adornData(this.dataForm, false)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$emit("refreshDataList");
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    }
  }
};
</script>
