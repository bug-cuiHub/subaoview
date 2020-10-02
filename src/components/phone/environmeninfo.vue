<template>
  <div class="content-container eheadmesg">
    <div class="page-option auto-center" v-if="pagedata">
      <div class="data-title">
        <span class="data-title-text">震中海拔</span>
      </div>
      <div class="data-title-content">
        <div class="data-option">
          <h2>{{pagedata.option}}</h2>
          <span class="data-int">米</span>
        </div>
        <div class="data-icon">
          <div class="data-icon-wrapper">
            <img :src="pageicon" class="envirimg">
          </div>
        </div>
      </div>
    </div>
    <div class="page-chart-wrapper" v-if="pagedata">
      <chart :option="chartoption" :id="'envirchart'"></chart>
    </div>
    <div class="page-description auto-center" v-if="desc">
      <p class="page-description-content">{{desc}}</p>
    </div>
  </div>
</template>

<script>
import pageicon from "@/assets/imgicon/enviricon.png";
import mHead from "@/components/pubcomponent/head.vue";
import axios from "@/assets/api/axios";
import chart from "@/components/pubcomponent/chart.vue";
import ChartoOption from "@/assets/api/chart";
export default {
  name: "economicinfo",
  props: {
    ok: Boolean
  },
  data: function() {
    return {
      pagedata: null,
      desc: null,
      pageicon: pageicon,
      chartoption: null
    };
  },
  created: function() {
    this.getEnvData();
  },
  methods: {
    getEnvData() {
      var setting = {
          method: "POST",
          url: "api/obtain/eqData"
        },
        data = {
          handel: "environment"
        };
      axios(
        res => {
          if (res.status === 1) {
            let data = res.data[0];
            this.pagedata = this.setPeoData(data);
            this.desc = res.data[0]['environment'];
            this.setOption();
          }
        },
        { setting, data }
      );
    },
    setPeoData(data) {
      return {
        option: parseInt(data.ave_altitude),
        chart: {
          list: [
            parseInt(data.min_altitude),
            parseInt(data.ave_altitude),
            parseInt(data.max_altitude)
          ]
        }
      };
    },
    setOption() {
      let data = this.pagedata.chart.list;
      let Chart = new ChartoOption("ShadowBar", data, "envirchart");
      this.chartoption = Chart.getsoption();
    }
  },
  components: {
    mHead,
    chart
  }
};
</script>

<style>
.envirimg {
	width: 100%;
}
/* .eheadmesg::before {
  font-size: 24px;
  height: 22px;
  padding-left: 54px;
  padding-top: 8px;
  line-height: 17px;
  font-weight: bold;
  text-align: center;
  content: "环境信息";
  position: absolute;
} */
</style>