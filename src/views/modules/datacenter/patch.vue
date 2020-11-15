<template>
    <div>
        <!-- 下载模板 -->
        <el-row class="top">
            <el-col :span="12">
                <span>数据导入流程</span>
            </el-col>
            <el-col :span="12" class="download">
                <span>导入模板下载</span>
            </el-col>
        </el-row>
        <!-- 流程图 -->
        <div class="flow">
            <div class="box classroom">班年级导入</div>
            <div class="box teacher">教师导入</div>
            <div class="box camera">摄像头与教室关系导入</div>
            <div class="box course">课程名称导入</div>
            <div class="box student">学生信息与照片导入</div>
            <div class="box course_time">课程时间创建（手动）</div>
            <div class="box course_info">课程信息创建（手动）</div>
            <div class="line1"></div>
            <div class="line2"></div>
            <div class="line3"></div>
            <div class="line4"></div>
            <div class="line5"></div>
            <div class="line6"></div>
        </div>
        <!-- 注意事项 -->
        <div class="note">
            <p class="bold">注意事项：</p>
            <p>该数据导入页面仅支持全校公共性的数据导入，比如班年级、教师、课程名称、教师和摄像头等。</p>
            <p>2.学生信息以及学生照片的批量导入在学生管理页面由各个班级的班主任操作导入完成，此页面流程图中为跳转链接。</p>
            <p>3.课程信息由各个班级的班主任在课程管理页面手动创建完成，此页面流程图中为跳转链接。</p>
        </div>
    </div>
</template>

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
        height: 500px;
        position: absolute;
        top: 51px;
        left: 195px;
    }
    .line2 {
        background: url(../../../assets/img/line2.png) no-repeat;
        background-size: contain;
        width: 110px;
        height: 500px;
        position: absolute;
        top: 82px;
        left: 460px;
    }
    .line4 {
        background: url(../../../assets/img/line2.png) no-repeat;
        background-size: contain;
        width: 110px;
        height: 500px;
        position: absolute;
        top: 332px;
        left: 460px;  
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