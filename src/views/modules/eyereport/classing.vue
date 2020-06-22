<template>
  <div class="classing-main">
    <img src="~@/assets/img/classing.png" style="position: absolute;width: 100%;" />
    <el-row>
      <el-form :inline="true">
        <div>
          <center>
            <el-form-item>日期：
              <el-date-picker value-format="yyyy-MM-dd" v-model="dataForm.date1" type="date" align="right"></el-date-picker>
            </el-form-item>
            <el-form-item label="班年级" prop="deptName">
              <el-popover placement="bottom-start" trigger="click" ref="deptpopover">
                <el-tree :data="deptList" :props="deptListTreeProps" node-key="deptId" ref="deptListTree" @current-change="deptListTreeCurrentChangeHandle" :default-expand-all="false" :highlight-current="true" :expand-on-click-node="false">
                </el-tree>
                <el-input v-model="dataForm.deptName" slot="reference" :readonly="true" placeholder="点击选择班年级" class="dept-list__input"></el-input>
              </el-popover>
            </el-form-item>
            <el-form-item label="科目" prop="course">
              <el-select v-model="dataForm.course" placeholder="请选择科目">
                <el-option v-for="item in options" :key="item.course_id" :label="item.course_name" :value="item.course_id"></el-option>
              </el-select>
            </el-form-item>
            <el-button @click="query" :loading="loading">查询</el-button>
          </center>
        </div>
      </el-form>
    </el-row>
    <div :style="{visibility: show ? 'visible' : 'hidden'}">
      <el-row :gutter="20">
        <el-col :span="4" :offset="1">
          <div class="title">学生&nbsp;<img src="~@/assets/img/gxfzico.png" /></div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6" :offset="4">
          <div id="xsqxzt" class="chart-box"></div>
        </el-col>
        <el-col :span="6" :offset="4">
        <div id="xsxxzt"  class="chart-box"></div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6" :offset="4">
          <div id="xsqxztqx" class="chart-box"></div>
        </el-col>
        <el-col :span="6" :offset="4">
        <div id="xsxxztqs"  class="chart-box"></div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4" :offset="1">
          <div class="title">教师&nbsp;<img src="~@/assets/img/gxfzico.png" /></div>
        </el-col>
      </el-row>
       <el-row :gutter="20">
        <el-col :span="6" :offset="4">
          <div id="jsqxzt" class="chart-box"></div>
        </el-col>
        <el-col :span="6" :offset="4">
        <div id="jsjxzt"  class="chart-box"></div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6" :offset="4">
          <div id="jsqxztqxs" class="chart-box"></div>
        </el-col>
        <el-col :span="6" :offset="4">
        <div id="jsjxztqx"  class="chart-box"></div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4" :offset="1">
          <div class="title">课堂&nbsp;<img src="~@/assets/img/gxfzico.png" /></div>
        </el-col>
      </el-row>
       <el-row :gutter="20">
        <el-col :span="6" :offset="2">
          <div id="ktjjx" class="chart-box"></div>
        </el-col>
        <el-col :span="6" :offset="1">
        <div id="ktzzd"  class="chart-box"></div>
        </el-col>
        <el-col :span="6" :offset="1">
        <div id="kthd"  class="chart-box"></div>
        </el-col>
      </el-row>
       <el-row :gutter="20">
        <el-col :span="6" :offset="2">
          <div id="ktjjxqs" class="chart-box"></div>
        </el-col>
        <el-col :span="6" :offset="1">
        <div id="ktzzdqs"  class="chart-box"></div>
        </el-col>
        <el-col :span="6" :offset="1">
        <div id="kthdqs"  class="chart-box"></div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4" :offset="1">
          <div class="title">课堂整体学习状态分析&nbsp;<img src="~@/assets/img/gxfzico.png" /></div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="20" :offset="2">
         <div id="ktztxx"  class="chart-box"></div>
        </el-col>
      </el-row>
    </div>
  </div>

