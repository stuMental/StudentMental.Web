<template>
  <el-dialog
    title="上传文件"
    :close-on-click-modal="false"
    @close="closeHandle"
    :visible.sync="visible"
  >  
    <el-upload
      drag
      :action="url"
      :before-upload="beforeUploadHandle"
      :on-success="successHandle"
      multiple
      :file-list="fileList"
      style="text-align: center;"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div
        class="el-upload__tip"
        slot="tip"
      >只支持xls、xlsx格式！</div>
    </el-upload>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      url: "",
      num: 0,
      successNum: 0,
      fileList: []
    };
  },
  methods: {
    init(id) {
      this.url = this.$http.adornUrl(
        `/report/uploadlocal/?token=${this.$cookie.get("token")}`
      );
      this.visible = true;
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
            callback: action => {
              this.visible = false;
            }
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
