<template>
  <el-dialog
    :title="!dataForm.studentNumber ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm"  ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item label="学号" prop="studentNumber">
        <el-input v-model="dataForm.studentNumber" :disabled="disabled" placeholder="学号"></el-input>
      </el-form-item>
      <el-form-item label="学生名称" prop="studentName">
        <el-input v-model="dataForm.studentName" placeholder="学生名称"></el-input>
      </el-form-item>
      <el-form-item label="年级" prop="gradeName">
        <el-input v-model="dataForm.gradeName" placeholder="年级"></el-input>
      </el-form-item>
      <el-form-item label="学院" prop="collegeName">
        <el-input v-model="dataForm.collegeName" placeholder="学院"></el-input>
      </el-form-item>
      <el-form-item label="班级" prop="className">
        <el-input v-model="dataForm.className" placeholder="班级"></el-input>
      </el-form-item>
      <el-form-item label="课堂ID" prop="courseId">
        <el-input v-model="dataForm.courseId" placeholder="课堂ID"></el-input>
      </el-form-item>
      <el-form-item label="课堂名称" prop="courseName">
        <el-input v-model="dataForm.courseName" :disabled="disabled" placeholder="课堂名称"></el-input>
      </el-form-item>
      <el-form-item label="教师编号" prop="teacherId">
        <el-input v-model="dataForm.teacherId" placeholder="教师编号"></el-input>
      </el-form-item>
      <el-form-item label="教师名称" prop="teacherName">
        <el-input v-model="dataForm.teacherName" placeholder="教师名称"></el-input>
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-time-picker value-format="HH:mm:ss" :disabled="disabled"  v-model="dataForm.startTime" placeholder=""></el-time-picker>
        <!-- <el-input v-model="dataForm.startTime" placeholder="开始时间"></el-input> -->
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
         <el-time-picker value-format="HH:mm:ss"   v-model="dataForm.endTime" placeholder=""></el-time-picker>
        <!-- <el-input v-model="dataForm.endTime" placeholder="结束时间"></el-input> -->
      </el-form-item>
      <el-form-item label="教室编号" prop="roomId">
        <el-input v-model="dataForm.roomId" placeholder="教室编号"></el-input>
      </el-form-item>
      <el-form-item label="教室地址" prop="roomAddr">
        <el-input v-model="dataForm.roomAddr" :disabled="disabled" placeholder="教室地址"></el-input>
      </el-form-item>
      <el-form-item label="星期" prop="weekday">
        <el-select v-model="dataForm.weekday" :disabled="disabled" placeholder="星期">
          <el-option  label="星期一" value="2"></el-option>
          <el-option  label="星期二" value="3"></el-option>
          <el-option  label="星期三" value="4"></el-option>
          <el-option   label="星期四" value="5"></el-option>
          <el-option   label="星期五" value="6"></el-option>
          <el-option   label="星期六" value="7"></el-option>
          <el-option   label="星期日" value="1"></el-option>
        </el-select>
        <!-- <el-input v-model="dataForm.weekday" placeholder="星期"></el-input> -->
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
        disabled:false,
        visible: false,
        dataForm: {
        },
      }
    },
    methods: {
      init (id) {
        if(id)
        {
        this.dataForm= id
        this.disabled=true
        }else
        {
          this.dataForm={}
          this.disabled=false
        }
        this.visible = true
        
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/course/save`),
              method: 'post',
              data: this.$http.adornData(this.dataForm, false)
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
