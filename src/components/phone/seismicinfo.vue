<template>
  <div class="content-container my-container">
    <div class="map-container" id="map-c">
      <mapComponent :id="bmapId" v-show="showBMap"></mapComponent>
      <mapComponent :id="gmapId" v-show="!showBMap"></mapComponent>
      <div class="map-types">
        <ul>
          <li name="maptype-li" v-on:click="setNormalType($event)">地图</li>
          <li name="maptype-li" v-on:click="setSatelliteType($event)">卫星</li>
          <li name="maptype-li" v-on:click="setThreeDType($event)">地形</li>
        </ul>
      </div>
      <div class="map-control">
        <div>
          <img
            :src="compassPng"
            class="seisimg"
            style="width:2.2rem;height:2.2rem;display: block;margin-left: 0;"
          />
        </div>
        <div class="eqCenter">
          <button class="eq-center" v-on:click="backToCenter()"></button>
        </div>
        <div class="track" style="margin:2px 0" v-on:click="showDistanceLine($event)">
          <span class="track-icon" data="checked">
            <img :src="checkedPng" style="width:1.5rem;height:1.5rem" />
          </span>
          <span class="track-title">距离</span>
        </div>
      </div>
      <div class="map-legend">
        <div class="legend">
          <h4 class="ltitle">图例</h4>
          <label>
            震中:
            <span class="item">
              <img :src="centerstarTwoPng" />
            </span>
          </label>
          <label>
            附近城镇:
            <span class="item">
              <img :src="nearCityPng" />
            </span>
          </label>
          <label v-show="showBMap">
            附近历史地震:
            <span class="item">
              <img :src="nearhistorylogo" style="width: 20px; height: 20px;" />
            </span>
          </label>
          <label v-show="showBMap">
            县城边界:
            <span class="item">
              <img :src="boundaryLegendPng" />
            </span>
          </label>
        </div>
      </div>
    </div>
    <div class="text-info"></div>
  </div>
</template>
<script>
import ajax from "axios";
import pub from "@/assets/pubFile.json";
import mHead from "@/components/pubcomponent/head.vue";
import axios from "@/assets/api/axios";
import checkedPng from "@/assets/mapimg/checked.png";
import nocheckedPng from "@/assets/mapimg/nochecked.png";
import compassPng from "@/assets/mapimg/compassicon.png";
import boundaryLegendPng from "@/assets/mapimg/boundaryLegend.png";
import centerstarTwoPng from "@/assets/mapimg/centerstar2.png";
import nearCityPng from "@/assets/mapimg/nearCity.png";
import Baidumap from "@/assets/api/bmap";
// import Googlemap from "@/assets/api/gmap";
import mapComponent from "@/components/pubcomponent/map.vue";
import nearhistorylogo from "@/assets/mapimg/nearhistorylogopng.png";
import "@/assets/basemap.css";

