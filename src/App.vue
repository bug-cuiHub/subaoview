<template>
  <div id="app">
    <router-view :ok="ok"></router-view>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "App",
  data() {
    return {
      ok: false,
    };
  },
  created: function() {
    this.seteqid(this.$route.params.eqid);
    // console.log(this.$route.params.eqid)
    // console.log(this.$route.params)
    // console.log(this.$route)
    if (window.screen.width >= 768) {
        this.ok = true;
        if (this.$route.params.eqid) {
          // 此处不应该跳转
          // this.$router.push({ name: "webHome" });
        } else {
          this.$router.push({ name: "login" });
        }
      }
  },
  methods: {
    ...mapMutations(["seteqid"])
  }
};
</script>

<style>
html,
body {
  margin: 0;
  height: 100%;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
}
#app > div {
  height: 100%;
}
.home-container {
  height: 100%;
}
.content-container {
  height: calc( 100vh - 4rem);
  overflow-x: hidden;
  text-align: center;
  background-color: #f7f4f4;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.map-container {
  height: calc(100% );
  position: relative;
}
@media only screen and (max-width: 377px) {
  .map-container {
    height: calc(100%);
  }
}
@media only screen and (max-width: 320px) {
  .map-container {
    height: calc(100% );
  }
}
.map-container div,
.thd-map div {
  background-color: transparent;
}
</style>
