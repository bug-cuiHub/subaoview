<template>
  <div>
    <label>时间：</label>
    <input id="time" placeholder="自定义日期格式" class="time_input" @click="changeDate">
    <div id="dateBody">
      <div id="schedule-box" class="boxshaw"></div>
    </div>
  </div>
</template>

<script>
import "@/assets/api/schedule.js";
export default {
  name: "date",
  data() {
    return {
      pointdate: ""
    };
  },
  mounted() {
    this.module_init();
  },
  methods: {
    module_init() {
      let mySchedule = new Schedule({
        el: "#schedule-box",
        // date: "2018-9-20 21:57:34",
        clickCb: function(y, m, d, hours, minute, second) {
          let e = new Date();
          hours = e.getHours();
          minute = e.getMinutes();
          second = e.getSeconds();
          m < 10 ? (m = "0" + m) : m;
          d < 10 ? (d = "0" + d) : d;
          hours < 10 ? (hours = "0" + hours) : hours;
          minute < 10 ? (minute = "0" + minute) : minute;
          second < 10 ? (second = "0" + second) : second;
          document.querySelector("#time").value =
            y + "-" + m + "-" + d + " " + hours + ":" + minute + ":" + second;
        },
        nextMonthCb: function(y, m, d, hours, minute, second) {
          let e = new Date();
          hours = e.getHours();
          minute = e.getMinutes();
          second = e.getSeconds();
          m < 10 ? (m = "0" + m) : m;
          d < 10 ? (d = "0" + d) : d;
          hours < 10 ? (hours = "0" + hours) : hours;
          minute < 10 ? (minute = "0" + minute) : minute;
          second < 10 ? (second = "0" + second) : second;
          document.querySelector("#time").value =
            y + "-" + m + "-" + d + " " + hours + ":" + minute + ":" + second;
        },
        prevMonthCb: function(y, m, d, hours, minute, second) {
          let e = new Date();
          hours = e.getHours();
          minute = e.getMinutes();
          second = e.getSeconds();
          m < 10 ? (m = "0" + m) : m;
          d < 10 ? (d = "0" + d) : d;
          hours < 10 ? (hours = "0" + hours) : hours;
          minute < 10 ? (minute = "0" + minute) : minute;
          second < 10 ? (second = "0" + second) : second;
          document.querySelector("#time").value =
            y + "-" + m + "-" + d + " " + hours + ":" + minute + ":" + second;
        }
      });
    },
    changeDate() {
      let status = document.getElementById("time");
      let dateBox = document.getElementById("dateBody");
      status.onmousemove = () => {
          status.style.width = "320px";
        dateBox.style.display = "block";
      };
      dateBox.onmousedown = () => {
        setTimeout(() => {
          dateBox.style.display = "none";
          status.style.width = "140px";
        }, 1000);
      };
    }
  }
};
</script>

<style>
.time_input {
  width: 140px;
  height: 38px;
  outline: none;
}
#dateBody {
  display: none;
  background-color: #fff;
  margin-left: 48px;
  width: 320px;
  font-size: 13px;
}
#schedule-box {
  width: 320px;
  margin: 0 auto;
  font-size: 13px;
}
.schedule-hd {
  display: flex;
  justify-content: space-between;
  padding: 0 15px;
}
.today {
  flex: 1;
  text-align: center;
  border: none;
}
.ul-box {
  list-style: none;
  padding: 0;
  margin: 0;
  overflow: hidden;
}
.ul-box > li {
  float: left;
  width: 14.28%;
  height: 35px;
  line-height: 35px;
  text-align: center;
  padding: 0 0;
}
.other-month {
  color: #999999;
}
.current-month {
  color: #333333;
}
.today-style {
  border-radius: 50%;
  background: #58d321;
}
.arrow {
  cursor: pointer;
}
.dayStyle {
  display: inline-block;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  text-align: center;
  line-height: 35px;
  cursor: pointer;
}
.current-month > .dayStyle:hover {
  background: #00bdff;
  color: #ffffff;
}
.today-flag {
  background: #00c2b1;
  color: #fff;
}
.boxshaw {
  box-shadow: 2px 2px 15px 2px #e3e3e3;
}
.selected-style {
  background: #00bdff;
  color: #ffffff;
}

@font-face {
  font-family: "iconfont";
  src: url("//at.alicdn.com/t/font_234130_nem7eskcrkpdgqfr.eot?t=1505291076294"); /* IE9*/
  src: url("//at.alicdn.com/t/font_234130_nem7eskcrkpdgqfr.eot?t=1505291076294#iefix")
      format("embedded-opentype"),
    /* IE6-IE8 */
      url("data:application/x-font-woff;charset=utf-8;base64,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")
      format("woff"),
    url("//at.alicdn.com/t/font_234130_nem7eskcrkpdgqfr.ttf?t=1505291076294")
      format("truetype"),
    /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
      url("//at.alicdn.com/t/font_234130_nem7eskcrkpdgqfr.svg?t=1505291076294#iconfont")
      format("svg"); /* iOS 4.1- */
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-115rightarrowheads:before {
  content: "\e79b";
}

.icon-111arrowheadright:before {
  content: "\e6db";
}

.icon-116leftarrowheads:before {
  content: "\e807";
}

.icon-112leftarrowhead:before {
  content: "\e6f6";
}
</style>