export default {
  name: "seismicinfo",
  props: {
    ok: Boolean,
  },
  data: function () {
    return {
      bmapId: "seismicinfoBmap",
      gmapId: "seismicinfoGmap",
      encbmap: null,
      encgmap: null,
      showBMap: true,
      mapData: null,
      eqCenter: null,
      compassPng: compassPng,
      boundaryLegendPng: boundaryLegendPng,
      centerstarTwoPng: centerstarTwoPng,
      nearCityPng: nearCityPng,
      checkedPng: checkedPng,
      nocheckedPng: nocheckedPng,
      nearhistorylogo: nearhistorylogo,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      document.getElementsByName("maptype-li")[0].style.backgroundColor =
        "#8ea8e0";
      this.getData();
    },
    getData() {
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
              this.encbmap = new Baidumap(this.bmapId, this.eqCenter);
              this.encbmap.setMarker(data[0], "EqCenter");
              this.gethistorydz();
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
                if (data.nearCityData && data.countrysideData) {
                  this.mapData = data;
                  this.encbmap.setMarker(data.nearCityData, "nearCity");
                  this.encbmap.setCounty(data.countrysideData);
                  this.encbmap.myControlInit();
                } else {
                  this.$Message.error("请求不到数据");
                }
              }
            },
            { setting, data }
          );
        }.bind(this)
      );
    },
    backToCenter() {
      if (this.encbmap.bmapMarkers) {
        if (this.showBMap == true) {
          var point = new BMap.Point(
            this.eqCenter.longitude,
            this.eqCenter.latitude
          );
          this.encbmap.bmap.centerAndZoom(point, 10);
        } else {
          this.encgmap.setCenterView();
        }
      }
    },
    initMaptypeLi(currentli) {
      var maptypeli = document.getElementsByName("maptype-li");
      for (var i = 0; i < maptypeli.length; i++) {
        maptypeli[i].style.backgroundColor = "#fff";
      }
      currentli.currentTarget.style.backgroundColor = "#8ea8e0";
    },
    setNormalType(event) {
      this.initMaptypeLi(event);
      this.showBMap = true;
      this.encbmap.bmap.setMapType(BMAP_NORMAL_MAP);
    },
    setSatelliteType(event) {
      this.initMaptypeLi(event);
      this.showBMap = true;
      this.encbmap.bmap.setMapType(BMAP_HYBRID_MAP);
    },
    setThreeDType(event) {
      this.initMaptypeLi(event);
      this.showBMap = false;
      if (this.encgmap === null) {
        this.encgmap = new Googlemap(
          this.gmapId,
          this.eqCenter,
          this.mapData,
          "TERRAIN"
        );
        if (this.mapData && this.eqCenter) {
          this.encgmap.setMarker(this.eqCenter, "EqCenter");
          this.encgmap.setMarker(this.mapData.nearCityData, "nearCity", true);
          this.encgmap.setCenterView();
        }
      }
    },
    showDistanceLine(event) {
      var _this = event.currentTarget;
      var parentNode = _this.childNodes[0];
      var node = parentNode.childNodes[0];
      var currentData = _this.childNodes[0].attributes[0].nodeValue;
      if (currentData === "nochecked") {
        node.setAttribute("src", checkedPng);
        parentNode.setAttribute("data", "checked");
        this.encbmap.showDistanceLine(true);
        if (this.encgmap != null) this.encgmap.showDistanceLine(true);
      } else {
        node.setAttribute("src", nocheckedPng);
        parentNode.setAttribute("data", "nochecked");
        this.encbmap.showDistanceLine(false);
        if (this.encgmap != null) this.encgmap.showDistanceLine(false);
      }
    },
    //获取震中历史地震信息
    gethistorydz() {
      ajax({
        method: "post",
        url:
          "http://" + pub.ip + "/subaoApi/public/api/obtain/getNearEarth",
        data: {
          latitude: this.eqCenter.latitude,
          longitude: this.eqCenter.longitude,
        },
      })
        .then((res) => {
          this.encbmap.setMarker(res.data, "nearhistorydz");
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  components: {
    mHead,
    mapComponent,
  },
};
</script>

<style>
.seisimg {
  width: 100%;
}
.track {
  display: flex;
  align-items: center;
}
.track-icon {
  display: flex;
  width: 1.8rem;
  height: 1.8rem;
}
.track-title {
  display: flex;
  font-size: 1rem;
  color: #3e3b3b;
  line-height: 28px;
}
.map-types {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 99999;
  background-color: transparent;
}
.map-types ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  -moz-box-shadow: 3px 3px 3px #dadada;
  box-shadow: 3px 3px 3px #dadada;
  border-radius: 2px;
}
.map-types li {
  display: inline;
  float: left;
  padding: 3px;
  background-color: #fff;
  color: #000;
  opacity: 1;
}
.map-legend {
  position: absolute;
  bottom: 12px;
  right: 5px;
  background-color: #fff !important;
}
.legend {
  text-align: center;
  border: 1px solid #c9c6c6;
  padding: 0.3rem;
  background-color: rgba(255, 255, 255);
}
.legend .ltitle {
  font-size: 1rem;
  margin: 0 0.5rem 0.5rem 0.5rem;
}
.legend label {
  display: flex;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  line-height: 1rem;
}
.legend .item img {
  width: 15px;
  height: 15px;
  display: block;
}
/* .my-container{
  display: flex;
} */
/* .map-container{
  width: 80%;
} */
.my-container h4 {
  margin: 0;
  text-align: center;
}
.table-bordered td,
.table-bordered th {
  border: 1px solid #e9ecef;
}
.my-container .table {
  width: 100%;
  font-size: 0.9rem;
  border-spacing: 0;
}
</style>