<template>
  <div class="teacheff-main">
    <img src="~@/assets/img/teacheff.png" style="position: absolute;width: 100%;" />
    <el-row>
      <el-form :inline="true">
        <div>
          <center>
            <el-form-item>
              日期：
              <el-date-picker
                value-format="yyyy-MM-dd"
                v-model="dataForm.date1"
                type="date"
                align="right"
                @change="datechange()"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="班年级" prop="deptName">
              <el-popover placement="bottom-start" trigger="click" ref="deptpopover">
                <el-tree
                  :data="deptList"
                  :props="deptListTreeProps"
                  node-key="deptId"
                  ref="deptListTree"
                  @current-change="deptListTreeCurrentChangeHandle"
                  :default-expand-all="false"
                  :highlight-current="true"
                  :expand-on-click-node="false"
                ></el-tree>
                <el-input
                  v-model="dataForm.deptName"
                  slot="reference"
                  :readonly="true"
                  placeholder="点击选择班年级"
                  class="dept-list__input"
                ></el-input>
              </el-popover>
            </el-form-item>
            <el-form-item label="科目" prop="course">
              <el-select v-model="dataForm.course" placeholder="请选择科目">
                <el-option
                  v-for="item in options"
                  :key="item.courseId"
                  :label="item.courseName"
                  :value="item.courseName"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-button @click="query" :loading="loading">查询</el-button>
          </center>
        </div>
      </el-form>
    </el-row>
    <div :style="{visibility: show ? 'visible' : 'hidden'}">
      <el-row :gutter="10">
        <!-- 教学综合效果 -->
        <el-col :span="6" :offset="1">
          <div class="title">
            教学效果综合状态总结&nbsp;
            <img src="~@/assets/img/gxfzico.png" />
          </div>
          <!-- <div id="chartRadarBoxxsztt" class="chart-box" style="min-height:549px;padding-bottom：10px"></div>   -->
          <div id="chartRadarBoxxsztt" class="chart-box" style="min-height:602px;padding-bottom：10px"></div>  
        </el-col>

        <el-col :span="16">
          <!-- <el-row> -->
            <div class="title">
              学生&nbsp;
              <img src="~@/assets/img/gxfzico.png" />
            </div>
            <el-row style="top: 0;">
              <el-col :span="8" style="padding-right:0px;border-right-color: #424562; border-right-width: 2px; border-right-style: solid;">
                <div id="Chartxsqx" class="chart-box">1</div>
              </el-col>
              <el-col :span="8" style="padding-right:0px;padding-left:0px;border-right-color: #424562; border-right-width: 2px; border-right-style: solid;">
                <div id="Chartxsjs" class="chart-box">1</div>
              </el-col>
              <el-col :span="8" style="padding-right:0px;padding-left:0px">
                <div id="Chartxsxx" class="chart-box">1</div>
              </el-col>
            </el-row>
          <!-- </el-row> -->
          <el-row style="top: 0;">
            <div class="title">
              课堂&nbsp;
              <img src="~@/assets/img/gxfzico.png" />
            </div>
            <el-col :span="8" style="padding-right:0px;border-right-color: #424562; border-right-width: 2px; border-right-style: solid;">
              <div id="Chartktjjx" class="chart-box"></div>
            </el-col>
            <el-col :span="8" style="padding-right:0px;padding-left:0px;border-right-color: #424562; border-right-width: 2px; border-right-style: solid;">
              <div id="Chartktzzd" class="chart-box"></div>
            </el-col>
            <el-col :span="8" style="padding-left:0px">
              <div id="Chartkthdx" class="chart-box"></div>
            </el-col>
          </el-row>

        </el-col>
      </el-row>

      <el-row :gutter="10" style="margin-top:20px;">
        <!-- 学生情绪状态 -->
        <el-col :span="10" :offset="1" style="padding-left:4px; padding-right:0px;">
            <div class="title">
              学生&nbsp;
              <img src="~@/assets/img/gxfzico.png" />
            </div>
          <div id="Chartxsqxztqs" class="chart-box">1</div>
        </el-col>
        <!-- 课堂积极性 -->
        <el-col :span="11" :offset="1" style="padding-left:0px; padding-right:4px;">
          <div class="title">
            课堂&nbsp;
            <img src="~@/assets/img/gxfzico.png" />
          </div>
          <div id="Chartktjjxqs" class="chart-box"></div>
        </el-col>
      </el-row>
      
      <el-row>
        <!-- 学生精神状态 -->
        <el-col :span="10" :offset="1" style="padding-left:0px">
          <div id="Chartxsjsztqs" class="chart-box"></div>
        </el-col>
         <!-- 课堂专注度 -->
        <el-col :span="11" :offset="1">
          <div id="Chartktzzdqs" class="chart-box"></div>
        </el-col>
      </el-row>
     
      <el-row>
        <!-- 学生学习状态 -->
        <el-col :span="10" :offset="1" style="padding-left:0px">
          <div id="Chartxsxxztqs" class="chart-box"></div>
        </el-col>
        <!-- 课堂互动性趋势 -->
        <el-col :span="11" :offset="1">
          <div id="Chartkthdxqs" class="chart-box"></div>
        </el-col>
      </el-row>
       <el-row :gutter="20" style="height:50px">
      </el-row>
    </div>
  </div>
