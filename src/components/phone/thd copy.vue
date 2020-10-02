<template>
  <div id="example-m" class="content-container">
    <div class="thd-map" id="changeMap">
      <mapComponent :id="mapId"></mapComponent>
      <!-- 测量两点之间的距离 -->
      <div id="topbar">
        <button
          class="action-button esri-icon-minus"
          id="distanceButton"
          type="button"
          title="测量两点之间的距离"
          @click="measure"
        ></button>
      </div>
      <!-- 截取三维地形图 -->
      <div id="screen">
        <button
          id="screenshotBtn"
          class="screen-button esri-widget"
          aria-label="选择一块区域"
          title="截取三维地形图"
          @click="screenshot"
        >
          <img :src="screenthd" class="screenthd" />
        </button>
      </div>

      <div id="hisSearch" @click="go()">
        <!-- <Input search placeholder="Enter something..." on-click="go()"/> -->
        <!-- <Input placeholder="Enter text" style="width: auto" on-click="go">
            <Icon type="ios-search" slot="suffix" />
        </Input>-->
        <Input search enter-button placeholder="输入历史地震" size="large" v-model="hisSearchInfo" />
      </div>

      <div id="screenshotDiv" class="screenhide">
        <img class="js-screenshot-image screenimg" />
        <div>
          <label>添加文本描述：</label>
          <input type="text" placeholder="文本描述" id="textInput" autofocus />
        </div>
        <button id="downloadBtn" class="screen-button" aria-label="下载图片" title="下载图片">下载图片</button>
        <button id="closeBtn" class="screen-button" aria-label="返回图层" title="返回图层">返回图层</button>
      </div>
      <div id="maskDiv" class="screenhide screenshotCursor"></div>
    </div>

    <div class="thd-near" v-if="!ok">
      <div class="thd-near-group" v-if="pagedata && pagedata.near && !ok">
        <div class="thd-near-item" v-for="(item, index) in pagedata.near" :key="index">
          <div class="thd-near-title">
            <div class="thd-near-name">
              <p>{{item.name}}</p>
            </div>
            <div class="thd-near-distance">
              <p>{{item.distence}}</p>
            </div>
          </div>
          <div class="thd-near-content">
            <div class="thd-near-control">
              <p class="thd-near-label">面积(km²)</p>
              <p class="thd-near-int">{{item.area}}</p>
            </div>
            <div class="thd-near-control">
              <p class="thd-near-label">经济(亿元)</p>
              <p class="thd-near-int">{{item.GDP}}</p>
            </div>
            <div class="thd-near-control">
              <p class="thd-near-label">人口(万人)</p>
              <p class="thd-near-int">{{item.POP_ALL}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="thd-his auto-center" v-if="pagedata && pagedata.his &&!ok">
      <div class="thd-his-title">
        <h3>1949年以来历史灾害地震</h3>
      </div>
      <div class="thd-his-group">
        <div class="thd-his-item" v-for="(item, index) in pagedata.his" :key="index">
          <div class="thd-his-date">
            <p>{{item.EarthquakeDate}}</p>
          </div>
          <div class="thd-his-content">
            <div class="thd-his-addr">
              <div class="thd-his-icon">
                <img :src="item.icon" class="thdimg" />
              </div>
              <div class="thd-his-name">
                <p>{{item.Macro_epicenter + item.Magnitude + '地震'}}</p>
              </div>
            </div>
            <div class="thd-his-detail">
              <div class="thd-his-control">
                <p class="thd-his-label">死亡人数(人)</p>
                <p class="thd-his-int">{{item.Death}}</p>
              </div>
              <div class="thd-his-control">
                <p class="thd-his-label">受灾面积(km²)</p>
                <p class="thd-his-int">{{item.Area}}</p>
              </div>
              <div class="thd-his-control">
                <p class="thd-his-label">经济损失(万元)</p>
                <p class="thd-his-int">{{item.DirectEconomicLoss}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import mHead from "@/components/pubcomponent/head.vue";
import centerstarPng from "@/assets/mapimg/centerStar.png";
import nearCityPng from "@/assets/mapimg/nearCity.png";
import hiso from "@/assets/imgicon/tdhis1.png";
import hiss from "@/assets/imgicon/tdhis2.png";
import hist from "@/assets/imgicon/tdhis3.png";
import axios from "@/assets/api/axios";
import ajax from "axios";
import chart from "@/assets/api/chart";
import screenthd from "@/assets/imgicon/screenthd.png";
import mapComponent from "@/components/pubcomponent/map.vue";
import "@/assets/basemap.css";
import Other_EQ_MARKER from "@/assets/imgicon/tdhisother.png";
import Basemap from "@/assets/api/basemap";
import ArcMap from "@/assets/api/arcmap";
import fault_zone from "@/assets/line_fault_zone.json";
import pub from "@/assets/pubFile.json";

export default {
  name: "thd",
  props: {
    ok: Boolean,
  },
  data: function () {
    return {
      hisiconarr: [hiso, hiss, hist],
      pagedata: null,
      eqCenter: null,
      mapData: {},
      encarcmap: null,
      baseMap: null,
      mapId: "thdmap",
      screenthd: screenthd,
      nearCityInfo: null,
      tagData: null,
      hisSearchInfo: null,
    };
  },
  created: function () {
    this.getThdData();
  },
  mounted: function () {
    this.changeMapSize();
  },
  methods: {
    go() {
      ajax({
        method: "post",
        url:
          "http://" + pub.ip + "/subaoApi/public/api/obtain/getHisSearchData",
        params: {
          info: this.hisSearchInfo,
        },
      })
        .then((res) => {
          console.log(res.data);
          this.getNewThd(res.data.lat, res.data.lon)
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getNewThd(lat, lon) {
      ajax({
        method: "post",
        url:"http://" + pub.ip + "/subaoApi/public/api/obtain/getSearchThdData",
        params: {
          lat: lat,
          lon: lon,
        },
      })
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getThdData() {
      //震中信息
      let setting = {
        method: "POST",
        url: "api/obtain/eqData",
      };
      let data = {
        handel: "epicenter",
      };
      axios(
        (res) => {
          if (res.status === 1) {
            let data = res.data;
            if (data[0]) {
              let time = data[0].time;
              this.eqCenter = data[0];
              this.eqCenter.time = time.substring(0, time.length - 3);
            } else {
              this.$Message.error("请求不到数据");
            }
          }
        },
        { setting, data }
      ).then(
        function () {
          data = {
            handel: "threeDimensional",
          };
          axios(
            (res) => {
              if (res.status === 1) {
                let data = res.data;
                this.mapData = this.cloneObj(data);
                let hisEqData = this.mapData.hisEqData;
                for (var item in hisEqData) {
                  if (hisEqData[item]) {
                    hisEqData[item].magnitude = hisEqData[item].Magnitude;
                  }
                }
                this.pagedata = this.setThdData(data);
                this.baseMap = new Basemap();
                ajax({
                  method: "post",
                  url:
                    "http://" +
                    pub.ip +
                    "/subaoApi/public/api/obtain/getNearEarth",
                  params: {
                    latitude: this.eqCenter.latitude,
                    longitude: this.eqCenter.longitude,
                  },
                })
                  .then((res) => {
                    this.mapData.hisEarData = res.data;
                    this.mapInit();
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }
            },
            { setting, data }
          );
          this.getManualMarking();
        }.bind(this)
      );
    },
    //获取人工标注的数据
    getManualMarking() {
      ajax({
        method: "get",
        url: "http://localhost/subaoApi/public/api/getarcgis",
      })
        .then((res) => {
          this.tagData = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //判断地图是在手机端还是web端
    changeMapSize() {
      if (document.body.clientWidth >= 600) {
        document.getElementById("changeMap").style.height = "100%";
      } else {
        document.getElementById("changeMap").style.height = "50%";
      }
    },
    //附近城镇信息
    setThdData(data) {
      let nearCityData = data.nearCityData;
      let near = null;
      let hisEqData = null;
      this.nearCityInfo = data.nearCityData;
      if (nearCityData) {
        near = nearCityData.map((item) => {
          let obj = null;
          if (Number(item.distence) === 0) {
            item.distence = "震中";
          } else {
            item.distence = "距离震中" + item.distence + "公里";
          }
          obj = Object.assign({}, item);
          return obj;
        });
      }
      if (data.hisEqData) hisEqData = this.arrayFrom(data.hisEqData);
      return {
        near: near,
        his: hisEqData,
      };
    },
    arrayFrom(obj) {
      let hisiconarr = this.hisiconarr;
      let rs = [];
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (obj[key]) {
            rs.push(obj[key]);
          }
        }
      }
      rs.forEach((item, index) => {
        item.icon = hisiconarr[index];
        item.Magnitude = Number(item.Magnitude).toFixed(1);
      });
      return rs;
    },
    mapInit() {
      this.encarcmap = new ArcMap(this.mapId, this.eqCenter, this.nearCityInfo);
      this.listen();
    },
    cloneObj(obj) {
      var newObj = {};
      if (obj instanceof Array) {
        newObj = [];
      }
      for (var key in obj) {
        var val = obj[key];

        newObj[key] = typeof val === "object" ? this.cloneObj(val) : val;
      }
      return newObj;
    },
    listen() {
      if (this.encarcmap.map) {
        this.encarcmap.setMarker(this.mapData.nearCityData, "nearCity");
        this.encarcmap.setHisEq(this.mapData.hisEqData);
        this.encarcmap.setHistoryMarker(this.mapData.hisEarData); //（崔珂玮）
        this.encarcmap.setVillageMarker(this.mapData.villageData); //（崔珂玮）
        this.encarcmap.setTagMarker(this.tagData); //（崔珂玮）
        this.encarcmap.epiLabel();
        this.encarcmap.locator();
        this.addfault_zone();
      } else {
        setTimeout(() => {
          this.listen();
        }, 1000);
      }
    },
    //测量的触发，调用arcmap里封装好的方法
    measure() {
      this.encarcmap.measure();
    },
    //三维地形图的截图
    screenshot() {
      this.encarcmap.screenshot();
    },
    //添加断裂带
    addfault_zone() {
      // this.encarcmap.addfault_zone(fault_zone)
      this.encarcmap.addfault_zoneF(fault_zone);
    },
  },
  components: {
    mHead,
    mapComponent,
  },
};
</script>

<style>
.thdimg {
  width: 100%;
}
.home-container .content-container .thd-map {
  height: 50%;
  background-color: transparent;
  padding: 0.3rem 0.2rem;
  position: relative;
}
.thd-near {
  margin-top: 0.5rem;
  background-color: transparent;
}
@media only screen and (min-width: 760px) {
  .thd-near {
    margin-top: 0;
  }
  .thd-map {
    padding: 0;
  }
}
.thd-near div {
  background-color: transparent;
}
.thd-near-group {
  display: block;
}
.thd-near-item p {
  margin: 0;
}
.thd-near-item {
  display: inline-block;
  width: 45%;
  background-color: #fff !important;
  position: relative;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.thd-near-item:after {
  content: "";
  clear: both;
  position: absolute;
  top: 0;
  left: 0;
  box-shadow: 0 0 1px 0 #b9b3b3;
  width: 100%;
  height: 100%;
}
.thd-near-item:first-child {
  margin-right: 3%;
  margin-bottom: 1rem;
}
.thd-near-item:nth-child(3) {
  margin-right: 3%;
}
.thd-near-title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 0.2rem;
  padding-left: 0.3rem;
  padding-right: 0.1rem;
  margin-bottom: 1rem;
  position: relative;
  font-size: 12px;
  color: #444242;
  font-weight: 700;
}
.thd-near-title:before {
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  clear: both;
  border-left: 2px solid #ec0707;
  height: 100%;
}
.thd-near-name {
  color: #000;
  height: 16px;
  width: 65px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.thd-near-content {
  font-size: 12px;
  text-align: center;
  font-weight: 700;
  display: flex;
}
.thd-near-control {
  width: calc(100% / 3);
}
p.thd-near-label {
  margin-bottom: 0.3rem;
  color: #736f6f;
  font-size: 10px;
}
p.thd-near-int {
  color: #e80e0e;
}
.thd-his {
  background-color: transparent;
  width: 95%;
}
.thd-his div {
  background-color: transparent;
}
.thd-his p {
  margin: 0;
}
.thd-his-title {
  text-align: left;
  margin-top: 2rem;
  margin-bottom: 0.8rem;
}
.thd-his-title h3 {
  display: inline-block;
  padding: 0.2rem 0.3rem;
  background-color: #bdb5b5;
  border-radius: 5px;
  color: #f5eeee;
}
.thd-his-item {
  display: flex;
  text-align: center;
  margin-bottom: 0.5rem;
}
.thd-his-date {
  font-size: 15px;
  font-weight: 700;
  margin-right: 1rem;
  width: 5.1rem;
}
.thd-his-content {
  display: flex;
  flex-direction: column;
}
.thd-his-addr {
  display: flex;
}
.thd-his-icon {
  width: 1rem;
  margin-right: 0.5rem;
}
.thd-his-name {
  font-size: 15px;
  font-weight: 700;
}
.thd-his-detail {
  display: flex;
  font-weight: 500;
  position: relative;
  font-size: 12px;
  padding-left: 1rem;
  padding-top: 0.8rem;
  margin-left: 0.5rem;
}
.thd-his-detail:before {
  content: "";
  clear: both;
  position: absolute;
  top: 0;
  left: 0;
  border-left: 1px solid #000;
  height: 100%;
}
.thd-his-control {
  margin-right: 0.5rem;
}
p.thd-his-label {
  margin-bottom: 0.3rem;
  color: #5f5c5c;
  font-size: 10px;
}
p.thd-his-int {
  font-size: 15px;
}
.thd-map h4 {
  margin: 0;
  text-align: center;
}
.thd-map .map-control {
  display: none;
}

/* //arcmap */
.esri-ui .esri-ui-manual-container .esri-popup__main-container {
  background-color: #fff;
}
.esri-ui .esri-ui-top-left .esri-widget {
  background-color: #fff;
}
.esri-ui .esri-ui-top-right .esri-widget {
  background-color: #fff;
}
.esri-ui .esri-ui-inner-container > .esri-ui-corner {
  background-color: transparent;
}
.esri-ui-manual-container > .esri-popup > .esri-popup__main-container {
  width: 200px;
}
.esri-expand__container .esri-expand__panel .esri-widget-button {
  background-color: #fff;
}
#topbar {
  background: #fff;
}
.action-button {
  font-size: 16px;
  background-color: transparent;
  border: 1px solid #d3d3d3;
  color: #6e6e6e;
  height: 32px;
  width: 32px;
  text-align: center;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.3);
}
#distanceButton {
  height: 32px;
  width: 32px;
  margin: 0;
}
.action-button:hover,
.action-button:focus {
  background: #0079c1;
  color: #e4e4e4;
}
.active {
  background: #0079c1;
  color: #e4e4e4;
}

/* 截图 */
#screen {
  position: relative;
  width: 32px;
  height: 32px;
  margin: 0;
  padding: 0;
}
.screenthd {
  position: absolute;
  top: 1px;
  left: 1px;
  width: 30px;
  height: 30px;
  margin: 0;
  padding: 0;
}
#screenshotDiv {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.8);
}
.screenhide {
  display: none;
}
.screenimg {
  border: 10px solid white;
  box-shadow: 2px 2px 5px 0 rgba(0, 0, 0, 0.5);
}
#screenshotDiv > * {
  margin: 0.5em;
}
.screenshotCursor {
  cursor: crosshair;
}
#screenshotBtn {
  height: 32px;
  width: 32px;
  margin: 0;
}
.screen-button {
  padding: 0.6em;
  background-color: transparent;
  border: 1px solid #d3d3d3;
  color: #6e6e6e;
  text-align: center;
  cursor: pointer;
}
.screen-button:hover,
.screen-button:focus {
  background: #0079c1;
  color: white;
}

#maskDiv {
  position: absolute;
  background: rgba(255, 51, 0, 0.1);
  border: 2px dashed rgb(255, 51, 0);
}

.esri-ui-manual-container > .esri-popup > .esri-popup__main-container {
  width: 425px;
  height: 240px;
}

.esri-popup__header-title {
  font-size: 18px !important;
}

.esri-ui-corner .esri-component.esri-widget--panel {
  width: 200px !important;
  font-size: 15px !important;
}

.esri-editor__content {
  min-height: 10vh !important;
}

.esri-search {
  width: 200px !important;
}
.esri-widget__table tr td {
  font-size: 15px !important;
}
.esri-widget__table tr th {
  font-size: 15px !important;
  text-align: center !important;
}
.esri-editor__overlay .esri-editor__warning-card {
  background-color: white !important;
}
</style>