<template>
  <div class="teacher-main">
    <img src="~@/assets/img/teacher.png" style="position: absolute;width: 100%;" />
    <el-row>
      <center>
        <el-form :inline="true" size="medium">
          <div>
            <el-form-item>
              <el-radio-group v-model="radio3">
                <el-radio-button label="按天" @click.native.prevent="changedatetype('按天')"></el-radio-button>
                <el-radio-button label="按月" @click.native.prevent="changedatetype('按月')"></el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-date-picker value-format="yyyy-MM-dd" v-model="dataForm.datepk" :type="daterange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="教师" prop="studentName">
              <el-select v-model="dataForm.teach" filterable placeholder="请选择">
                <el-option v-for="item in options" :key="item.tea_id" :label="item.tea_name" :value="item.tea_id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-button @click="query" :loading="false">查询</el-button>
          </div>
        </el-form>
      </center>
    </el-row>
    <div :style="{visibility: show ? 'visible' : 'hidden'}">
       <el-row :gutter="20">
        <el-col :span="6" :offset="4">
          <div id="xsqxzt" class="chart-box"></div>
        </el-col>
        <el-col :span="6" :offset="4">
        <div id="xsxxzt"  class="chart-box"></div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col><div class="title"></div></el-col>
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
          <div id="xsqxzt" class="chart-box"></div>
        </el-col>
        <el-col :span="6" :offset="4">
        <div id="xsxxzt"  class="chart-box"></div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import echarts from "echarts";
export default {
  data() {
    return {
      daterange: "daterange",
      show: true,
      options: [],
      radio3: "按天",
      iheight: 0,
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setDate(start.getDate() - 7);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      chartxsqxzt: null,
      chartxsxxzt:null,
      dataForm: {
        datepk: "",
        teach: ""
      }
    };
  },
  mounted() {
    this.init();
    this.initxsqx();
    this.initxsxxzt();
  },
  activated() {
    // 由于给echart添加了resize事件, 在组件激活时需要重新resize绘画一次, 否则出现空白bug
    if (this.chartxsqxzt) {
      this.chartxsqxzt.resize();
    }
     if (this.chartxsxxzt) {
      this.chartxsxxzt.resize();
    }
  },
  methods: {
    //表格属性
    tableheaderCellStyle({ row, column, rowIndex, columnIndex }) {
      return "background:#303660;color:#ffffff;border:#2a2f4d";
    },
    tableCellStyle({ row, column, rowIndex, columnIndex }) {
      return "color:#e8b898;background:#2a2f4d;border:#2a2f4d";
    },
    query() {
      var date1 = "";
      var date2 = "";
      date1 = this.dataForm.datepk[0];
      date2 = this.dataForm.datepk[1];
      this.$http({
        url: this.$http.adornUrl("/report/pro"),
        method: "post",
        data: this.$http.adornData({
          date1: date1,
          date2: date2,
          studentid: this.dataForm.studentid
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log(data);
          this.show = true;
        } else {
          this.$message.error(data.msg);
        }
      });
      // console.log(this.dataForm);
    },
    init() {
      this.iheight = window.innerHeight - 800 + "px";
        this.getstudentlist(this.dataForm.deptId);
    },
    changedatetype(e) {
      this.radio3 = e;
      if (e === "按天") {
        this.radio3 = e;
        this.daterange = "daterange";
        this.pickerOptions = {
          shortcuts: [
            {
              text: "最近一周",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setDate(start.getDate() - 7);
                picker.$emit("pick", [start, end]);
              }
            }
          ]
        };
        this.dataForm.datepk = "";
      } else {
        this.daterange = "monthrange";
        this.pickerOptions = {
          shortcuts: [
            {
              text: "最近一月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setDate(start.getDate() - 7);
                picker.$emit("pick", [start, end]);
              }
            }
          ]
        };
        this.dataForm.datepk = "";
      }
    },
    getstudentlist(id) {
      this.$http({
        url: this.$http.adornUrl(`/report/tealist`),
        methods: "get",
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.options = data.data;
        this.dataForm.teach = "";
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
    }
  }
};
</script>


<style   lang="scss" >
.teacher-main {
  position: absolute;
  left: 1%;
  right: 1%;
  top: 0;
  bottom: 1%;
  //min-width: 1600px;
  overflow-x: hidden;
  overflow-y: auto;
  background: #242636;
  .tabless {
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
    height: 25px;
  }
  .titles {
    letter-spacing: 2px;
    color: #ffffff;
    font-size: 20px;
    padding-bottom: 5px;
    padding-top: 10px;
    font-weight: bold;
    font-family: "Microsoft YaHei";
    padding-left: 20px;
    height: 40px;
    background-color: #2f345c;
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
  .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background-color: #0c1352;
  }
  .el-input__inner {
    color: #f5f5f5;
  }
  .el-table th,
  .el-table tr {
    background: #303660;
  }
}
//start
.eyereport-teacher {
  .el-date-range-picker__content.is-left {
    background-color: #343a6d !important;
  }
  .el-date-range-picker__content.is-right {
    background-color: #343a6d !important;
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
  .el-date-table td.next-month,
  .el-date-table td.prev-month {
    color: #606266;
  }
  .el-date-picker__header-label {
    color: #ffffff;
  }
  .el-tree-node__content:hover {
    background-color: #0c1352;
  }
  .el-month-table td .cell {
    color: #ffffff;
  }
  .el-select-dropdown__item.hover,
  .el-select-dropdown__item:hover {
    background-color: #0c1352;
  }
  .el-tree-node:focus > .el-tree-node__content {
    background-color: #0c1352;
  }
}
</style>
