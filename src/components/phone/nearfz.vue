<template>
  <div class="content-container my-container">
    <div class="map-container">
      <mapComponent :id="mapId"></mapComponent>
      <div class="map-control">
        <div>
          <img
            :src="compassPng"
            class="nearfzimg"
            style="width:2.2rem;height:2.2rem;display: block;
    margin-left: 0;"
          >
        </div>
        <div class="eqCenter">
          <button class="eq-center" v-on:click="encbmap.setCenterView()"></button>
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
  name: "nearfz",
  props: {
    ok: Boolean
  },
  data: function() {
    return {
      encbmap: null,
      compassPng: compassPng,
      mapId: "nearfz"
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
            this.mapInit();
          } else {
            this.$Message.error("请求不到数据");
          }
        }
      },
      { setting, data }
    );
  },
  mounted() {},
  methods: {
    mapInit() {
      this.encbmap = new Baidumap(this.mapId, this.eqCenter);
      this.encbmap.setFaultZone(fault_zone);
    }
  },
  components: {
    mHead,
    mapComponent
  }
};
</script>

<style>
.nearfzimg {
	width: 100%;
}
</style>