<template>
  <div class="site-wrapper site-page--login" >
    <div class="site-content__wrapper">
      <div class="site-content">
        <canvas id="cans" width="2560" height="1000" style="min-width: 1000px;  position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%)"></canvas>
        <center>
          <div class="login-main">
            <h3 class="login-title">{{webname}}</h3>
            <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" status-icon>
              <el-form-item prop="userName">
                <el-input class="login-input" v-model="dataForm.userName" placeholder="帐号"></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
              </el-form-item>
              <el-form-item prop="captcha">
                <el-row :gutter="20">
                  <el-col :span="14">
                    <el-input v-model="dataForm.captcha" placeholder="验证码">
                    </el-input>
                  </el-col>
                  <el-col :span="10" class="login-captcha">
                    <img :src="captchaPath" @click="getCaptcha()" alt="">
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item>
                <el-button class="login-btn-submit" type="primary" @click="dataFormSubmit()" :disabled="display">登录</el-button>
              </el-form-item>
            </el-form>
          </div>
        </center>
      </div>
    </div>
  </div>
</template>

<script>
import { getUUID } from "@/utils";
export default {
  data() {
    return {
      display: false,
      dataForm: {
        userName: "",
        password: "",
        uuid: "",
        captcha: ""
      },
      webname:"",
      dataRule: {
        userName: [
          { required: true, message: "帐号不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ],
        captcha: [
          { required: true, message: "验证码不能为空", trigger: "blur" }
        ]
      },
      captchaPath: ""
    };
  },
  created() {
    this.getwebname();
    this.getCaptcha();
  },
  mounted() {
    this.init(document.getElementById("cans"));
  },
  methods: {
    init(cvs) {
      var ctx = cvs.getContext("2d");
      var scene = new F3.Scene();
      var camera = new F3.Camera();
      camera.origin = new F3.Vector3(cvs.width / 2, cvs.height / 3);
      camera.p = 1200;
      var renderer = new F3.Renderer(ctx, cvs);
      var effect = new Effect(renderer, scene, camera, cvs);
      effect.animate();
      effect.setFunction(planeFunctions["sin(sqrt(x^2+z^2))"]);
      effect.toggleRotate("y");
      F3.TIME.start();
    },
    // 提交表单
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.display = true;
          this.$http({
            url: this.$http.adornUrl("/sys/login"),
            method: "post",
            data: this.$http.adornData({
              username: this.dataForm.userName,
              password: this.dataForm.password,
              uuid: this.dataForm.uuid,
              captcha: this.dataForm.captcha
            })
          }).then(({ data }) => {
            this.display = false;
            if (data && data.code === 0) {
              this.$cookie.set("token", data.token);
              this.$router.replace({ name: "home" });
            } else {
              this.getCaptcha();
              this.$message.error(data.msg);
            }
          });
        }
      });
    },
    getwebname(){
       this.$http({
        url: this.$http.adornUrl("/webname"),
        method: "get"
      }).then(({ data }) => {
        this.webname=data.msg
      });
    },
    // 获取验证码
    getCaptcha() {
      this.dataForm.uuid = getUUID();
      this.captchaPath = this.$http.adornUrl(
        `/captcha.jpg?uuid=${this.dataForm.uuid}`
      );
    }
  }
};
var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return call && (typeof call === "object" || typeof call === "function")
    ? call
    : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError(
      "Super expression must either be null or a function, not " +
        typeof superClass
    );
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass);
}

