<template>
  <div class="pro-main">
    <img src="~@/assets/img/cls.png" style="position: absolute;width: 100%;" />
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
            <el-button @click="query" :loading="false">查询</el-button>
          </center>
        </div>
      </el-form>
    </el-row>
    <div :style="{visibility: show ? 'visible' : 'hidden'}">
      <el-row :gutter="20">
        <el-col :span="5" :offset="2" style="padding-right: 0px;">
          <div class="title">学业自律性分布&nbsp;<img src="~@/assets/img/xyzlico.png" /></div>
          <div id="xyzl" class="chart-box" style="border-right-color: #424562; border-right-width: 2px; border-right-style: solid;"></div>
        </el-col>
        <el-col :span="5" style="padding-left: 0px; ">
          <div class="title" style="height:25px">&nbsp;</div>
          <div id="jszl" class="chart-box"></div>
        </el-col>
        <el-col :span="5" style="padding-right: 0px;">
          <div class="title" style="height:25px">心理健康状态分布&nbsp;<img src="~@/assets/img/qxztico.png" /></div>
          <div id="qxzl" class="chart-box" style="border-right-color: #424562; border-right-width: 2px; border-right-style: solid;"></div>
        </el-col>
        <el-col :span="5" style="padding-left: 0px; ">
          <div class="title" style="height:25px"></div>
          <div id="rjzl" class="chart-box"></div>
        </el-col>
      </el-row>
      <!-- 第二行 -->
      <el-row :gutter="20">
        <el-col :span="10" :offset="2" style="padding-right:0px">
          <div class="title">
            状态历史信息&nbsp;<img src="~@/assets/img/ztlsico.png" />
          </div>
          <div id="qxhistory" class="chart-box" style="border-right-color: #424562; border-right-width: 2px; border-right-style: solid;
            border-bottom-color:#424562; border-bottom-width: 2px; border-bottom-style: solid;"></div>
          <div id="zthistory" class="chart-box" style="border-right: 2px solid #424562;"></div>
        </el-col>
        <el-col :span="10" style="padding-left: 0px;">
          <div class="title" style="height:24px"></div>
          <div id="jshistory" class="chart-box" style="border-bottom: 2px solid #424562;"></div>
          <div id="xkxq" class="chart-box"></div>
        </el-col>
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
        datepk: "",
        deptId: 0,
        deptName: ""
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
      fchdata: []
    };
  },
  components: {
    Clasdetail
  },
  mounted() {
    this.init();
    this.initChartxkxq();
    this.initCharxyzl();
    this.intitChartjszl();
    this.initCharxljk();
    this.initCharrjzl();
    this.initchartqxhistory();
    this.initchartjshistory();
    this.initchartzthistory();
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
    clasdetailshow(id) {
      this.clasdetailVisible = true;
      this.$nextTick(() => {
        this.$refs.clasdetail.init(this.dataForm, id);
      });
    },
    initchartqxhistory() {
      var option = {
        title: {
          backgroundColor: "#212858",
          text: "-情绪状态-",
          bottom: "15%",
          right: "1%",
          textStyle: {
            color: "#ffffff",
            fontWeight: "normal"
          }
        },
        legend: {
          orient: "vertical",
          data: ["开心", "正常", "低落"],
          top: "100",
          right: "4%",
          textStyle: {
            color: "#ffffff"
          }
        },
        color: ["#019640", "#b9b43b", "#545b99"],
        grid: {
          top: "15",
          left: "3%",
          right: "20%",
          bottom: "10%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.qxtimeline,
          axisLine: {
            lineStyle: {
              color: "#ffffff"
            }
          },
          axisLabel: {
            color: "#ffffff",
            interval: 0,
            rotate: -40
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#555971",
              type: "solid"
            }
          }
        },
        yAxis: {
          type: "value",
          splitLine: {
            show: true,
            lineStyle: {
              color: "#555971",
              type: "solid"
            }
          },
          axisLine: {
            lineStyle: {
              color: "#ffffff"
            }
          },
          axisLabel: {
            color: "#ffffff",
            formatter: function(value) {
              var texts = [];
              texts.push(value + "%");
              return texts;
            }
          }
        },
        series: [
          {
            name: "开心",
            type: "line",
            data: this.kxdata,
            symbol: "circle",
            symbolSize: "5",
            itemStyle: {
              normal: {
                borderWidth: 1,
                borderColor: "#019640",
                lineStyle: {
                  width: 1,
                  color: "#019640",
                  type: "solid"
                }
              }
            }
          },
          {
            name: "正常",
            type: "line",
            data: this.zcdata,
            symbol: "rect",
            symbolSize: "5",
            itemStyle: {
              normal: {
                borderWidth: 1,
                borderColor: "#b9b43b",
                lineStyle: {
                  width: 1,
                  color: "#b9b43b",
                  type: "dotted"
                }
              }
            }
          },
          {
            name: "低落",
            type: "line",
            data: this.dldata,
            symbol: "roundRect",
            symbolSize: "5",
            itemStyle: {
              normal: {
                borderWidth: 1,
                borderColor: "#545b99",
                lineStyle: {
                  width: 1,
                  color: "#545b99",
                  type: "dashed"
                }
              }
            }
          }
        ]
      };
      this.chartqxhistory = echarts.init(document.getElementById("qxhistory"));
      this.chartqxhistory.setOption(option,true);
      window.addEventListener("resize", () => {
        this.chartqxhistory.resize();
      });
    },
    initchartjshistory() {
      var option = {
        title: {
          backgroundColor: "#212858",
          text: "-精神状态-",
          bottom: "15%",
          right: "1%",
          textStyle: {
            color: "#ffffff",
            fontWeight: "normal"
          }
        },
        legend: {
          orient: "vertical",
          data: ["积极", "正常", "疲惫"],
          top: "100",
          right: "4%",
          textStyle: {
            color: "#ffffff"
          }
        },
        color: ["#019640", "#b9b43b", "#545b99"],
        grid: {
          top: "15",
          left: "3%",
          right: "20%",
          bottom: "10%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.jstimeline,
          axisLine: {
            lineStyle: {
              color: "#ffffff"
            }
          },
          axisLabel: {
            color: "#ffffff",
            interval: 0,
            rotate: -40
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#555971",
              type: "solid"
            }
          }
        },
        yAxis: {
          type: "value",
          splitLine: {
            show: true,
            lineStyle: {
              color: "#555971",
              type: "solid"
            }
          },
          axisLine: {
            lineStyle: {
              color: "#ffffff"
            }
          },
          axisLabel: {
            color: "#ffffff",
            formatter: function(value) {
              var texts = [];
              texts.push(value + "%");
              return texts;
            }
          }
        },
        series: [
          {
            name: "积极",
            type: "line",
            data: this.jjdata,
            symbol: "circle",
            symbolSize: "5",
            itemStyle: {
              normal: {
                borderWidth: 1,
                borderColor: "#019640",
                lineStyle: {
                  width: 1,
                  color: "#019640",
                  type: "solid"
                }
              }
            }
          },
          {
            name: "正常",
            type: "line",
            data: this.jszcdata,
            symbol: "rect",
            symbolSize: "5",
            itemStyle: {
              normal: {
                borderWidth: 1,
                borderColor: "#b9b43b",
                lineStyle: {
                  width: 1,
                  color: "#b9b43b",
                  type: "dotted"
                }
              }
            }
          },
          {
            name: "疲惫",
            type: "line",
            data: this.pbdata,
            symbol: "roundRect",
            symbolSize: "5",
            itemStyle: {
              normal: {
                borderWidth: 1,
                borderColor: "#545b99",
                lineStyle: {
                  width: 1,
                  color: "#545b99",
                  type: "dashed"
                }
              }
            }
          }
        ]
      };

      this.chartjshistory = echarts.init(document.getElementById("jshistory"));
      this.chartjshistory.setOption(option,true);
      window.addEventListener("resize", () => {
        this.chartjshistory.resize();
      });
    },
    initchartzthistory() {
      var option = {
        title: {
          backgroundColor: "#212858",
          text: "-学习状态-",
          bottom: "15%",
          right: "1%",
          textStyle: {
            color: "#ffffff",
            fontWeight: "normal"
          }
        },
        legend: {
          orient: "vertical",
          data: ["非常好", "良好", "正常", "不佳"],
          top: "100",
          right: "4%",
          textStyle: {
            color: "#ffffff"
          }
        },
        color: ["#019640", "#019640", "#b9b43b", "#545b99"],
        grid: {
          top: "15",
          left: "3%",
          right: "20%",
          bottom: "10%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.xxtimeline,
          axisLine: {
            lineStyle: {
              color: "#ffffff"
            }
          },
          axisLabel: {
            color: "#ffffff",
            interval: 0,
            rotate: -40
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#555971",
              type: "solid"
            }
          }
        },
        yAxis: {
          type: "value",
          splitLine: {
            show: true,
            lineStyle: {
              color: "#555971",
              type: "solid"
            }
          },
          axisLine: {
            lineStyle: {
              color: "#ffffff"
            }
          },
          axisLabel: {
            color: "#ffffff",
            formatter: function(value) {
              var texts = [];
              texts.push(value + "%");
              return texts;
            }
          }
        },
        series: [
          {
            name: "非常好",
            type: "line",
            data: this.fchdata,
            symbol: "circle",
            symbolSize: "5",
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#019640"
                  },
                  {
                    offset: 1,
                    color: "#2d3358"
                  }
                ])
              }
            },
            itemStyle: {
              normal: {
                borderWidth: 1,
                borderColor: "#019640",
                lineStyle: {
                  width: 1,
                  color: "#019640",
                  type: "solid"
                }
              }
            }
          },
          {
            name: "良好",
            type: "line",
            data: this.lhdata,
            symbol: "pin",
            symbolSize: "5",
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#8fbd3e"
                  },
                  {
                    offset: 1,
                    color: "#2d3358"
                  }
                ])
              }
            },
            itemStyle: {
              normal: {
                borderWidth: 1,
                borderColor: "#8fbd3e",
                lineStyle: {
                  width: 1,
                  color: "#8fbd3e",
                  type: "solid"
                }
              }
            }
          },
          {
            name: "正常",
            type: "line",
            data: this.xxzcdata,
            symbol: "rect",
            symbolSize: "5",
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#cfca52"
                  },
                  {
                    offset: 1,
                    color: "#2d3358"
                  }
                ])
              }
            },
            itemStyle: {
              normal: {
                borderWidth: 1,
                borderColor: "#cfca52",
                lineStyle: {
                  width: 1,
                  color: "#cfca52",
                  type: "dotted"
                }
              }
            }
          },
          {
            name: "不佳",
            type: "line",
            data: this.bjdata,
            symbol: "roundRect",
            symbolSize: "5",
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#59609f"
                  },
                  {
                    offset: 1,
                    color: "#2d3358"
                  }
                ])
              }
            },
            itemStyle: {
              normal: {
                borderWidth: 1,
                borderColor: "#59609f",
                lineStyle: {
                  width: 1,
                  color: "#59609f",
                  type: "dashed"
                }
              }
            }
          }
        ]
      };

      this.chartzthistory = echarts.init(document.getElementById("zthistory"));
      this.chartzthistory.setOption(option,true);
      window.addEventListener("resize", () => {
        this.chartzthistory.resize();
      });
    },

    initChartxkxq() {
      var option = {
        title: {
          text: "-学科兴趣分布-",
          // left: "right",
          // top: "bottom",
          bottom: "15%",
          right: "1%",
          backgroundColor: "#212858",
          textStyle: {
            color: "#ffffff",
            fontWeight: "normal"
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: "15",
          left: "3%",
          right: "20%",
          bottom: "10%",
          containLabel: true
        },
        xAxis: {
          type: "value",
          splitLine: {
            show: false
          },
          axisLabel: {
            color: "#ffffff"
          },

          axisLine: {
            lineStyle: {
              color: "#ffffff"
            }
          }
        },
        yAxis: {
          axisLabel: {
            color: "#ffffff"
          },

          axisLine: {
            lineStyle: {
              color: "#ffffff"
            }
          },
          type: "category",
          data: this.xkxqdatay
        },
        series: [
          {
            name: "",
            type: "bar",
            data: this.xkxqdatax,
            barMaxWidth: 20,
            label: {
              normal: {
                show: true,
                position: "insideRight"
              }
            },
            itemStyle: {
              normal: {
                // 定制显示（按顺序）
                color: function(params) {
                  return new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                    {
                      offset: 0,
                      color: "#75e472"
                    },
                    {
                      offset: 1,
                      color: "#2d3358"
                    }
                  ]);
                }
              }
            }
          }
        ]
      };
      this.chartxkxq = echarts.init(document.getElementById("xkxq"));
      this.chartxkxq.setOption(option,true);
      window.addEventListener("resize", () => {
        this.chartxkxq.resize();
      });
    },
    initCharxyzl() {
      var option = {
        legend: {
          orient: "horizontal",
          left: "right",
          data: [
            {
              name: "非常好",
              icon: "triangle"
            },
            {
              name: "良好",
              icon: "triangle"
            },
            {
              name: "正常",
              icon: "triangle"
            },
            {
              name: "不佳",
              icon: "triangle"
            }
          ],
          textStyle: {
            color: "#ffffff"
          }
        },
        graphic: [
          {
            //环形图中间添加文字
            type: "text", //通过不同top值可以设置上下显示
            left: "center",
            top: "48%",
            style: {
              text: "-学习状态-",
              textAlign: "center",
              fill: "#ffffff", //文字的颜色
              width: 30,
              height: 30,
              fontSize: 20,
              fontFamily: "Microsoft YaHei"
            }
          }
        ],
        series: [
          {
            type: "pie",
            radius: ["40%", "55%"],
            data: this.xxdata,
            labelLine: {
              normal: {
                length: 5, // 改变标示线的长度
                lineStyle: {
                  color: "#ffffff" // 改变标示线的颜色
                }
              }
            },
            label: {
              normal: {
                formatter: function(params) {
                  var res = params.name + "\r\n";
                  res += params.value + "%";
                  return res;
                },
                textStyle: {
                  color: "#ffffff" // 改变标示文字的颜色
                }
              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              },
              normal: {
                color: function(params) {
                  if (params.name == "非常好") {
                    return "#019640";
                  }
                  if (params.name == "良好") {
                    return "#8fbd3e";
                  }
                  if (params.name == "正常") {
                    return "#cfca52";
                  }
                  if (params.name == "不佳") {
                    return "#59609f";
                  }
                }
              }
            }
            // No encode specified, by default, it is '2012'.
          }
        ]
      };
      this.chartxyzl = echarts.init(document.getElementById("xyzl"));
      this.chartxyzl.setOption(option,true);
      window.addEventListener("resize", () => {
        this.chartxyzl.resize();
      });
    },
    intitChartjszl() {
      var option = {
        legend: {
          orient: "horizontal",
          left: "center",
          data: [
            {
              name: "积极",
              icon: "rect"
            },
            {
              name: "正常",
              icon: "rect"
            },
            {
              name: "疲惫",
              icon: "rect"
            }
          ],
          textStyle: {
            color: "#ffffff"
          }
        },
        graphic: [
          {
            //环形图中间添加文字
            type: "text", //通过不同top值可以设置上下显示
            left: "center",
            top: "48%",
            style: {
              text: "-精神状态-",
              textAlign: "center",
              fill: "#ffffff", //文字的颜色
              width: 30,
              height: 30,
              fontSize: 20,
              fontFamily: "Microsoft YaHei"
            }
          }
        ],
        series: [
          {
            type: "pie",
            radius: ["40%", "55%"],
            data: this.jsdata,
            labelLine: {
              normal: {
                length: 5, // 改变标示线的长度
                lineStyle: {
                  color: "#ffffff" // 改变标示线的颜色
                }
              }
            },
            label: {
              normal: {
                formatter: function(params) {
                  var res = params.name + "\r\n";
                  res += params.value + "%";
                  return res;
                },
                textStyle: {
                  color: "#ffffff" // 改变标示文字的颜色
                }
              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              },
              normal: {
                color: function(params) {
                  if (params.name == "积极") {
                    return "#23a15b";
                  }
                  if (params.name == "正常") {
                    return "#d6d156";
                  }
                  if (params.name == "疲惫") {
                    return "#59609f";
                  }
                }
              }
            }
          }
        ]
      };
      this.chartjszl = echarts.init(document.getElementById("jszl"));
      this.chartjszl.setOption(option,true);
      window.addEventListener("resize", () => {
        this.chartjszl.resize();
      });
    },
    //饼图
    initCharxljk() {
      var option = {
        title: {
          backgroundColor: "#212858",
          text: "-情绪状态-",
          bottom: "5%",
          left: "center",
          textStyle: {
            color: "#ffffff",
            fontWeight: "normal"
          }
        },
        legend: {
          orient: "horizontal",
          left: "center",
          data: [
            {
              name: "开心",
              icon: "rect"
            },
            {
              name: "正常",
              icon: "rect"
            },
            {
              name: "低落",
              icon: "rect"
            }
          ],
          textStyle: {
            color: "#ffffff"
          }
        },
        series: [
          {
            type: "pie",
            radius: "55%",
            left: "center",
            stillShowZeroSum: false,
            data: this.qxdata,
            labelLine: {
              normal: {
                lineStyle: {
                  color: "#ffffff" // 改变标示线的颜色
                }
              }
            },
            label: {
              normal: {
                formatter: function(params) {
                  var res = params.name + "\r\n";
                  res += params.value + "%";
                  return res;
                },
                textStyle: {
                  color: "#ffffff" // 改变标示文字的颜色
                }
              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              },
              normal: {
                color: function(params) {
                  if (params.name == "正常") {
                    return "#b9b43b";
                  }
                  if (params.name == "开心") {
                    return "#019640";
                  }
                  if (params.name == "低落") {
                    return "#545b99";
                  }
                }
              }
            }
          }
        ]
      };
      this.chartxljk = echarts.init(document.getElementById("qxzl"));
      this.chartxljk.setOption(option,true);
      window.addEventListener("resize", () => {
        this.chartxljk.resize();
      });
    },
    //人际
    initCharrjzl() {
      var option = {
        title: {
          backgroundColor: "#212858",
          text: "-人际关系-",
          bottom: "5%",
          left: "center",
          textStyle: {
            color: "#ffffff",
            fontWeight: "normal"
          }
        },
        legend: {
          orient: "horizontal",
          left: "right",
          data: [
            {
              name: "非常好",
              icon: "rect"
            },
            {
              name: "良好",
              icon: "rect"
            },
            {
              name: "正常",
              icon: "rect"
            },
            {
              name: "孤僻",
              icon: "rect"
            }
          ],
          textStyle: {
            color: "#ffffff"
          }
        },
        series: [
          {
            type: "pie",
            radius: "55%",
            left: "center",
            stillShowZeroSum: false,
            data: this.rjdata,
            labelLine: {
              normal: {
                lineStyle: {
                  color: "#ffffff" // 改变标示线的颜色
                }
              }
            },
            label: {
              normal: {
                formatter: function(params) {
                  var res = params.name + "\r\n";
                  res += params.value + "%";
                  return res;
                },
                textStyle: {
                  color: "#ffffff" // 改变标示文字的颜色
                }
              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              },
              normal: {
                color: function(params) {
                  if (params.name == "孤僻") {
                    return "#A06DE4";
                  }
                  if (params.name == "正常") {
                    return "#CFCA52";
                  }
                  if (params.name == "良好") {
                    return "#90BC3D";
                  }
                  if (params.name == "非常好") {
                    return "#019642";
                  }
                }
              }
            }
          }
        ]
      };
      this.charrjzl = echarts.init(document.getElementById("rjzl"));
      this.charrjzl.setOption(option,true);
      window.addEventListener("resize", () => {
        this.charrjzl.resize();
      });
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
      this.$http({
        url: this.$http.adornUrl("/report/clas"),
        method: "post",
        data: this.$http.adornData({
          date1: this.dataForm.date1,
          deptid: this.dataForm.deptId
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log(data)
          this.show = true;
          this.cols = data.data.cols;
          this.tableData = data.data.kqList;
          if (data.data.qxdata.size != 3) {
            this.qxdata = [];
            var names = [
              { name: "正常", value: 0 },
              { name: "开心", value: 0 },
              { name: "低落", value: 0 }
            ];
            names.forEach(qxdatal => {
              data.data.qxdata.forEach(qxdatat => {
                if (qxdatal.name == qxdatat.name) {
                  qxdatal.value = qxdatat.value;
                }
              });
              this.qxdata.push(qxdatal);
            });
          }
          if (data.data.rjdata.size != 3) {
            this.rjdata = [];
            var names = [
              { name: "非常好", value: 0 },
              { name: "良好", value: 0 },
              { name: "正常", value: 0 },
              { name: "孤僻", value: 0 }
            ];
            names.forEach(rjdatal => {
              data.data.rjdata.forEach(rjdatat => {
                if (rjdatal.name == rjdatat.name) {
                  rjdatal.value = rjdatat.value;
                }
              });
              this.rjdata.push(rjdatal);
            });
          }
          //this.qxdata = data.data.qxdata;
          // this.rjdata = data.data.rjdata;
          if (data.data.xxdata.size != 3) {
            this.xxdata = [];
            var names = [
              { name: "非常好", value: 0 },
              { name: "良好", value: 0 },
              { name: "正常", value: 0 },
              { name: "不佳", value: 0 }
            ];
            names.forEach(xxdatal => {
              data.data.xxdata.forEach(xxdatat => {
                if (xxdatal.name == xxdatat.name) {
                  xxdatal.value = xxdatat.value;
                }
              });
              this.xxdata.push(xxdatal);
            });
          }

          //this.xxdata = data.data.xxdata;
          if (data.data.jsdata.size != 3) {
            this.jsdata = [];
            var names = [
              { name: "积极", value: 0 },
              { name: "正常", value: 0 },
              { name: "疲惫", value: 0 }
            ];
            names.forEach(jsdatal => {
              data.data.jsdata.forEach(jsdatat => {
                if (jsdatal.name == jsdatat.name) {
                  jsdatal.value = jsdatat.value;
                }
              });
              this.jsdata.push(jsdatal);
            });
          }

          //this.jsdata = data.data.jsdata;
          this.xkxqdatax = data.data.xkxqdatax;
          this.xkxqdatay = data.data.xkxqdatay;
          this.yjData = data.data.yjData;
          this.yjcols = data.data.yjcols;
          this.qxtimeline = data.data.qxtimeline;
          this.kxdata = data.data.kxdata;
          this.zcdata = data.data.zcdata;
          this.dldata = data.data.dldata;
          this.jstimeline = data.data.jstimeline;
          this.jjdata = data.data.jjdata;
          this.jszcdata = data.data.jszcdata;
          this.pbdata = data.data.pbdata;
          this.xxtimeline = data.data.xxtimeline;
          this.lhdata = data.data.lhdata;
          this.xxzcdata = data.data.xxzcdata;
          this.bjdata = data.data.bjdata;
          this.fchdata = data.data.fchdata;
          this.initCharxljk();
          this.initCharrjzl();
          this.initCharxyzl();
          this.intitChartjszl();
          this.initChartxkxq();
          this.initchartqxhistory();
          this.initchartjshistory();
          this.initchartzthistory();
          // console.log(data);
          this.elcls = data.data.elcls;
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
    }
  }
};
</script>

<style  lang="scss" >
.pro-main {
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
</style>
