<template>
    <el-dialog :title="!dataForm.cameraId ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
            <el-form-item label="摄像头编号" prop="cameraId">
                <el-input v-model="dataForm.cameraId" placeholder="摄像头编号"></el-input>
            </el-form-item>
            <el-form-item label="摄像头地址" prop="cameraAddr">
                <el-input v-model="dataForm.cameraAddr" placeholder="摄像头地址"></el-input>
            </el-form-item>
            <el-form-item label="教室编号" prop="roomId">
                <el-input v-model="dataForm.roomId" placeholder="教室编号"></el-input>
            </el-form-item>
            <el-form-item label="教室地址" prop="roomAddr">
                <el-input v-model="dataForm.roomAddr" placeholder="教室地址"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
             <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        cameraId: "",
        cameraAddr: "",
        roomId:"",
        roomAddr:""
      },
      dataRule: {
        camera_addr: [
          { required: true, message: "摄像头IP不能为空", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    init(id) {
      // console.log(id)
      this.dataForm.cameraId = id ;
      // console.log(this.dataForm.cameraId)
      this.visible = true;
      this.$nextTick(() => {
        if (this.dataForm.cameraId) {
          this.$http({
            url: this.$http.adornUrl(
              `/croom/info/${this.dataForm.cameraId}`
            ),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm = data.data;
            }
          });
        }
      });
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/croom/save`
            ),
            method: "post",
            data: this.$http.adornData({
              cameraId: this.dataForm.cameraId,
              cameraAddr: this.dataForm.cameraAddr,
              roomId: this.dataForm.roomId,
              roomAddr:this.dataForm.roomAddr
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
