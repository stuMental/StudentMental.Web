<template>
  <div class="statistics-main">
    <img src="~@/assets/img/statistics.png" style="position: absolute;width: 100%;" />
    <el-row>
      <el-form :inline="true">
        <div>
          <center>
            <el-form-item>当前时间：{{nowTime}}</el-form-item>
            <el-form-item>
              <el-button @click="showhistory()">历史查询</el-button>
            </el-form-item>
          </center>
        </div>
      </el-form>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="20" :offset="2" style="padding-right: 0px;">
        <div class="title">
          人数实时统计{{times}}&nbsp;
          <img src="~@/assets/img/xyzlico.png" />
        </div>
        <el-table
          :data="dataFrom"
          class="tabless"
          style="padding-left:10px;background-color:inherit"
          border
          :header-cell-style="tableheaderCellStyle"
          :cell-style="tableCellStyles"
          :header-row-style="tableheaderCellStyles"
        >
          <el-table-column prop="roomaddra" label="教室"></el-table-column>
          <el-table-column prop="tootala" label="数量"></el-table-column>
          <el-table-column prop="roomaddrb" label="教室"></el-table-column>
          <el-table-column prop="tootalb" label="数量"></el-table-column>
          <el-table-column prop="roomaddrc" label="教室"></el-table-column>
          <el-table-column prop="tootalc" label="数量"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <statisticshistory v-if="historyVisible" ref="statisticshistory"></statisticshistory>
  </div>
</template>


<script>
import statisticshistory from "./statistics-history";
export default {
  data() {
    return {
      historyVisible: false,
      dataFrom: [],
      nowTime: "2020-12-12 12:20:20",
      times:""
    };
  },
  components: {
    statisticshistory
  },
  mounted() {
    this.nowTimes();
    this.getdata()
    setInterval(this.getdata,10000)
  },
  methods: {
    showhistory() {
      this.historyVisible = true;
      this.$nextTick(() => {
        this.$refs.statisticshistory.init();
      });
    },
    transdata(data) {
      if(data.length==0)
      {
        return;
      }
      this.dataFrom = [];
      // console.log(data)
        this.times=data[0].dt
      for (var a = 0; a <= data.length / 3; a++) {
        var newdata = {
          roomaddra: "",
          tootala: "",
          roomaddrb: "",
          tootalb: "",
          roomaddrc: "",
          tootalc: ""
        };
        if (3 * a + 0 < data.length) {
          newdata.roomaddra = data[3 * a + 0].room_addr;
          newdata.tootala = data[3 * a + 0].total;
        }
        if (3 * a + 1 < data.length) {
          newdata.roomaddrb = data[3 * a + 1].room_addr;
          newdata.tootalb = data[3 * a + 1].total;
        }
        if (3 * a + 2 < data.length) {
          newdata.roomaddrc = data[3 * a + 2].room_addr;
          newdata.tootalc = data[3 * a + 2].total;
        }
        if(newdata.roomaddra!="")
        {
        this.dataFrom.push(newdata);}
      }
    },
    //显示当前时间（年月日时分秒）
    timeFormate(timeStamp) {
      let year = new Date(timeStamp).getFullYear();
      let month =
        new Date(timeStamp).getMonth() + 1 < 10
          ? "0" + (new Date(timeStamp).getMonth() + 1)
          : new Date(timeStamp).getMonth() + 1;
      let date =
        new Date(timeStamp).getDate() < 10
          ? "0" + new Date(timeStamp).getDate()
          : new Date(timeStamp).getDate();
      let hh =
        new Date(timeStamp).getHours() < 10
          ? "0" + new Date(timeStamp).getHours()
          : new Date(timeStamp).getHours();
      let mm =
        new Date(timeStamp).getMinutes() < 10
          ? "0" + new Date(timeStamp).getMinutes()
          : new Date(timeStamp).getMinutes();
      let ss =
        new Date(timeStamp).getSeconds() < 10
          ? "0" + new Date(timeStamp).getSeconds()
          : new Date(timeStamp).getSeconds();
      let week = new Date(timeStamp).getDay();
      let weeks = ["日", "一", "二", "三", "四", "五", "六"];
      let getWeek = "星期" + weeks[week];
      this.nowTime =
        year +
        "年" +
        month +
        "月" +
        date +
        "日" +
        " " +
        hh +
        ":" +
        mm +
        ":" +
        ss +
        getWeek;
    },
    nowTimes() {
      this.timeFormate(new Date());
      setInterval(this.nowTimes, 1000);
      this.clear();
    },
    clear() {
      clearInterval(this.nowTimes);
      this.nowTimes = null; 
    },
    getdata() {
      this.$http({
        url: this.$http.adornUrl("/eyereportdata/statistics/listss"),
        method: "get"
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log(data);
          this.transdata(data.data);
          // console.log(this.dataFrom)
        } else {
          this.dataFrom = [];
        }
      });
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
    }
  }
};
</script>

<style  lang="scss" >
.statistics-main {
  //background: url(~@/assets/img/backimg.png);
  position: absolute;
  left: 1%;
  right: 1%;
  top: 0;
  bottom: 1%;
  overflow-x: hidden;
  overflow-y: auto;
  background: #242636;
  .chart-box {
    min-height: 400px;
    height:400px;
    background: #2f345c;
  }
  .el-dialog {
    background: #242636;
  }
  .el-dialog__title {
    color: #ffffff;
  }
  .tabless {
    position: unset;
    width: 100%;
    background-color: #303660;
    font-size: 18px;
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
.eyereport-statistics {
  .el-range-editor--medium .el-range-input{
    font-size:13px
  }
  .el-picker-panel__footer{
    background-color: #343a6d;
    border-top-color:#343a6d;
  }
  .el-input__inner{
    color: #ffffff;
    background-color: #343a6d;
  }
  .el-button+.el-button{
    background-color: #343a6d;
    color: #ffffff;
    border: #343a6d;
  }
  .el-input.is-disabled .el-input__inner{
     background-color: #343a6d;
     color: #ffffff;
  }
  .el-time-spinner__list{
     background-color: #343a6d;
     color: #ffffff;
  }
  .el-time-panel__footer{
     background-color: #343a6d;
     color: #ffffff;
  }
  .el-time-spinner__item.active:not(.disabled)
  {
    color:#17B3A3;
  }
  .el-time-panel__btn{
    color:#17B3A3;
  }
  .el-date-range-picker__time-header{
    border-bottom:1px solid #343a6d;
  }
  .el-time-spinner__item{
    color: #ffffff;
  }
  .el-time-panel{
    border:1px solid #343a6d;
  }
  .el-time-panel__footer{
     border:1px solid #343a6d;
  }
  .el-time-spinner__item active{
    color: #0c1352;
  }
  .el-time-spinner__item:hover:not(.disabled):not(.active) {
  background: #0c1352;
  cursor: pointer
}
  .el-pagination button:disabled {
    background-color: #343a6d;
  }
  .el-pager li {
    background-color: #343a6d;
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
