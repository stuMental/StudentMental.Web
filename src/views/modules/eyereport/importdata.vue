<template>
  <div>
    <div style="padding-bottom:20px">
      <a :href='zip' download=""> 下载模板</a>
      <el-upload drag :action="url" :before-upload="beforeUploadHandle" :on-success="successHandle" multiple :file-list="fileList" style="text-align: center;margin-left: 25%;width: 50%;">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">只支持xls、xlsx格式！</div>
      </el-upload>
    </div>
    <el-tabs type="border-card">
      <el-tab-pane label="摄像头课程信息表">
        <caminfos></caminfos>
      </el-tab-pane>
      <el-tab-pane label="学生班级信息表">
        <studentclas></studentclas>
      </el-tab-pane>
      <el-tab-pane label="课程信息表">
        <classtable></classtable>
      </el-tab-pane>
      <el-tab-pane label="学生成绩信息表">
        <studentscore></studentscore>
      </el-tab-pane>
      <el-tab-pane label="学生获奖信息表">
        <studentaware></studentaware>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import caminfos from "./caminfos";
import studentclas from "./studentclas";
import classtable from "./classtable";
import studentscore from "./studentscore";
import studentaware from "./studentaware";
export default {
  data() {
    return {
      zip: window.SITE_CONFIG.cdnUrl + "/static/zip/mb.zip",
      url: "",
      num: 0,
      successNum: 0,
      fileList: []
    };
  },
  components: {
    caminfos,
    studentclas,
    classtable,
    studentscore,
    studentaware
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.url = this.$http.adornUrl(
        `/report/uploadlocal/?token=${this.$cookie.get("token")}`
      );
    },
    // 上传之前
    beforeUploadHandle(file) {
      if (
        file.type !== "application/vnd.ms-excel" &&
        file.type !==
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        this.$message.error("只支持xls、xlsx格式！");
        return false;
      }
      this.num++;
    },
    // 上传成功
    successHandle(response, file, fileList) {
      this.fileList = fileList;
      this.successNum++;
      if (response && response.code === 0) {
        if (this.num === this.successNum) {
          this.$alert("上传成功", "提示", {
            confirmButtonText: "确定",
            callback: action => {}
          });
        }
      } else {
        this.$message.error(response.msg);
      }
    },
    // 弹窗关闭时
    closeHandle() {
      this.fileList = [];
      this.$emit("refreshDataList");
    }
  }
};
</script>
