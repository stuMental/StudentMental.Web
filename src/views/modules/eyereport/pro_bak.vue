<template>
  <div class="mod-clas-echarts">
    <el-row>
      <el-form :inline="true">
        <el-row>
          <el-form-item>
            <el-radio-group
              v-model="radio3"
              fill="#3E8EF7"
            >
              <el-radio-button
                style="color:blue"
                label="按天"
                @click.native.prevent="changedatetype('按天')"
              ></el-radio-button>
              <el-radio-button
                label="按月"
                @click.native.prevent="changedatetype('按月')"
              ></el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-show="visible">
            <el-date-picker
              value-format="yyyy-MM-dd"
              v-model="dataForm.datepk"
              type="daterange"
              :picker-options="pickerOptions"
              range-separator=" 至 "
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item v-show="!visible">
            <el-date-picker
              value-format="yyyy-MM-dd"
              v-model="dataForm.date1"
              type="month"
              align="right"
            >
            </el-date-picker> 至
            <el-date-picker
              value-format="yyyy-MM-dd"
              v-model="dataForm.date2"
              type="month"
              align="right"
            >
            </el-date-picker>
          </el-form-item>
          <el-button @click="query">查询</el-button>
        </el-row>
        <el-row>
          <el-form-item
            label="班年级"
            prop="deptName"
          >
            <el-popover
              placement="bottom-start"
              trigger="click"
            >
              <el-tree
                :data="deptList"
                :props="deptListTreeProps"
                node-key="deptId"
                ref="deptListTree"
                @current-change="deptListTreeCurrentChangeHandle"
                :default-expand-all="true"
                :highlight-current="true"
                :expand-on-click-node="false"
              >
              </el-tree>
              <el-input
                v-model="dataForm.deptName"
                slot="reference"
                :readonly="true"
                placeholder="点击选择班年级"
                class="dept-list__input"
              ></el-input>
            </el-popover>

          </el-form-item>
          <el-form-item
            label="学生"
            prop="studentName"
          >
            <el-select
              v-model="dataForm.studentid"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
      </el-form>
    </el-row>
    <el-row
      :gutter="20"
      :style="{visibility: show ? 'visible' : 'hidden'}"
    >
      <el-col :span="24">
        <el-card>
          <el-row>
            <el-col
              :span="24"
              style="font-size: 20px;font-weight:bold"
            >
              个性化发展
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col
              :span="6"
              style="font-size: 18px;padding-top:40px"
            >学科兴趣</el-col>
            <el-col
              :span="6"
              style="font-size: 18px;padding-top:40px;font-weight:bold"
            >{{this.xkxq}}</el-col>
            <el-col
              :span="6"
              style="font-size: 18px;padding-top:40px"
            >体艺发展</el-col>
            <el-col
              :span="6"
              style="font-size: 18px;padding-top:40px;font-weight:bold"
            >{{this.tyfz}}</el-col>
          </el-row>
          <el-row>
            <el-col
              :span="24"
              style="font-size: 20px;padding-top:40px;font-weight:bold"
            >
              心理健康状态
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :span="12"
              :offset="5"
              style="font-size:18px;padding-top:20px"
            >人际关系
            </el-col>
            <el-col :span="6"
              style="font-size:18px;padding-top:20px">情绪状态
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :span="12"
              :offset="1"
              
            >
            <div
                id="rjzt_chart"
                class="chart-box"
              ></div>
            </el-col>
            <el-col :span="6" :offset="2">
              <div
                id="qxzt_chart"
                class="chart-box"
              ></div>
            </el-col>
          </el-row>
          <el-row style="padding-top:20px">
            <div
              id="bq_chart"
              class="chart-box"
            ></div>
          </el-row>
          <el-row style="font-size:20px;padding-top:20px;font-weight:bold"> 学业自律性
          </el-row>
          <el-row :gutter="20">
            <el-col
              :span="12"
              :offset="5"
              style="font-size:20px;padding-top:20px"
            >精神状态
            </el-col>
            <el-col
              :span="6"
              style="font-size:20px;padding-top:20px"
            >学习状态
            </el-col>
          </el-row>
          <el-row>
            <div
              id="xyzlchart"
              class="chart-box"
            ></div>
          </el-row>
          <el-row>
            <div
              id="jsztline"
              class="chart-box"
            ></div>
          </el-row>
          <el-row>
            <div
              id="xxztline"
              class="chart-box"
            ></div>
          </el-row>
          <el-row style="font-size:20px;padding-top:20px;font-weight:bold"> 学生综合状态总结
          </el-row>
          <el-row>
            <div
              id="chartRadarBoxxszt"
              class="chart-box"
            ></div>
          </el-row>
          <el-row style="font-size:20px;padding-top:40px;font-weight:bold"> 学业状态分析
          </el-row>
          <el-row>
            <div
              id="chartAditorBox"
              class="chart-box"
            ></div>
          </el-row>
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
      show: false,
      xkxq: "",
      tyfz: "",
      rjgx: "",
      qxzt: [],
      bq: [],
      bqtime: [],
      jsztdata: [],
      xxztdata: [],
      jsztlinedata: [],
      jsztline: [],
      xxztline: [],
      xxztlinedata: [],
      xszt: [],
      aditorlegend: [],
      Aditordata: [],
      options: [],
      chartqxzt: null,
      chartrjzt: null,
      chartbq: null,
      chartxyzl: null,
      chartLinexxzt: null,
      chartLinejszt: null,
      ChartRadarxszt: null,
      chartAditor: null,
      visible: true,
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
      deptId: 0,
      deptList: [],
      deptListTreeProps: {
        label: "name",
        children: "children"
      },
      dataForm: {
        date1: "",
        date2: "",
        datepk: "",
        deptId: 0,
        deptName: "",
        studentid: "",
        studentname: ""
      }
    };
  },
  mounted() {
    this.init();
    this.initChartqxzt();
    this.initChartrjzt();
    this.initchartbq();
    this.initChartxyzl();
    this.initChartxxztline();
    this.initChartLinejszt();
    this.initChartRadarxszt();
    this.initChartAditor();
  },
  activated() {
    // 由于给echart添加了resize事件, 在组件激活时需要重新resize绘画一次, 否则出现空白bug
    if (this.chartqxzt) {
      this.chartqxzt.resize();
    }
    if (this.chartrjzt) {
      this.chartrjzt.resize();
    }
    if (this.chartbq) {
      this.chartbq.resize();
    }
    if (this.chartxyzl) {
      this.chartxyzl.resize();
    }
    if (this.chartLinexxzt) {
      this.chartLinexxzt.resize();
    }
    if (this.chartLinejszt) {
      this.chartLinejszt.resize();
    }
    if (this.ChartRadarxszt) {
      this.ChartRadarxszt.resize();
    }
    if (this.chartAditor) {
      this.chartAditor.resize();
    }
  },
  methods: {
    query() {
      var date1 = "";
      var date2 = "";
      if (this.dataForm.datepk === "") {
        if (this.dataForm.date1 === "") {
          this.$message({
            message: "开始时间不为空",
            type: "error",
            duration: 1500
          });
          return;
        }
        if (this.dataForm.date2 === "") {
          this.$message({
            message: "结束时间不为空",
            type: "error",
            duration: 1500
          });
          return;
        }
        date1 = this.dataForm.date1;
        date2 = this.dataForm.date2;
      } else {
        date1 = this.dataForm.datepk[0];
        date2 = this.dataForm.datepk[1];
      }
      if (this.dataForm.deptName === "") {
        this.$message({
          message: "班级不为空",
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
          this.show = true;
          this.xkxq = data.data.xkxq;
          this.tyfz = data.data.tyfz;
          this.rjgx = data.data.rjgx;
          this.qxzt = data.data.qxzt;
          this.bq = data.data.bq;
          this.bqtime = data.data.bqtime;
          this.jsztdata = data.data.jsztdata;
          this.xxztdata = data.data.xxztdata;
          this.jsztline = data.data.jsztline;
          this.jsztlinedata = data.data.jsztlinedata;
          this.xxztline = data.data.xxztline;
          this.xxztlinedata = data.data.xxztlinedata;
          this.xszt = data.data.xszt;
          this.aditorlegend = data.data.aditorlegend;
          this.Aditordata = data.data.Aditordata;
          this.initChartqxzt();
          this.initChartrjzt();
          this.initchartbq();
          this.initChartxyzl();
          this.initChartxxztline();
          this.initChartLinejszt();
          this.initChartRadarxszt();
          this.initChartAditor();
          //console.log(data);
        } else {
          this.$message.error(data.msg);
        }
      });

      //console.log(this.dataForm);
    },
    deptListTreeCurrentChangeHandle(data, node) {
      this.dataForm.deptId = data.deptId;
      this.dataForm.deptName = data.name;
      this.getstudentlist(this.dataForm.deptId);
    },
    init() {
      this.iheight = window.innerHeight - 800 + "px";
      this.$http({
        url: this.$http.adornUrl("/sys/dept/select"),
        method: "get",
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.deptList = treeDataTranslate(data.deptList, "deptId");
        this.getstudentlist(this.dataForm.deptId);
      });
    },
    changedatetype(e) {
      this.radio3 = e;
      if (e === "按天") {
        this.radio3 = e;
        this.visible = true;
        this.dataForm.date1 = "";
        this.dataForm.data2 = "";
      } else {
        this.visible = false;
        this.dataForm.datepk = "";
      }
    },
    getstudentlist(id) {
      this.$http({
        url: this.$http.adornUrl(`/report/dict/stu/${id}`),
        methods: "get",
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.options = data.stu;
      });
    },
    // 饼状图
    initChartqxzt() {
      var option = {
        tooltip: {
          trigger: "item"
        },
        series: [
          {
            type: "pie",
            radius: "50%",
            center: ["50%", "50%"],
            data: this.qxzt
          }
        ]
      };
      this.chartqxzt = echarts.init(document.getElementById("qxzt_chart"));
      this.chartqxzt.setOption(option);
      window.addEventListener("resize", () => {
        this.chartqxzt.resize();
      });
    },
    initChartrjzt() {
      var option = {
    title: {
        text:this.rjgx,
        top:'49%',
        left:'36%',
        textStyle:{
        fontWeight:'normal'
        }
      },
    series: [{
        type: 'pie',
        radius: "50%",
        center: ['38%', '50%'],
            labelLine: {
                normal: {
                    show: false
                }
            },
        data:[{name:'',value:0}]
        // No encode specified, by default, it is '2012'.
    }]
};
      this.chartrjzt = echarts.init(document.getElementById("rjzt_chart"));
      this.chartrjzt.setOption(option);
      window.addEventListener("resize", () => {
        this.chartrjzt.resize();
      });
    },
    // 折线图
    initchartbq() {
      var option = {
        title: {
          text: "表情",
          x: "center",
        textStyle:{
        fontWeight:'normal'
        }
        },
        tooltip: {
          trigger: "axis",
          formatter: function(datas) {
            var res = datas[0].name + "<br/>";
            for (var i = 0, length = datas.length; i < length; i++) {
              var texts = "";
              var value = datas[i].data;
              if (value == 0) {
                texts = "开心";
              } else if (value == 1) {
                texts = "正常";
              } else if (value == 2) {
                texts = "低落";
              }
              res += texts + "<br/>";
            }
            return res;
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.bqtime
        },
        yAxis: {
          type: "category",
          data:['2','1','0'],
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
            type: "line",
            data: this.bq
          }
        ]
      };
      this.chartbq = echarts.init(document.getElementById("bq_chart"));
      this.chartbq.setOption(option);
      window.addEventListener("resize", () => {
        this.chartbq.resize();
      });
    },
    // 饼状图
    initChartxyzl() {
      var option = {
        tooltip: {
          trigger: "item"
        },
        series: [
          {
            type: "pie",
            radius: 80,
            center: ["25%", "30%"],
            data: this.jsztdata
            // No encode specified, by default, it is '2012'.
          },
          {
            type: "pie",
            radius: 80,
            data: this.xxztdata,
            center: ["75%", "30%"]
          }
        ]
      };
      this.chartxyzl = echarts.init(document.getElementById("xyzlchart"));
      this.chartxyzl.setOption(option);
      window.addEventListener("resize", () => {
        this.chartxyzl.resize();
      });
    },
    // 折线图
    initChartxxztline() {
      var option = {
        title: {
          text: "学习状态",
          x: "center",
        textStyle:{
        fontWeight:'normal'
        }
        },
        tooltip: {
          trigger: "axis",
          formatter: function(datas) {
            var res = datas[0].name + "<br/>";
            for (var i = 0, length = datas.length; i < length; i++) {
              var texts = "";
              var value = datas[i].data;
              if (value == 0) {
                texts = "非常好";
              } else if (value == 1) {
                texts = "良好";
              } else if (value == 2) {
                texts = "正常";
              } else if (value == 3) {
                texts = "不佳";
              }
              res += texts + "<br/>";
            }
            return res;
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.xxztline
        },
        yAxis: {
          type: "category",
          inverse:true,
          data:['0','1','2','3'],
          axisLabel: {
            formatter: function(value) {
              var texts = [];
              if (value == 0) {
                texts.push("非常好");
              } else if (value == 1) {
                texts.push("良好");
              } else if (value == 2) {
                texts.push("正常");
              } else if (value == 3) {
                texts.push("不佳");
              }
              return texts;
            }
          }
        },
        series: [
          {
            type: "line",
            data: this.xxztlinedata
          }
        ]
      };
      this.chartLinexxzt = echarts.init(document.getElementById("xxztline"));
      this.chartLinexxzt.setOption(option);
      window.addEventListener("resize", () => {
        this.chartLinexxzt.resize();
      });
    },

    // 折线图
    initChartLinejszt() {
      var option = {
        title: {
          text: "精神状态",
          x: "center",
        textStyle:{
        fontWeight:'normal'
        }
        },
        tooltip: {
          trigger: "axis",
          formatter: function(datas) {
            var res = datas[0].name + "<br/>";
            for (var i = 0, length = datas.length; i < length; i++) {
              var texts = "";
              var value = datas[i].data;
              if (value == 0) {
                texts = "积极";
              } else if (value == 1) {
                texts = "正常";
              } else if (value == 2) {
                texts = "疲惫";
              }
              res += texts + "<br/>";
            }
            return res;
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.jsztline
        },
        yAxis: {
          type: "category",
          data:['2','1','0'],
          axisLabel: {
            formatter: function(value) {
              var texts = [];
              if (value == 0) {
                texts.push("积极");
              } else if (value == 1) {
                texts.push("正常");
              } else if (value == 2) {
                texts.push("疲惫");
              }
              return texts;
            }
          }
        },
        series: [
          {
            type: "line",
            data: this.jsztlinedata
          }
        ]
      };
      this.chartLinejszt = echarts.init(document.getElementById("jsztline"));
      this.chartLinejszt.setOption(option);
      window.addEventListener("resize", () => {
        this.chartLinejszt.resize();
      });
    },
    // 雷达图
    initChartRadarxszt() {
      var option = {
        tooltip: {},
        calculable: true,
        polar: [
          {
            indicator: [
              { text: "学业状态", max: 1 },
              { text: "精神状态", max: 1 },
              { text: "情绪状态", max: 1 },
              { text: "人际关系", max: 1 }
            ],
            radius: 130
          }
        ],
        series: [
          {
            type: "radar",
            itemStyle: {
              normal: {
                areaStyle: {
                  type: "default"
                }
              }
            },
            data: [
              {
                value: this.xszt
              }
            ]
          }
        ]
      };
      this.ChartRadarxszt = echarts.init(
        document.getElementById("chartRadarBoxxszt")
      );
      this.ChartRadarxszt.setOption(option);
      window.addEventListener("resize", () => {
        this.ChartRadarxszt.resize();
      });
    },
    //散点图
    initChartAditor() {
      var option = {
        tooltip: {
          // trigger: 'axis',
          showDelay: 0,
          formatter: function(params) {
            if (params.value.length > 1) {
              return (
                params.seriesName +
                " :<br/>" +
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
          },
          axisPointer: {
            show: true,
            type: "cross",
            lineStyle: {
              type: "dashed",
              width: 1
            }
          }
        },
        grid: {
          left: "3%",
          right: "7%",
          bottom: "3%",
          containLabel: true
        },
        legend: {
          data: this.aditorlegend,
          left: "center"
        },
        xAxis: [
          {
            name: "学业状态",
            type: "value",
            scale: true,
            axisLine: {
              symbol: ["none", "arrow"]
            },
            axisLabel: {
              formatter: "{value} "
            },
            splitLine: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            name: "成绩",
            axisLine: {
              symbol: ["none", "arrow"]
            },
            type: "value",
            scale: true,
            axisLabel: {
              formatter: "{value} "
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: this.Aditordata
      };
      this.chartAditor = echarts.init(
        document.getElementById("chartAditorBox")
      );
      this.chartAditor.setOption(option);
      window.addEventListener("resize", () => {
        this.chartAditor.resize();
      });
    }
  }
};
</script>

<style lang="scss">
.mod-menu {
  .dept-list__input,
  .icon-list__input {
    > .el-input__inner {
      cursor: pointer;
    }
  }
}
.mod-clas-echarts {
  .chart-box {
    min-height: 400px;
  }
}
</style>