</template>
<script>
import { treeDataTranslate } from "@/utils";
export default {
  data() {
    return {
      loading: false,
      dataForm: {
        date1: "",
        deptId: 0,
        deptName: "",
        course: ""
      },
      date1: "",
      show: true,
      deptListTreeProps: {
        label: "name",
        children: "children"
      },
      deptList: [],
      bodydata: [],
      smalldata: [],
      headdata: [],
      options: [],
      chartxsqxzt: null,
      chartxsqxztqx: null,
      chartxsxxzt:null,
      chartxsxxztqs:null
    };
  },
  mounted() {
    this.init();
    this.initxsqx();
    this.initxsqxztqx();
    this.initxsxxzt();
    this.initxsxxztqs();
  },
  activated() {
    if (this.chartxsqxzt) {
      this.chartxsqxzt.resize();
    }
    if (this.chartxsqxztqx) {
      this.chartxsqxztqx.resize();
    }
     if (this.chartxsxxzt) {
      this.chartxsxxzt.resize();
    }
    if (this.chartxsxxztqs) {
      this.chartxsxxztqs.resize();
    }
  },
  methods: {
    getcourse(deptid) {
      this.$http({
        url: this.$http.adornUrl("/report/courselist"),
        method: "post",
        data: this.$http.adornData({
          deptid: deptid
        })
      }).then(({ data }) => {
        // console.log(this.dataForm.course);
        this.options = data.data;
        this.dataForm.course = "";
      });
    },
    tableheaderCellStyle({ row, column, rowIndex, columnIndex }) {
      return "background:#303660;color:#ffffff;border:#2a2f4d";
    },
    tableCellStyles({ row, column, rowIndex, columnIndex }) {
      return "color:#ffffff;background:#2a2f4d;border-color: #575c7c;border-font-size: 16px;";
    },
    tableheaderCellStyles({ row, column, rowIndex, columnIndex }) {
      return "background:#2a2f4d;border:#2a2f4d";
    },
    deptListTreeCurrentChangeHandle(data, node) {
      this.dataForm.deptId = data.deptId;
      this.dataForm.deptName = data.name;
      this.getcourse(this.dataForm.deptId);
      this.$refs["deptpopover"].doClose();
    },
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
          message: "班级不为空",
          type: "error",
          duration: 1500
        });
        return;
      }
      if(this.dataForm.course==="")
      {
        this.$message({
          message: "科目不为空",
          type: "error",
          duration: 1500
        });
        return;
      }
      this.loading = true;
      this.$http({
        url: this.$http.adornUrl("/behavior/list"),
        method: "post",
        data: this.$http.adornData({
          date1: this.dataForm.date1,
          deptid: this.dataForm.deptId,
          course:this.dataForm.course
        })
      })
        .then(({ data }) => {
          this.loading = false;
          if (data && data.code === 0) {
            this.show = true;
            this.headdata = data.headdata;
            this.bodydata = data.bodydata;
            this.smalldata = data.smalldata;
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message({
            message: "请求接口错误",
            type: "error",
            duration: 1500,
            onClose: () => {
              this.display = false;
            }
          });
        });
    },
    init() {
      this.$http({
        url: this.$http.adornUrl("/sys/dept/select"),
        method: "get",
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.deptList = treeDataTranslate(data.deptList, "deptId");
        this.getcourse(this.dataForm.deptId);
      });
    },
    //报表
    initxsqx() {
      var option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          x: "left",
          data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"]
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: 335, name: "直接访问" },
              { value: 310, name: "邮件营销" },
              { value: 234, name: "联盟广告" },
              { value: 135, name: "视频广告" },
              { value: 1548, name: "搜索引擎" }
            ]
          }
        ]
      };
      this.chartxsqxzt = echarts.init(document.getElementById("xsqxzt"));
      this.chartxsqxzt.setOption(option);
      window.addEventListener("resize", () => {
        this.chartxsqxzt.resize();
      });
    },
    initxsqxztqx() {
      var option = {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line"
          }
        ]
      };
      this.chartxsqxztqx = echarts.init(document.getElementById("xsqxztqx"));
      this.chartxsqxztqx.setOption(option);
      window.addEventListener("resize", () => {
        this.chartxsqxztqx.resize();
      });
    },
    initxsxxzt() {
      var option = {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line"
          }
        ]
      };
      this.chartxsqxztqx = echarts.init(document.getElementById("xsxxzt"));
      this.chartxsqxztqx.setOption(option);
      window.addEventListener("resize", () => {
        this.chartxsqxztqx.resize();
      });
    },
    initxsxxztqs() {
      var option = {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line"
          }
        ]
      };
      this.chartxsqxztqx = echarts.init(document.getElementById("xsxxztqs"));
      this.chartxsqxztqx.setOption(option);
      window.addEventListener("resize", () => {
        this.chartxsqxztqx.resize();
      });
    }
  }
};
</script>
<style lang="scss">
.classing-main {
  //background: url(~@/assets/img/backimg.png);
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
.eyereport-classing {
  .el-tree {
    background-color: #343a6d;
    color: #ffffff;
  }
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
</style>


