<template>
  <div class="content-container my-container">
    <div class="map-container">
      <mapComponent :id="mapId"></mapComponent>
      <div class="map-control">
        <div>
          <img
            :src="compassPng"
            class="worldimg"
            style="width:2.2rem;height:2.2rem;display: block;
    margin-left: 0;"
          >
        </div>
        <div class="eqCenter">
          <button class="eq-center" v-on:click="encbmap.setWorldView()"></button>
        </div>
      </div>
      <div class="map-control-rd">
        <div class="cutline">
          <svg width="11px" height="11px">
            <circle cx="5" cy="5" r="5" stroke="black" stroke-width="1" fill="#ff3600"></circle>
          </svg>
          <span>2018.01.01-至今</span>
        </div>
        <div class="cutline">
          <svg width="11px" height="11px">
            <circle cx="5" cy="5" r="5" stroke="black" stroke-width="1" fill="#0001ff"></circle>
          </svg>
          <span>2017.01.01-2017.12.31</span>
        </div>
        <div class="cutline">
          <svg width="11px" height="11px">
            <circle cx="5" cy="5" r="5" stroke="black" stroke-width="1" fill="#f0ef49"></circle>
          </svg>
          <span>2016.01.01-2016.12.31</span>
        </div>
        <div class="cutline">
          <svg width="11px" height="11px">
            <circle cx="5" cy="5" r="5" stroke="black" stroke-width="1" fill="#cecace"></circle>
          </svg>
          <span>2012.01.01-2015.12.31</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mHead from "@/components/pubcomponent/head.vue";
import mapComponent from "@/components/pubcomponent/map.vue";
import axios from "@/assets/api/axios";
import fault_zone from "@/assets/fault_zone.json";
import Baidumap from "@/assets/api/bmap";
import compassPng from "@/assets/mapimg/compassicon.png";
import "@/assets/basemap.css";
export default {
  name: "worldEq",
  props: {
    ok: Boolean
  },
  data: function() {
    return {
      encbmap: null,
      compassPng: compassPng,
      mapId: "worldEq",
      eqCenter: null
    };
  },
  created: function() {
    //震中信息
    let setting = {
      method: "POST",
      url: "api/obtain/eqData"
    };
    let data = {
      handel: "epicenter"
    };
    axios(
      res => {
        if (res.status === 1) {
          let data = res.data;
          if (data[0]) {
            this.eqCenter = data[0];
            //this.mapInit();
          } else {
            this.$Message.error("请求不到数据");
          }
        }
      },
      { setting, data }
    ).then(
      function() {
        let data = {
          handel: "worldEq"
        };
        axios(
          res => {
            if (res.status === 1) {
              let data = res.data;
              if (data[0]) {
                //this.eqCenter=data[0];
                this.mapInit(data);
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
  mounted() {},
  methods: {
    mapInit(points) {
      this.encbmap = new Baidumap(this.mapId, this.eqCenter);
      this.encbmap.bmap.enableScrollWheelZoom(true);
      this.encbmap.setWorldView();
      this.encbmap.addfz(fault_zone);
      this.encbmap.showWorldHisEq(points);
    }
  },
  components: {
    mHead,
    mapComponent
  }
};
</script>

<style>
.worldimg {
	width: 100%;
}
.map-container > .map-control-rd {
  position: absolute;
  text-align: left;
  background-color: aliceblue;
  bottom: 0px;
  right: 0px;
  height: 70px;
  width: 160px;
}
</style>