<template>
  <div>
    <div class="layout">
      <div class="index-head">
        <img :src="logo" title="速报视图自动发布后台管理系统" />
        <span class="index-title">地震应急响应可视化辅助平台</span>
      </div>
      <div class="index-root">
        <img :src="admin" />
        <div class="index-menu" @mouseover="overmouse" @mouseleave="leavemouse">
          admin
          <div id="index-imgAro">
            <img :src="triangle_1" />
            <img :src="triangle_2" />
          </div>
          <ul class="index-menu-list">
            <li>帮助文档</li>
            <li @click="logout">注销</li>
          </ul>
        </div>
      </div>
      <Layout :style="{minHeight: '92vh'}">
        <Sider collapsible :collapsed-width="78" v-model="isCollapsed">
          <Menu active-name="1-1" theme="dark" width="auto" :class="menuitemClasses">
            <MenuItem name="1-1">
              <Icon type="ios-navigate"></Icon>
              <span @click="changeShow()">发布地震</span>
            </MenuItem>
            <MenuItem name="1-2">
              <Icon type="ios-cloud" />
              <span @click="webPush">Web端推送</span>
            </MenuItem>
            <MenuItem name="1-3">
              <Icon type="md-phone-portrait" />
              <span @click="phonePush">移动端推送</span>
            </MenuItem>
            <MenuItem name="1-4">
              <Icon type="ios-aperture-outline" />
              <span @click="wechatpush">微信推送</span>
            </MenuItem>
            <!-- <MenuItem name="1-5">
              <Icon type="ios-aperture-outline"/>
              <span>历史地震</span>
            </MenuItem>-->
            <!-- <MenuItem name="1-6">
              <Icon type="ios-aperture-outline" />
              <span @click="confirm()">自动截图</span>
            </MenuItem> -->
            <MenuItem name="1-7">
              <Icon type="ios-construct-outline" />
              <span @click="changeShow()">数据管理</span>
            </MenuItem>
          </Menu>
        </Sider>
        <Layout>
          <Content>
            <div class="index-main" v-if="ok">
              <pubMapBox></pubMapBox>
            </div>
            <div class="index-main" v-if="!ok">
              <datamanage></datamanage>
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  </div>
</template>

<script>
import logo from "@/assets/logo/logo.png";
import admin from "@/assets/logo/admin.jpg";
import triangle_1 from "@/assets/imgicon/triangle_1.png";
import triangle_2 from "@/assets/imgicon/triangle_2.png";
import pubMapBox from "@/components/pubcomponent/pubmapBox.vue";
import datamanage from "@/components/web/datamanage.vue"
import pub from "@/assets/pubFile.json";
import ajax from "axios";
import { mapMutations } from "vuex";
import qs from "qs";

