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
            <el-form-item label="院系" prop="class_name">
              <el-popover placement="bottom-start" trigger="click" ref="deptpopover">
                <el-tree :data="deptList" :props="deptListTreeProps" node-key="deptId" ref="deptListTree" @current-change="deptListTreeCurrentChangeHandle" :default-expand-all="false" :highlight-current="true" :expand-on-click-node="false">
                </el-tree>
                <el-input v-model="dataForm.class_name" slot="reference" :readonly="true" placeholder="点击选择班年级" class="dept-list__input"></el-input>
              </el-popover>
            </el-form-item>
            <el-form-item label="教师" prop="studentName">
              <el-select v-model="dataForm.teacher_id" filterable placeholder="请选择" @change="teacherCurrentChangeHandle">
                <el-option v-for="item in options" :key="item.username" :label="item.name" :value="item.username">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="科目" prop="subjectName">
              <el-select v-model="dataForm.course_id" filterable placeholder="请选择">
                <el-option
                  v-for="item in subjectOptions"
                  :key="item.course_id"
                  :label="item.course_name"
                  :value="item.course_id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-button @click="query" :loading="false">查询</el-button>
          </div>
        </el-form>
      </center>
    </el-row>
    <div :style="{visibility: show ? 'visible' : 'hidden'}">
      <el-row :gutter="20">
        <el-col :span="11" :offset="1" style="padding-right: 0px;">
          <div class="title">教师互动类型</div>
          <div class="jxms">
            <div class="jxms-box" style="width: 30%">
              <div class="jxms-img">
                <img src="~@/assets/img/jxms.jpg">
              </div>
              <p>教学模式：混合型</p>
              <p class="p-top">Rt：{{ rt }}</p>
              <p>教师行为占比</p>
              <p class="p-top">Ch：{{ ch }}</p>
              <p>师生行为转化率</p>
            </div>
            <div class="jxms-right" style="width: 70%">
              <div id="rtchchart" class="chart-box" :style="{backgroundImage:'url('+require('../../../assets/img/rtch.png')+')'}"></div>
            </div>
          </div>

        </el-col>
        <el-col :span="11" style="padding-left: 0px;">
          <div class="title" style="height:25px">&nbsp;</div>
          <div style="background-color: #30345C;">
            <div id="ssxwchart" class="chart-box" style="width: 100%;"></div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="11" :offset="1" style="padding-right: 0px;">
          <div style="width: 100%; background-color: #30345C; border-right: 2px solid #424562;">
            <div id="xsxwchart" class="chart-box" style="width: 100%;"></div>
          </div>
        </el-col>
        <el-col :span="11" style="padding-left: 0px; ">
          <div style="width: 100%; background-color: #30345C;">
            <div id="jsxwchart" class="chart-box" style="width: 100%;"></div>
          </div>
        </el-col>
      </el-row>
      
      <!-- 第二部分 -->
      <el-row :gutter="20" style="margin-top: 15px;">
        <el-col :span="11" :offset="1" style="padding-right: 0px;">
          <div class="title">教学情绪</div>
          <div id="jxqxchart" class="chart-box" style="border-right: 2px solid #424562; overflow:hidden;"></div>
        </el-col>
        <el-col :span="11" style="padding-left: 0px;">
          <div class="title" style="height:25px">&nbsp;</div>
          <div style="width: 100%; background-color: #30345C;">
            <div id="jxqxlinechart" class="chart-box" style="width: 100%;"></div>
          </div>
        </el-col>
      </el-row>

      <!-- 第三部分 -->
      <el-row :gutter="20" style="margin-top: 15px;">
        <el-col :span="11" :offset="1" style="padding-right: 0px;">
          <div class="title">教学状态</div>
          <div id="jxztchart" class="chart-box" style="height:320px; border-right-color: #424562; border-right-width: 2px; border-right-style: solid;"></div>
          <div class="jxzt-score" style="position: relative; top: -105px; color: #fff; padding-left: 20px;">
            <p>综合得分：{{score}}</p>
            <!-- <p>教学情绪平稳、准时上课并且教学行为较为丰富</p> -->
            <p>教学状态表现
              <span v-if="90 <= score && score <= 100">优秀</span>
              <span v-else-if="80 <= score && score < 90">良好</span>
              <span v-else-if="70 <= score && score < 80">一般</span>
              <span v-else-if="60 <= score && score < 70">较差</span>
              <span v-else-if="0 < score && score < 60">差</span>
              ，其中
              <span v-if="0.85 <= emotion && emotion <= 1">教学情绪积极、</span>
              <span v-else-if="0.6 <= emotion && emotion < 0.85">教学情绪平稳、</span>
              <span v-else-if="emotion < 0.6">教学中有较多愤怒情绪、</span>
              <span v-if="ontime == 1">准时上课</span>
              <span v-else-if="0.6 <= ontime && emotion < 1">偶尔不准时上课</span>
              <span v-else-if="ontime < 0.6">不准时上课情况较突出</span>
              <span v-if="0.9 <= behavior && behavior <= 1">并且教学行为丰富</span>
              <span v-else-if="0.8 <= behavior && behavior < 0.9">并且教学行为较丰富</span>
              <span v-else-if="0.6 <= behavior && behavior < 0.8">并且教学行为较丰富</span>
              <span v-else-if="behavior < 0.6">并且教学行为单一</span>
            </p>
          </div>
        </el-col>
        <el-col :span="11" style="padding-left: 0px; ">
          <div class="title" style="height:25px">&nbsp;</div>
          <div style="width: 100%; background-color: #30345C;">
            <div id="jxztchartline" class="chart-box" style="height:320px; width: 100%;"></div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="height:50px"></el-row>
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
      show: false,
      // show: true,
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
      // todo
      // options: [{studentNumber: "202001", studentName: "教师1"}, {studentNumber: "202002", studentName: "教师2"}],
      options :[],
      subjectOptions: [],
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
        teacher_id: "",
        course_id: "",
        college_name: "",
        grade_name: "",
        class_name: "",
      },
      rt: null,
      ch: null,
      rtchData: [],
      ssxwData: [],
      xsxwData: [],
      jsxwData: [],
      jxqxData: [],
      jxqxlineData: {},
      jxztData: {},
      score: null,
      ontime: null,
      emotion: null,
      behavior: null,
      jxqxline: [],
      jxztlineData: {}
    };
  },
  mounted() {
    this.init();
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
  // 由于给echart添加了resize事件, 在组件激活时需要重新resize绘画一次, 否则出现空白bug
  activated() {
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
    getcourse(deptid, teacherid) {
      this.$http({
        url: this.$http.adornUrl("/datacenter/StudentCourseInfo/getCourseByTeacher"),
        method: "post",
        data: this.$http.adornData({
          deptid: deptid+"",
          teacher_id: teacherid
        })
      }).then(({ data }) => {
        this.subjectOptions = data.data;
        this.dataForm.course_id = "";
      });
    }, 

    //表格属性
    tableheaderCellStyle({ row, column, rowIndex, columnIndex }) {
      return "background:#303660;color:#ffffff;border:#2a2f4d";
    },
    tableCellStyle({ row, column, rowIndex, columnIndex }) {
      return "color:#e8b898;background:#2a2f4d;border:#2a2f4d";
    },
    // 查询
    query() {
      var date1 = "";
      var date2 = "";
      date1 = this.dataForm.datepk[0];
      date2 = this.dataForm.datepk[1];
      // 时间
      if (this.dataForm.datepk === "") {
        this.$message({
          message: "日期不为空",
          type: "error",
          duration: 1500
        });
        return;
      }
      // 院系
      if (this.dataForm.class_name === "") {
        this.$message({
          message: "院系不为空",
          type: "error",
          duration: 1500
        });
        return;
      }
      // 教师
      if (this.dataForm.teacher_id === "") {
        this.$message({
          message: "教师不为空",
          type: "error",
          duration: 1500
        });
        return;
      }
      // 科目
      if (this.dataForm.course_id === "") {
        this.$message({
          message: "科目不为空",
          type: "error",
          duration: 1500
        });
        return;
      }
      this.$http({
        url: this.$http.adornUrl("/eyereport/teacher/type"),
        method: "post",
        data: this.$http.adornData({
          date1: date1,
          date2: date2,
          deptid: this.dataForm.deptId,
          teacher_id: this.dataForm.teacher_id,
          course_id: this.dataForm.course_id,
          college_name: this.dataForm.college_name,
          grade_name: this.dataForm.grade_name,
          class_name: this.dataForm.class_name
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log(data);
          // rt-ch图
          let rtch = data.data.rtch
          if(rtch && rtch[0]){
            this.rt = rtch[0].rt
            this.ch = rtch[0].ch
            this.rtchData.push([rtch[0].rt, rtch[0].ch]);
            this.initChartrtch()
          }
          // 师生行为序列图
          let ssxw = data.data.ssxw
          if(ssxw.length != 0){
            let x = 0
            let y = 0
            let cnt = 1
            this.ssxwData.push([0, 0])
            ssxw.forEach((v, i) => {
              // 从第二个开始
              if(i != 0){
                // 跟前一个不等
                if(v['type'] != ssxw[i - 1]['type']){
                  if (ssxw[i - 1]['type'] == 0){
                    x += cnt
                  }
                  else{
                    y += cnt
                  }
                  cnt = 1
                  this.ssxwData.push([x, y])
                }
                else{
                  cnt += 1
                }
              }
            })
            // console.log(this.ssxwData)
            this.initChartssxw()
          }
          // 学生行为分析
          let xsxw = data.data.xsxw
            if(xsxw.length != 0){
            xsxw.forEach((v, i) => {
              this.xsxwData.push([v.action, v.percentage * 100])
            })
            this.initChartxsxw()
          }
          // 教师行为分析
          let jsxw = data.data.jsxw
            if(jsxw.length != 0){
            jsxw.forEach((v, i) => {
              this.jsxwData.push([v.action, v.percentage * 100])
            })
            this.initChartjsxw()
          }
          // 教学情绪
          let jxqx = data.data.qxzt
          if(jxqx && jxqx[0]){
            if(jxqx.length != 0){
              this.jxqxData = [
                {value: jxqx[0].happy_rate, name: '开心', itemStyle: {color: '#24A15A'}},
                {value: jxqx[0].normal_rate, name: '平静', itemStyle: {color: '#D6D156'}},
                {value: jxqx[0].angry_rate, name: '愤怒', itemStyle: {color: '#59609F'}}
              ]
              this.initChartjxqx()
            }
          }
          // 教学情绪趋势图
          let jxqxline = data.data.jxqxline
          this.jxqxlineData.dt = []
          this.jxqxlineData.happy = []
          this.jxqxlineData.normal = []
          this.jxqxlineData.angry = []
          if(jxqxline.length != 0){
            jxqxline.forEach((v, i) => {
              v.happy_rate *= 100
              v.normal_rate *= 100
              v.angry_rate *= 100
              this.jxqxlineData.dt.push(v.dt)
              this.jxqxlineData.happy.push(v.happy_rate.toFixed(2))
              this.jxqxlineData.normal.push(v.normal_rate.toFixed(2))
              this.jxqxlineData.angry.push(v.angry_rate.toFixed(2))
            })
            // console.log(this.jxqxlineData)
            this.initChartjxqxline()
          }
          // 教学状态
          let jxzt = data.data.jxzt
          if(jxzt && jxzt[0]){
            if(jxzt.length != 0){
              this.score = Number(jxzt[0]['score'])
              this.ontime = Number(jxzt[0]['ontime'])
              this.emotion = Number(jxzt[0]['emotion'])
              this.behavior = Number(jxzt[0]['behavior'])
              this.initChartjxzt()
            }
          }
          // 教学状态趋势
          let jxztline = data.data.jxztline
          if(jxztline.length != 0){
            this.jxztlineData.dt = []
            this.jxztlineData.score = []
            jxztline.forEach((v, i) => {
              this.jxztlineData.dt.push(v.dt)
              this.jxztlineData.score.push(v.score)
            })
            this.initChartjxztline()
          }
          if(!rtch[0] && ssxw.length == 0 && xsxw.length == 0 && jsxw.length == 0 && !jxqx[0] && jxqxline.length == 0 && !jxzt[0] && jxztline.length == 0){
            this.$message.error("暂无数据！");
          }
          else{
            this.show = true;
          }

        } else {
          this.$message.error(data.msg);
        }
      });
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
            // data: [
            //     [0.4, 0.6],
            // ],
            data: this.rtchData,
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
          name: "T",
          nameTextStyle: {
            color: "#fff",
          },
          type: "value",
          // type: "category",
          // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
          name: "S",
          nameTextStyle: {
            color: "#fff",
          },
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
          left: '18%',
          right: '8%',
          bottom:'10%'
        },
        series: [
            {
                name: 'Step Start',
                type: 'line',
                step: 'start',
                symbol:'circle',//拐点设置为实心
                // data: [0, 1, 0, 1, 0, 1, 0]
                data: this.ssxwData
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
            // data: ['发言', '思考/计算', '讨论', '其他'],
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
          axisLabel: {
            show: true,  
            interval: 'auto',
            color: "#ffffff",
            formatter : '{value} %'
          }, 
          axisLine: {
            lineStyle: {
              color: "#555971"
            }
          },
 
        },
        grid: {
          left: '18%',
          right: '8%',
          // bottom:'28%'
        },
        series: [{
            // data: [['发言', 10], ['发言2', 30], ['发言3', 10], ['发言4', 50]],
            data: this.xsxwData,
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
            // data: ['板书', '解说(讲课)', '问答', '巡视', '其他'],
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
          axisLabel: {
            show: true,  
            interval: 'auto',
            color: "#ffffff",
            formatter : '{value} %'
          }, 
          
        },
        grid: {
          left: '18%',
          right: '8%',
          // bottom:'28%'
        },
        series: [{
            // data: [10, 30, 10, 50, 20],
            data: this.jsxwData,
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
                // data: [
                //     {value: 335, name: '开心', itemStyle: {color: '#24A15A'}},
                //     {value: 310, name: '平静', itemStyle: {color: '#D6D156'}},
                //     {value: 154, name: '愤怒', itemStyle: {color: '#59609F'}}
                // ]
                data: this.jxqxData
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
            trigger: 'axis',
            formatter : '{a0}: {c0} %<br />{a1}: {c1} %<br />{a2}: {c2} %<br />'
        },
        legend: {
            orient: 'horizontal',
            bottom: '20',
            data: ['开心', '平静', '愤怒'],
            textStyle: {
                color: '#fff',
            },
        },
        // grid: {
        //     left: '3%',
        //     right: '4%',
        //     bottom: '50',
        //     containLabel: true
        // },
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
            // data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            data: this.jxqxlineData.dt
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
          axisLabel: {
            show: true,  
            interval: 'auto',
            color: "#ffffff",
            formatter : '{value} %'
          }, 
          
        },
        grid: {
          left: '18%',
          right: '8%',
          bottom:'38%'
        },
        series: [
            {
                name: '开心',
                type: 'line',
                symbol:'circle',//拐点设置为实心
                itemStyle: {color: '#24A15A'},
                // data: [120, 132, 101, 134, 90, 230, 210]
                data: this.jxqxlineData.happy
            },
            {
                name: '平静',
                type: 'line',
                symbol:'circle',//拐点设置为实心
                itemStyle: {color: '#D6D156'},
                // data: [220, 182, 191, 234, 290, 330, 310]
                data: this.jxqxlineData.normal
            },
            {
                name: '愤怒',
                type: 'line',
                symbol:'circle',//拐点设置为实心
                itemStyle: {color: '#59609F'},
                // data: [320, 332, 301, 334, 390, 330, 320]
                data: this.jxqxlineData.angry
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
                    // value: [0.7, 0.6, 1],
                    value: [this.emotion, this.behavior, this.ontime],
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
            // data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            data: this.jxztlineData.dt
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
        grid: {
          left: '18%',
          right: '8%',
          bottom:'28%'
        },
        tooltip: {
            trigger: 'axis'
        },
        series: [{
            // data: [820, 932, 901, 934, 1290, 1330, 1320],
            data: this.jxztlineData.score,
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

    // 院系改变
    deptListTreeCurrentChangeHandle(data, node) {
      this.dataForm.deptId = data.deptId;
      this.dataForm.class_name = data.name;
      if(this.dataForm.teacher_id != ""){
        this.getcourse(this.dataForm.deptId, this.dataForm.teacher_id);
      }
      this.$refs['deptpopover'].doClose()
    },

    // 教师单选框改变
    teacherCurrentChangeHandle(){
      if(this.dataForm.teacher_id != "" && this.dataForm.deptid != ""){
        this.getcourse(this.dataForm.deptId, this.dataForm.teacher_id);
      }
    },

    init() {
      this.iheight = window.innerHeight - 800 + "px";
      // 院系选择
      this.$http({
        url: this.$http.adornUrl("/sys/dept/select"),
        method: "get",
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.deptList = treeDataTranslate(data.deptList, "deptId");
        this.getTeacherList(this.dataForm.deptId);
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
    // 获取教师列表
    getTeacherList(id) {
      this.$http({
        url: this.$http.adornUrl("/sys/user/getTeacherList"),
        methods: "post",
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
    // top: -70px;
    top: -95px;
    color: #fff;
    padding-left: 20px;
    padding-right: 20px;
    line-height: 25px;
  }
}

</style>
