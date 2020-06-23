<template>
  <el-dialog
    title="历史查询"
    :close-on-click-modal="false"
    :visible.sync="visible"
    @opened="initChartbar_dv()"
    width="90%"
  >
    <center>
      <el-form :inline="true">
        <el-form-item>
          <el-date-picker
            v-model="datepk"
            :picker-options="pickerOptions"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select v-model="roomaddr" filterable placeholder="教室">
            <el-option
              v-for="item in roomaddrs"
              :key="item.roomId"
              :label="item.roomAddr"
              :value="item.roomAddr"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="query()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="export2Excel()" v-show="if_export">导出</el-button>
        </el-form-item>
      </el-form>
    </center>
    <el-row style="top:0px">
      <div ref="bar_dv" class="chart-box"></div>
    </el-row>
  </el-dialog>
</template>
<script>
import echarts from "echarts";
export default {
  data() {
    return {
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
      chartLinebar: null,
      datepk: [],
      visible: false,
      dataForm: [],
      roomaddr: "",
      roomaddrs: [],
      bar_dvdata: [],
      bar_dvline: [],
      list:[],
      if_export: false
    };
  },
  methods: {
    // 柱状图
    initChartbar_dv() {
      var option = {
        tooltip: {},
        grid:{
          y2:100
        },
        xAxis: {
          data: this.bar_dvline,
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
            interval: 'auto',
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
          axisLabel: {
            color: "#ffffff"
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
            data: this.bar_dvdata,
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
      let bar_dv = this.$refs.bar_dv;
      this.chartLinebar = echarts.init(bar_dv);
      this.chartLinebar.setOption(option, true);
      window.addEventListener("resize", () => {
        this.chartLinebar.resize();
      });
    },
    query() {
      if (!this.roomaddr) {
        this.$message.error("请选择教室");
      }
      var date1 = "";
      var date2 = "";
      date1 = this.datepk[0];
      date2 = this.datepk[1];
      if (!date1) {
        this.$message.error("请选择时间");
      }
      if (!date2) {
        this.$message.error("请选择时间");
      }
      this.$http({
        url: this.$http.adornUrl("/eyereportdata/statistics/list"),
        method: "post",
        data:this.$http.adornParams({
            roomaddr:this.roomaddr,
            date1:date1,
            date2:date2
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.bar_dvdata = [];
          this.bar_dvline=[];
          data.data.forEach(item => {
            this.bar_dvdata.push(item.total)
            this.bar_dvline.push(item.dt)
          });
          this.initChartbar_dv();
          this.list = data.data
          this.if_export = true;
        } else {
          this.bar_dvdata = [];
          this.bar_dvline=[];
        }
      });
    },
    init() {
      this.visible = true;
      this.getroomaddr();
    },
    getroomaddr() {
      this.$http({
        url: this.$http.adornUrl(`/croom/roomall`),
        method: "get"
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.roomaddrs = data.data;
        } else {
          this.roomaddrs = [];
        }
      });
    },
    formatJson(filterVal, jsonData) {
　　　　return jsonData.map(v => filterVal.map(j => v[j]))
　　},
    export2Excel() {
　　　　require.ensure([], () => {
　　　　　　const { export_json_to_excel } = require('../../../utils/Export2Excel');
　　　　　　const tHeader = ['教室','时间','人数'];
          const filterVal = ['room', 'dt', 'total'];
          this.list.forEach((item, index) => {
            item['room'] = this.roomaddr
          })
　　　　　　const data = this.formatJson(filterVal, this.list);
　　　　　　export_json_to_excel(tHeader, data, '人数历史查询统计_'+ this.datepk[0] + '_' + this.datepk[1] + '.xlsx');
　　　　})
  　 }
  }
};
</script>