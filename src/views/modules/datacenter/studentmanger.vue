<template>
  <el-dialog title="批量管理" :close-on-click-modal="false" :visible.sync="visible">
    <el-upload
      ref="fileList"
      class="upload-demo"
      :action="url"
      :file-list="fileList"
      :on-error="errorHandle"
      :before-upload="beforeUploadHandle"
      :on-success="successHandle"
      :before-remove="handleRemove"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传zip文件,文件不允许中文，将学生照片以jpg后缀命名，放在以学号命名的文件夹中后进行zip压缩上传即可</div>
    </el-upload>
    <!-- <el-row>
        <el-col :span="5">解析进度：</el-col>
      <el-col :span="20"><el-progress  :text-inside="true" :stroke-width="18" :percentage="percentage"></el-progress></el-col>
    </el-row>-->
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
      <el-button type="primary" @click="dataFormSubmit()">解析</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
        percentage:0,
      num: 0,
      successNum: 0,
      uids: [],
      visible: false,
      fileList:[],
      url:""
    };
  },
  methods: {
      
    handleRemove(file, fileList) {
      var oldfileList = fileList;
      // console.log(oldfileList);
      var x = this.findx(this.uids, file.uid);
            if (x > -1) {
              this.uids.splice(x, 1);
            }
            this.$emit("studentpho", this.uids);
            this.$message.success("删除成功");
    },
      init(){
          this.url = this.$http.adornUrl(
        `/eyereportdata/schoolclassinfo/uploadall/?token=${this.$cookie.get(
          "token"
        )}`
      );
          this.visible=true
      },
    dataFormSubmit() {
        this.$http({
            url: this.$http.adornUrl(`/eyereportdata/schoolclassinfo/resolv`),
            method: "post",
            data: this.uids
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "解析任务提交成功，预计需要5-10分钟，可刷新学生列表查看没有标准照的学生",
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
          })
      // console.log(this.uids);
    },
     //查找指定元素
    findx(array, obj) {
      for (var i = 0; i < array.length; i++) {
        if (array[i] == obj) return i;
      }
      return -1;
    },
    //查找指定元素
    find(array, obj) {
      for (var i = 0; i < array.length; i++) {
        if (array[i].uid == obj.uid) return i;
      }
      return -1;
    },
     // 上传成功
    successHandle(response, file, fileList) {
      this.successNum++;
      if (response && response.code === 0) {
        if (this.num === this.successNum) {
          this.$alert("上传成功", "提示", {
            confirmButtonText: "确定",
            callback: action => {
              var index = this.find(fileList, file);
              if (index > -1) {
                fileList.splice(index, 1);
                var newfile = file;
                // console.log(response.filename)
                newfile.uid = response.filename;
                fileList.push(newfile);
                this.fileList = fileList;
                this.uids.push(newfile.uid);
              }
            }
          });
        }
      } else {
        this.num--;
        this.successNum--;
        var index = this.find(fileList, file);
        if (index > -1) {
          fileList.splice(index, 1);
        }
        this.fileList = fileList;
        this.$message.error(response.msg);
      }
    },
    beforeUploadHandle(file) {
        // console.log(file)
      var testmsg = /^application\/(zip)$/.test(file.type);
     // const isLt4M = file.size / 1024 / 1024 <= 4; //图片大小不超过2MB
      if (!testmsg) {
        this.$message.error("上传文件格式不对!");
        return false;
      }
    //   if (!isLt4M) {
    //     this.$message.error("上传图片大小不能超过 4M!");
    //     return false;
    //   }
      this.num++;
      return true;
    },
    
    //上传失败
    errorHandle(err, file, fileList) {
      this.num--;
      this.$message.error("上传失败");
    },
  }
};
</script>