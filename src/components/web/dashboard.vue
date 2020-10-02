<template>
  <div class="dash">
    <div class="flex-container column">
        <div class="dash-item one" @click="clickChart('1')" style="transform: translate(-22.4%,-33.5%) scale(0.33)">
          <environmentchart></environmentchart>
        </div>
        <div class="dash-item two" @click="clickChart('2')" style="transform: translate(-22.4%,0.5%) scale(0.33)">
          <populationchart></populationchart>
        </div>
        <div class="dash-item three" @click="clickChart('3')" style="transform: translate(-22.4%,34.5%) scale(0.33)">
          <economicchart></economicchart>
        </div>
        <div class="dash-item four active" @click="clickChart('4')" style="transform: translate(43.7%, 0) scale(1)">
          <chinaChart></chinaChart>
        </div>
    </div>
  </div>
</template>

<script>
import bg from "@/assets/imgicon/bg.jpg"
import economicchart from "@/components/dashboard/economicchart"
import environmentchart from "@/components/dashboard/environmentchart"
import populationchart from "@/components/dashboard/populationchart"
import chinaChart from "@/components/dashboard/chinaChart"

export default {
  data() {
    return {
      items: [],
      bg: bg
    };
  },
  mounted() {
    this.newinit();
  },
  methods: {
    _resize() {
      this.$root.charts.forEach(myChart => {
        myChart.resize();
      });
    },
    newinit() {
      this.items = document.querySelectorAll(".flex-container .dash-item");
      for (let i = 0; i < this.items.length; i++) {
        this.items[i].dataset.order = i + 1;
      }
    },
    // 这个是点击图表替换中心图标
    clickChart(clickIndex) {
      let activeItem = document.querySelector(".flex-container .active");
      let activeIndex = activeItem.dataset.order;
      let clickItem = this.items[clickIndex - 1];
      if (activeIndex === clickIndex) {
        return;
      }
      activeItem.classList.remove("active");
      clickItem.classList.add("active");
      this._setStyle(clickItem, activeItem);
    },
    _setStyle(el1, el2) {
      let transform1 = el1.style.transform;
      let transform2 = el2.style.transform;
      el1.style.transform = transform2;
      el2.style.transform = transform1;
    }
  },
  components: {
    economicchart,
    environmentchart,
    populationchart,
    chinaChart
  }
};
</script>

<style>
* {
  box-sizing: border-box;
}
.populationchart,
.economicchart,
.chinaChart,
.columnChart,
.environmentchart,
.flex-container,
.column {
  background: none !important;
}
.dash {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
  padding-top: 5%;
  background: url("../../assets/imgicon/bg.jpg");
  background-size: 100% 100%;
}
.flex-container,
.column {
  position: relative;
  height: 85%;
  width: 90%;
  overflow: hidden;
  margin: 0 auto 100px auto;
  box-sizing: content-box;
  background: url("../../assets/imgicon/bg.jpg");
}
.dash-item {
  padding: 0px;
  margin: 0px;
  width: 68%;
  height: 100%;
  position: absolute;
  transform: scale(0.33);
  text-align: center;
  transition: all 0.8s;
  background: rgba(32, 32, 35, 0.5);
}
.active {
  height: 100%;
  width: 69%;
  margin-left: 10px;
  line-height: 300px;
}

.echarts > div:first-child {
  background: transparent;
}
.chart-wrapper,
.echarts,
.auto-center {
  background: transparent;
}
.box #box div{
  background: transparent;
}
</style>
