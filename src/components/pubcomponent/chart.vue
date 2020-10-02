<template>
  <div class="chart-wrapper" v-if="option">
    <chart :id="id" :options="option" :init-options="initOption" :ref="id"></chart>
  </div>
</template>

<script>
//将ECharts.vue中的echarts/lib/echarts换为echarts
import ECharts from "vue-echarts/components/ECharts";
import "echarts/lib/chart/pie";
import "echarts/lib/chart/bar";
import "echarts/lib/chart/line";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/legend";
import "echarts/lib/chart/pictorialBar";
import "echarts/lib/chart/scatter";
import "echarts/lib/chart/effectScatter";
import "echarts/lib/chart/map";
import "echarts/lib/component/geo";
import "echarts/map/js/china";
export default {
  props: {
    id: {
      type: String,
      default: ""
    },
    option: {
      type: Object,
      default() {
        return null;
      }
    }
  },
  data: function() {
    return {
      initOption: {
        renderer: "canvas"
      }
    };
  },
  components: {
    chart: ECharts
  }
};
</script>

<style>
.chart-wrapper {
  width: 100%;
  height: 100%;
}
.echarts {
  width: 100% !important;
  height: 100% !important;
}
</style>