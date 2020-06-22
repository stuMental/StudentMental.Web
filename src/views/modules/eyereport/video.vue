<template>
  <div style="text-align: center">
    <!-- <video src="~@/assets/img/video.mp4" controls="controls" height="400" ></video> -->
    <center>
      <video
      width="640"
        height="264"
        id="videobox"
        class="video-js"
        controls
        preload="auto"
      >
        <!--:poster="posterSrc" > -->
        <p class="vjs-no-js">不支持播放</p>
      </video>
    </center>
    <div style="text-align: left;margin-left:15%">
      <br />
      <span>1、 face_id：人的身份信息，演示视频是随机采样的教室，无身份信息</span>
      <br />
      <span>2、 body_pose：人体姿态信息，包括normal(正常姿态)，tired(困倦)，sleep(睡觉)，stand_up(站立)，raise_hand(举手)，lose_attention(未正视前方)，unknown(未知)</span>
      <br />
      <span>3、 headpose：头部姿态信息，包括head_down(低头)，look_around(左顾右盼)，look_front(正视)</span>
      <br />
      <span>4、 emotion：面部表情信息，包括happy(开心)，normal(正常)，sad(不佳)</span>
    </div>
  </div>
</template>

<script>
import videojs from "video.js";
import "videojs-contrib-hls";
export default {
  data() {
    return {
      posterSrc:
        "https://matrimony001.100msh.net.cn/public/code/material/mp-7261-1554175849.jpg",
      isError: false,
      player: null
    };
  },
  mounted() {
    this.$http({
      url: this.$http.adornUrl("/sys/config/list"),
      method: "get",
      params: this.$http.adornParams({
        paramKey: "videourl"
      })
    }).then(({ data }) => {
      if (data && data.code === 0) {
        // console.log(data)
        var videoSrc = data.page.list[0].paramValue;
        // console.log(videoSrc);
        
        this.player = videojs("videobox", {
          bigPlayButton: true,
          textTrackDisplay: true,
          posterImage: true,
          errorDisplay: false,
          controlBar: true,
          autoplay:true,
          playbackRates: [0.5, 1, 1.5, 2],
          sources: [
　　　　　　{src: videoSrc}
　　　　]
        });
        this.player.enterFullScreen();
      } else {
        this.$message.error("获取视频地址失败");
      }
    });
    //为避免在初始化video时播放源是空的，报播放源错误，需要先给source 的src赋值

    // player.width(this.videoW)   //设置播放器宽度
  },
  beforeDestroy() {
    const videoDom = this.$refs.videoRef; //不能用document 获取节点
    videojs(videoDom).dispose(); //销毁video实例，避免出现节点不存在 但是flash一直在执行,也避免重新进入页面video未重新声明
  }
};
</script>
