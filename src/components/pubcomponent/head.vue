<template>
  <div class="head-container">
    <div class="head-inner">
      <div class="head-logo">
        <img :src="logo" class="headimg">
      </div>
      <div class="head-title pchide">
        <h2>{{headTitle}}</h2>
        <small>{{date}}</small>
      </div>
    </div>
  </div>
</template>

<script>
import logo from "@/assets/logo/subaoView.png";
import { mapGetters } from "vuex";
import Date from "@/assets/api/date";
export default {
  props:[
    'headTitle'
  ],
  name: "eqhead",
  data: function() {
    return {
      logo: logo,
      // headTitle: "",
      date: null
    };
  },
  created: function() {
    this.date = new Date().format("yyyy-MM-dd");
    this.headTitle = this.geteqhead();
  },
  methods: {
    ...mapGetters(["geteqhead"])
  }
};
</script>

<style>
.headimg {
  width: 100%;
}
.head-container {
  height: 4rem;
  overflow: hidden;
  position: relative;
}
@media only screen and (max-width: 377px) {
  .head-container {
    height: 4rem;
  }
}
@media only screen and (max-width: 320px) {
  .head-container {
    height: 4rem;
  }
}
@media only screen and (min-width: 760px) {
  .head-container {
    height: 7.5vh;
  }
  .pchide {
    display: none;
  }
}
.head-container:after {
  content: "";
  clear: both;
  position: absolute;
  box-shadow: 0 -1px 2px 0 #969393;
  width: 100%;
  bottom: 0;
  left: 0;
  height: 1px;
}
.head-inner {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 10%;
  padding-left: 5px;
  background-color: #f7f4f4;
}
.head-logo {
  width: 9rem;
  height: 100%;
  line-height: 5.5;
}
.head-logo img {
  width: 100%;
  margin-top: 10px;
  margin-left: 10px;
}
.head-title {
  height: 100%;
  font-weight: 700;
}
.head-title h2 {
  margin: 0;
  padding: 0;
}
</style>