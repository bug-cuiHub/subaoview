<template>
  <div>
    <div id="login-body">
      <div class="login-wrapper">
        <div class="login-container">
          <h1>速报视图自动发布后台管理系统</h1>
          <div class="login-form">
            <p>
              <span>用户名:</span>
              <input type="text" v-model="username" placeholder="用户名" />
            </p>
            <p>
              <span>密码:</span>
              <input type="password" v-model="password" placeholder="密码" />
            </p>
            <p>
              <span>验证码:</span>
              <input type="text" class="login-verify" v-model="verifyCode" placeholder="验证码" />
              <img :src="verifyCodeSrc" width="120;" height="43" @click="updateVerifyCode" />
            </p>
            <p>
              <button @click="login()">登录</button>
            </p>
          </div>
        </div>

        <ul class="login-bg-bubbles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </div>
    <div class="login-footer">
      <h4>联系电话：13700349482</h4>
      <h4>本系统版权归属 防灾科技学院GIS协会 所有 Copyright All</h4>
    </div>
  </div>
</template>

<script>
import ajax from "axios";
import qs from "qs";
import pub from "@/assets/pubFile.json";
export default {
  name: "login",
  data() {
    return {
      username: null,
      password: null,
      verifyCode: null,
      verifyCodeSrc: null,
      PHPSESSID: null
    };
  },
  created() {
    this.JudgeEquipment();
    this.updateVerifyCode();
    this.loginVerify();
  },
  methods: {
    //判断登录的设备是手机还是电脑
    JudgeEquipment() {
      let userAgentInfo = navigator.userAgent;
      // console.log(1111)
      // console.log(userAgentInfo)
      
      let Agents = new Array(
        "Android",
        "iPhone",
        "SymbianOS",
        "Windows Phone",
        "iPad",
        "iPod"
      );

      let agentinfo = null;
      for (let i = 0; i < Agents.length; i++) {
        if (userAgentInfo.indexOf(Agents[i]) > 0) {
          agentinfo = userAgentInfo;
          break;
        }
      }
      if (agentinfo) {
        this.$router.push({ name: "indexphone" });
      }
    },

    updateVerifyCode() {
      this.verifyCodeSrc ="http://" +pub.ip +"/subaoApi/public/api/user/createVerifyCode?"+new Date().getTime();
    },

    login() {
      ajax({
        method: "post",
        url: "http://" + pub.ip + "/subaoApi/public/api/user/login",
        //url: "/rng/subaoApi/public/api/user/login",
        params: //qs.stringify({
          {
            username: this.username,
            password: this.password,
            input_captcha: this.verifyCode
          },
        //}),
        //允许携带cookie
        withCredentials: true
      })
        .then(response => {
          //验证码cookie是不区分端口的
          let res = response.data;
          if (res.status === 1) {
            this.loginAnimation();
            setTimeout(() => {
              this.$Message.success("登录成功");
              this.$router.push({ name: "index" });
            }, 1000);
          } else if (res.status === 0) {
            this.$Message.error(res.msg);
          } else {
            this.$Message.error("网络错误");
          }
        })
        .catch(err => {
          console.error(err);
        });
    },

    //验证是否登录
    loginVerify() {
      ajax({
        method: "get",
        url: "http://" + pub.ip + "/subaoApi/public/api/user/isLogin",
        //url: "/kw/subaoApi/public/api/user/isLogin",
        //允许携带cookie
        withCredentials: true
      })
        .then(res => {
          if (res.data.status === 1) {
          //   this.$router.push({ name: "login" });
          // } else {
            this.$router.push({ name: "index" });
          }
        })
        .catch(err => {
          console.error(err);
        });
    },

    loginAnimation() {
      let loginBox = document.getElementsByClassName("login-form");
      let loginTitle = document.getElementsByTagName("h1");
      loginBox[0].style.display = "none";
      loginTitle[0].classList.add("form-success");
    }
  }
};
</script>

