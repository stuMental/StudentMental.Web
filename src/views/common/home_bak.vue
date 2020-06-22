<template>
  <div class="mod-home">
    <div class="main">

      <div
        id="layer02"
        class="layer"
        style="height:15%;"
      >
        <div
          id="layer02_01"
          style="width:24%;"
        >
          <div class="layer02-data">
            <span style="font-size:26px;">90</span>
            <span style="font-size:16px;">人</span>
          </div>
          <canvas
            width="200"
            height="100"
          ></canvas>
        </div>
        <div
          id="layer02_02"
          style="width:24%;"
        >
          <div class="layer02-data">
            <span style="font-size:26px;">85</span>
            <span style="font-size:16px;">人</span>
          </div>
          <canvas
            width="200"
            height="100"
          ></canvas>
        </div>
        <div
          id="layer02_03"
          style="width:12%;"
        >
          <div class="layer02-data">
            <span style="font-size:26px;"></span>
            <span style="font-size:16px;">高一</span>
          </div>
          <canvas
            width="120"
            height="100"
          ></canvas>
        </div>
        <div
          id="layer02_04"
          style="width:12%;"
        >
          <div class="layer02-data">
            <span style="font-size:26px;"></span>
            <span style="font-size:16px;">一班</span>
          </div>
          <canvas
            width="120"
            height="100"
          ></canvas>
        </div>
        <div
          id="layer02_05"
          style="width:12%;"
        >
          <div class="layer02-data">
            <span style="font-size:26px;"></span>
            <span style="font-size:16px;">张小明</span>
          </div>
          <canvas
            width="120"
            height="100"
          ></canvas>
        </div>
      </div>
      <div
        id="layer05"
        class="layer"
        style="height:25%;"
      >
        <div
          
          class="layer05-panel"
        >
        <div id="layer05_left" class="layer05-row">
            <div
              id="layer05_01"
              style="width:50%;"
            >
              <div class="layer51-data">
                <span style="font-size:26px;">3</span>
                <span style="font-size:16px;">人</span>
              </div>
              <canvas
                width="200"
                height="100"
                style="margin-top: -20px;"
              ></canvas>
            </div>
            <div
              id="layer05_02"
              style="width:50%;"
            >
              <div class="layer51-data">
                <span style="font-size:26px;">1</span>
                <span style="font-size:16px;">人</span>
              </div>
              <canvas
                width="200"
                height="100"
                style="margin-top: -20px;"
              ></canvas>
            </div>
            </div>
          <div id="layer05_left" class="layer05-row">
            <div
              id="layer05_03"
              style="width:50%;"
            >
              <div class="layer52-data">
                <span style="font-size:26px;">2</span>
                <span style="font-size:16px;">人</span>
              </div>
              <canvas
                width="200"
                height="100"
                style="margin-top: -20px;"
              ></canvas>
            </div>
            <div
              id="layer05_04"
              style="width:50%;"
            >
              <div class="layer52-data">
                <span style="font-size:26px;">1</span>
                <span style="font-size:16px;">人</span>
              </div>
              <canvas
                width="200"
                height="100"
                style="margin-top: -20px;"
              ></canvas>
            </div>
          </div>
        </div>
        <div
          id="layer05_right"
          class="layer05-panel"
        >
          <div
            id="layer05_right_label"
            class="layer05-panel-label"
          >
            <span>近一周日均情绪趋势</span>
          </div>
          <div
            id="layer05_right_chart"
            class="layer05-panel-chart"
          ></div>
        </div>
      </div>
      <div
        id="layer04"
        class="layer"
        style="height:25%;margin-top: 15px;"
      >
        <div
          id="layer04_left"
          class="layer04-panel"
        >
          <div
            id="layer04_left_label"
            class="layer04-panel-label"
          >近一周日均学习状态趋势</div>
          <div
            id="layer04_left_chart"
            class="layer04-panel-chart"
          ></div>
        </div>
        <div
          id="layer04_right"
          class="layer04-panel"
        >
          <div
            id="layer04_right_label"
            class="layer04-panel-label"
          >
            <span>近一周日均精神状态</span>
          </div>
          <div
            id="layer04_right_chart"
            class="layer04-panel-chart"
          ></div>
        </div>
      </div>
      <div
        id="layer03"
        class="layer"
        style="height:35%;margin-top: 15px;"
      >
        <div
          id="layer03_left"
          style="width:48%;"
          class="layer03-panel"
        >
          <div
            id="layer03_left_label01"
            class="layer03-left-label"
          >班级兴趣占比</div>
          <div
            id="layer03_left_01"
            class="layer03-left-chart"
            style="width:16%;"
          >
            <canvas
              width="100"
              height="260"
              style="margin:30px 0 0 20px;"
            ></canvas>
          </div>

          <div
            id="layer03_left_02"
            class="layer03-left-chart"
            style="width:80%;"
          ></div>
        </div>
        <div
          id="layer03_right"
          style="width:50%;"
          class="layer03-panel"
        >
          <div id="layer03_right_label">人际关系</div>
          <div
            id="layer03_right_chart01"
            class="layer03-right-chart"
          >
            <canvas
              width="97.5"
              height="150"
              style="margin:40px 0 0 20px;"
            ></canvas>
            <div class="layer03-right-chart-label">非常好</div>
          </div>
          <div
            id="layer03_right_chart02"
            class="layer03-right-chart"
          >
            <canvas
              width="97.5"
              height="150"
              style="margin:40px 0 0 20px;"
            ></canvas>
            <div class="layer03-right-chart-label">良好</div>
          </div>
          <div
            id="layer03_right_chart03"
            class="layer03-right-chart"
          >
            <canvas
              width="97.5"
              height="150"
              style="margin:40px 0 0 20px;"
            ></canvas>
            <div class="layer03-right-chart-label">正常</div>
          </div>
          <div
            id="layer03_right_chart04"
            class="layer03-right-chart"
          >
            <canvas
              width="97.5"
              height="150"
              style="margin:40px 0 0 20px;"
            ></canvas>
            <div class="layer03-right-chart-label">孤僻</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    homeinit();
  }
};