export default {
  name: "index",
  data() {
    return {
      logo: logo,
      admin: admin,
      isCollapsed: false,
      url: "",
      triangle_1: triangle_1,
      triangle_2: triangle_2,
      access_token: "",
      all_user: null,
      time_sleep: null,
      wechat_info: null,
      ok: true
    };
  },
  created() {},
  computed: {
    menuitemClasses: function () {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    },
  },
  methods: {
    ...mapMutations(["setpublishUri"]),
    changeShow(){
      this.ok = !(this.ok)
    },
    overmouse: function () {
      var a = document.getElementById("index-imgAro").children[0];
      var b = document.getElementById("index-imgAro").children[1];
      a.style.top = -22 + "px";
      b.style.top = -22 + "px";
    },
    leavemouse: function () {
      var a = document.getElementById("index-imgAro").children[0];
      var b = document.getElementById("index-imgAro").children[1];
      a.style.top = -2 + "px";
      b.style.top = 22 + "px";
    },
    //注销
    logout() {
      ajax({
        method: "get",
        url: "http://" + pub.ip + "/subaoApi/public/api/user/logout",
        //允许携带cookie
        withCredentials: true,
      })
        .then((res) => {
          if (res.data.status === 1) {
            this.$Message.info("注销成功");
            this.$router.push({ name: "login" });
          } else {
            this.$Message.error("网络错误");
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    //web端推送
    webPush() {
      ajax({
        method: "get",
        url: "http://" + pub.ip + "/subaoApi/public/api/push/webPush",
        //允许携带cookie
        withCredentials: true,
      })
        .then((res) => {
          console.log(res.data);
          if (res.data.status) {
            let routeUrl = this.$router.resolve({
              path: "/webHome/" + res.data.data + "/cthd",
            });
            window.open(routeUrl.href, "_blank");
          } else {
            this.$Message.error("推送失败");
          }
          // 在一个新标签打开页面
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //手机端推送
    phonePush() {
      ajax({
        method: "get",
        url: "http://" + pub.ip + "/subaoApi/public/api/push/phonePush",
        //允许携带cookie
        withCredentials: true,
      })
        .then((res) => {
          if (res.data.status) {
            this.setpublishUri(res.data.data);
            this.$router.push({ name: "qrcode" });
          } else {
            this.$Message.error("推送失败");
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    //微信推送
    wechatpush() {
      this.$Message.loading({
        content: "Loading...",
        duration: 0,
      });
      ajax({
        method: "get",
        url: "http://" + pub.ip + "/subaoApi/public/api/push/wechatPush",
        //url: "https://www.gissky.com/subaoApi/public/index.php/index/index/kow",
        //允许携带cookie
        withCredentials: true,
      })
        .then((res) => {
          this.$Message.destroy();
          this.$Message.success("推送成功");
          ajax({
            method: "get",
            url:
              "https://www.gissky.com/subaoApi/public/index.php/index/index/kow",
            params: {
              // data: res.data.data[0],
              district: res.data.data[0][0].district,
              time: res.data.data[0][0].time,
              lon: res.data.data[0][0].lon,
              lat: res.data.data[0][0].lat,
              magn: res.data.data[0][0].magn,
              intensity: res.data.data[0][0].intensity,
              depth: res.data.data[0][0].depth,
              id: res.data.data[1],
            },
          })
            .then((res) => {
              console.log(res.data);
            })
            .catch((err) => {
              console.log(err);
            });
          // this.wechat_info = res.data["data"][0]
          // this.pushMain();
        })
        .catch((err) => {
          this.$Message.destroy();
          this.$Message.error("推送失败");
          console.error(err);
        });
    },
    // 自动截图
    confirm() {
      const title = "自动截图";
      const content = "确定要现在开始自动截图吗？这可能需要一点时间...";
      this.$Modal.confirm({
        title: title,
        content: content,
        onOk: () => {
          this.$Message.loading({
            content: "正在截图中...",
            duration: 0,
          });
          ajax({
            method: "post",
            url: "http://" + pub.ip + "/subaoApi/public/api/screen/autoScreen",
            //允许携带cookie
            withCredentials: true,
          })
            .then((res) => {
              this.$Message.destroy();
              if (res.data.status === 1) {
                this.$Message.success("截图成功！");
              } else {
                this.$Message.error("截图失败！");
              }
            })
            .catch((err) => {
              this.$Message.error("网络错误，请求失败！");
              console.error(err);
            });
        },
        onCancel: () => {
          this.$Message.info("取消自动截图");
        },
      });
    },
    //调用微信测试号api推送主函数
    pushMain() {
      //微信测试号的微信号和密钥
      let value = {
        appid: "wx5957c95a261f6e8a",
        appsecret: "c47a5129aba06dc2fc161b4931503568",
      };
      let url =
        "/wechatapi/cgi-bin/token?grant_type=client_credential&appid=" +
        value["appid"] +
        "&secret=" +
        value["appsecret"];
      this.getToken(url);
      this.time_sleep = setInterval(() => {
        if (this.all_user) {
          let openids = this.all_user.data.openid;
          // openids.forEach(element => {
          //console.log(element)
          this.send_message("oBQZg1SQnRANr_q8hdwywTb3lrJ0");
          // });
          clearInterval(this.time_sleep);
        } else {
          console.log("time_sleep");
        }
      }, 1000);
    },
    //获取access_token
    getToken(url) {
      ajax({
        method: "get",
        url: url,
      })
        .then((res) => {
          this.access_token = res.data.access_token;
          this.get_allopenid(this.access_token, "");
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //获取所有关注的用户的
    get_allopenid(access_token, next_openid) {
      let url =
        "/wechatapi/cgi-bin/user/get?access_token=" +
        access_token +
        "&next_openid=" +
        next_openid;
      ajax({
        method: "get",
        url: url,
      })
        .then((res) => {
          console.log(res.data);
          this.all_user = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //发送请求
    send_message(openid) {
      let url =
        "/wechatapi/cgi-bin/message/template/send?access_token=" +
        this.access_token;
      console.log(this.wechat_info);
      ajax({
        method: "post",
        url: url,
        data: {
          touser: openid,
          template_id: "1kHpyqPFgmfn5h6uA2164z78gJAWXgVWkI0qh2cTL38",
          url: "http://172.17.130.182:8080/#/home/",
          topcolor: "#7B68EE",
          data: {
            addres: { value: this.wechat_info["district"], color: "#000" },
            longtitude: { value: this.wechat_info["lon"], color: "#F70997" },
            lattitude: { value: this.wechat_info["lat"], color: "#248d24" },
            datatime: { value: this.wechat_info["time"], color: "#000" }, //date("Y-m-d H:i:s"), color: "#000" },
            magnitude: { value: this.wechat_info["magn"], color: "#1784e8" },
            url: { value: "测试连接", color: "#1784e8" },
          },
        },
      })
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  components: {
    pubMapBox,
    datamanage
  },
};
</script>

<style>
.index-head {
  left: 0;
  position: relative;
}
.index-head img {
  width: 72px;
}
.index-title {
  position: absolute;
  margin-top: 6px;
  left: 80px;
  font-size: 40px;
}
.index-root {
  height: 40px;
  position: absolute;
  top: 16px;
  right: 0px;
  margin-right: 10px;
  font: 14px Helvetica Neue, Helvetica, PingFang SC, \5fae\8f6f\96c5\9ed1,
    Tahoma, Arial, sans-serif;
}
.index-root img {
  width: 40px;
  height: 40px;
  position: absolute;
  right: 80px;
}
.index-menu {
  height: 40px;
  width: 55px;
  display: inline-block;
  position: absolute;
  top: 10px;
  right: 25px;
  font-size: 14px;
  color: black;
  font-weight: 500;
  opacity: 0.4;
  line-height: 19px;
  transition-delay: 400ms;
  transition-duration: 500ms;
  transition-property: all;
  transition-timing-function: ease-in-out;
  cursor: pointer;
  z-index: 2;
}
.index-menu:hover {
  opacity: 1;
}
#index-imgAro {
  width: 10px;
  height: 12px;
  position: absolute;
  top: 2px;
  right: 5px;
  overflow: hidden;
}
#index-imgAro img {
  position: relative;
  top: 0;
  left: 0;
  width: 10px;
  height: 10px;
}
.index-menu-list {
  width: 0px;
  height: 0px;
  position: absolute;
  top: 0px;
  right: 40px;
  padding-left: 0px;
  margin-top: 0px;
  border: 1px rgb(187, 184, 184) solid;
  background-color: white;
  overflow: hidden;
  opacity: 0.8;
  transition-delay: 200ms;
  transition-duration: 300ms;
  transition-timing-function: ease;
  transition-property: all;
}
.index-menu:hover {
  overflow: visible;
}
.index-menu:hover .index-menu-list {
  border-top: 5px #393d49 solid;
  width: 125px;
  top: 40px;
  right: -5px;
  height: 86px;
  opacity: 1;
  z-index: 2;
}
.index-menu-list li {
  width: 100%;
  height: 40px;
  line-height: 40px;
  list-style: none;
  padding-left: 20px;
  box-shadow: 0px 0px 0px;
  opacity: 0.4;
  color: black;
  transition-duration: 800ms;
  transition-property: all;
}
.index-menu-list li:hover {
  opacity: 1;
  background-color: #f2f4f7;
}
.index-main {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.ivu-menu-item{
  font-size: 18px!important;
}
</style>
