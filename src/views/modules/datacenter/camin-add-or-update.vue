<template>
  <el-dialog
    :title="!dataForm.cameraId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="100px"
    >
      <el-form-item  label="摄像头地址" prop="cameraAddr">
        <el-input  v-model="dataForm.cameraAddr" placeholder="摄像头地址"></el-input>
      </el-form-item>
      <el-form-item label="教室" prop="roomId">
        <el-select v-model="dataForm.roomId" filterable placeholder="请选择教室" style="display: block;">
          <el-option
            v-for="item in options"
            :key="item.paramKey"
            :label="item.paramValue"
            :value="item.paramKey"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="docker" prop="docker">
        <el-input v-model="dataForm.docker" placeholder="docker"></el-input>
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
      options: [],
      dataForm: {
        cameraId: 0,
        roomId: "",
        roomAddr: "",
        cameraAddr: "",
        docker: ""
      }
    };
  },
  methods: {
    getroomid(id) {
     var roomAddr=""
      this.options.forEach(element => {
        if (element.paramKey === ""+id) {
          roomAddr= element.paramValue;
        }
      });
      return roomAddr;
    },

    init(id) {
      this.options = [];
      this.$http({
        url: this.$http.adornUrl("/sys/config/roomlist"),
        methods: "get"
      }).then(({ data }) => {
        if (data && data.code === 0) {
          data.data.forEach(element => {
            if (element.paramKey) {
              this.options.push(element);
            }
          });
        } else {
          this.options = [];
        }
      });
      this.dataForm.cameraId = id || 0;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.cameraId) {
          this.$http({
            url: this.$http.adornUrl(
              `/datacenter/camera/info/${this.dataForm.cameraId}`
            ),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.roomId = data.camer.roomId;
              this.dataForm.roomAddr = data.camer.roomAddr;
              this.dataForm.cameraAddr = data.camer.cameraAddr;
              this.dataForm.docker = data.camer.docker;
            }
          });
        }
      });
    },
    // 表单提交
    dataFormSubmit() {
      this.dataForm.roomAddr = this.getroomid(this.dataForm.roomId);
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/datacenter/camera/${
                !this.dataForm.cameraId ? "save" : "update"
              }`
            ),
            method: "post",
            data: this.$http.adornData({
              cameraId: this.dataForm.cameraId || undefined,
              roomAddr: this.dataForm.roomAddr,
              cameraAddr: this.dataForm.cameraAddr,
              docker: this.dataForm.docker,
              roomId: this.dataForm.roomId
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