var Point = (function(_F3$Obj) {
  _inherits(Point, _F3$Obj);
  function Point() {
    var radius =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5;
    _classCallCheck(this, Point);
    var _this = _possibleConstructorReturn(
      this,
      (Point.__proto__ || Object.getPrototypeOf(Point)).call(this)
    );
    _this.radius = radius;
    _this.color =
      "rgba(" +
      [
        (Math.random() * 255) | 0,
        (Math.random() * 255) | 0,
        (Math.random() * 255) | 0,
        Math.random()
      ].join(",") +
      ")";
    _this.prevCrood = null;
    return _this;
  }
  _createClass(Point, [
    {
      key: "render",
      value: function render(ctx) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(
          this.croods2D.position.x,
          this.croods2D.position.y,
          this.radius * this.croods2D.scale * this.yScale,
          this.radius * this.croods2D.scale * this.yScale
        );
      }
    }
  ]);
  return Point;
})(F3.Obj);
var planeFunctions = {
  "sin(sqrt(x^2+z^2))": function sinSqrtX2Z2(x, z, offset) {
    return Math.sin(
      Math.sqrt(Math.pow(x / 2, 2) + Math.pow(z / 2, 2)) - offset
    );
  },
  "cos(x)*sin(z)": function cosXSinZ(x, z, offset) {
    return Math.cos(x / 4 + offset) * Math.sin(z / 4 + offset) * 1;
  }
};
var Effect = (function(_F3$Time) {
  _inherits(Effect, _F3$Time);
  function Effect(renderer, scene, camera, cvs) {
    _classCallCheck(this, Effect);
    var _this2 = _possibleConstructorReturn(
      this,
      (Effect.__proto__ || Object.getPrototypeOf(Effect)).call(this)
    );
    _this2.renderer = renderer;
    _this2.scene = scene;
    _this2.camera = camera;
    _this2.cvs = cvs;
    _this2.xOffset = 0;
    _this2.waveHeight = 0.4; // 波高
    _this2.waveWidth = 8; // 波长
    _this2.col = 33;
    _this2.colPointNum = 33;
    _this2.flyTime = 2000;
    _this2.timePass = 0;
    _this2.scale = 1;
    _this2.scaleStep = 0.01;
    _this2.planeFunction = function() {
      return 0;
    };
    _this2.rotate = { x: false, y: false, z: false };
    _this2.pointGroup = new F3.Obj();
    _this2.scene.add(_this2.pointGroup);
    _this2.resize(cvs.width, cvs.height);
    _this2.init();
    return _this2;
  }

  _createClass(Effect, [
    {
      key: "resize",
      value: function resize(width, height) {
        this.cvs.width = width;
        this.cvs.height = height;
        // this.pointGroup.position.set(this.cvs.width/2, this.cvs.height, 0);
        this.stepWidth = width * 1.8 / this.col;
        this.pointGroup.setPosition(
          this.cvs.width / 2,
          this.cvs.height * 1.2,
          -this.col * this.stepWidth / 2
        );
        this.pointGroup.setRotation(0.1, 0, 0);
        // this.waveHeight = height/2;
        // this.waveWidth = this.waveHeight * 4;
        // console.log(this.stepWidth);
      }
    },
    {
      key: "init",
      value: function init() {
        // create point
        var point;
        for (
          var x = -(this.col - 1) / 2, count = 0;
          x <= (this.col - 1) / 2;
          x++
        ) {
          for (
            var z = -(this.colPointNum - 1) / 2;
            z <= (this.colPointNum - 1) / 2;
            z++
          ) {
            point = new Point(10);
            this.pointGroup.add(point);
            /*point.initPos = new F3.Vector3(
                         x + Math.random() * -2 + 1,
                         -30 + -10 * Math.random(),
                         z + Math.random() * -2 + 1
                    );*/
            point.initPos = new F3.Vector3(0, 0, 0);
            point.flyDelay = 0; //Math.random() * 1000 | 0;
          }
        }
      }
    },
    {
      key: "update",
      value: function update(delta) {
        this.timePass += delta;
        this.xOffset = this.timePass / 500;

        var point = void 0;
        var flyPecent = void 0;
        var x = void 0,
          y = void 0,
          z = void 0;
        var count = 0;

        // if (this.timePass < 100)
        for (x = -(this.col - 1) / 2; x <= (this.col - 1) / 2; x++) {
          for (
            z = -(this.colPointNum - 1) / 2;
            z <= (this.colPointNum - 1) / 2;
            z++
          ) {
            // let y = Math.cos(x*Math.PI/this.waveWidth + this.xOffset)*Math.sin(z*Math.PI/this.waveWidth + this.xOffset) * this.waveHeight;

            y = this.planeFunction(x, z, this.xOffset);
            // let y = Math.sin(Math.sqrt(Math.pow(x/v, 2)+Math.pow(z/v, 2)) - this.xOffset) * 1
            // console.log(y);

            point = this.pointGroup.children[count];
            point.yScale = 1; //(-y + 0.6)/(this.waveHeight) * 1.5;

            flyPecent = (this.timePass - point.flyDelay) / this.flyTime;
            flyPecent = flyPecent > 1 ? 1 : flyPecent < 0 ? 0 : flyPecent;

            point.setPosition(
              x * this.stepWidth,
              y * this.stepWidth,
              z * this.stepWidth
            );
            count++;
          }
        }
        if (this.rotate.x || this.rotate.y || this.rotate.z) {
          this.pointGroup.setRotation(
            this.rotate.x ? this.pointGroup.rotation.x + 0.001 : 0,
            this.rotate.y ? this.pointGroup.rotation.y + 0.001 : 0,
            this.rotate.z ? this.pointGroup.rotation.z + 0.001 : 0
          );
        }
      }
    },
    {
      key: "setFunction",
      value: function setFunction(fun) {
        this.planeFunction = fun;
      }
    },
    {
      key: "toggleRotate",
      value: function toggleRotate(r) {
        this.rotate[r] = !this.rotate[r];
        if (!this.rotate[r]) {
          this.pointGroup.rotation[r] = 0;
        }
      }
    },
    {
      key: "animate",
      value: function animate() {
        var _this3 = this;

        this.addTick(function(delta) {
          _this3.update(delta);
          _this3.renderer.render(_this3.scene, _this3.camera);
        });
      }
    }
  ]);

  return Effect;
})(F3.Time);
</script>

<style lang="scss">
.site-wrapper.site-page--login {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  // background-color: rgba(38, 50, 56, .6);
  background: radial-gradient(circle, #2bf8ff, #09193d);
  // background: radial-gradient(circle, #6d2717, #0c0000);
  overflow: hidden;
  &:before {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    content: "";
    //background-image: url(~@/assets/img/login_bg.jpg);
    background-size: cover;
  }
  .site-content__wrapper {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 0;
    margin: 0;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: transparent;
  }
  .site-content {
    min-height: 100%;
  }
  .brand-info {
    margin: 220px 100px 0 90px;
    color: #fff;
  }
  .brand-info__text {
    margin: 0 0 22px 0;
    font-size: 48px;
    font-weight: 400;
    text-transform: uppercase;
  }
  .brand-info__intro {
    margin: 10px 0;
    font-size: 16px;
    line-height: 1.58;
    opacity: 0.6;
  }
  .login-main {
    top: 0;
    right: 0;
    padding: 8%;
    width: 600px;
    min-height: 100%;
  }
  .login-title {
    font: 28px/40px "微软雅黑";
    text-align: center;
    color: rgb(255, 255, 255);
    text-shadow: 2px 2px 2px #000;
    transition: 2s;
  }
  .login-input {
    background-color: transparent;
  }
  .login-captcha {
    overflow: hidden;
    > img {
      width: 100%;
      cursor: pointer;
    }
  }
  .login-btn-submit {
    width: 100%;
    background-color: rgb(11, 42, 76);
    margin-top: 38px;
    border: 1px solid rgb(11, 42, 76);
  }
}
canvas {
  pointer-events: none;
}
</style>
