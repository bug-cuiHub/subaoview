<template>
  <div class="webBox">
    <div class="boxinfo">
      <m-head class="inner-header"></m-head>
      <span class="inner-name">环境信息</span>
      <cenvironment class="environmentBox" />
    </div>
  </div>
</template>

<script>
import cenvironment from "@/components/phone/environmeninfo";
import mHead from "@/components/pubcomponent/head.vue";
export default {
  name: "cweatherinfo",
  components: {
    cenvironment,
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
.environmentBox {
  width: 100%;
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