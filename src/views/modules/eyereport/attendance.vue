<template>
  <div class="attendance-main">
    <img src="~@/assets/img/attendance.png" style="position: absolute;width: 100%;" />
    <el-row>
      <el-form :inline="true">
        <div>
          <center>
            <el-form-item>日期：
              <el-date-picker @change="datechange" value-format="yyyy-MM-dd" v-model="dataForm.date" type="date" align="right"></el-date-picker>
            </el-form-item>
            <el-form-item label="班年级" prop="deptName">
              <el-popover placement="bottom-start" trigger="click" ref="deptpopover">
                <el-tree :data="deptList" :props="deptListTreeProps" node-key="deptId" ref="deptListTree" @current-change="deptListTreeCurrentChangeHandle" :default-expand-all="false" :highlight-current="true" :expand-on-click-node="false">
                </el-tree>
                <el-input v-model="dataForm.deptName" slot="reference" :readonly="true" placeholder="点击选择班年级" class="dept-list__input"></el-input>
              </el-popover>
            </el-form-item>
            <el-form-item label="科目" prop="coursename">
              <el-select v-model="dataForm.coursename" placeholder="">
                 <el-option v-for="item in courses" :key="item.courseId" :label="item.courseName" :value="item.courseName"></el-option>
              </el-select>
            </el-form-item>
            <el-button @click="query" :loading="false">查询</el-button>
          </center>
        </div>
      </el-form>
    </el-row>
    <div :style="{visibility: show ? 'visible' : 'hidden'}">
      <el-row :gutter="20">
                <el-col :span="20" :offset="2" style="padding-right: 0px;">
                    <div class="title">{{dataForm.date1}}考勤统计&nbsp;<img src="~@/assets/img/xyzlico.png" /></div>
                    <el-table :data="data" class="tabless" style="padding-left:10px;background-color:inherit" border :header-cell-style="tableheaderCellStyle" :cell-style="tableCellStyles" :header-row-style="tableheaderCellStyles">
                        <el-table-column width="150px" prop="time_grap" label="时间" >
                        </el-table-column>
                        <el-table-column width="100px" label="总人数">
                            <template slot-scope="scope">
                                {{(scope.row.exisnum?scope.row.exisnum:0)+(scope.row.absence?scope.row.absence:0)}}
                            </template>
                        </el-table-column>
                        <el-table-column width="100px" prop="absence" label="缺勤人数">
                        </el-table-column>
                        <el-table-column width="300px" prop="absencename" label="缺勤姓名">
                        </el-table-column>
                        <el-table-column prop="attendancename" label="出勤姓名">
                        </el-table-column>
                    </el-table>
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
      show: false,
      deptList: [],
      deptListTreeProps: {
        label: "name",
        children: "children"
      },
      courses:[],
      data:[],
      dataForm: {
        date: "",
        deptId: "",
        coursename:"",
        deptName:""
      }
    };
  },
  mounted() {
    this.init();
  },
  methods: {
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
     deptListTreeCurrentChangeHandle(data, node) {
      this.dataForm.deptId = data.deptId;
      this.dataForm.deptName = data.name;
      //this.dataForm.DataStus[node].deptName = data.name;
      this.getcourse(data.deptId)
      this.$refs['deptpopover'].doClose()
    },
    datechange()
    {
    if(this.dataForm.deptId){
     this.getcourse(this.dataForm.deptId)
     }
    },
    getcourse(deptid){
        this.$http({
            url:this.$http.adornUrl("/course/courselist"),
            method:"POST",
            data:this.$http.adornData({
                deptid:deptid,
                date:this.dataForm.date
            })
        }).then(({data})=>{
            if(data.code===0)
            {
                this.courses=data.data
            }else
            {
                this.$message.error(data.msg); 
            }
        })

    },
    query() {
      if (this.dataForm.date === "") {
        this.$message({
          message: "时间不为空",
          type: "error",
          duration: 1500
        });
        return;
      }
      if(this.dataForm.deptId==="")
    {
        this.$message({
          message: "请选择班年级",
          type: "error",
          duration: 1500
        });
        return;
    }
    if(this.dataForm.coursename==="")
    {
        this.$message({
          message: "请选择科目",
          type: "error",
          duration: 1500
        });
        return;
    }
      this.$http({
        url: this.$http.adornUrl("/attendance/list"),
        method: "POST",
        data: this.$http.adornData({
          date: this.dataForm.date,
          deptId: this.dataForm.deptId,
          coursename:this.dataForm.coursename
        })
      }).then(({ data }) => {
        // console.log(data)
        if (data && data.code === 0) {
          this.show = true;
          this.data=data.data
        } else {
          this.show = false;
            this.data=[]
          this.$message.error(data.msg);
        }
      });
    },
    init() {
      this.$http({
        url: this.$http.adornUrl("/sys/dept/select"),
        method: "get",
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.deptList = treeDataTranslate(data.deptList, "deptId");
      });
    }
  }
};
</script>

<style  lang="scss" >
.attendance-main {
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
.eyereport-attendance {
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
