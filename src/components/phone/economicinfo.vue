<template>
  <div class="content-container headmesg">
    <div class="page-option auto-center" v-if="pagedata">
      <div class="data-title">
        <span class="data-title-text">{{pagedata.name}}生产总值</span>
      </div>
      <div class="data-title-content">
        <div class="data-option">
          <h2>{{pagedata.option}}</h2>
          <span class="data-int">亿元</span>
        </div>
        <div class="data-icon">
          <div class="data-icon-wrapper">
            <img :src="pageicon" class="ecoimg">
          </div>
        </div>
      </div>
    </div>
    <div class="page-chart-wrapper" v-if="pagedata">
      <chart :option="chartoption" :id="'encochart'"></chart>
    </div>
    <div class="page-description auto-center" v-if="desc">
      <p class="page-description-content">{{desc}}</p>
    </div>
  </div>
</template>

<script>
import pageicon from "@/assets/imgicon/econicon.png";
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
    this.getEncData();
  },
  methods: {
    getEncData() {
      var setting = {
          method: "POST",
          url: "api/obtain/eqData"
        },
        data = {
          handel: "economic"
        };
      axios(
        res => {
          if (res.status === 1) {
            let data = res.data[0];
            this.pagedata = this.setPeoData(data);
            this.desc = res.data[0]['economic'];
            this.setOption();
          }
        },
        { setting, data }
      );
    },
    setPeoData(data) {
      return {
        option: data.GDP,
        name: data.eq_name,
        chart: {
          list: [data.FST_INDUSTRY, data.SND_INDUSTRY, data.TRD_INDUSTRY]
        }
      };
    },
    setOption() {
      let data = this.pagedata.chart.list;
      let Chart = new ChartoOption("PencilBar", data, "encochart");
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
.ecoimg {
  width: 100%;
}
/* .headmesg::before {
  font-size: 24px;
  height: 22px;
  padding-left: 54px;
  padding-top: 8px;
  line-height: 17px;
  font-weight: bold;
  text-align: center;
  content: "经济信息";
  position: absolute;
} */
</style>