</template>
<script>
import { treeDataTranslate } from "@/utils";
import { formatDate } from "@/utils";
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
      ChartRadarxsztt: null,
      Chartxsqx: null,
      Chartxsxx: null,
      Chartxsjs: null,
      Chartxsqxztqs: null,
      Chartxsjsztqs: null,
      Chartxsxxztqs: null,
      Chartktjjx: null,
      Chartkthdx: null,
      Chartktzzd: null,
      Chartktjjxqs: null,
      Chartktzzdqs: null,
      Chartkthdxqs: null,
      date1: "",
      show: false,
      deptListTreeProps: {
        label: "name",
        children: "children"
      },
      deptList: [],
      bodydata: [],
      smalldata: [],
      headdata: [],
      options: []
    };
  },
  mounted() {
    this.init();
    // this.initChartRadarjxxg();
    // this.initChartxsqx();
    // this.initChartxsjs();
    // this.initChartxsxx();
    // this.initChartxsqxztqs();
    // this.initChartxsjsztqs();
    // this.initChartxsxxztqs();
    // this.initChartktjjx();
    // this.initChartkthdx();
    // this.initChartktzzd();
    // this.initChartktjjxqs();
    // this.initChartktzzdqs();
    // this.initChartkthdxqs();
    // this.initChartktztxyztfx();
  },
  activated() {

    if(this.ChartRadarxsztt)
    {
      this.ChartRadarxsztt.resize()
    }
     if(this.Chartxsqx)
    {
      this.Chartxsqx.resize()
    }
      if(this.Chartxsxx)
    {
      this.Chartxsxx.resize()
    }
    if(this.Chartxsjs)
    {
      this.Chartxsjs.resize()
    }
     if(this.Chartxsqxztqs)
    {
      this.Chartxsqxztqs.resize()
    }
      if(this.Chartxsjsztqs)
    {
      this.Chartxsjsztqs.resize()
    }
     if(this.Chartxsxxztqs)
    {
      this.Chartxsxxztqs.resize()
    }
     if(this.Chartktjjx)
    {
      this.Chartktjjx.resize()
    }
      if(this.Chartkthdx)
    {
      this.Chartkthdx.resize()
    }
     if(this.Chartktzzd)
    {
      this.Chartktzzd.resize()
    }
     if(this.Chartktjjxqs)
    {
      this.Chartktjjxqs.resize()
    }
      if(this.Chartktzzdqs)
    {
      this.Chartktzzdqs.resize()
    }
      if(this.Chartkthdxqs)
    {
      this.Chartkthdxqs.resize()
    }
  },
  methods: {
    datechange(){
      this.getcourse(this.dataForm.deptId,this.dataForm.date1);
    },
    addDate(date, days) {
      var d = new Date(date);
      d.setDate(d.getDate() + days);
      var m = d.getMonth() + 1;
      var M="";
      if (m < 10) {
         M= "-0" + m
      }else
      {
        M="-"+m
      }
      var dd=d.getDate();
      var D="";
      if(dd<10)
      {
        D="-0"+dd
      }else
      {
        D="-"+dd
      }
      return d.getFullYear() +  M + D;
    },
    getcourse(deptid,date1) {
      this.$http({
        url: this.$http.adornUrl("/datacenter/StudentCourseInfo/dict"),
        method: "post",
        data: this.$http.adornData({
          deptid: deptid+"",
          date:date1
        })
      }).then(({ data }) => {
        // console.log(data.data)
        let courseList = {}
        data.data.forEach((v, i) => {
          if(!(v.courseId in courseList)){
            courseList[v.courseId] = v.courseName
            this.options.push(v)
          }
        })
        // console.log(this.options)
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
      this.getcourse(this.dataForm.deptId,this.dataForm.date1);
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
      if (this.dataForm.course === "") {
        this.$message({
          message: "科目不为空",
          type: "error",
          duration: 1500
        });
        return;
      }
      this.show=true
      this.$http({
        url: this.$http.adornUrl("/eyereportdata/teacheff/Radarjxxg"),
        method: "post",
        data: this.$http.adornData({
          deptid: this.dataForm.deptId,
          course_name: this.dataForm.course,
          dt: this.dataForm.date1
        })
      }).then(({ data }) => {
        if (data.data.length > 0) {
          this.initChartRadarjxxg(data.data);
        } else {
          this.initChartRadarjxxg();
        }
      });
      this.$http({
        url: this.$http.adornUrl("/eyereportdata/teacheff/xsqxzt"),
        method: "post",
        data: this.$http.adornData({
          deptid: this.dataForm.deptId,
          course_name: this.dataForm.course,
          dt: this.dataForm.date1
        })
      }).then(({ data }) => {
        if (data.data.length > 0) {
          this.initChartxsqx(data.data);
        } else {
          this.initChartxsqx();
        }
      });
      this.$http({
        url: this.$http.adornUrl("/eyereportdata/teacheff/xsjszt"),
        method: "post",
        data: this.$http.adornData({
          deptid: this.dataForm.deptId,
          course_name: this.dataForm.course,
          dt: this.dataForm.date1
        })
      }).then(({ data }) => {
        if (data.data.length > 0) {
          this.initChartxsjs(data.data);
        } else {
          this.initChartxsjs();
        }
      });
      this.$http({
        url: this.$http.adornUrl("/eyereportdata/teacheff/xsxxzt"),
        method: "post",
        data: this.$http.adornData({
          deptid: this.dataForm.deptId,
          course_name: this.dataForm.course,
          dt: this.dataForm.date1
        })
      }).then(({ data }) => {
        if (data.data.length > 0) {
          this.initChartxsxx(data.data);
        } else {
          this.initChartxsxx();
        }
      });
      this.$http({
        url: this.$http.adornUrl("/eyereportdata/teacheff/xsqxztqx"),
        method: "post",
        data: this.$http.adornData({
          deptid: this.dataForm.deptId,
          course_name: this.dataForm.course,
          dt: this.dataForm.date1
        })
      }).then(({ data }) => {
        if (data.data.length > 0) {
          this.initChartxsqxztqs(data.data);
        } else {
          this.initChartxsqxztqs();
        }
      });
      this.$http({
        url: this.$http.adornUrl("/eyereportdata/teacheff/xsjsztqx"),
        method: "post",
        data: this.$http.adornData({
          deptid: this.dataForm.deptId,
          course_name: this.dataForm.course,
          dt: this.dataForm.date1
        })
      }).then(({ data }) => {
        if (data.data.length > 0) {
          this.initChartxsjsztqs(data.data);
        } else {
          this.initChartxsjsztqs();
        }
      });
      this.$http({
        url: this.$http.adornUrl("/eyereportdata/teacheff/xsxxztqx"),
        method: "post",
        data: this.$http.adornData({
          deptid: this.dataForm.deptId,
          course_name: this.dataForm.course,
          dt: this.dataForm.date1
        })
      }).then(({ data }) => {
        if (data.data.length > 0) {
          this.initChartxsxxztqs(data.data);
        } else {
          this.initChartxsxxztqs();
        }
      });
      this.$http({
        url: this.$http.adornUrl("/eyereportdata/teacheff/ktjjx"),
        method: "post",
        data: this.$http.adornData({
          deptid: this.dataForm.deptId,
          course_name: this.dataForm.course,
          dt: this.dataForm.date1
        })
      }).then(({ data }) => {
        if (data.data.length > 0) {
          this.initChartktjjx(data.data);
        } else {
          this.initChartktjjx();
        }
      });
      this.$http({
        url: this.$http.adornUrl("/eyereportdata/teacheff/ktzzd"),
        method: "post",
        data: this.$http.adornData({
          deptid: this.dataForm.deptId,
          course_name: this.dataForm.course,
          dt: this.dataForm.date1
        })
      }).then(({ data }) => {
        if (data.data.length > 0) {
          this.initChartktzzd(data.data);
        } else {
          this.initChartktzzd();
        }
      });
      this.$http({
        url: this.$http.adornUrl("/eyereportdata/teacheff/kthdx"),
        method: "post",
        data: this.$http.adornData({
          deptid: this.dataForm.deptId,
          course_name: this.dataForm.course,
          dt: this.dataForm.date1
        })
      }).then(({ data }) => {
        if (data.data.length > 0) {
          this.initChartkthdx(data.data);
        } else {
          this.initChartkthdx();
        }
      });
      this.$http({
        url: this.$http.adornUrl("/eyereportdata/teacheff/ktjjxqx"),
        method: "post",
        data: this.$http.adornData({
          deptid: this.dataForm.deptId,
          course_name: this.dataForm.course,
          dt: this.dataForm.date1
        })
      }).then(({ data }) => {
        if (data.data.length > 0) {
          this.initChartktjjxqs(data.data);
        } else {
          this.initChartktjjxqs();
        }
      });

      this.$http({
        url: this.$http.adornUrl("/eyereportdata/teacheff/ktzzdqx"),
        method: "post",
        data: this.$http.adornData({
          deptid: this.dataForm.deptId,
          course_name: this.dataForm.course,
          dt: this.dataForm.date1
        })
      }).then(({ data }) => {
        if (data.data.length > 0) {
          this.initChartktzzdqs(data.data);
        } else {
          this.initChartktzzdqs();
        }
      });
      this.$http({
        url: this.$http.adornUrl("/eyereportdata/teacheff/kthdxqx"),
        method: "post",
        data: this.$http.adornData({
          deptid: this.dataForm.deptId,
          course_name: this.dataForm.course,
          dt: this.dataForm.date1
        })
      }).then(({ data }) => {
        if (data.data.length > 0) {
          this.initChartkthdxqs(data.data);
        } else {
          this.initChartkthdxqs();
        }
      });
      // this.$http({
      //   url: this.$http.adornUrl("/eyereportdata/teacheff/ktztxxfx"),
      //   method: "post",
      //   data: this.$http.adornData({
      //     deptid: this.dataForm.deptId,
      //     course_name: this.dataForm.course,
      //     dt: this.dataForm.date1
      //   })
      // }).then(({ data }) => {
      //   if (data.data.length > 0) {
      //     this.initChartktztxyztfx(data.data);
      //   } else {
      //     this.initChartktztxyztfx();
      //   }
      // });
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
    // 雷达图
    initChartRadarjxxg(data) {
      var leftdata = [];
      var rightdata = [];
      if (data) {
        leftdata.push(data[0].student_study_score);
        leftdata.push(data[0].student_emotion_score);
        leftdata.push(data[0].student_mental_score);
        leftdata.push(data[0].class_interactivity_score);
        leftdata.push(0);
        leftdata.push(data[0].class_concentration_score);
        rightdata.push(0);
        rightdata.push(0);
        rightdata.push(0);
        rightdata.push(data[0].class_interactivity_score);
        rightdata.push(data[0].class_positivity_score);
        rightdata.push(data[0].class_concentration_score);
      }
      var option = {
        calculable: true,
        radar: [
          {
            indicator: [
              { text: "学习状态", max: 1 },
              { text: "情绪状态", max: 1 },
              { text: "精神状态", max: 1 },
              { text: "课堂互动性", max: 1 },
              { text: "课堂积极性", max: 1 },
              { text: "课堂专注度", max: 1 }
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
            radius: 100
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
                value: leftdata,
                areaStyle: {
                  normal: {
                    color: "rgba(0, 255, 255, 0.8)" // 选择区域颜色
                  }
                },
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
              },
              {
                value: rightdata,
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
      this.ChartRadarxsztt = echarts.init(
        document.getElementById("chartRadarBoxxsztt")
      );
      this.ChartRadarxsztt.setOption(option, true);
      window.addEventListener("resize", () => {
        this.ChartRadarxsztt.resize();
      });
    },
    // 饼图
    initChartxsqx(data) {
      var chartdata = [];
      if (data) {
        data.forEach(item => {
          if (item.student_emotion == 0) {
            var i = {
              name: "开心",
              value: item.percentage
            };
            chartdata.push(i);
          }
          if (item.student_emotion == 1) {
            var i = {
              name: "正常",
              value: item.percentage
            };
            chartdata.push(i);
          }
          if (item.student_emotion == 2) {
            var i = {
              name: "低落",
              value: item.percentage
            };
            chartdata.push(i);
          }
        });
      } else {
        chartdata = [
          { name: "开心", value: 0 },
          { name: "正常", value: 0 },
          { name: "低落", value: 0 }
        ];
      }
      var option = {
        title: {
          backgroundColor: "#212858",
          text: "-学生情绪状态-",
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
            radius: "50%",
            left: "center",
            stillShowZeroSum: true,
            data: chartdata,
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
                  if (params.name == "低落") {
                    return "#A06DE4";
                  }
                  if (params.name == "正常") {
                    return "#CFCA52";
                  }
                  if (params.name == "开心") {
                    return "#019642";
                  }
                }
              }
            }
          }
        ]
      };
      this.Chartxsqx = echarts.init(document.getElementById("Chartxsqx"));
      this.Chartxsqx.setOption(option, true);
      window.addEventListener("resize", () => {
        this.Chartxsqx.resize();
      });
    },
    // 饼图
    initChartxsjs(data) {
      var Chartdata = [];
      if (data) {
        data.forEach(item => {
          if (item.student_mental_stat == 0) {
            var i = {
              name: "积极",
              value: item.percentage
            };
            Chartdata.push(i);
          }
          if (item.student_mental_stat == 1) {
            var i = {
              name: "正常",
              value: item.percentage
            };
            Chartdata.push(i);
          }
          if (item.student_mental_stat == 2) {
            var i = {
              name: "疲惫",
              value: item.percentage
            };
            Chartdata.push(i);
          }
        });
      } else {
        Chartdata = [
          { name: "积极", value: 0 },
          { name: "正常", value: 0 },
          { name: "疲惫", value: 0 }
        ];
      }
      var option = {
        title: {
          backgroundColor: "#212858",
          text: "-学生精神状态-",
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
        series: [
          {
            type: "pie",
            radius: "50%",
            left: "center",
            stillShowZeroSum: true,
            data: Chartdata,
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
                  if (params.name == "疲惫") {
                    return "#A06DE4";
                  }
                  if (params.name == "正常") {
                    return "#CFCA52";
                  }
                  if (params.name == "积极") {
                    return "#019642";
                  }
                }
              }
            }
          }
        ]
      };
      this.Chartxsjs = echarts.init(document.getElementById("Chartxsjs"));
      this.Chartxsjs.setOption(option, true);
      window.addEventListener("resize", () => {
        this.Chartxsjs.resize();
      });
    },
    // 饼图
    initChartxsxx(data) {
      var chartdata = [];
      if (data) {
        data.forEach(item => {
          if (item.student_study_stat == 0) {
            var i = {
              name: "非常好",
              value: item.percentage
            };
            chartdata.push(i);
          }
          if (item.student_study_stat == 1) {
            var i = {
              name: "良好",
              value: item.percentage
            };
            chartdata.push(i);
          }
          if (item.student_study_stat == 2) {
            var i = {
              name: "正常",
              value: item.percentage
            };
            chartdata.push(i);
          }
          if (item.student_study_stat == 3) {
            var i = {
              name: "不佳",
              value: item.percentage
            };
            chartdata.push(i);
          }
        });
      } else {
        chartdata = [
          { name: "非常好", value: 0 },
          { name: "良好", value: 0 },
          { name: "正常", value: 0 },
          { name: "不佳", value: 0 }
        ];
      }
      var option = {
        title: {
          backgroundColor: "#212858",
          text: "-学生学习状态-",
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
              name: "不佳",
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
            radius: "50%",
            left: "center",
            stillShowZeroSum: true,
            data: chartdata,
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
                  if (params.name == "不佳") {
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
      this.Chartxsxx = echarts.init(document.getElementById("Chartxsxx"));
      this.Chartxsxx.setOption(option, true);
      window.addEventListener("resize", () => {
        this.Chartxsxx.resize();
      });
    },
    // 折线图
    initChartxsqxztqs(data) {
      var line = [];
      if (this.dataForm.date1) {
        var date = new Date(this.dataForm.date1);
        for (var i = 14; i > -1; i--) {
          line.push(this.addDate(date, -i));
        }
      }
      var a = [];
      var b = [];
      var c = [];
      if (data) {
        for(var f=0;f<15;f++)
        {
           data.forEach(itemt => {
            if (line[f] == itemt.dt) {
              if (itemt.student_emotion == 0) {
                a.push(itemt.percentage);
              }
              if (itemt.student_emotion == 1) {
                b.push(itemt.percentage);
              }
              if (itemt.student_emotion == 2) {
                c.push(itemt.percentage);
              }
            }
          });
          if(a.length!=f+1)
          {
            a.push(0)
          }
           if(b.length!=f+1)
          {
            b.push(0)
          }
           if(c.length!=f+1)
          {
            c.push(0)
          }
        }
      }
      var option = {
        title: {
          backgroundColor: "#212858",
          text: "-学生情绪状态趋势-",
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
          data: line,
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
            data: a,
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
            data: b,
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
            data: c,
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
      this.Chartxsqxztqs = echarts.init(
        document.getElementById("Chartxsqxztqs")
      );
      this.Chartxsqxztqs.setOption(option, true);
      window.addEventListener("resize", () => {
        this.Chartxsqxztqs.resize();
      });
    },
    // 折线图
    initChartxsjsztqs(data) {
       var line = [];
      if (this.dataForm.date1) {
        var date = new Date(this.dataForm.date1);
        for (var i = 14; i > -1; i--) {
          line.push(this.addDate(date, -i));
        }
      }
      var a = [];
      var b = [];
      var c = [];
      if (data) {
        for(var f=0;f<15;f++)
        {
           data.forEach(itemt => {
            if (line[f] == itemt.dt) {
              if (itemt.student_mental_stat == 0) {
                a.push(itemt.percentage);
              }
              if (itemt.student_mental_stat == 1) {
                b.push(itemt.percentage);
              }
              if (itemt.student_mental_stat == 2) {
                c.push(itemt.percentage);
              }
            }
          });
          if(a.length!=f+1)
          {
            a.push(0)
          }
           if(b.length!=f+1)
          {
            b.push(0)
          }
           if(c.length!=f+1)
          {
            c.push(0)
          }
        }
      }
      var option = {
        title: {
          backgroundColor: "#212858",
          text: "-学生精神状态-",
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
          data: line,
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
            data: a,
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
            data: b,
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
            data: c,
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
      this.Chartxsjsztqs = echarts.init(
        document.getElementById("Chartxsjsztqs")
      );
      this.Chartxsjsztqs.setOption(option, true);
      window.addEventListener("resize", () => {
        this.Chartxsjsztqs.resize();
      });
    },
    // 折线图
    initChartxsxxztqs(data) {
       var line = [];
      if (this.dataForm.date1) {
        var date = new Date(this.dataForm.date1);
        for (var i = 14; i > -1; i--) {
          line.push(this.addDate(date, -i));
        }
      }
      var a = [];
      var b = [];
      var c = [];
      var d=[];
      if (data) {
        for(var f=0;f<15;f++)
        {
           data.forEach(itemt => {
            if (line[f] == itemt.dt) {
              if (itemt.student_study_stat == 0) {
                a.push(itemt.percentage);
              }
              if (itemt.student_study_stat == 1) {
                b.push(itemt.percentage);
              }
              if (itemt.student_study_stat == 2) {
                c.push(itemt.percentage);
              }
              if (itemt.student_study_stat == 3) {
                d.push(itemt.percentage);
              }
            }
          });
          if(a.length!=f+1)
          {
            a.push(0)
          }
           if(b.length!=f+1)
          {
            b.push(0)
          }
           if(c.length!=f+1)
          {
            c.push(0)
          }
          if(d.length!=f+1)
          {
            d.push(0)
          }
        }
      }
      var option = {
        title: {
          backgroundColor: "#212858",
          text: "-学生学习状态趋势-",
          bottom: "15%",
          right: "1%",
          textStyle: {
            color: "#ffffff",
            fontWeight: "normal"
          }
        },
        legend: {
          orient: "vertical",
          data: ["非常好","良好", "正常", "不佳"],
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
          data: line,
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
            data: a,
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
            name: "良好",
            type: "line",
            data: b,
            symbol: "rect",
            symbolSize: "5",
            itemStyle: {
              normal: {
                borderWidth: 1,
                borderColor: "#90BC3D",
                lineStyle: {
                  width: 1,
                  color: "#b9b43b",
                  type: "dotted"
                }
              }
            }
          },
          {
            name: "正常",
            type: "line",
            data: c,
            symbol: "rect",
            symbolSize: "5",
            itemStyle: {
              normal: {
                borderWidth: 1,
                borderColor: "#CFCA52",
                lineStyle: {
                  width: 1,
                  color: "#CFCA52",
                  type: "dotted"
                }
              }
            }
          },
          {
            name: "不佳",
            type: "line",
            data: d,
            symbol: "roundRect",
            symbolSize: "5",
            itemStyle: {
              normal: {
                borderWidth: 1,
                borderColor: "#A06DE4",
                lineStyle: {
                  width: 1,
                  color: "#A06DE4",
                  type: "dashed"
                }
              }
            }
          }
        ]
      };
      this.Chartxsxxztqs = echarts.init(
        document.getElementById("Chartxsxxztqs")
      );
      this.Chartxsxxztqs.setOption(option, true);
      window.addEventListener("resize", () => {
        this.Chartxsxxztqs.resize();
      });
    },
    // 仪表图
    initChartktjjx(data) {
      var chartdata=[];
      if(data)
      {chartdata.push(data[0].class_positivity*1+0.5)}
      var option = {
        title: {
          backgroundColor: "#212858",
          text: "-课堂积极性-",
          top: "15%",
          right: "center",
          textStyle: {
            color: "#ffffff",
            fontWeight: "normal"
          }
        },
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
            data: chartdata
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
      this.Chartktjjx = echarts.init(document.getElementById("Chartktjjx"));
      this.Chartktjjx.setOption(option, true);
      window.addEventListener("resize", () => {
        this.Chartktjjx.resize();
      });
    },
    // 仪表图
    initChartktzzd(data) {
       var chartdata=[];
      if(data)
      {chartdata.push(data[0].class_concentration*1+0.5)}
      var option = {
         title: {
          backgroundColor: "#212858",
          text: "-课堂专注度-",
          top: "15%",
          right: "center",
          textStyle: {
            color: "#ffffff",
            fontWeight: "normal"
          }
        },
        color: [
          "rgb(1, 150, 66)",
          "rgb(207, 202, 82)",
          "rgb(160, 109, 228)"
        ],
        legend: {
          data: ["高", , "正常", "低"],
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
                  [0.33, "rgb(160, 109, 228)"],
                  [0.66, "rgb(207, 202, 82)"],
                  [1, "rgb(1, 150, 66)"]
                ]
              }
            },
            endAngle: 0,
            startAngle: 180,
            type: "gauge",
            splitNumber: 3,
            min: 3,
            max: 0,
            detail: {
              show: false
            },
            itemStyle: {},
            data: chartdata
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
              { value: 0, name: "高" },
              { value: 0, name: "正常" },
              { value: 0, name: "低" }
            ]
          }
        ]
      };
      this.Chartktzzd = echarts.init(document.getElementById("Chartktzzd"));
      this.Chartktzzd.setOption(option, true);
      window.addEventListener("resize", () => {
        this.Chartktzzd.resize();
      });
    },
    // 仪表图
    initChartkthdx(data) {
       var chartdata=[];
      if(data)
      {chartdata.push(data[0].class_interactivity*1+0.5)}
      var option = {
         title: {
          backgroundColor: "#212858",
          text: "-课堂互动性-",
          top: "15%",
          right: "center",
          textStyle: {
            color: "#ffffff",
            fontWeight: "normal"
          }
        },
        color: [
          "rgb(1, 150, 66)",
          "rgb(207, 202, 82)",
          "rgb(160, 109, 228)"
        ],
        legend: {
          data: ["高", , "正常", "低"],
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
                  [0.33, "rgb(160, 109, 228)"],
                  [0.66, "rgb(207, 202, 82)"],
                  [1, "rgb(1, 150, 66)"]
                ]
              }
            },
            endAngle: 0,
            startAngle: 180,
            type: "gauge",
            splitNumber: 3,
            min: 3,
            max: 0,
            detail: {
              show: false
            },
            itemStyle: {},
            data: chartdata
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
              { value: 0, name: "高" },
              { value: 0, name: "正常" },
              { value: 0, name: "低" }
            ]
          }
        ]
      };
      this.Chartkthdx = echarts.init(document.getElementById("Chartkthdx"));
      this.Chartkthdx.setOption(option, true);
      window.addEventListener("resize", () => {
        this.Chartkthdx.resize();
      });
    },
    // 折线图
    initChartktjjxqs(data) {
      var line = [];
      if (this.dataForm.date1) {
        var date = new Date(this.dataForm.date1);
        for (var i = 14; i > -1; i--) {
          line.push(this.addDate(date, -i));
        }
      }
      var a = [];
      if (data) {
        for(var f=0;f<15;f++)
        {
           data.forEach(itemt => {
            if (line[f] == itemt.dt) {
                a.push(itemt.class_positivity);
            }
          });
          if(a.length!=f+1)
          {
            a.push(0)
          }
        }
      }
      var option = {
        title: {
          backgroundColor: "#212858",
          text: "-课堂积极性趋势-",
          top: "3%",
          right: "1%",
          textStyle: {
            color: "#ffffff",
            fontWeight: "normal"
          }
        },
        
        grid: {
          left: "3%",
          right: "7%",
          bottom: "10%",
          top: "16%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: line,
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
                texts.push("积极");
              } else if (value == 1) {
                texts.push("正常");
              } else if (value == 2) {
                texts.push("不佳");
              }else if(value==3)
              {
                texts.push("无")
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
            data: a
          }
        ]
      };
      this.Chartktjjxqs = echarts.init(document.getElementById("Chartktjjxqs"));
      this.Chartktjjxqs.setOption(option, true);
      window.addEventListener("resize", () => {
        this.Chartktjjxqs.resize();
      });
    },
    // 折线图
    initChartktzzdqs(data) {
      
      var line = [];
      if (this.dataForm.date1) {
        var date = new Date(this.dataForm.date1);
        for (var i = 14; i > -1; i--) {
          line.push(this.addDate(date, -i));
        }
      }
      var a = [];
      if (data) {
        for(var f=0;f<15;f++)
        {
           data.forEach(itemt => {
            if (line[f] == itemt.dt) {
                a.push(itemt.class_concentration);
            }
          });
          if(a.length!=f+1)
          {
            a.push(0)
          }
        }
      }
      var option = {
        title: {
          backgroundColor: "#212858",
          text: "-课堂专注度趋势-",
          top: "3%",
          right: "1%",
          textStyle: {
            color: "#ffffff",
            fontWeight: "normal"
          }
        },
        
        grid: {
          left: "3%",
          right: "7%",
          bottom: "10%",
          top: "16%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: line,
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
                texts.push("高");
              } else if (value == 1) {
                texts.push("正常");
              } else if (value == 2) {
                texts.push("低");
              } else if (value == 3) {
                texts.push("无");
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
            data: a
          }
        ]
      }
      this.Chartktzzdqs = echarts.init(document.getElementById("Chartktzzdqs"));
      this.Chartktzzdqs.setOption(option, true);
      window.addEventListener("resize", () => {
        this.Chartktzzdqs.resize();
      });
    },
    // 柱状图
    initChartkthdxqs(data) {
       var line = [];
      if (this.dataForm.date1) {
        var date = new Date(this.dataForm.date1);
        for (var i = 14; i > -1; i--) {
          line.push(this.addDate(date, -i));
        }
      }
      var a = [];
      if (data) {
        for(var f=0;f<15;f++)
        {
           data.forEach(itemt => {
            if (line[f] == itemt.dt) {
                a.push(itemt.class_interactivity);
            }
          });
          if(a.length!=f+1)
          {
            a.push(0)
          }
        }
      }
      var option = {
         title: {
          backgroundColor: "#212858",
          text: "-课堂互动性趋势-",
          top: "3%",
          right: "1%",
          textStyle: {
            color: "#ffffff",
            fontWeight: "normal"
          }
        },
        
        grid: {
          left: "3%",
          right: "7%",
          bottom: "10%",
          top: "16%",
          containLabel: true
        },
        xAxis: {
          data: line,
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
          data: ["4","3", "2", "1", "0", "-1"],
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
              }else if(value== 3)
              {
                texts.push("不佳");
              }else if(value== 4)
              {
                texts.push("无");
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
            data: a,
            animation: false
          },
          {
            type: "bar",
            data: a,
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
      // console.log(option)
      this.Chartkthdxqs = echarts.init(document.getElementById("Chartkthdxqs"));
      this.Chartkthdxqs.setOption(option, true);
      window.addEventListener("resize", () => {
        this.Chartkthdxqs.resize();
      });
    },
    // 坐标图
    initChartktztxyztfx(data) {
      var chartdata=[]
      if(data)
      {
        data.forEach(item=>{
         var d={
           data:[[item.study_level,item.grade_level]],
           symbolSize:15,
           name:"科目："+item.course_name+"<br/>考试日期："+item.dt,
           type:"scatter"
         }
         chartdata.push(d)
        })
      }
      var option = {
        grid: {
          top:"11%",
          left: "20%",
          right: "20%",
          bottom:"3%",
          containLabel: true
        },
         tooltip: {
          // trigger: 'axis',
          showDelay: 0,
          formatter: function(params) {
            if (params.value.length > 1) {
              return (
                params.seriesName +
                " <br/>" +
                "学习状态：" +
                params.value[0] +
                "  <br/>" +
                "学生成绩：" +
                params.value[1]
              );
            } else {
              return (
                params.seriesName +
                " <br/>" +
                "学习状态" +
                params.name +
                "  <br/>" +
                "学生成绩" +
                params.value
              );
            }
          }
        },
        xAxis: [
          {
            min: -1,
            max: 1,
            name: "班级学生学习状态",
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
            name: "班级学生成绩",
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
        series: chartdata
      };
      // console.log(option)
      this.Chartktztxyztfx = echarts.init(
        document.getElementById("Chartktztxyztfx")
      );
      this.Chartktztxyztfx.setOption(option, true);
      window.addEventListener("resize", () => {
        this.Chartktztxyztfx.resize();
      });
    }
  }
};
</script>
<style lang="scss">
.teacheff-main {
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
.eyereport-teacheff {
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


