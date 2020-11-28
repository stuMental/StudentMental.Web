<template>
    <div>
        <!-- 下载模板 -->
        <el-row class="top">
            <el-col :span="12">
                <span>数据导入流程</span>
            </el-col>
            <el-col :span="12" class="download">
                <a :href="zip" id="download">导入模板下载</a>
            </el-col>
        </el-row>
        <!-- 流程图 -->
        <div class="flow">
            <div class="box classroom" @click="openDia('dept')">班年级导入</div>
            <div class="box teacher" @click="openDia('teacher')">教师导入</div>
            <div class="box camera" @click="openDia('camera')">摄像头与教室关系导入</div>
            <div class="box course" @click="openDia('courseName')">课程名称导入</div>
            <div class="box student" @click="openDia('student')">学生信息导入</div>
            <div class="box studentImage" @click="openDia('studentImage')">学生照片导入</div>
            <div class="box course_time">课程时间创建（手动）</div>
            <div class="box course_info">课程信息创建（手动）</div>
            <div class="line1"></div>
            <div class="line2"></div>
            <div class="line3"></div>
            <div class="line4"></div>
            <div class="line5"></div>
            <div class="line6"></div>
            <div class="line7"></div>
        </div>
        <!-- 注意事项 -->
        <div class="note">
            <p class="bold">注意事项：</p>
            <p>1.该数据导入页面仅支持全校公共性的数据导入，比如班年级、教师、课程名称、教师和摄像头等。</p>
            <p>2.学生信息以及学生照片的批量导入在学生管理页面由各个班级的班主任操作导入完成，此页面流程图中为跳转链接。</p>
            <p>3.课程信息由各个班级的班主任在课程管理页面手动创建完成，此页面流程图中为跳转链接。</p>
        </div>
        <!-- 文件上传对话框 -->
        <el-dialog :visible.sync="dialogFormVisible">
            <el-upload drag :action="url" :data=fileType :before-upload="beforeUploadHandle" :on-success="successHandle" multiple :file-list="fileList" style="text-align: center;margin-left: 25%;width: 50%;">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或
                <em>点击上传</em>
                </div>
                <div class="el-upload__tip" slot="tip">只支持xls、xlsx格式！</div>
            </el-upload>
        </el-dialog>
        <!-- 学生照片上传对话框 -->
        <el-dialog :visible.sync="dialogImageVisible">
            <el-upload drag :action="imageUrl" list-type="picture" :data=fileType :before-upload="imageBeforeUploadHandle" :on-success="successHandle" multiple :file-list="fileList" style="text-align: center;margin-left: 25%;width: 50%;">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将照片拖到此处，或
                <em>点击上传</em>
                </div>
                <div class="el-upload__tip" slot="tip">只支持jpg、png格式！</div>
            </el-upload>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data () {
        return {
            dialogFormVisible: false,
            dialogImageVisible: false,
            zip: window.SITE_CONFIG.cdnUrl + "/static/zip/batch.zip",
            url: "",
            imageUrl : "",
            // fileType: {tablename: "dept"}
            // fileType: {tablename: "camera"}
            // fileType: {tablename: "courseName"}
            // fileType: {tablename: "teacher"}
            fileType: {tablename: ""},
            fileList: []
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        openDia(type) {
            if(type == "studentImage"){
                this.dialogImageVisible = true
            } else {
                this.dialogFormVisible = true               
            }
            this.fileType.tablename = type
        },
        init() {
            this.url = this.$http.adornUrl(
                `/report/uploadlocal/?token=${this.$cookie.get("token")}`
            );
            this.imageUrl = this.$http.adornUrl(
                `/report/uploadImage/?token=${this.$cookie.get("token")}`
            );
        },
        // 上传之前
        beforeUploadHandle(file) {
            if (
                file.
                file.type !== "application/vnd.ms-excel" &&
                file.type !==
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            ) {
                this.$message.error("只支持xls、xlsx格式！");
                return false;
            }
            this.num++;
        },
        // 学生照片上传之前检查
        imageBeforeUploadHandle(file) {
            // if (
            //     file.type !== "application/vnd." &&
            //     file.type !==
            //     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            // ) {
            //     this.$message.error("只支持xls、xlsx格式！");
            //     return false;
            // }
            // this.num++;
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
    }
}
</script>

<style scoped>
    .top {
        height: 30px;
        border-bottom: 1px solid #eee;
    }
    .download {
        text-align: right;
    }
    .flow {
        height: 350px;
    }
    .box {
        width: 160px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #94FFBE;
        position: absolute;
    }
    .classroom {
        top: 200px;
    }
    .teacher {
        top: 75px;
        left: 300px;
    }
    .camera {
        top: 200px;
        left: 300px;
    }
    .course {
        top: 325px;
        left: 300px;
    }
    .student {
        top: 75px;
        left: 570px;
    }
    .studentImage {
        top: 75px;
        left: 850px;
    }
    .course_time {
        top: 325px;
        left: 570px;
        background-color: #28AEAE;
    }
    .course_info {
        top: 200px;
        left: 850px;
        background-color: #28AEAE;
    }
    .line1 {
        background: url(../../../assets/img/line1.png) no-repeat;
        width: 100px;
        height: 270px;
        position: absolute;
        top: 94px;
        left: 195px;
    }
    .line2 {
        background: url(../../../assets/img/line2.png) no-repeat;
        background-size: contain;
        width: 110px;
        height: 30px;
        position: absolute;
        top: 82px;
        left: 460px;
    }
    .line3 {
        background: url(../../../assets/img/line3.png) no-repeat;
        background-size: cover;
        width: 390px;
        height: 30px;
        position: absolute;
        top: 203px;
        left: 460px;  
    }
    .line4 {
        background: url(../../../assets/img/line2.png) no-repeat;
        background-size: contain;
        width: 110px;
        height: 30px;
        position: absolute;
        top: 336px;
        left: 460px;  
    }
    .line5 {
        background: url(../../../assets/img/line5.png) no-repeat;
        background-size: contain;
        width: 110px;
        height: 118px;
        position: absolute;
        top: 100px;
        left: 735px;  
    }
    .line6 {
        background: url(../../../assets/img/line6.png) no-repeat;
        background-size: contain;
        width: 110px;
        height: 118px;
        position: absolute;
        top: 225px;
        left: 735px;  
    }
    .line7 {
        background: url(../../../assets/img/line2.png) no-repeat;
        background-size: contain;
        width: 118px;
        height: 118px;
        position: absolute;
        top: 82px;
        left: 730px;  
    }
    .note {
        font-size: 14px;
        color: #A9A9A9;
    }
    .bold {
        font-weight: bold;
        color: #303133;
    }
</style>