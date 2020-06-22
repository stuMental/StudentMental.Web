<template>
  <el-upload class="upload-pho" ref="fileList" :action="url" :on-error="errorHandle" :before-upload="beforeUploadHandle" :on-success="successHandle" :on-preview="handlePreview" :before-remove="handleRemove" :file-list="fileList" list-type="picture">
    <el-button size="small" type="primary">点击上传</el-button>
    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过4M</div>
  </el-upload>

</template>
<script>
export default {
  name:"studentpho",
  data() {
    return {
      studentid:0,
      num: 0,
      successNum: 0,
      url: "",
      fileList: [
        {
          name: "2f454fc861ce4324962c0b391be11308",
          uid: "2f454fc861ce4324962c0b391be11308",
          url:
            "http://127.0.0.1:8080/student_service/eyereportdata/schoolclassinfo/pho/image?token=03cedba6a9b8c61d8182f2d460d93aec&uuid=2f454fc861ce4324962c0b391be11308"
        }
      ],
      uids: []
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init(id) {
      this.uids=[]
      this.fileList = [];
      this.url = this.$http.adornUrl(
        `/eyereportdata/schoolclassinfo/uploadlocal/?token=${this.$cookie.get(
          "token"
        )}`
      );
      if(id==0)
      {
        return
      }
      if (id) {
        this.studentid=id
        this.$http({
          url: this.$http.adornUrl("/eyereportdata/schoolclassinfo/pho/list"),
          method: "get",
          params: this.$http.adornParams({
            student_number: id
          })
        }).then(({ data }) => {
          //console.log(data)
          if (data && data.code === 0) {
            this.fileList = [];
            
            data.data.forEach(element => {
              var file = {};
              file.name = element.imageId;
              file.uid = element.imageId;
              file.url = this.$http.adornUrl(
                `/eyereportdata/schoolclassinfo/pho/image?token=${this.$cookie.get(
                  "token"
                )}&uuid=${element.imageId}`
              );
              this.fileList.push(file);
              this.uids.push(file.uid)
            });
          } else {
            this.fileList = [];
          }
        });
        // console.log(this.fileList)
      } else {
        this.fileList = [];
      }
      this.$emit("studentpho", this.uids);
    }, // 上传之前
    beforeUploadHandle(file) {
      var testmsg = /^image\/(jpeg|png|jpg)$/.test(file.type);
      const isLt4M = file.size / 1024 / 1024 <= 4; //图片大小不超过2MB
      if (!testmsg) {
        this.$message.error("上传图片格式不对!");
        return false;
      }
      if (!isLt4M) {
        this.$message.error("上传图片大小不能超过 4M!");
        return false;
      }
      this.num++;
      return true;
    },
    handleRemove(file, fileList) {
      var oldfileList = fileList;
      // console.log(oldfileList);
      this.$http
        .get(
          this.$http.adornUrl(
            `/eyereportdata/schoolclassinfo/pho/del/${file.uid}`
          )
        )
        .then(({ data }) => {
          if (data && data.code === 0) {
            var x = this.findx(this.uids, file.uid);
            if (x > -1) {
              this.uids.splice(x, 1);
            }
            this.$emit("studentpho", this.uids);
            this.$message.success("删除成功");
          } else {
            oldfileList.push(file);
            this.fileList = oldfileList;
            this.$$message.error("删除失败");
          }
        });
    },
    handlePreview(file) {
      //console.log(file);
    },
    //上传失败
    errorHandle(err, file, fileList) {
      this.num--;
      this.$message.error("上传失败");
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
                newfile.uid = response.data;
                fileList.push(newfile);
                this.fileList = fileList;
                this.uids.push(newfile.uid);
                this.$emit("studentpho", this.uids);
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
    }
  }
};
</script>