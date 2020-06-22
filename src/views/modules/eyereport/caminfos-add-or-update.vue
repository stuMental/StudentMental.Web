<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item label="摄像头地址" prop="camera_addr">
        <el-input v-model="dataForm.camera_addr" placeholder="摄像头地址"></el-input>
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
    data () {
      return {
        visible: false,
        dataForm: {
          camera_id: 0,
          camera_addr: '',
          class_id: ''
        },
        dataRule: {
          camera_addr: [
            { required: true, message: '摄像头IP不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id,clsid) {
        if(clsid==0)
        {
          this.$message.error("请选择班级");
          return
        }
        this.dataForm.class_id=clsid
        this.dataForm.camera_id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.camera_id) {
            this.$http({
              url: this.$http.adornUrl(`/eyereportdata/sccinfo/info/${this.dataForm.camera_id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm=data.data
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        //console.log(this.dataForm.camera_id)
        //console.log(this.dataForm.class_id)
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/eyereportdata/sccinfo/${!this.dataForm.camera_id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'camera_id': this.dataForm.camera_id || undefined,
                'camera_addr': this.dataForm.camera_addr,
                'class_id': this.dataForm.class_id
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
