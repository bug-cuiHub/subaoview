<template>
  <div class="webBox">
    <div class="boxinfo">
      <m-head class="inner-header"></m-head>
      <span class="inner-name">天气信息</span>
      <cweather class="weatherBox"/>
    </div>
  </div>
</template>

<script>
import cweather from "@/components/phone/weatherinfo";
import mHead from "@/components/pubcomponent/head.vue";
export default {
  name: "cweatherinfo",
  components: {
    cweather,
    mHead
  }
};
</script>

<style scoped>
.webBox {
  position: relative;
  width: 100%;
  height: 100%;
  background: #efedf3;
}
.boxinfo {
  position: relative;
  left: 50%;
  top: 30px;
  margin-left: -250px;
  width: 500px;
  height: 800px;
}
.weatherBox {
  position: absolute;
  margin: 0;
  height: 780px;
}
.inner-name {
  right: 101px;
  top: 18px;
  font-size: 24px;
  height: 22px;
  padding-top: 5px;
  line-height: 17px;
  font-weight: bold;
  text-align: center;
  position: absolute;
}
.boxinfo .inner-header .head-container{
height: 7.5vh;
}
</style>


