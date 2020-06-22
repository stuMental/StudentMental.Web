<template>
  <div class="mod-clas-echarts">
    <el-row>
      <el-form :inline="true">
        <el-form-item>日期：
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="dataForm.date1"
            type="date"
            align="right"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="班年级"
          prop="deptName"
        >
          <el-popover ref="deptListPopover"
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
              placeholder="点击选择班级"
              class="dept-list__input"
            ></el-input>
          </el-popover>

        </el-form-item>
        <el-button @click="query">查询</el-button>
      </el-form>
    </el-row>
    <el-row
      :gutter="20"
      :style="{visibility: show ? 'visible' : 'hidden'}"
    >
      <el-col :span="24">
        <el-card>
          <el-row>
            <el-row style="font-size: 20px;font-weight:bold">今日考勤</el-row>
            <el-table
              :data="tableData"
              style="width: 100%"
              height="400"
            >
              <el-table-column
                v-for="col in cols"
                :key="col.prop"
                :prop="col.prop"
                :label="col.label"
              ></el-table-column>
            </el-table>
            <el-row style="font-size: 20px;padding-top:40px;padding-bottom:10px;font-weight:bold">今日心理健康状态分布</el-row>
            <el-row :gutter="20">
              <el-col
                :span="12"
                :offset="5"
              ><span
                  style="font-size: 20px;color: black"
                  v-show="!elcls"
                >情绪状态</span>
                <el-button
                  v-show="elcls"
                  type="text"
                  style="font-size: 20px;color: black"
                  @click="clasdetailshow(1)"
                >情绪状态</el-button>
              </el-col>
              <el-col
                :span="6"
                style="font-size: 20px;"
              ><span
                  style="font-size: 20px;color: black"
                  v-show="!elcls"
                >人际关系</span>
                <el-button
                  v-show="elcls"
                  type="text"
                  style="font-size: 20px;color: black"
                  @click="clasdetailshow(2)"
                >人际关系</el-button>
              </el-col>
            </el-row>
            <el-row>
              <div
                id="xljk"
                class="chart-xljk"
              ></div>
            </el-row>
            <el-row style="font-size: 20px;padding-top:10px;padding-bottom:10px;font-weight:bold">今日学业自律性分布
            </el-row>
            <el-row :gutter="20">
              <el-col
                :span="12"
                :offset="5"
                style="font-size: 20px;"
              ><span
                  style="font-size: 20px;color: black"
                  v-show="!elcls"
                >学习状态</span>
                <el-button
                  v-show="elcls"
                  type="text"
                  style="font-size: 20px;color: black"
                  @click="clasdetailshow(3)"
                >学习状态</el-button>
              </el-col>
              <el-col
                :span="6"
                style="font-size: 20px;"
              ><span
                  style="font-size: 20px;color: black"
                  v-show="!elcls"
                >精神状态</span>
                <el-button
                  v-show="elcls"
                  type="text"
                  style="font-size: 20px;color: black"
                  @click="clasdetailshow(4)"
                >精神状态</el-button>
              </el-col>
            </el-row>
            <el-row>
              <div
                id="xyzl"
                class="chart-xljk"
              ></div>
            </el-row>
            <el-row>
              <div
                id="xkxq"
                class="chart-xljk"
              ></div>
            </el-row>
            <el-row style="font-size: 20px;padding-top:40px;font-weight:bold">校园安全预警</el-row>
            <el-row>
              <el-table
                :data="yjData"
                
                style="width: 100%"
              >
                <el-table-column
                  v-for="col in yjcols"
                  :key="col.prop"
                  :prop="col.prop"
                  :label="col.label"
                ></el-table-column>
              </el-table>
            </el-row>
            <el-row :style="{visibility: elcls ? 'visible' : 'hidden'}">
              <el-row style="font-size: 20px;padding-top:40px;padding-bottom:10px;font-weight:bold">状态历史信息
              </el-row>
              <el-row style="padding-top:20px">
                <div
                  id="qxhistory"
                  class="chart-xljk"
                ></div>
              </el-row>
              <el-row style="padding-top:20px">
                <div
                  id="jshistory"
                  class="chart-xljk"
                ></div>
              </el-row>
              <el-row style="padding-top:20px">
                <div
                  id="zthistory"
                  class="chart-xljk"
                ></div>
              </el-row>
            </el-row>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <clasdetail
      v-if="clasdetailVisible"
      ref="clasdetail"
    ></clasdetail>
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
      chartxljk: null,
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
    this.initCharxljk();
    this.initCharxyzl();
    this.initChartxkxq();
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
    clasdetailshow(id) {
      this.clasdetailVisible = true;
      this.$nextTick(() => {
        this.$refs.clasdetail.init(this.dataForm, id);
      });
    },
    initchartqxhistory() {
      var option = {
        title: {
          text: "情绪状态",
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
              res += datas[i].seriesName + ": " + datas[i].data + "%<br/>";
            }
            return res;
          }
        },
        legend: {
          data: ["开心", "正常", "低落"],
          bottom: 0
        },
        grid: {
          left: "3%",
          right: "4%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.qxtimeline
        },
        yAxis: {
          type: "value",
          axisLabel: {
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
            data: this.kxdata
          },
          {
            name: "正常",
            type: "line",
            data: this.zcdata
          },
          {
            name: "低落",
            type: "line",
            data: this.dldata
          }
        ]
      };
      this.chartqxhistory = echarts.init(document.getElementById("qxhistory"));
      this.chartqxhistory.setOption(option);
      window.addEventListener("resize", () => {
        this.chartqxhistory.resize();
      });
    },
    initchartjshistory() {
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
              res += datas[i].seriesName + ": " + datas[i].data + "%<br/>";
            }
            return res;
          }
        },
        legend: {
          data: ["积极", "正常", "疲惫"],
          bottom: 0
        },
        grid: {
          left: "3%",
          right: "4%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.jstimeline
        },
        yAxis: {
          type: "value",
          axisLabel: {
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
            data: this.jjdata
          },
          {
            name: "正常",
            type: "line",
            data: this.jszcdata
          },
          {
            name: "疲惫",
            type: "line",
            data: this.pbdata
          }
        ]
      };

      this.chartjshistory = echarts.init(document.getElementById("jshistory"));
      this.chartjshistory.setOption(option);
      window.addEventListener("resize", () => {
        this.chartjshistory.resize();
      });
    },
    initchartzthistory() {
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
              res += datas[i].seriesName + ": " + datas[i].data + "%<br/>";
            }
            return res;
          }
        },
        legend: {
          data: ["非常好", "良好", "视频广告", "正常", "不佳"],
          bottom: 0
        },
        grid: {
          left: "3%",
          right: "4%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.xxtimeline
        },
        yAxis: {
          type: "value",
          axisLabel: {
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
            data: this.fchdata
          },
          {
            name: "良好",
            type: "line",
            data: this.lhdata
          },
          {
            name: "正常",
            type: "line",
            data: this.xxzcdata
          },
          {
            name: "不佳",
            type: "line",
            data: this.bjdata
          }
        ]
      };

      this.chartzthistory = echarts.init(document.getElementById("zthistory"));
      this.chartzthistory.setOption(option);
      window.addEventListener("resize", () => {
        this.chartzthistory.resize();
      });
    },

    initChartxkxq() {
      var option = {
        title: {
          text: "学科兴趣分布",
          x: "center",
        textStyle:{
        fontWeight:'normal'
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
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: "category",
          data: this.xkxqdatay
        },
        series: [
          {
            name: "",
            type: "bar",
            data: this.xkxqdatax
          }
        ]
      };
      this.chartxkxq = echarts.init(document.getElementById("xkxq"));
      this.chartxkxq.setOption(option);
      window.addEventListener("resize", () => {
        this.chartxkxq.resize();
      });
    },
    initCharxyzl() {
      var option = {
        tooltip: {
          trigger: "item"
        },
        series: [
          {
            type: "pie",
            radius: "50%",
            center: ["25%", "50%"],
            data: this.xxdata
            // No encode specified, by default, it is '2012'.
          },
          {
            type: "pie",
            radius: "50%",
            center: ["75%", "50%"],
            data: this.jsdata
          }
        ]
      };
      this.chartxyzl = echarts.init(document.getElementById("xyzl"));
      this.chartxyzl.setOption(option);
      window.addEventListener("resize", () => {
        this.chartxyzl.resize();
      });
    },
    //饼图
    initCharxljk() {
      var option = {
        tooltip: {
          trigger: "item"
        },
        series: [
          {
            type: "pie",
            radius: "50%",
            center: ["25%", "50%"],
            data: this.qxdata
            // No encode specified, by default, it is '2012'.
          },
          {
            type: "pie",
            radius: "50%",
            data: this.rjdata,
            center: ["75%", "50%"]
          }
        ]
      };
      this.chartxljk = echarts.init(document.getElementById("xljk"));
      this.chartxljk.setOption(option);
      window.addEventListener("resize", () => {
        this.chartxljk.resize();
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
          this.show = true;
          this.cols = data.data.cols;
          this.tableData = data.data.kqList;
          this.qxdata = data.data.qxdata;
          this.rjdata = data.data.rjdata;
          this.xxdata = data.data.xxdata;
          this.jsdata = data.data.jsdata;
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
          this.initCharxyzl();
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
      this.$refs["deptListPopover"].doClose();
      //this.dataForm.DataStus[node].deptName = data.name;
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
  .chart-xljk {
    min-height: 400px;
  }
}
</style>