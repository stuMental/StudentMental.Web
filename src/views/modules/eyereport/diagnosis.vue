<template>
  <div class="pro-main">
    <img src="~@/assets/img/diagnosis.png" style="position: absolute;width: 100%;" />
    <el-row>
      <el-form :inline="true">
        <div>
          <center>
            <el-form-item>日期：
              <el-date-picker value-format="yyyy-MM-dd" v-model="dataForm.date1" type="date" align="right"></el-date-picker>
            </el-form-item>
            <el-form-item label="院系" prop="deptName">
              <el-popover placement="bottom-start" trigger="click" ref="deptpopover">
                <el-tree :data="deptList" :props="deptListTreeProps" node-key="deptId" ref="deptListTree" @current-change="deptListTreeCurrentChangeHandle" :default-expand-all="false" :highlight-current="true" :expand-on-click-node="false">
                </el-tree>
                <el-input v-model="dataForm.deptName" slot="reference" :readonly="true" placeholder="点击选择班年级" class="dept-list__input"></el-input>
              </el-popover>
            </el-form-item>
            <el-form-item label="学生" prop="studentName">
              <el-select v-model="dataForm.studentid" filterable placeholder="请选择">
                <el-option v-for="item in options" :key="item.studentNumber" :label="item.studentName" :value="item.studentNumber">
                </el-option>
              </el-select>
            </el-form-item>
            <el-button @click="query" :loading="false">查询</el-button>
          </center>
        </div>
      </el-form>
    </el-row>
    <!-- 学业诊断 -->
    <div :style="{visibility: show ? 'visible' : 'hidden'}">
      <el-row>
        <el-col :span="10" :offset="1" v-for="(course, i) in classData" :key="i">
          <!-- <div class="title">语文&nbsp;<img src="~@/assets/img/xyztfxico.png" /></div> -->
          <div class="title">{{course.course_name}}&nbsp;<img src="~@/assets/img/xyztfxico.png" /></div>
          <div :id="'chart'+i" :ref="'chart' + i" class="chart-box" style="height:353px"></div>
          <div class="chart-box" style="min-height:100px">
            <span class="remark-student" style="color:#ffffff;font-size:15px;float: left;text-align: center;width: 100%;">
              学生维度：学业状态，{{course.study_level}}；成绩：{{course.grade_level}}</span>
              <!-- 学生维度：学业状态，93；成绩：95</span> -->
            <span class="remark-class" style="color:#ffffff;font-size:15px;float: left;text-align: center;width: 100%;">
              班级维度：学业状态，{{course.study_level}}；成绩：{{course.grade_level}}</span>
          </div>
        </el-col>
        <!-- <el-col :span="10" :offset="1">
          <div class="title">数学&nbsp;<img src="~@/assets/img/xyztfxico.png" /></div>
          <div id="chartAditorBox1" class="chart-box" style="height:353px"></div>
          <div class="chart-box" style="min-height:100px">
            <span style="color:#ffffff;font-size:15px;float: left;text-align: center;width: 100%;">学生维度：学业状态，93；成绩：95</span>
            <span style="color:#ffffff;font-size:15px;float: left;text-align: center;width: 100%;">班级维度：学业状态，93；成绩：95</span>
          </div>
        </el-col>
        <el-col :span="10" :offset="1">
          <div class="title">数学&nbsp;<img src="~@/assets/img/xyztfxico.png" /></div>
          <div id="chartAditorBox1" class="chart-box" style="height:353px"></div>
          <div class="chart-box" style="min-height:100px">
            <span style="color:#ffffff;font-size:15px;float: left;text-align: center;width: 100%;">学生维度：学业状态，93；成绩：95</span>
            <span style="color:#ffffff;font-size:15px;float: left;text-align: center;width: 100%;">班级维度：学业状态，93；成绩：95</span>
          </div>
        </el-col>  -->
      </el-row>      

      <el-row :gutter="20" style="height:50px">
      </el-row>
    </div>
  </div>
</template>