function homeinit() {
  drawLayer02Label($("#layer02_01 canvas").get(0), "总人数", 80, 200);
  drawLayer02Label($("#layer02_02 canvas").get(0), "今日识别签到人数", 80, 300);
  drawLayer02Label($("#layer02_03 canvas").get(0), "年级", 80, 400);
  drawLayer02Label($("#layer02_04 canvas").get(0), "班级", 50, 200);
  drawLayer02Label($("#layer02_05 canvas").get(0), "班主任", 40, 200);
  drawLayer02Label($("#layer05_01 canvas").get(0), "今日补签", 80, 200);
  drawLayer02Label($("#layer05_02 canvas").get(0), "今日旷课", 80, 300);
  drawLayer02Label($("#layer05_03 canvas").get(0), "今日迟早早退", 80, 200);
  drawLayer02Label($("#layer05_04 canvas").get(0), "今日请假", 80, 200);

  // drawLayer02Label($("#layer02_06 canvas").get(0), "请假人数", 50, 200);

  renderLegend();

  //
  renderChartBar01();
  //renderChartBar02();

  //
  renderLayer03Right();

  //30
  renderLayer04Left();

  //
  renderLayer04Right();

  renderLayer05Right();
}
</script>

<style lang="scss">
.mod-home {
  line-height: 1.5;
  background-size: 100% 100%;
  font-weight: bold;
  font-family: "Microsoft Yahei";
  overflow: scroll;
  background: url(~@/assets/img/nybj.png);
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
}
.main {
  width: 1024px;
  height: 768px;
  position: relative;
  margin: auto;
}
div {
  border: 0px solid white;
}
.layer {
  position: relative;
  width: 100%;
}
#layer01 img {
  text-align: center;
  display: block;
  height: 35px;
  padding-top: 35px;
  margin: auto;
}
#layer02 > div {
  height: 100%;
  float: left;
  position: relative;
}
.layer02-data {
  position: absolute;
  width: auto;
  height: 100px;
  color: white;
  top: 45px;
  left: 65px;
}
.layer03-panel {
  height: 100%;
  position: relative;
  float: left;
}
.layer03-left-label {
  position: absolute;
}
#layer03_left_label01 {
  top: 10px;
  left: 10px;
  color: white;
  height: 20px;
  width: 200px;
  font-weight: bold;
}
#layer03_left_label02 {
  right: 10px;
  top: 10px;
  color: #036769;
  height: 20px;
  width: 200px;
}
.layer03-left-chart {
  position: relative;
  float: left;
  height: 100%;
}
#layer03_right_label {
  position: absolute;
  top: 10px;
  left: 10px;
  color: white;
  height: 20px;
  width: 100px;
}
.layer03-right-chart {
  position: relative;
  float: left;
  height: 100%;
  width: 25%;
}
.layer03-right-chart-label {
  color: white;
  text-align: center;
  position: absolute;
  bottom: 60px;
  width: 100%;
}
.layer04-panel {
  position: relative;
  float: left;
  height: 100%;
  width: 48%;
}
.layer04-panel-label {
  width: 100%;
  height: 15%;
  color: white;
  padding-top: 5px;
}
.layer04-panel-chart {
  width: 100%;
  height: 85%;
}
.layer05-row {
  position: relative;
  height: 50%;
  width: 100%;
}
.layer05-panel {
  position: relative;
  float: left;
  height: 100%;
  width: 48%;
}
.layer05-panel-label {
  width: 100%;
  height: 15%;
  color: white;
  padding-top: 5px;
}
.layer05-panel-chart {
  width: 100%;
  height: 85%;
}
.layer51-data {
  position: absolute;
  width: auto;
  height: 100px;
  color: white;
  top: 25px;
  left: 65px;
}
.layer52-data {
  position: absolute;
  width: auto;
  height: 100px;
  color: white;
  top: 25px;
  left: 65px;
}
#layer05_left > div {
  height: 100%;
  float: left;
  position: relative;
}
</style>

