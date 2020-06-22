<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="课程id" prop="course_id">
        <el-input v-model="dataForm.course_id" placeholder="课程id"></el-input>
      </el-form-item>
      <el-form-item label="课程名称" prop="course_name">
        <el-input v-model="dataForm.course_name" placeholder="课程名称"></el-input>
      </el-form-item>
       <el-form-item label="教室ID" prop="course_name">
        <el-input v-model="dataForm.room_id" placeholder="教室ID"></el-input>
      </el-form-item>
       <el-form-item label="教师ID" prop="tea_id">
        <el-input v-model="dataForm.tea_id" placeholder="教师ID"></el-input>
      </el-form-item>
      <el-form-item label="教师名称" prop="tea_name">
        <el-input v-model="dataForm.tea_name" placeholder="教师名称"></el-input>
      </el-form-item>
      <el-form-item label="开始时间" prop="start_time">
        <el-input v-model="dataForm.start_time" placeholder="开始时间(hh:mm:ss)"></el-input>
      </el-form-item>
      <el-form-item label="结束时间" prop="end_time">
        <el-input v-model="dataForm.end_time" placeholder="结束时间(hh:mm:ss)"></el-input>
      </el-form-item>
      <el-form-item label="星期" prop="weekday">
        <el-input v-model="dataForm.weekday" placeholder="星期(1、2、3、4、5、6、7)"></el-input>
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
        clsid:0,
        dataForm: {
          id: 0,
          course_id:'',
          course_name:'',
          tea_id:'',
          tea_name:'',
          start_time: '',
          end_time: '',
          weekday: ''
        },
        dataRule: {
          course_id: [
            { required: true, message: '课程id不能为空', trigger: 'blur' }
          ],
          course_name: [
            { required: true, message: '课程名称不能为空', trigger: 'blur' }
          ],
          tea_id: [
            { required: true, message: '教师ID不能为空', trigger: 'blur' }
          ],
          tea_name: [
            { required: true, message: '教师名称不能为空', trigger: 'blur' }
          ],
          start_time: [
            { required: true, message: '开始时间不能为空', trigger: 'blur' }
          ],
          end_time: [
            { required: true, message: '结束时间不能为空', trigger: 'blur' }
          ],weekday: [
            { required: true, message: '星期不能为空', trigger: 'blur' }
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
        this.clsid=clsid
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/eyereportdata/schoolcourseinfo/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm = data.data
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/eyereportdata/schoolcourseinfo/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'course_id': this.dataForm.course_id,
                'course_name': this.dataForm.course_name,
                'tea_id': this.dataForm.tea_id,
                'tea_name': this.dataForm.tea_name,
                'start_time': this.dataForm.start_time,
                'end_time': this.dataForm.end_time,
                'weekday': this.dataForm.weekday,
                'class_name':this.clsid
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
