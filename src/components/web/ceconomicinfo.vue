<template>
  <div class="webBox">
    <div class="boxinfo">
      <m-head class="inner-header"></m-head>
      <span class="inner-name">经济信息</span>
      <ceconomic class="economicBox"/>
    </div>
  </div>
</template>

<script>
import ceconomic from "@/components/phone/economicinfo";
import mHead from "@/components/pubcomponent/head.vue";
export default {
  name: "ceconomicinfo",
  components: {
    ceconomic,
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
.economicBox {
  position: absolute;
  margin: 0px;
  height: 780px;
  width: 100%;
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