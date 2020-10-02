<template>
  <div id="side-box" :class="[show?'side-box-show':'side-box-hidden']">
    <img :src="listPng" class="listblock" @click="switchList()">
    <!-- <transition name="fade"> -->
    <div class="menu-box" :class="[show?'side-box-show':'side-box-hidden']">
      <ul>
        <!-- <li><router-link to="cseismicinfo">地震信息</router-link></li> -->
        <li class="cseismicinfo" @click="changeViews($event)">地震信息</li>
        <li class="cweatherinfo" @click="changeViews($event)">天气信息</li>
        <li class="cpopulationinfo" @click="changeViews($event)">人口信息</li>
        <li class="ceconomicinfo" @click="changeViews($event)">经济信息</li>
        <li class="cenvironmeninfo" @click="changeViews($event)">环境信息</li>
        <li class="dashboard" @click="changeViews($event)">图表分析</li>
        <li class="cthd" @click="changeViews($event)">三维地形图</li>
        <li class="worldEq" @click="changeViews($event)">全球历史地震</li>
        <!-- <li class="picmanage" @click="changeViews($event)">图片管理</li>
        <li class="weatherpeople" @click="changeViews($event)">图片管理</li> -->
      </ul>
    </div>
    <!-- </transition> -->
  </div>
</template>

<script>
import listPng from "@/assets/imgicon/list.png";

export default {
  name: "side",
  data() {
    return { listPng, show: true };
  },
  methods: {
    changeViews(e) {
      let str = e.target.className;
      this.$router.push({ name: str });
    },
    switchList: function() {
      this.show = !this.show;
    }
  }
};
</script>
<style>
#side-box {
  display: inline-block;
  position: relative;
  overflow: hidden;
  float: left;
  transition-duration: 1s;
  transition-timing-function:ease;
  height: 100%;
}
.side-box-show {
  /* width: 10%; */
  width: 130px;
}
.side-box-hidden {
  width: 0;
}
.menu-box {
  height: 100%;
  transition-duration: 1s;
  transition-timing-function:ease;

  background-color: #393d49;
}
ul {
  margin: 0;
  padding: 0;
}
.menu-box> ul > li {
  margin: 0;
  padding: 0;
  list-style: none;
  color: #fff;
  cursor: pointer;
  height: 30px;
  padding: 3px;
  margin-left: 0px;
  padding-left: 2vw;
  padding-right: 3px;
  line-height: 24px;
  text-align: left;
  opacity: 0.5;
  display: block;
  width: 130px;
  overflow: hidden;
}
ul > li:hover {
  opacity: 1;
  box-shadow: -8px 0 0 #5fb878;
}
ul > li > span {
  display: block;
  width: 84px;
  overflow: hidden;
}

.listblock {
  width: 30px;
  height: 30px;
  position: fixed;
  z-index: 1;
  bottom: 10px;
}
.heidden-menu-box {
  display: inline-block;
  height: 100%;
  width: 10%;
  background-color: #393d49;
  position: absolute;
  overflow: hidden;
  float: left;
}
.fade-enter-active,
.fade-leave-active {
  /* transition: width 2s; */
  /* transition: opacity .5s; */
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
</style>

