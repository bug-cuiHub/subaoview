<template>
  <div class="home-container">
    <m-Head :headTitle="headName"></m-Head>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <div class="click-change" v-if="!ok">
      <button class="click-change-left click-change-button" @click="routerTran('left')"><Icon type="ios-arrow-back" /></button>
      <button
        class="click-change-right click-change-button"
        @click="routerTran('right')"
      ><Icon type="ios-arrow-forward" /></button>
    </div>
  </div>
</template>

<script>
import mHead from "@/components/pubcomponent/head.vue";
export default {
  name: "home",
  props: {
    ok: Boolean
  },
  data() {
    return {
      headName: "",
      localNum: 0,
      routers: [
        [
          "seismicinfo",
          "thd",
          "weatherinfo",
          "populationinfo",
          "economicinfo",
          "environmeninfo",
          "nearfz"
        ],
        [
          "地震信息",
          "三维信息",
          "天气信息",
          "人口信息",
          "经济信息",
          "环境信息",
          "附近断裂带"
        ]
      ]
    };
  },
  methods: {
    // back() {
    //   switch (this.$route.name) {
    //     case "default":
    //     case "seismicinfo":
    //       this.$router.push({
    //         name: "nearfz"
    //       });
    //       break;
    //     case "weatherinfo":
    //       this.$router.push({
    //         name: "thd"
    //       });
    //       break;
    //     case "populationinfo":
    //       this.$router.push({
    //         name: "weatherinfo"
    //       });
    //       break;
    //     case "economicinfo":
    //       this.$router.push({
    //         name: "populationinfo"
    //       });
    //       break;
    //     case "environmeninfo":
    //       this.$router.push({
    //         name: "economicinfo"
    //       });
    //       break;
    //     case "thd":
    //       this.$router.push({
    //         name: "seismicinfo"
    //       });
    //       break;
    //     case "nearfz":
    //       this.$router.push({
    //         name: "environmeninfo"
    //       });
    //       break;
    //   }
    // },
    // next() {
    //   switch (this.$route.name) {
    //     case "default":
    //     case "seismicinfo":
    //       this.$router.push({
    //         name: "thd"
    //       });
    //       break;
    //     case "weatherinfo":
    //       this.$router.push({
    //         name: "populationinfo"
    //       });
    //       break;
    //     case "populationinfo":
    //       this.$router.push({
    //         name: "economicinfo"
    //       });
    //       break;
    //     case "economicinfo":
    //       this.$router.push({
    //         name: "environmeninfo"
    //       });
    //       break;
    //     case "environmeninfo":
    //       this.$router.push({
    //         name: "nearfz"
    //       });
    //       break;
    //     case "thd":
    //       this.$router.push({
    //         name: "weatherinfo"
    //       });
    //       break;
    //     case "nearfz":
    //       this.$router.push({
    //         name: "seismicinfo"
    //       });
    //       break;
    //   }
    // },
    routerTran(direction) {
      if (direction == "right") {
        this.localNum = (this.localNum + 1) % 7;
        this.$router.push({
          name: this.routers[0][this.localNum]
        });
        this.headName = this.routers[1][this.localNum]
      } else if (direction == "left") {
        this.localNum = (this.localNum + 6) % 7;
        this.$router.push({
          name: this.routers[0][this.localNum]
        });
        this.headName = this.routers[1][this.localNum]
      }
    }
  },
  created() {
    this.localNum = this.routers[0].indexOf(this.$route.name);
    this.headName = this.routers[1][this.localNum]
  },
  components: {
    mHead
  }
};
</script>

<style>
.click-change {
  margin-top: -100%;
  opacity: 0.5;
  animation: appear_vanish 3s;
  animation-iteration-count: 10000000;
}
@keyframes appear_vanish {
  from {
    opacity: 0.1;
  }
  to {
    opacity: 0.5;
  }
}
.click-change-button {
  background-color: #e2dede;
  border: none;
  color: black;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 20px;
  margin: 0;
  padding: 10px;
  cursor: pointer;
  border-radius: 50%;
  outline: none;
}
.click-change-left {
  float: left;
}
.click-change-right {
  float: right;
}
</style>