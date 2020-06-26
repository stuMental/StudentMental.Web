<template>
  <div class="pro-main">
    <img src="~@/assets/img/teacherbackimg.png" style="position: absolute;width: 100%;" />
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
            <el-form-item label="院系" prop="deptName">
              <el-popover placement="bottom-start" trigger="click" ref="deptpopover">
                <el-tree :data="deptList" :props="deptListTreeProps" node-key="deptId" ref="deptListTree" @current-change="deptListTreeCurrentChangeHandle" :default-expand-all="false" :highlight-current="true" :expand-on-click-node="false">
                </el-tree>
                <el-input v-model="dataForm.deptName" slot="reference" :readonly="true" placeholder="点击选择班年级" class="dept-list__input"></el-input>
              </el-popover>
            </el-form-item>
            <el-form-item label="教师" prop="studentName">
              <el-select v-model="dataForm.studentid" filterable placeholder="请选择">
                <el-option v-for="item in options" :key="item.studentNumber" :label="item.studentName" :value="item.studentNumber">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="科目" prop="subjectName">
              <el-select v-model="dataForm.subjectid" filterable placeholder="请选择">
                <el-option v-for="item in options" :key="item.subjectNumber" :label="item.subjectName" :value="item.subjectNumber">
                </el-option>
              </el-select>
            </el-form-item>
            <el-button @click="query" :loading="false">查询</el-button>
          </div>
        </el-form>
      </center>
    </el-row>
    <div :style="{visibility: show ? 'visible' : 'hidden'}">
      <!-- <el-row :gutter="20">
        <el-col :span="4" :offset="1">
          <div class="title">个性化发展&nbsp;<img src="~@/assets/img/gxfzico.png" /></div>
          <el-table :data="xkxq" class="tabless" height="140" :header-cell-style="tableheaderCellStyle" :cell-style="tableCellStyle">
            <el-table-column prop="name" label="学科兴趣">
            </el-table-column>
          </el-table>
          <el-table :data="tyfz" class="tabless" height="140" :header-cell-style="tableheaderCellStyle" :cell-style="tableCellStyle">
            <el-table-column prop="name" label="体艺发展">
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="6">
          <div class="title">人际关系&nbsp;<img src="~@/assets/img/rjgxico.png" /></div>
          <div id="rjgx_chart" class="chart-box" />
        </el-col>
        <el-col :span="6">
          <div class="title">情绪状态&nbsp;<img src="~@/assets/img/qxztico.png" /></div>
          <div id="qxzt_chart" class="chart-box"></div>
        </el-col>
        <el-col :span="6">
          <div class="title">学生综合状态总结&nbsp;<img src="~@/assets/img/xszhico.png" /></div>
          <div id="chartRadarBoxxszt" class="chart-box"></div>
        </el-col>
      </el-row> -->
      <el-row :gutter="20">
        <el-col :span="11" :offset="1" style="padding-right: 0px;">
          <div class="title">教师互动类型</div>
          <div class="jxms">
            <div class="jxms-box" style="width: 30%">
              <div class="jxms-img">
                <img src="~@/assets/img/jxms.jpg">
              </div>
              <p>教学模式：混合型</p>
              <p class="p-top">Rt：0.4</p>
              <p>教师行为占比</p>
              <p class="p-top">Ch：0.1</p>
              <p>师生行为转化率</p>
            </div>
            <div class="jxms-right" style="width: 70%">
              <div id="rtchchart" class="chart-box" :style="{backgroundImage:'url('+require('../../../assets/img/rtch.png')+')'}"></div>
            </div>
          </div>

          <!-- <div id="xsxwchart" class="chart-box" style="border-right-color: #424562; border-right-width: 2px; border-right-style: solid;"></div> -->
        </el-col>
        <el-col :span="11" style="padding-left: 0px;">
          <div class="title" style="height:25px">&nbsp;</div>
          <div style="background-color: #30345C;">
            <div id="ssxwchart" class="chart-box" style="width: 87%;"></div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="11" :offset="1" style="padding-right: 0px;">
          <div style="width: 100%; background-color: #30345C; border-right: 2px solid #424562;">
            <div id="xsxwchart" class="chart-box" style="width: 87%;"></div>
          </div>
        </el-col>
        <el-col :span="11" style="padding-left: 0px; ">
          <div style="width: 100%; background-color: #30345C;">
            <div id="jsxwchart" class="chart-box" style="width: 87%;"></div>
          </div>
        </el-col>
      </el-row>
      
      <!-- 第二部分 -->
      <el-row :gutter="20" style="margin-top: 15px;">
        <el-col :span="11" :offset="1" style="padding-right: 0px;">
          <div class="title">教学情绪</div>
          <!-- <div id="jsztchart" class="chart-box" style="border-right-color: #424562; border-right-width: 2px; border-right-style: solid;"></div> -->
          <div id="jxqxchart" class="chart-box" style="border-right: 2px solid #424562; overflow:hidden;"></div>
        </el-col>
        <el-col :span="11" style="padding-left: 0px;">
          <div class="title" style="height:25px">&nbsp;</div>
          <div style="width: 100%; background-color: #30345C;">
            <div id="jxqxlinechart" class="chart-box" style="width: 87%;"></div>
          </div>
        </el-col>
      </el-row>

      <!-- 第三部分 -->
      <el-row :gutter="20" style="margin-top: 15px;">
        <!-- <el-col :span="12" :offset="1">
          <div class="title">表情&nbsp;<img src="~@/assets/img/bqico.png" /></div>
          <div id="bq_chart" class="chart-box"></div>
        </el-col> -->
        <el-col :span="11" :offset="1" style="padding-right: 0px;">
          <div class="title">教学状态</div>
          <!-- <div id="jsztchart" class="chart-box" style="border-right-color: #424562; border-right-width: 2px; border-right-style: solid;"></div> -->
          <div id="jxztchart" class="chart-box" style="border-right-color: #424562; border-right-width: 2px; border-right-style: solid;"></div>
          <!-- <div id="chartAditorBox" class="chart-box" style="height:503px"></div> -->
          <div class="jxzt-score" style="position: relative; top: -75px; color: #fff; padding-left: 20px;">
            <p>综合得分：78</p>
            <p>教学情绪平稳、准时上课并且教学行为较为丰富</p>
          </div>
        </el-col>
        <el-col :span="11" style="padding-left: 0px; ">
          <div class="title" style="height:25px">&nbsp;</div>
          <div style="width: 100%; background-color: #30345C;">
            <div id="jxztchartline" class="chart-box" style="width: 87%;"></div>
          </div>
        </el-col>
      </el-row>

      <!-- <el-row :gutter="20">
        <el-col :span="12" :offset="1">
          <div class="title">学业状态分析&nbsp;<img src="~@/assets/img/xyztfxico.png" /></div>
          <div id="chartAditorBox" class="chart-box" style="height:503px"></div>
          <div class="chart-box" style="min-height:100px">
            <span style="color:#ffffff;font-size:15px;float: left;text-align: center;width: 100%;">备注：成绩与学业状态分别为1绩点,绩点越高表示越优秀</span>

          </div>
        </el-col>
        <el-col :span="10" >
          <div class="titles" >精神状态&nbsp;<img src="~@/assets/img/jsztico.png" /></div>
          <div id="jsztline" class="chart-box"></div>
          <div class="titles">
            学习状态&nbsp;<img src="~@/assets/img/xxztico.png" /></div>
          <div id="xxztline" class="chart-box"></div>
        </el-col>
      </el-row> -->
      <el-row :gutter="20" style="height:50px">
      </el-row>
    </div>
  </div>
