<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="学生ID" prop="student_number">
        <el-input v-model="dataForm.student_number" placeholder="学生ID" :disabled="disable"></el-input>
      </el-form-item>
      <el-form-item label="学生姓名" prop="student_name">
        <el-input v-model="dataForm.student_name" placeholder="学生姓名" :disabled="disable"></el-input>
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
          <studentpho ref="Studentpho"  @studentpho="studentphohange"></studentpho>
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
export default {
  data() {
    return {
      studentawaredata: [],
      studentsoredata:[],
      studentphodata:[],
      visible: false,
      disable:false,
      clsid: 0,
      dataForm: {
        student_number: 0,
        student_name: ""
      },
      add:0,
      dataRule: {
        student_number: [
          { required: true, message: "学生ID不能为空", trigger: "blur" }
        ],
        student_name: [
          { required: true, message: "学生姓名不能为空", trigger: "blur" }
        ]
      }
    };
  },
  components: {
    studentaware,
    studentsore,
    studentpho
  },
  methods: {
    studentphohange(data){
      this.studentphodata=[]
      data.forEach(element => {
        var values={imageId:element}
        this.studentphodata.push(values)
      });
      //console.log(this.studentphodata)
    },
    studentsorechange(data){
      this.studentsoredata=data
    },
    //子组件数据变更
    studentawarechange(data) {
      this.studentawaredata = data;
    },
    init(id) {
      this.disable=false;
      // console.log(id);
      this.dataForm.student_number = id.studentNumber;
      this.dataForm.student_name=id.studentName;
      if(this.dataForm.student_number)
      {
        this.disable=true
      }
      this.visible = true;
      this.$nextTick(() => {
        this.$refs.Studentaware.getDataList(this.dataForm.student_number);
        this.$refs.Studentsore.getDataList(this.dataForm.student_number);
        this.$refs.Studentpho.init(this.dataForm.student_number);
      });
    },
    // 表单提交
    dataFormSubmit() {
      //console.log(this.studentphodata)
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/eyereportdata/schoolclassinfo/updata`
            ),
            method: "post",
            data: this.$http.adornData({
              schoolclassinfo: this.dataForm,
              studentawaredata:this.studentawaredata,
              studentsoredata:this.studentsoredata,
              studentphodata:this.studentphodata
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
