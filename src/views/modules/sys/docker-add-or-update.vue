<template>
  <el-dialog :title="!dataForm.dockerId ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="docker名" prop="dockerName">
        <el-input v-model="dataForm.dockerName" placeholder="docker名"></el-input>
      </el-form-item>
      <el-form-item label="摄像头地址" prop="cameraId">
        <el-select v-model="dataForm.cameraId" filterable placeholder="请选择" >
          <el-option v-for="item in carmelist" :key="item.cameraId" :label="item.cameraAddr" :value="item.cameraId">
          </el-option>
        </el-select>
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
      carmelist:[],
      dataForm: {
        dockerId: 0,
        dockerName: "",
        cameraId: "",
        cameraAddr: ""
      },
      dataRule: {
        dockerName: [
          { required: true, message: "docker名不能为空", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    getselectlist() {
      this.$http({
        url:this.$http.adornUrl(`/croom/cameraall`),
        methods:'get',
        params:this.$http.adornParams()
      }).then(({data})=>{
        if(data&&data.code===0)
        {
          this.carmelist=data.data
        }
      })
    },
    init(id) {
      this.getselectlist()
      this.dataForm.dockerId = id || 0;
      this.visible = true;
      this.$nextTick(() => {
      this.$refs["dataForm"].resetFields();
        if (this.dataForm.dockerId) {
          this.$http({
            url: this.$http.adornUrl(
              `/eyereportdata/sccinfo/docker/info/${this.dataForm.dockerId}`
            ),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.dockerId = data.data.dockerId;
              this.dataForm.dockerName = data.data.dockerName;
              this.dataForm.cameraAddr = data.data.cameraAddr;
              this.dataForm.cameraId=data.data.cameraId;
            }
          });
        }
      });
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.carmelist.forEach(element => {
            if(element.cameraId==this.dataForm.cameraId)
            {
              this.dataForm.cameraAddr=element.cameraAddr
            }            
          });
          this.dataForm.cameraAddr=this.dataForm.cameraAddr.substring(this.dataForm.cameraAddr.indexOf("@")+1,this.dataForm.cameraAddr.length);
          
          this.$http({
            url: this.$http.adornUrl(
              `/eyereportdata/sccinfo/docker/${
                !this.dataForm.dockerId ? "save" : "update"
              }`
            ),
            method: "post",
            data: this.$http.adornData({
              dockerId: this.dataForm.dockerId || undefined,
              dockerName: this.dataForm.dockerName,
              cameraId: this.dataForm.cameraId,
              cameraAddr: this.dataForm.cameraAddr
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