<script>
import Clasdetail from "./clasdetail";
import echarts from "echarts";
import { treeDataTranslate } from "@/utils";
import '@/assets/scss/common.scss'
export default {
  data() {
    return {
      clasdetailVisible: false,
      qxdata: [],
      rjdata: [],
      xxdata: [],
      jsdata: [],
      xkxqdatax: [],
      xkxqdatay: [],
      yjData: [],
      yjcols: [],
      chartqxhistory: null,
      chartjshistory: null,
      chartzthistory: null,
      chartxkxq: null,
      chartxyzl: null,
      chartjszl: null,
      chartxljk: null,
      charrjzl: null,
      show: false,
      cols: [],
      tableData: [],
      //班级
      elcls: false,
      deptId: 0,
      deptList: [],
      deptListTreeProps: {
        label: "name",
        children: "children"
      },
      dataForm: {
        date1: "",
        // datepk: "",
        deptId: 0,
        deptName: "",
        studentid: ""
      },
      qxtimeline: [],
      kxdata: [],
      zcdata: [],
      dldata: [],
      jstimeline: [],
      jjdata: [],
      jszcdata: [],
      pbdata: [],
      xxtimeline: [],
      lhdata: [],
      xxzcdata: [],
      bjdata: [],
      fchdata: [],
      options: [],
      aditorlegend: [],
      Aditordata: [],
      chartAditor: [],
      classData: []
    };
  },
  components: {
    Clasdetail
  },
  mounted() {
    this.init();
  },
  activated() {
    // 由于给echart添加了resize事件, 在组件激活时需要重新resize绘画一次, 否则出现空白bug
    if (this.chartxljk) {
      this.chartxljk.resize();
    }
    if (this.chartxyzl) {
      this.chartxyzl.resize();
    }
    if (this.chartjszl) {
      this.chartjszl.resize();
    }
    if (this.chartxkxq) {
      this.chartxkxq.resize();
    }
    if (this.chartqxhistory) {
      this.chartqxhistory.resize();
    }
    if (this.chartjshistory) {
      this.chartjshistory.resize();
    }
    if (this.chartzthistory) {
      this.chartzthistory.resize();
    }
    this.chartAditor.forEach((v, i) => {
      if (this.chartAditor[i]) {
        this.chartAditor[i].resize();
      }
    })

  },
  methods: {
    //散点图
    initChart(i) {
      var option = {
        tooltip: {
          // trigger: 'axis',
          showDelay: 0,
          formatter: function(params) {
            if (params.value.length > 1) {
              return (
                params.seriesName +
                " <br/>" +
                "学业状态" +
                params.value[0] +
                " , " +
                "成绩" +
                params.value[1]
              );
            } else {
              return (
                params.seriesName +
                " :<br/>" +
                "学业状态" +
                params.name +
                " , " +
                "成绩" +
                params.value
              );
            }
          }
        },
        grid: {
          left: "10%",
          right: "20%",
          containLabel: true,
          bottom:"10%"
        },
        // legend: {
        //   data: this.aditorlegend,
        //   left: "center",
        //   top: "bottom",
        //   formatter: function(item) {
        //     var rt = item;
        //     datas.forEach(ad => {
        //       if (ad.name == item) {
        //         rt = ad.name + ": 学业状态 " + ad.data[0].join(" 成绩 ");
        //       }
        //     });
        //     return rt;
        //   },
        //   textStyle: {
        //     color: "#ffffff",
        //     fontSize: 16
        //   }
        // },
        xAxis: [
          {
            min: -1,
            max: 1,
            name: "学业状态",
            type: "value",
            scale: true,
            axisLine: {
              symbol: ["none", "arrow"]
            },
            axisLabel: {
              formatter: "{value} "
            },
            interval: 0.1,
            splitLine: {
              show: true,
              lineStyle: {
                color: "#555772"
              }
            },
            axisLine: {
              lineStyle: {
                color: "#ffffff",
                width: 1.5 //这里是为了突出显示加上的
              }
            }
          }
        ],
        yAxis: [
          {
            min: -1,
            max: 1,
            name: "成绩",
            axisLine: {
              symbol: ["none", "arrow"]
            },
            type: "value",
            scale: true,
            axisLabel: {
              formatter: "{value} "
            },
            interval: 0.1,
            splitLine: {
              show: true,
              lineStyle: {
                color: "#555772"
              }
            },
            axisLine: {
              lineStyle: {
                color: "#ffffff",
                width: 1.5 //这里是为了突出显示加上的
              }
            }
          }
        ],
        series: [{
            type: 'scatter',
            name: '班级维度：',
            data: [[this.classData[i]['study_level'], this.classData[i]['grade_level']]],
            itemStyle: {
              color: '#2F4556'
            }
          },{
            type: 'scatter',
            name: '学生维度：',
            data: [[0.1, 0.3]],
            itemStyle: {
              color: '#A63738'
            }
          }
        ]
      };

      // 有坑，动态生成的dom获取不到，外面要加nextTick
      this.$nextTick(() => {
        this.chartAditor[i] = echarts.init(
          document.getElementById("chart" + i)
        );
        this.chartAditor[i].setOption(option,true);
        window.addEventListener("resize", () => {
          this.chartAditor[i].resize();
        });
      })
    },

    //表格属性
    tableheaderCellStyle({ row, column, rowIndex, columnIndex }) {
      return "background:#303660;color:#ffffff;border:#2a2f4d";
    },
    tableCellStyles({ row, column, rowIndex, columnIndex }) {
      return "color:#ffffff;background:#2a2f4d;border-color: #575c7c;border-font-size: 16px;";
    },
    tableheaderCellStyles({ row, column, rowIndex, columnIndex }) {
      return "background:#2a2f4d;border:#2a2f4d";
    },
    clasdetailshow(id) {
      this.clasdetailVisible = true;
      this.$nextTick(() => {
        this.$refs.clasdetail.init(this.dataForm, id);
      });
    },
    // 获取学生列表
    getstudentlist(id) {
      // console.log(id)
       this.$http({
        url: this.$http.adornUrl("/datacenter/schoolstudent/dict"),
        methods: "get",
        params: this.$http.adornParams({
          deptId: id
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.options=data.data;
        } else {
          this.options = [];
        }
      });
    },
    // 查询
    query() {
      if (this.dataForm.date1 === "") {
        this.$message({
          message: "时间不为空",
          type: "error",
          duration: 1500
        });
        return;
      }
      if (this.dataForm.deptName === "") {
        this.$message({
          message: "院系不为空",
          type: "error",
          duration: 1500
        });
        return;
      }
      if (this.dataForm.studentid === "") {
        this.$message({
          message: "学生不为空",
          type: "error",
          duration: 1500
        });
        return;
      }
      console.log(this.dataForm.date1, this.dataForm.deptId, this.dataForm.studentid)
      this.$http({
        url: this.$http.adornUrl("/report/diagnosis"),
        method: "post",
        data: this.$http.adornData({
          dt: this.dataForm.date1,
          deptid: this.dataForm.deptId,
          studentid: this.dataForm.studentid
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(data);
          this.classData = data.data.class;
          // this.studentData = data.data.student;
          this.show = true;
          // 图表渲染
          if(this.classData.length != 0){
            this.classData.forEach((v, i) => {
              this.chartAditor.push(i)
              this.initChart(i);
            })
          }
          
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    deptListTreeCurrentChangeHandle(data, node) {
      this.dataForm.deptId = data.deptId;
      this.dataForm.deptName = data.name;
      //this.dataForm.DataStus[node].deptName = data.name;
      this.$refs['deptpopover'].doClose()
    },
    init() {
      this.$http({
        url: this.$http.adornUrl("/sys/dept/select"),
        method: "get",
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.deptList = treeDataTranslate(data.deptList, "deptId");
      });
      this.getstudentlist(this.dataForm.deptId)
    }
  }
};
</script>

<style  lang="scss" >
.pro-main {
    #danger{
        margin: 100px 150px 0;
    }
  position: absolute;
  left: 1%;
  right: 1%;
  top: 0;
  bottom: 1%;
  overflow-x: hidden;
  overflow-y: auto;
  background: #242636;
  .tabless {
    position: unset;
    width: 100%;
    background-color: #303660;
    font-size: 18px;
    height: 140px;
    border: #2a2f4d;
  }
  .title {
    letter-spacing: 2px;
    color: #ffffff;
    font-size: 20px;
    margin-bottom: 5px;
    margin-top: 10px;
    font-weight: bold;
    font-family: "Microsoft YaHei";
    margin-left: 20px;
  }
  .el-row {
    top: 80px;
    background-color: #242636;  
  }
  .el-table::before {
    background: none;
  }
  .echartbg {
    background-color: rgb(52, 58, 109);
  }
  ::-webkit-scrollbar-track-piece {
    //滚动条凹槽的颜色，还可以设置边框属性
    background-color: #383f7f;
  }
  ::-webkit-scrollbar-track {
    background-color: #383f7f;
  }
  ::-webkit-scrollbar {
    //滚动条的宽度
    width: 16px;
    height: 9px;
  }
  ::-webkit-scrollbar-thumb {
    //滚动条的设置
    background-color: #2a305a;
    background-clip: padding-box;
    min-height: 28px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background-color: #2a305a;
  }
  ::-webkit-scrollbar-button {
    background-color: #2a305a;
    color: #c0c1ce;
  }

  .chart-box {
    min-height: 282px;
    background: #2f345c;
  }

  .el-form-item--medium .el-form-item__content,
  .el-form-item--medium .el-form-item__label {
    color: #f5f5f5;
  }

  .el-radio-button:first-child .el-radio-button__inner {
    border: 0;
    border-radius: 0;
  }
  .el-radio-button:last-child .el-radio-button__inner {
    border-radius: 0;
  }
  .el-radio-button__inner {
    background-color: #343a6d;
    color: #f5f5f5;
    border: 0;
  }

  .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    border: 1px solid #737cc2;
    background-color: #343a6d;
    box-shadow: inset 0px 0px 5px 1px #ffffff !important;
  }
  .el-input__inner {
    border: 0;
    background-color: #343a6d;
  }
  .el-range-editor--medium .el-range-separator {
    color: #f5f5f5;
  }
  .el-range-editor--medium .el-range-input {
    background-color: #343a6d;
  }
  .el-range-editor--medium .el-range-input::-webkit-input-placeholder {
    color: #f5f5f5;
  }
  .el-form-item--medium .el-form-item__content,
  .el-form-item--medium .el-form-item__label {
    color: #f5f5f5;
  }
  .el-button {
    background: #343a6d;
    color: #f5f5f5;
    border: 0;
  }
  .el-input__inner {
    color: #f5f5f5;
  }
  .el-table th,
  .el-table tr {
    background: #303660;
  }
}
.eyereport-clas {
  .el-picker-panel {
    color: #ffffff;
    border: 0;
  }
  .el-date-table td.next-month,
  .el-date-table td.prev-month {
    color: #606266;
  }
  .el-date-picker__header-label {
    color: #ffffff;
  }
  .el-select-dropdown__item.hover,
  .el-select-dropdown__item:hover {
    background-color: #0c1352;
  }
  .el-tree-node__content:hover {
    background-color: #0c1352;
  }
  .el-month-table td .cell {
    color: #ffffff;
  }
  .el-tree-node:focus > .el-tree-node__content {
    background-color: #0c1352;
  }

  .el-select-dropdown__item {
    color: #f5f5f5;
  }
  .el-picker-panel__sidebar {
    background-color: #343a6d;
    border: 0;
  }
  .el-date-range-picker__header {
    color: #f5f5f5;
  }
  .el-date-range-picker table {
    color: #f5f5f5;
  }
  .el-date-table th {
    color: #f5f5f5;
  }
  .el-picker-panel__shortcut {
    color: #f5f5f5;
  }
  .el-picker-panel {
    border: 0;
    background: #343a6d;
  }
  .el-picker-panel__icon-btn {
    color: #f5f5f5;
  }
  .el-date-table td.in-range div,
  .el-date-table td.in-range div:hover,
  .el-date-table.is-week-mode .el-date-table__row.current div,
  .el-date-table.is-week-mode .el-date-table__row:hover div {
    background-color: #0c1352;
  }
  .el-date-editor .el-range-input {
    color: #f5f5f5;
  }
  .el-month-table td.in-range div,
  .el-month-table td.in-range div:hover {
    background-color: #0c1352;
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 350px;
  }
  .el-date-editor .el-range-separator {
    padding: 0;
  }
  .el-popover {
    background: #343a6d;
    border: 0;
  }
  .el-tree-node {
    background: #343a6d;
    color: #f5f5f5;
  }
  .el-select-dropdown__empty {
    color: #f5f5f5;
  }
  .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background-color: #0c1352;
  }
  .el-select-dropdown {
    border: 0;
    background: #343a6d;
    color: #f5f5f5;
  }
  .el-table--border th.gutter:last-of-type {
    border: 0;
  }
}
  .remark-student, .remark-class{
    line-height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 5px;
  }
  .remark-student::before{
    content: "";
    display: inline-block;
    width: 20px;
    height: 20px;
    background-color: #A63738;
    border-radius: 50%;
    margin-right: 10px;
  }
  .remark-class::before{
    content: "";
    display: inline-block;
    width: 20px;
    height: 20px;
    background-color: #2F4555;
    border-radius: 50%;
    margin-right: 10px;
  }
</style>
