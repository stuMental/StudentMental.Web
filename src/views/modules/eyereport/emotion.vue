<template>
  <div class="mod-emotion-echarts">
    <el-row>
      <el-form :inline="true">
        <el-row>
          <el-form-item>
            <el-radio-group v-model="radio3" fill="#3E8EF7">
              <el-radio-button style="color:blue" label="按天" @click.native.prevent="changedatetype('按天')"></el-radio-button>
              <el-radio-button label="按月" @click.native.prevent="changedatetype('按月')"></el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-show="visible">
            <el-date-picker v-model="dataForm.datepk" type="daterange" :picker-options="pickerOptions" range-separator=" 至 " start-placeholder="开始日期" end-placeholder="结束日期" align="right">
            </el-date-picker>
          </el-form-item>
          <el-form-item v-show="!visible">
            <el-date-picker v-model="dataForm.date1" type="month" align="right">
            </el-date-picker> 至
            <el-date-picker v-model="dataForm.date2" type="month" align="right">
            </el-date-picker>
          </el-form-item>
          <el-button type="primary" @click="addDomain">新增</el-button>
          <el-button @click="initChartLine">查询</el-button>
        </el-row>
        <el-row v-for="(datastu,index) in dataForm.DataStus" :key="index">
          <el-form-item label="部门" prop="deptName">
            <el-popover placement="bottom-start" trigger="click" ref="deptListPopover">
              <el-tree :data="deptList" :props="deptListTreeProps" node-key="deptId" ref="deptListTree" @current-change="((item)=>{deptListTreeCurrentChangeHandle(item, index)})" :default-expand-all="true" :highlight-current="true" :expand-on-click-node="false">
              </el-tree>
              <el-input v-model="datastu.deptName" slot="reference" :readonly="true" placeholder="点击选择班年级" class="dept-list__input"></el-input>
            </el-popover>

          </el-form-item>
          <el-form-item label="学生" prop="studentName">
            <el-select v-model="datastu.student" filterable placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-button type="danger" @click.prevent="removeDomain(datastu)">删除</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <div id="emotion" class="chart-box"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from "echarts";
import { treeDataTranslate } from "@/utils";
export default {
  data() {
    return {
      options: [
        {
          value: "1",
          label: "李明"
        },
        {
          value: "2",
          label: "赵国"
        },
        {
          value: "3",
          label: "李华"
        },
        {
          value: "4",
          label: "马超"
        },
        {
          value: "5",
          label: "赵明"
        },
        {
          value: "6",
          label: "赵华"
        }
      ],
      visible: true,
      radio3: "按天",
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
      chartLine: null,
      deptId: 0,
      deptList: [],
      deptListTreeProps: {
        label: "name",
        children: "children"
      },
      dataForm: {
        date1: "",
        date2: "",
        DataStus: [
          {
            student: "",
            deptName: ""
          }
        ],
        datepk: ""
      }
    };
  },
  mounted() {
    this.init();
    this.initChartLine();
  },
  activated() {
    // 由于给echart添加了resize事件, 在组件激活时需要重新resize绘画一次, 否则出现空白bug
    if (this.chartLine) {
      this.chartLine.resize();
    }
  },
  methods: {
    removeDomain(item) {
      var index = this.dataForm.DataStus.indexOf(item);
      if (index !== 0) {
        this.dataForm.DataStus.splice(index, 1);
      }
    },
    addDomain() {
      this.dataForm.DataStus.push({
        student: "",
        deptName: ""
      });
    },
    deptListTreeCurrentChangeHandle(data, node) {
      this.dataForm.deptId = data.deptId;
      this.dataForm.deptName = data.name;
      this.dataForm.DataStus[node].deptName = data.name;
      this.$refs["deptListPopover"].doClose();
    },
    init() {
      this.$http({
        url: this.$http.adornUrl("/sys/dept/select"),
        method: "get",
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.deptList = treeDataTranslate(data.deptList, "deptId");
      });
    },
    changedatetype(e) {
      this.radio3 = e;
      if (e === "按天") {
        this.radio3 = e;
        this.visible = true;
      } else {
        this.visible = false;
      }
    },
    // 折线图
    initChartLine() {
      var option = {
        title: {
          text: "情绪趋势"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["李明", "赵国", "李华", "马超", "赵明", "赵华"]
        },
        animation: true,
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [
            "2018/12/24",
            "2018/12/25",
            "2018/12/26",
            "2018/12/27",
            "2018/12/28"
          ]
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: function(value) {
              var texts = [];
              if (value == 0) {
                texts.push("开心");
              } else if (value == 1) {
                texts.push("正常");
              } else if (value == 2) {
                texts.push("低落");
              }
              return texts;
            }
          }
        },
        series: [
          {
            name: "李明",
            type: "line",
            itemStyle: { normal: { areaStyle: { type: "default" } } },
            data: [1, 1, 0, 1, 1]
          },
          {
            name: "赵国",
            type: "line",
            itemStyle: { normal: { areaStyle: { type: "default" } } },
            data: [2, 0, 0, 1, 1]
          },
          {
            name: "李华",
            type: "line",
            itemStyle: { normal: { areaStyle: { type: "default" } } },
            data: [1, 0, 0, 0, 1]
          },
          {
            name: "马超",
            type: "line",
            itemStyle: { normal: { areaStyle: { type: "default" } } },
            data: [2, 1, 1, 2, 2]
          },
          {
            name: "赵明",
            type: "line",
            itemStyle: { normal: { areaStyle: { type: "default" } } },
            data: [2, 1, 0, 1, 2]
          },
          {
            name: "赵华",
            type: "line",
            itemStyle: { normal: { areaStyle: { type: "default" } } },
            data: [2, 1, 0, 1, 1]
          }
        ]
      };
      this.chartLine = echarts.init(document.getElementById("emotion"));
      this.chartLine.setOption(option);
      window.addEventListener("resize", () => {
        this.chartLine.resize();
      });
    }
  }
};
</script>

<style lang="scss">
.mod-emotion-echarts {
  > .el-alert {
    margin-bottom: 10px;
  }
  > .el-row {
    margin-top: -10px;
    margin-bottom: -10px;
    .el-col {
      padding-top: 10px;
      padding-bottom: 10px;
    }
  }
  .chart-box {
    min-height: 400px;
  }
}
.mod-menu {
  .dept-list__input,
  .icon-list__input {
    > .el-input__inner {
      cursor: pointer;
    }
  }
}
</style>