<style>
#login-body {
  font-family: "Source Sans Pro", sans-serif;
  color: white;
  font-weight: 300;
}
#login-body ::-webkit-input-placeholder {
  /* WebKit browsers */
  font-family: "Source Sans Pro", sans-serif;
  color: white;
  font-weight: 300;
}
#login-body :-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  font-family: "Source Sans Pro", sans-serif;
  color: white;
  opacity: 1;
  font-weight: 300;
}
#login-body ::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  font-family: "Source Sans Pro", sans-serif;
  color: white;
  opacity: 1;
  font-weight: 300;
}
#login-body :-ms-input-placeholder {
  /* Internet Explorer 10+ */
  font-family: "Source Sans Pro", sans-serif;
  color: white;
  font-weight: 300;
}
.login-wrapper {
  background: #50a3a2;
  background: -webkit-linear-gradient(top left, #50a3a2 0%, #53e3a6 100%);
  background: linear-gradient(to bottom right, #50a3a2 0%, #53e3a6 100%);
  opacity: 0.8;
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.login-wrapper .login-container .form-success {
  -webkit-transform: translateY(85px);
  -moz-transform: translateY(85px);
  -ms-transform: translateY(85px);
  transform: translateY(85px);
}
.login-container {
  position: relative;
  top: 10%;
  max-width: 700px;
  margin: 0 auto;
  border-radius: 25%;
  padding: 30px 30px;
  height: 600px;
}
.login-container h1 {
  font-size: 40px;
  text-align: center;
  -webkit-transition-duration: 1s;
  transition-duration: 1s;
  -webkit-transition-timing-function: ease-in-put;
  transition-timing-function: ease-in-put;
  font-weight: 200;
}

.login-form {
  padding: 85px 0;
  position: absolute;
  left: 10%;
  width: 80%;
  z-index: 2;
}
.login-form p {
  display: inline-flex;
  line-height: 43px;
  width: 100%;
  padding: 0px 110px 30px 110px;
}
.login-form p > span {
  font-size: 17px;
  display: block;
  width: 70px;
  text-align: justify;
  line-height: 45px;
}

.login-form input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: 0;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background-color: rgba(255, 255, 255, 0.2);
  width: 250px;
  height: 43px;
  border-radius: 3px;
  padding: 10px 15px;
  display: block;
  text-align: center;
  font-size: 18px;
  color: white;
  -webkit-transition-duration: 0.25s;
  transition-duration: 0.25s;
  font-weight: 300;
}
.login-form .login-verify {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: 0;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background-color: rgba(255, 255, 255, 0.2);
  width: 120px;
  border-radius: 3px;
  padding: 10px 15px;
  display: block;
  text-align: center;
  font-size: 18px;
  color: white;
  margin-right: 10px;
  -webkit-transition-duration: 0.25s;
  transition-duration: 0.25s;
  font-weight: 300;
}
.login-form input:hover {
  background-color: rgba(255, 255, 255, 0.4);
}
.login-form .login-verify:focus {
  background-color: white;
  width: 150px;
  margin-left: 5px;
  color: #53e3a6;
}
.login-form input:focus {
  background-color: white;
  width: 280px;
  color: #53e3a6;
}

.login-form button {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: 0;
  background-color: white;
  border: 0;
  padding: 0px 0;
  margin: 0 auto auto 70px;
  color: #53e3a6;
  border-radius: 3px;
  width: 250px;
  height: 50px;
  cursor: pointer;
  font-size: 18px;
  -webkit-transition-duration: 0.25s;
  transition-duration: 0.25s;
}
.login-form button:hover {
  background-color: #f5f7f9;
}

.login-bg-bubbles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.login-bg-bubbles li {
  position: absolute;
  list-style: none;
  display: block;
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.15);
  bottom: -160px;
  -webkit-animation: square 25s infinite;
  animation: square 25s infinite;
  -webkit-transition-timing-function: linear;
  transition-timing-function: linear;
}
.login-bg-bubbles li:nth-child(1) {
  left: 10%;
}
.login-bg-bubbles li:nth-child(2) {
  left: 20%;
  width: 80px;
  height: 80px;
  -webkit-animation-delay: 2s;
  animation-delay: 2s;
  -webkit-animation-duration: 17s;
  animation-duration: 17s;
}
.login-bg-bubbles li:nth-child(3) {
  left: 25%;
  -webkit-animation-delay: 4s;
  animation-delay: 4s;
}
.login-bg-bubbles li:nth-child(4) {
  left: 40%;
  width: 60px;
  height: 60px;
  -webkit-animation-duration: 22s;
  animation-duration: 22s;
  background-color: rgba(255, 255, 255, 0.25);
}
.login-bg-bubbles li:nth-child(5) {
  left: 70%;
}
.login-bg-bubbles li:nth-child(6) {
  left: 80%;
  width: 120px;
  height: 120px;
  -webkit-animation-delay: 3s;
  animation-delay: 3s;
  background-color: rgba(255, 255, 255, 0.2);
}
.login-bg-bubbles li:nth-child(7) {
  left: 32%;
  width: 160px;
  height: 160px;
  -webkit-animation-delay: 7s;
  animation-delay: 7s;
}
.login-bg-bubbles li:nth-child(8) {
  left: 55%;
  width: 20px;
  height: 20px;
  -webkit-animation-delay: 15s;
  animation-delay: 15s;
  -webkit-animation-duration: 40s;
  animation-duration: 40s;
}
.login-bg-bubbles li:nth-child(9) {
  left: 25%;
  width: 10px;
  height: 10px;
  -webkit-animation-delay: 2s;
  animation-delay: 2s;
  -webkit-animation-duration: 40s;
  animation-duration: 40s;
  background-color: rgba(255, 255, 255, 0.3);
}
.login-bg-bubbles li:nth-child(10) {
  left: 90%;
  width: 160px;
  height: 160px;
  -webkit-animation-delay: 11s;
  animation-delay: 11s;
}
.login-footer {
  position: fixed;
  bottom: 7%;
  width: 100%;
  opacity: 0.3;
  font-size: 18px;
  line-height: 45px;
}
.login-footer h4 {
  text-align: center;
}
@-webkit-keyframes square {
  0% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
  100% {
    -webkit-transform: translateY(-700px) rotate(600deg);
    transform: translateY(-700px) rotate(600deg);
  }
}
@keyframes square {
  0% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
  100% {
    -webkit-transform: translateY(-700px) rotate(600deg);
    transform: translateY(-700px) rotate(600deg);
  }
}
</style>