</template>
<script>
import echarts from "echarts";
import { treeDataTranslate } from "@/utils";
import '@/assets/scss/common.scss'

export default {
  data() {
    return {
      daterange: "daterange",
      // show: false,
      show: true,
      xkxq: [],
      tyfz: [],
      rjgx: [],
      qxzt: [],
      bq: [],
      bqtime: [],
      jsztdata: [],
      xxztdata: [],
      jsztlinedata: [],
      jsztline: [],
      dataShadow: [],
      xxztline: [],
      xxztlinedata: [],
      xszt: [],
      aditorlegend: [],
      Aditordata: [],
      options: [],
      chartqxzt: null,
      chartbq: null,
      chartjszt: null,
      chartxxzt: null,
      chartLinexxzt: null,
      chartLinejszt: null,
      ChartRadarxszt: null,
      chartAditor: null,
      chartrjgx: null,
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
        datepk: "",
        deptId: 0,
        deptName: "",
        studentid: "",
        studentname: "",
        subjectname: "",
      }
    };
  },
  mounted() {
    this.init();
    // this.initChartLinejszt();
    // this.initChartxxztline();
    // this.initChartjszt();
    // this.initChartAditor();
    // this.initChartxxzt();
    // this.initChartqxzt();
    // this.initChartRadarxszt();
    // this.initchartbq();
    // this.initrj();

    // rt-ch图
    this.initChartrtch();

    // 师生行为分析
    this.initChartssxw();

    // 学生行为分析
    this.initChartxsxw();

    // 教师行为分析
    this.initChartjsxw();

    // 教学情绪
    this.initChartjxqx();
    this.initChartjxqxline();

    // 教学状态
    this.initChartjxzt();
    this.initChartjxztline();
  },
  activated() {
    // 由于给echart添加了resize事件, 在组件激活时需要重新resize绘画一次, 否则出现空白bug
    if (this.chartqxzt) {
      this.chartqxzt.resize();
    }
    if (this.chartbq) {
      this.chartbq.resize();
    }
    if (this.chartjszt) {
      this.chartjszt.resize();
    }
    if (this.chartxxzt) {
      this.chartxxzt.resize();
    }
    if (this.chartrjgx) {
      this.chartrjgx.resize();
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
    //表格属性
    tableheaderCellStyle({ row, column, rowIndex, columnIndex }) {
      return "background:#303660;color:#ffffff;border:#2a2f4d";
    },
    tableCellStyle({ row, column, rowIndex, columnIndex }) {
      return "color:#e8b898;background:#2a2f4d;border:#2a2f4d";
    },
    //人际关系
    initrj() {
      var option = {
        color: [
          "rgb(1, 150, 66)",
          "rgb(144, 188, 61)",
          "rgb(207, 202, 82)",
          "rgb(160, 109, 228)"
        ],
        legend: {
          data: ["非常好", "良好", "正常", "孤僻"],
          textStyle: {
            color: "#ffffff"
          }
        },
        series: [
          {
            // radius: "100%",
            axisLabel: {
              show: false
            },
            axisTick: {
              show: false
            },
            pointer: {
              width: 10,
              length: "80%"
            },
            splitLine: {
              show: false
            },
            center: ["50%", "75%"],
            axisLine: {
              lineStyle: {
                width: 40, // 属性lineStyle控制线条样式
                color: [
                  [0.25, "rgb(160, 109, 228)"],
                  [0.5, "rgb(207, 202, 82)"],
                  [0.75, "rgb(144, 188, 61)"],
                  [1, "rgb(1, 150, 66)"]
                ]
              }
            },
            endAngle: 0,
            startAngle: 180,
            type: "gauge",
            splitNumber: 4,
            min: 4,
            max: 0,
            detail: {
              show: false
            },
            itemStyle: {},
            data: this.rjgx
          },
          {
            type: "funnel",
            x: "56%",
            width: "0%",
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            itemStyle: {
              borderWidth: 0
            },
            data: [
              { value: 0, name: "非常好" },
              { value: 0, name: "良好" },
              { value: 0, name: "正常" },
              { value: 0, name: "孤僻" }
            ]
          }
        ]
      };
      this.chartrjgx = echarts.init(document.getElementById("rjgx_chart"));
      this.chartrjgx.setOption(option),true;
      window.addEventListener("resize", () => {
        this.chartrjgx.resize();
      });
    },
    query() {
      var date1 = "";
      var date2 = "";
      date1 = this.dataForm.datepk[0];
      date2 = this.dataForm.datepk[1];
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
          // console.log(data);
          this.show = true;
          this.xkxq = data.data.xkxq;
          this.tyfz = data.data.tyfz;
          this.rjgx = [];
          this.rjgx.push(parseInt(data.data.rjgx) + 0.5);
          if (data.data.qxzt.size != 3) {
            this.qxzt = [];
            var names = [
              { name: "低落", value: 0 },
              { name: "正常", value: 0 },
              { name: "开心", value: 0 }
            ];
            names.forEach(qxztel => {
              data.data.qxzt.forEach(qxtt => {
                if (qxztel.name == qxtt.name) {
                  qxztel.value = qxtt.value;
                }
              });
              this.qxzt.push(qxztel);
            });
          }
          //this.qxzt = data.data.qxzt;
          this.bq = data.data.bq;
          this.bqtime = data.data.bqtime;
          //
          if (data.data.jsztdata.size != 3) {
            this.jsztdata = [];
            var names = [
              { name: "积极", value: 0 },
              { name: "正常", value: 0 },
              { name: "疲惫", value: 0 }
            ];
            names.forEach(jsztdatal => {
              data.data.jsztdata.forEach(jsztdatat => {
                if (jsztdatal.name == jsztdatat.name) {
                  jsztdatal.value = jsztdatat.value;
                }
              });
              this.jsztdata.push(jsztdatal);
            });
          }
          //
          if (data.data.xxztdata.size != 3) {
            this.xxztdata = [];
            var names = [
              { name: "非常好", value: 0 },
              { name: "良好", value: 0 },
              { name: "正常", value: 0 },
              { name: "不佳", value: 0 }
            ];
            names.forEach(xxztdatal => {
              data.data.xxztdata.forEach(xxztdatat => {
                if (xxztdatal.name == xxztdatat.name) {
                  xxztdatal.value = xxztdatat.value;
                }
              });
              this.xxztdata.push(xxztdatal);
            });
          }

          //this.jsztdata = data.data.jsztdata;
          //this.xxztdata = data.data.xxztdata;
          this.jsztline = data.data.jsztline;
          this.jsztlinedata = data.data.jsztlinedata;
          this.dataShadow = [];
          this.jsztlinedata.forEach(jsztlinedatav => {
            this.dataShadow.push("-1");
          });

          this.xxztline = data.data.xxztline;
          this.xxztlinedata = data.data.xxztlinedata;
          this.xszt = data.data.xszt;
          this.aditorlegend = data.data.aditorlegend;
          this.Aditordata = data.data.Aditordata;
          // this.initChartqxzt();
          // this.initchartbq();
          // this.initChartjszt();
          // this.initChartxxzt();
          // this.initChartxxztline();
          // this.initChartLinejszt();
          // this.initChartRadarxszt();
          // this.initChartAditor();
          // this.initrj();

        } else {
          this.$message.error(data.msg);
        }
      });
      // console.log(this.dataForm);
    },

    // rt-ch图
    initChartrtch(){
      var option = {
        title:{
            text: 'Rt-Ch图',  
            textStyle: {
                color: '#fff',
            },
            left: 'center',
            top: '20',
        },
        xAxis: {
            max: 1,
            axisLabel: {
              color: "#ffffff",
            },
            splitLine: {
                show: true,
                lineStyle: {
                  color: "#555971",
                  type: "solid"
                }
            },
            axisLine: {
              lineStyle: {
                color: "#555971"
              }
            },
        },
        yAxis: {
            type: 'value',
            max: 1,
            axisLine: {
              lineStyle: {
                color: '#fff',
              }
            },
          boundaryGap: false,
          axisLabel: {
            color: "#ffffff",
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#555971",
              type: "solid"
            }
          },
          axisLine: {
            lineStyle: {
              color: "#555971"
            }
          },
        },
        series: [{
            symbolSize: 20,
            data: [
                [0.4, 0.6],
            ],
            type: 'scatter'
        }]
      };

      this.chartjxqx = echarts.init(document.getElementById("rtchchart"));
      this.chartjxqx.setOption(option,true);
      window.addEventListener("resize", () => {
        this.chartjxqx.resize();
      });
    },

    // 师生行为分析
    initChartssxw(){
      var option = {
        title:{
          text: '师生(S-T)行为序列',  
          textStyle: {
            color: '#fff',
          },
          left: 'center',
          top: '20',
        },
        xAxis: {
            type: "category",
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisLabel: {
              color: "#ffffff",
            },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#555971",
              type: "solid"
            }
          },
            axisLine: {
              lineStyle: {
                color: "#555971"
              }
            },
        },
        yAxis: {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#fff',
              }
            },
          boundaryGap: false,
          axisLabel: {
            color: "#ffffff",
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#555971",
              type: "solid"
            }
          },
          axisLine: {
            lineStyle: {
              color: "#555971"
            }
          },
        },
        // tooltip: {
        //     trigger: 'axis'
        // },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        series: [
            {
                name: 'Step Start',
                type: 'line',
                step: 'start',
                symbol:'circle',//拐点设置为实心
                data: [120, 132, 101, 134, 90, 230, 210]
            }
        ]
      };

      this.chartjxqx = echarts.init(document.getElementById("ssxwchart"));
      this.chartjxqx.setOption(option,true);
      window.addEventListener("resize", () => {
        this.chartjxqx.resize();
      });
    },

    // 学生行为分析
    initChartxsxw(){
      var option = {
        title:{
          text: '学生行为分析',  
          textStyle: {
            color: '#fff',
          },
          left: 'center',
          top: '20',
        },
        xAxis: {
            type: "category",
            // boundaryGap: false,
            data: ['发言', '思考/计算', '讨论', '其他'],
            axisLabel: {
              color: "#ffffff",
            },
            axisLine: {
              lineStyle: {
                color: "#555971"
              }
            },
        },
        yAxis: {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#fff',
              }
            },
          boundaryGap: false,
          axisLabel: {
            color: "#ffffff",
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#555971",
              type: "solid"
            }
          },
          axisLine: {
            lineStyle: {
              color: "#555971"
            }
          },
          
        },
        series: [{
            data: [10, 30, 10, 50],
            type: 'bar',
            itemStyle: {
                normal: {
                    color: '#4572C5',
                }
            },
            barWidth : 30
        }]
      };

      this.chartjxqx = echarts.init(document.getElementById("xsxwchart"));
      this.chartjxqx.setOption(option,true);
      window.addEventListener("resize", () => {
        this.chartjxqx.resize();
      });
    },

    // 教师行为分析
    initChartjsxw(){
      var option = {
        title:{
          text: '教师行为分析',  
          textStyle: {
            color: '#fff',
          },
          left: 'center',
          top: '20',
        },
        xAxis: {
            type: "category",
            // boundaryGap: false,
            data: ['板书', '解说(讲课)', '问答', '巡视', '其他'],
            axisLabel: {
              color: "#ffffff",
            },
            axisLine: {
              lineStyle: {
                color: "#555971"
              }
            },
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#fff',
            }
          },
          boundaryGap: false,
          axisLabel: {
            color: "#ffffff",
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#555971",
              type: "solid"
            }
          },
          axisLine: {
            lineStyle: {
              color: "#555971"
            }
          },
          
        },
        series: [{
            data: [10, 30, 10, 50, 20],
            type: 'bar',
            itemStyle: {
                normal: {
                    color: '#4572C5',
                }
            },
            barWidth : 30
        }]
      };

      this.chartjxqx = echarts.init(document.getElementById("jsxwchart"));
      this.chartjxqx.setOption(option,true);
      window.addEventListener("resize", () => {
        this.chartjxqx.resize();
      });
    },

    // 教学情绪
    initChartjxqx(){
      // 指定图表的配置项和数据
      var option = {
        title:{
          text: '教师情绪状态',  
          textStyle: {
            color: '#fff',
          },
          left: 'center',
          top: '20',
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        backgroundColor: '#2f345c',
        legend: {
            orient: 'horizontal',
            bottom: '20',
            data: ['开心', '平静', '愤怒'],
            textStyle: {
                color: '#fff',
            },
        },
        series: [
            {
                name: '教师情绪状态',
                type: 'pie',
                radius: ['40%', '50%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    {value: 335, name: '开心', itemStyle: {color: '#24A15A'}},
                    {value: 310, name: '平静', itemStyle: {color: '#D6D156'}},
                    {value: 154, name: '愤怒', itemStyle: {color: '#59609F'}}
                ]
            }
        ]
      };

      this.chartjxqx = echarts.init(document.getElementById("jxqxchart"));
      this.chartjxqx.setOption(option,true);
      window.addEventListener("resize", () => {
        this.chartjxqx.resize();
      });
    },

    // 教学情绪折线图
    initChartjxqxline(){
      var option = {
        title:{
          text: '教师情绪状态趋势',  
          textStyle: {
            color: '#fff',
          },
          left: 'center',
          top: '20',
        },
        backgroundColor: '#2f345c',
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            orient: 'horizontal',
            bottom: '20',
            data: ['开心', '平静', '愤怒'],
            textStyle: {
                color: '#fff',
            },
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '50',
            containLabel: true
        },
        xAxis: {
            type: "category",
            boundaryGap: false,
            data: this.bqtime,
            axisLabel: {
              color: "#ffffff",
              interval: 0,
              rotate: 40
            },
            axisLine: {
              lineStyle: {
                color: "#555971"
              }
            },
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#fff',
              }
            },
          boundaryGap: false,
          axisLabel: {
            color: "#ffffff",
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#555971",
              type: "solid"
            }
          },
          axisLine: {
            lineStyle: {
              color: "#555971"
            }
          },
          
        },
        series: [
            {
                name: '开心',
                type: 'line',
                symbol:'circle',//拐点设置为实心
                itemStyle: {color: '#24A15A'},
                data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
                name: '平静',
                type: 'line',
                symbol:'circle',//拐点设置为实心
                itemStyle: {color: '#D6D156'},
                data: [220, 182, 191, 234, 290, 330, 310]
            },
            {
                name: '愤怒',
                type: 'line',
                symbol:'circle',//拐点设置为实心
                itemStyle: {color: '#59609F'},
                data: [320, 332, 301, 334, 390, 330, 320]
            },
        ]
      };

      this.chartjxqxline = echarts.init(document.getElementById("jxqxlinechart"));
      this.chartjxqxline.setOption(option,true);
      window.addEventListener("resize", () => {
        this.chartjxqxline.resize();
      });
    },

    // 教学状态
    initChartjxzt(){
      var option = {
        title: {
            text: '教学状态评估',
            textStyle: {
                color: '#fff',
              },
              left: 'center',
              top: '20',
        },
        tooltip: {},
        radar: {
            name: {
                textStyle: {
                    color: '#fff',
                    backgroundColor: '#999',
                    borderRadius: 3,
                    padding: [3, 5]
                }
            },
            indicator: [
                { name: '教学情绪', max: 1},
                { name: '教学行为', max: 1},
                { name: '守时情况', max: 1},
            ],
            center: ['50%', '55%'],
            radius: 60
        },
        series: [{
            name: '教学状态评估',
            type: 'radar',
            symbol: "none", // 去掉图表中各个图区域的边框线拐点
            itemStyle: {
                normal: {
                    color : "#4572C5", // 图表中各个图区域的边框线拐点颜色
                    lineStyle: {
                        color: "#4572C5" // 图表中各个图区域的边框线颜色
                    },

                }
            },
            areaStyle: {normal: {}},
            data: [
                {
                    value: [0.7, 0.6, 1],
                    areaStyle: {
                    normal: {
                        color: '#4572C5', // 选择区域颜色
                        opacity: 1, // 图表中各个图区域的透明度
                    }
                }
                }
            ]
        }]
      };

      this.chartjxqx = echarts.init(document.getElementById("jxztchart"));
      this.chartjxqx.setOption(option,true);
      window.addEventListener("resize", () => {
        this.chartjxqx.resize();
      });
    },

    // 教学状态折线图
    initChartjxztline(){
      var option = {
        title: {
            text: '教学状态综合得分趋势',
            textStyle: {
                color: '#fff',
              },
              left: 'center',
              top: '20',
        },
        xAxis: {
            type: "category",
            boundaryGap: false,
            data: this.bqtime,
            axisLabel: {
              color: "#ffffff",
              interval: 0,
              rotate: 40
            },
            axisLine: {
              lineStyle: {
                color: "#555971"
              }
            },
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#fff',
              }
            },
          boundaryGap: false,
          axisLabel: {
            color: "#ffffff",
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#555971",
              type: "solid"
            }
          },
          axisLine: {
            lineStyle: {
              color: "#555971"
            }
          },
          
        },
        tooltip: {
            trigger: 'axis'
        },
        series: [{
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            symbol:'circle',//拐点设置为实心
            itemStyle: {
                normal: {
                    color : "#4572C5", // 图表中各个图区域的边框线拐点颜色
                    lineStyle: {
                        color: "#4572C5" // 图表中各个图区域的边框线颜色
                    },

                }
            },
            
        }]
      };

      this.chartjxqx = echarts.init(document.getElementById("jxztchartline"));
      this.chartjxqx.setOption(option,true);
      window.addEventListener("resize", () => {
        this.chartjxqx.resize();
      });
    },

    deptListTreeCurrentChangeHandle(data, node) {
      this.dataForm.deptId = data.deptId;
      this.dataForm.deptName = data.name;
      this.getstudentlist(this.dataForm.deptId);
      this.$refs['deptpopover'].doClose()
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
    // 饼状图
    initChartqxzt() {
      var option = {
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
            center: ["50%", "50%"],
            stillShowZeroSum: false,
            data: this.qxzt,
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
      this.chartqxzt = echarts.init(document.getElementById("qxzt_chart"));
      this.chartqxzt.setOption(option,true);
      window.addEventListener("resize", () => {
        this.chartqxzt.resize();
      });
    },
    // 折线图
    initchartbq() {
      var option = {
        grid: {
          left: "3%",
          right: "7%",
          bottom: "7%",
          top: "6%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.bqtime,
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
          },
          axisLine: {
            lineStyle: {
              color: "#555971"
            }
          }
        },
        yAxis: {
          type: "category",
          boundaryGap: false,
          data: ["3", "2", "1", "0", "-1"],
          splitLine: {
            show: true,
            lineStyle: {
              color: "#555971",
              type: "solid"
            }
          },
          axisLine: {
            lineStyle: {
              color: "#555971"
            }
          },
          axisLabel: {
            color: "#ffffff",
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
            itemStyle: {
              normal: {
                lineStyle: {
                  color: "#ecd760"
                }
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#ecd760"
                  },
                  {
                    offset: 1,
                    color: "rgba(100,178,237,0.1)"
                  }
                ])
              }
            },
            data: this.bq
          }
        ]
      };
      this.chartbq = echarts.init(document.getElementById("bq_chart"));
      this.chartbq.setOption(option,true);
      window.addEventListener("resize", () => {
        this.chartbq.resize();
      });
    },
    // 饼状图
    initChartjszt() {
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
            data: this.jsztdata,
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
      this.chartjszt = echarts.init(document.getElementById("jsztchart"));
      this.chartjszt.setOption(option,true);
      window.addEventListener("resize", () => {
        this.chartjszt.resize();
      });
      
    },
    initChartxxzt() {
      var option = {
        legend: {
          orient: "horizontal",
          left: "center",
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
            data: this.xxztdata,
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
      this.chartxxzt = echarts.init(document.getElementById("xxztchart"));
      this.chartxxzt.setOption(option,true);
      window.addEventListener("resize", () => {
        this.chartxxzt.resize();
      });
    },
    // 折线图
    initChartxxztline() {
      var option = {
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
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.xxztline,
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
          },
          axisLine: {
            lineStyle: {
              color: "#555971"
            }
          }
        },
        yAxis: {
          type: "category",
          boundaryGap: false,
          data: ["4", "3", "2", "1", "0", "-1"],
          splitLine: {
            show: true,
            lineStyle: {
              color: "#555971",
              type: "solid"
            }
          },
          axisLine: {
            lineStyle: {
              color: "#555971"
            }
          },
          axisLabel: {
            color: "#ffffff",
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
            itemStyle: {
              normal: {
                lineStyle: {
                  color: "#99e1ff"
                }
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#06a7ea"
                  },
                  {
                    offset: 1,
                    color: "rgba(100,178,237,0.1)"
                  }
                ])
              }
            },
            data: this.xxztlinedata
          }
        ]
      };
      this.chartLinexxzt = echarts.init(document.getElementById("xxztline"));
      this.chartLinexxzt.setOption(option,true);
      window.addEventListener("resize", () => {
        this.chartLinexxzt.resize();
      });
    },

    // 柱状图
    initChartLinejszt() {
      var option = {
        xAxis: {
          data: this.jsztline,
          splitLine: {
            show: true,
            lineStyle: {
              color: "#555971",
              type: "solid"
            }
          },
          axisLine: {
            lineStyle: {
              color: "#555971"
            }
          },
          axisLabel: {
            color: "#ffffff",
            interval: 0,
            rotate: -40
          }
        },
        yAxis: {
          axisLine: {
            lineStyle: {
              color: "#555971"
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#555971",
              type: "solid"
            }
          },
          boundaryGap: false,
          data: ["3", "2", "1", "0", "-1"],
          axisLabel: {
            color: "#ffffff",
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
            // For shadow
            type: "bar",
            itemStyle: {
              normal: { color: "#424873" }
            },
            barGap: "-100%",
            barCategoryGap: "40%",
            data: this.dataShadow,
            animation: false
          },
          {
            type: "bar",
            data: this.jsztlinedata,
            barCategoryGap: "80%",
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#28a2d5"
                  },
                  {
                    offset: 1,
                    color: "#ffffff"
                  }
                ])
              }
            }
          }
        ]
      };
      this.chartLinejszt = echarts.init(document.getElementById("jsztline"));
      this.chartLinejszt.setOption(option,true);
      window.addEventListener("resize", () => {
        this.chartLinejszt.resize();
      });
    },
    // 雷达图
    initChartRadarxszt() {
      var option = {
        calculable: true,
        radar: [
          {
            indicator: [
              { text: "学业状态", max: 1 },
              { text: "精神状态", max: 1 },
              { text: "情绪状态", max: 1 },
              { text: "人际关系", max: 1 }
            ],
            name: {
              textStyle: {
                color: "#ffffff"
              }
            },
            splitArea: {
              areaStyle: {
                color: ["#3c447f", "#4e547b", "#323864"]
              }
            },
            radius: 80
          }
        ],
        series: [
          {
            type: "radar",
            itemStyle: {
              normal: {
                areaStyle: {
                  color: "#36d178"
                }
              }
            },
            data: [
              {
                value: this.xszt,
                label: {
                  normal: {
                    color: "#ffffff",
                    position: "bottom",
                    show: true,
                    formatter: function(params) {
                      return params.value;
                    }
                  }
                }
              }
            ]
          }
        ]
      };
      this.ChartRadarxszt = echarts.init(
        document.getElementById("chartRadarBoxxszt")
      );
      this.ChartRadarxszt.setOption(option,true);
      window.addEventListener("resize", () => {
        this.ChartRadarxszt.resize();
      });
    },
    //散点图
    initChartAditor() {
      var datas = this.Aditordata;
      // console.log(datas)
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
          }
        },
        grid: {
          left: "20%",
          right: "20%",
          containLabel: true,
          bottom:"30%"
        },
        legend: {
          data: this.aditorlegend,
          left: "center",
          top: "bottom",
          formatter: function(item) {
            var rt = item;
            datas.forEach(ad => {
              if (ad.name == item) {
                rt = ad.name + ": 学业状态 " + ad.data[0].join(" 成绩 ");
              }
            });
            return rt;
          },
          textStyle: {
            color: "#ffffff",
            fontSize: 16
          }
        },
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
        series: datas
      };
      this.chartAditor = echarts.init(
        document.getElementById("chartAditorBox")
      );
      this.chartAditor.setOption(option,true);
      window.addEventListener("resize", () => {
        this.chartAditor.resize();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
#rtchchart{
  width: 282px;
  height: 282px;
  background-repeat: no-repeat;
  background-size: 227px 163px;
  background-position: center;
}
.jxms{
  display: flex;
  height: 282px;
  background-color: #30345C;
  border-right: 2px solid rgb(66, 69, 98);
  padding-top: 20px;
  padding-left: 10px;
  .jxms-img{
    width: 70px;
    height: 70px;
    margin: 0 auto;
    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  p{
    color: #fff;
    margin-left: 20px;
  }
  p.p-top{
    margin-top: 30px;
  }
}
.pro-main {
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
    background-color:#2f345c;
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

  /deep/ .el-form-item--medium .el-form-item__content,
  /deep/ .el-form-item--medium .el-form-item__label {
    color: #f5f5f5;
  }

  /deep/ .el-radio-button:first-child .el-radio-button__inner {
    border: 0;
    border-radius: 0;
  }
  /deep/ .el-radio-button:last-child .el-radio-button__inner {
    border-radius: 0;
  }
  /deep/ .el-radio-button__inner {
    background-color: #343a6d;
    color: #f5f5f5;
    border: 0;
  }

  /deep/ .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    border: 1px solid #737cc2;
    background-color: #343a6d;
    box-shadow: inset 0px 0px 5px 1px #ffffff !important;
  }
  /deep/ .el-input__inner {
    border: 0;
    background-color: #343a6d;
  }
  /deep/ .el-range-editor--medium .el-range-separator {
    color: #f5f5f5;
  }
  /deep/ .el-range-editor--medium .el-range-input {
    background-color: #343a6d;
  }
  /deep/ .el-range-editor--medium .el-range-input::-webkit-input-placeholder {
    color: #f5f5f5;
  }
  /deep/ .el-form-item--medium .el-form-item__content,
  /deep/ .el-form-item--medium .el-form-item__label {
    color: #f5f5f5;
  }
  /deep/ .el-button {
    background: #343a6d;
    color: #f5f5f5;
    border: 0;
  }
  /deep/ .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background-color: #0c1352;
  }
  /deep/ .el-input__inner {
    color: #f5f5f5;
  }
  /deep/ .el-table th,
  /deep/ .el-table tr {
    background: #303660;
  }
  .jxzt-score{
    position: relative;
    top: -70px;
    color: #fff;
    padding-left: 20px;
  }
}

</style>
