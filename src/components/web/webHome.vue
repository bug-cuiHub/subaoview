<template>
  <div class="layout">
    <Layout :style="{minHeight: '100vh'}">
      <Sider collapsible :collapsed-width="78" v-model="isCollapsed">
        <Menu active-name="1-1" theme="dark" width="auto" :class="menuitemClasses">
          <MenuItem name="1-1" :to="{name:'cthd'}">
            <Icon type="md-globe"/>
            <span>三维地形图</span>
          </MenuItem>
          <MenuItem name="1-2" :to="{name:'cseismicinfo'}">
            <Icon type="ios-navigate"></Icon>
            <span>地震信息</span>
          </MenuItem>
          <MenuItem name="1-3" :to="{name:'cweatherinfo'}">
            <Icon type="ios-cloud"/>
            <span>天气信息</span>
          </MenuItem>
          <MenuItem name="1-4" :to="{name:'cpopulationinfo'}">
            <Icon type="md-contact"/>
            <span>人口信息</span>
          </MenuItem>
          <MenuItem name="1-5" :to="{name:'ceconomicinfo'}">
            <Icon type="logo-yen"/>
            <span>经济信息</span>
          </MenuItem>
          <MenuItem name="1-6" :to="{name:'cenvironmeninfo'}">
            <Icon type="md-bicycle"/>
            <span>环境信息</span>
          </MenuItem>
          <MenuItem name="1-7" :to="{name:'dashboard'}">
            <Icon type="md-stats"/>
            <span>图表分析</span>
          </MenuItem>
          <MenuItem name="1-8" :to="{name:'worldEq'}">
            <Icon type="ios-analytics"/>
            <span>全球历史地震</span>
          </MenuItem>
        </Menu>
      </Sider>
      <router-view class="webHome-card-main" id="mainNode"></router-view>
    </Layout>
  </div>
</template>
<script>
import logo from "@/assets/logo/subaoView.png";

export default {
  data() {
    return {
      isCollapsed: false,
      logo
    };
  },
  computed: {
    menuitemClasses: function() {
      if (this.isCollapsed) {
        let mainNode = document.getElementById("mainNode")
        mainNode.webkitRequestFullScreen()
      } else {
        document.webkitExitFullscreen();
      }
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    }
  },
  components: {
    // mHead
  },
  created(){
    // this.$router.push('cseismicinfo')
  }
};
</script>
<style>
.layout-con {
  height: 100%;
  width: 100%;
}
.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 100px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 16px;
}
.collapsed-menu span {
  width: 0px;
  transition: width 0.2s ease;
}
.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 22px;
}

.ivu-card-body {
  height: 100%;
}
#mainNode {
  height: 100vh;
  width: 100%;
}
.webHome-card-main .map-container {
  height: 100%;
}
#mainNode .thd-near-group,#mainNode .thd-his{
  display:none;
}
.ivu-menu-item{
  font-size: 18px!important;
}
</style>