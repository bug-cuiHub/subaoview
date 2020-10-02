<template>
  <div class="webBox">
    <div class="boxinfo">
            <m-head class="inner-header"></m-head>
      <span class="inner-name">人口信息</span>
      <cpopulation class="populationBox"/>
    </div>
  </div>
</template>

<script>
import cpopulation from "@/components/phone/populationinfo";
import mHead from "@/components/pubcomponent/head.vue";
export default {
  name: "cpopulationinfo",
  components: {
    cpopulation,
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
.populationBox {
  position: absolute;
  margin: 0px;
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
</style>
