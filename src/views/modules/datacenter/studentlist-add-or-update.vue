<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="50%"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
    >
      <el-form-item label="学生ID" prop="studentNumber">
        <el-input v-model="dataForm.studentNumber" placeholder="学生ID" :disabled="disable"></el-input>
      </el-form-item>
      <el-form-item label="班年级" prop="deptName">
        <el-popover ref="deptListPopover" placement="bottom-start" trigger="click">
          <el-tree
            :data="deptList"
            :props="deptListTreeProps"
            node-key="deptId"
            ref="deptListTree"
            @current-change="deptListTreeCurrentChangeHandle"
            :default-expand-all="true"
            :highlight-current="true"
            :expand-on-click-node="false"
          ></el-tree>
        </el-popover>
        <el-input
          v-model="dataForm.deptName"
          v-popover:deptListPopover
          :readonly="true"
          placeholder="点击选择班年级"
          class="dept-list__input"
        ></el-input>
      </el-form-item>
      <el-form-item label="学生姓名" prop="studentName">
        <el-input v-model="dataForm.studentName" placeholder="学生姓名"></el-input>
      </el-form-item>
    </el-form>
    <el-row>
      <el-tabs>
        <el-tab-pane label="获奖信息">
          <studentaware ref="Studentaware" showbutton="true" @studentaware="studentawarechange"></studentaware>
        </el-tab-pane>
        <el-tab-pane label="成绩信息">
          <studentsore ref="Studentsore" showbutton="true" @studentsore="studentsorechange"></studentsore>
        </el-tab-pane>
        <el-tab-pane label="标准照信息">
          <studentpho ref="Studentpho" @studentpho="studentphohange"></studentpho>
        </el-tab-pane>
      </el-tabs>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import studentaware from "./studentaware";
import studentsore from "./studentscore";
import studentpho from "./studentpho";
import { treeDataTranslate } from "@/utils";
export default {
  data() {
    return {
      studentawaredata: [],
      studentsoredata: [],
      studentphodata: [],
      visible: false,
      disable: false,
      clsid: 0,
      save:"",
      dataForm: {
        studentNumber: 0,
        studentName: "",
        deptName: "",
        deptId: ""
      },
      add: 0,
      deptListTreeProps: {
        label: "name",
        children: "children"
      },
      deptList: [],
      dataRule: {
        studentNumber: [
          { required: true, message: "学生ID不能为空", trigger: "blur" }
        ],
        studentName: [
          { required: true, message: "学生姓名不能为空", trigger: "blur" }
        ],
        deptName: [{ required: true, message: "班级不能为空", trigger: "blur" }]
      }
    };
  },
  components: {
    studentaware,
    studentsore,
    studentpho
  },
  methods: {
    deptListTreeCurrentChangeHandle(data, node) {
      this.dataForm.deptId = data.deptId;
      this.dataForm.deptName = data.name;
      this.$refs["deptListPopover"].doClose();
    },
    studentphohange(data) {
      this.studentphodata = [];
      data.forEach(element => {
        var values = {
          studentNumber: this.dataForm.studentNumber,
          imageId: element
        };
        this.studentphodata.push(values);
      });
      //console.log(this.studentphodata)
    },
    studentsorechange(data) {
      this.studentsoredata = data;
    },
    //子组件数据变更
    studentawarechange(data) {
      //console.log(data)
      this.studentawaredata = data;
    },
    init(id) {
      if (id == 1) {
        this.save = id+"";
      } else {
        this.save = "0";
      }
      (this.studentawaredata = []),
        (this.studentsoredata = []),
        (this.studentphodata = []),
        this.$http({
          url: this.$http.adornUrl("/sys/dept/select"),
          method: "get",
          params: this.$http.adornParams()
        }).then(({ data }) => {
          this.deptList = treeDataTranslate(data.deptList, "deptId");
        });
      this.disable = false;
      this.dataForm = {
        studentNumber: 0,
        studentName: "",
        deptName: "",
        deptId: ""
      };
      this.dataForm.studentNumber =
        id.studentNumber == undefined ? "" : id.studentNumber;
      this.dataForm.studentName =
        id.studentName == undefined ? "" : id.studentName;
      this.dataForm.deptId = id.deptId == undefined ? "" : id.deptId;
      this.dataForm.deptName = id.deptName == undefined ? "" : id.deptName;
      this.dataForm.isphon = id.isphon == undefined ? "" : id.isphon;
      console.log(this.dataForm);
      if (this.dataForm.studentNumber) {
        this.disable = true;
      }
      this.visible = true;
      this.$nextTick(() => {
        this.$refs.Studentaware.getDataList(this.dataForm.studentNumber);
        this.$refs.Studentsore.getDataList(this.dataForm.studentNumber);
        this.$refs.Studentpho.init(this.dataForm.studentNumber);
      });
    },
    // 表单提交
    dataFormSubmit() {
      console.log(this.studentawaredata)
      this.$refs["dataForm"].validate(valid => {
        if (this.studentphodata.length == 0) {
          this.dataForm.isphon = 0;
        } else {
          this.dataForm.isphon = 1;
        }
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/datacenter/schoolstudent/updata`),
            method: "post",
            data: this.$http.adornData({
              schoolclassinfo: this.dataForm,
              studentawaredata: this.studentawaredata,
              studentsoredata: this.studentsoredata,
              studentphodata: this.studentphodata,
              save:this.save
            })
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
