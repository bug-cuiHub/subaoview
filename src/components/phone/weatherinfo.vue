<template>
  <div class="content-container wheadmesg">
    <div class="wet-title auto-center">
      <div class="wet-date">
        <h3>{{date}}</h3>
      </div>
      <div class="wet-now-wendu" v-if="climatemsg">
        <div class="now-wendu-left">
          <span class="wet-meta">{{climatemsg.nowcli.updatetime}}</span>
        </div>
        <div class="now-wendu-right">
          <h2>{{climatemsg.nowcli.wendu}}</h2>
          <span class="wet-eq-name">{{cliname}}</span>
        </div>
      </div>
      <div class="wet-type" v-if="climatemsg">
        <span class="wet-type-scetion">
          <span class="icon-weathercock"></span>
          {{climatemsg.nowcli.type}}
        </span>
        <span class="wet-type-scetion">
          <span class="icon-fengxiang"></span>
          {{climatemsg.nowcli.fengxiang}}
        </span>
        <span class="wet-type-scetion">
          <span class="icon-fengli"></span>
          {{climatemsg.nowcli.fengli}}
        </span>
        <span class="wet-type-scetion">
          <span class="icon-shidu"></span>
          {{climatemsg.nowcli.shidu}}
        </span>
      </div>
    </div>

    <div class="wet-option auto-center" v-if="zhishus">
      <div class="wet-type">
        <span class="wet-type-scetion" v-for="(zhishu,index) in zhishus" :key="index">
          <span class="wet-type-label">{{zhishu.name}}:</span>
          {{zhishu.value}}
        </span>
      </div>
    </div>

    <div class="wet-msg-list auto-center" v-if="climatemsg">
      <div class="wet-msg-item" v-for="(item,index) in climatemsg.wetlist" :key="index">
        <div class="wet-msg-date">
          <h3>{{item.date}}</h3>
        </div>
        <div class="wet-msg-detail">
          <div class="wet-msg-wendu">
            <h2>{{item.wendu}}</h2>
          </div>
          <div class="wet-msg-type">
            <span class="wet-type-scetion">
              <span class="icon-weathercock"></span>
              {{item.day.type}}
            </span>
            <span class="wet-type-scetion">
              <span class="icon-fengli"></span>
              {{item.day.fengli}}
            </span>
            <span class="wet-type-scetion">
              <span class="icon-fengxiang"></span>
              {{item.day.fengxiang}}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="page-description auto-center" v-if="clides">
      <p class="page-description-content">{{clides}}</p>
    </div>

  </div>
</template>

<script>
import mHead from "@/components/pubcomponent/head.vue";
import axios from "@/assets/api/axios";
import Date from "@/assets/api/date";
import "@/assets/weticon/style.css";
import "@/assets/base.css";
export default {
  name: "weatherinfo",
  props: {
    ok: Boolean
  },
  data: function() {
    return {
      climatemsg: null,
      clides: "",
      cliname: "",
      inzhishus: ["舒适度", "感冒指数", "紫外线强度"],
      zhishus: null,
      date: null
    };
  },
  created: function() {
    this.date = new Date().format("yyyy-MM-dd");
    this.wetMsg();
  },
  methods: {
    wetMsg() {
      let setting = {
        method: "POST",
        url: "api/obtain/eqData"
      };
      let data = {
        handel: "weather"
      };
      axios(
        res => {
          let data = res.data.climateData;
          let nowcli = {
            fengli: data.fengli,
            fengxiang: data.fengxiang,
            shidu: data.shidu,
            wendu: data.wendu + "℃",
            updatetime: data.updatetime,
            type: data.forecast.weather[0].day.type
          };
          let wetlist = data.forecast.weather.slice(1).map(item => {
            let _wendu = item.low.split(" ")[1] + "~" + item.high.split(" ")[1];
            let obj = {
              date: item.date,
              wendu: _wendu,
              day: item.day
            };
            return obj;
          });
          let zhishu = data.zhishus.zhishu;
          this.zhishus = zhishu.reduce((arr, item) => {
            let flag = this.inarray(item.name, this.inzhishus);
            if (flag) {
              let name = item.name.replace(/(指数|强度)/, ""),
                value = item.value;
              arr.push({ name, value });
            }
            return arr;
          }, []);
          this.climatemsg = { nowcli, wetlist };
          this.clides = res.data['weather'];
          this.cliname = res.data.name;
        },
        { setting, data }
      );
    },
    inarray(target, arr) {
      let flag = arr.some(item => {
        return target === item;
      });
      return flag;
    }
  },
  components: {
    mHead
  }
};
</script>

<style>
.wet-title {
  width: 80%;
  height: 6.8rem;
  margin-top: 10%;
  position: relative;
  overflow: hidden;
}
@media only screen and (max-width: 375px) {
  .wet-title {
    height: 6.8rem;
  }
  .content-container .wet-option {
    width: 90%;
  }
}
@media only screen and (max-width: 320px) {
  .wet-title {
    height: 6.8rem;
  }
  .content-container .wet-option {
    width: 90%;
  }
}
.wet-title:after {
  content: "";
  clear: both;
  box-shadow: 0 0 1px 0 #e2dede;
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
.wet-date {
  position: absolute;
  line-height: 2;
  background-color: red;
  color: #fff;
  padding-left: 5px;
  padding-right: 5px;
  box-shadow: 0 0 2px 0 #848080;
  top: 0;
  z-index: 1;
  left: 5%;
}
.wet-option {
  width: 80%;
  height: 9%;
  overflow: auto;
  background-color: rgba(255, 255, 255, 0.3);
  position: relative;
  display: flex;
  margin-top: 10px;
}
.wet-type {
  display: flex;
  position: absolute;
  width: 100%;
  bottom: 5px;
  left: 0;
}
.wet-type-scetion {
  font-size: 14px;
  color: #676565;
  width: calc(100% / 3);
  font-weight: 700;
}
span.wet-type-scetion > span {
  margin-right: 3px;
}
.wet-now-wendu {
  width: 100%;
  font-size: 30px;
  text-align: right;
  position: relative;
  display: flex;
}
.now-wendu-left {
  width: 50%;
}
.now-wendu-right {
  width: 50%;
  text-align: center;
}
span.wet-eq-name {
  font-size: 15px;
  display: block;
  font-weight: 700;
}
span.wet-type-label {
  color: #000;
}
.wet-meta {
  position: absolute;
  top: auto;
  font-size: 25px;
  font-weight: 700;
  bottom: 0;
  left: 10%;
}
.wet-msg-list {
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  width: 80%;
  margin-top: 10px;
}
.wet-msg-list div {
  background-color: transparent;
}
.wet-msg-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  position: relative;
}
.wet-msg-item:after {
  content: "";
  clear: both;
  position: absolute;
  bottom: 0;
  left: 0;
  border-bottom: 1px dashed #cac4c4;
  width: 100%;
}
.wet-msg-item:nth-child(odd) {
  background-color: rgba(255, 255, 255, 0.5);
}
.wet-msg-date {
  width: 40%;
}
.wet-msg-detail {
  width: 60%;
}
/* .wheadmesg::before {
  font-size: 24px;
  height: 22px;
  padding-left: 54px;
  padding-top: 8px;
  line-height: 17px;
  font-weight: bold;
  text-align: center;
  content: "天气信息";
  position: absolute;
} */
.wheadmesg {
  width: 100%;
}
</style>