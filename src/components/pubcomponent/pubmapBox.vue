<template>
  <div class="pubmap-box">
    <div class="pubmap-content">
      <div class="longitude">
        <span>震源经度：</span>
        <Input v-model="longitude" size="large" placeholder="请输入经度" />
      </div>

      <div class="latitude">
        <span>震源纬度：</span>
        <Input v-model="latitude" size="large" placeholder="请输入纬度" />
      </div>

      <div class="magnitude">
        <span>震源深度(千米)：</span>
        <Input v-model="depth" size="large" placeholder="请输入深度" />
      </div>

      <div class="depth">
        <span style="width:70px;">震级：</span>
        <Input v-model="magnitude" size="large" placeholder="请输入震级" />
      </div>

      <div class="time">
        <span style="width:60px;">时间：</span>
        <DatePicker type="datetime" size="large" placeholder="自定义日期格式" v-model="time"></DatePicker>
      </div>

      <div class="btn">
        <Button type="primary" ghost class="pub-cho" @click="getGooglePoint()">选择震源</Button>
        <Button type="primary" ghost class="pub-cho pub-cho-yes" @click="getCityName()">确认提交</Button>
      </div>
    </div>
    <div id="seismicinfoGmap"></div>
    <!-- <div id="l-map"></div>      这一行我加的 -->
  </div>
</template>

<script>
import circlePng from "@/assets/mapimg/circle.png";
import ajax from "axios";
import qs from "qs";
import pub from "@/assets/pubFile.json";
// import date from "@/components/pubcomponent/date.vue";

export default {
  name: "pubmapBox",
  data() {
    return {
      longitude: null,
      latitude: null,
      depth: null,
      magnitude: null,
      time: null,
      map: null,
      street: null,
      district: null,
      city: null,
      province: null,
      intensity: null,
      point: null,
      learnmarker: null,
      circlePng: circlePng,
    };
  },
  mounted() {
    this.initbmap();
  },
  methods: {
    initbmap() {
      var that = this;
      var map = new BMap.Map("seismicinfoGmap");
      this.map = map;
      var point = new BMap.Point(116.404, 39.915); // 创建点坐标
      map.centerAndZoom(point, 10); // 初始化地图，设置中心点坐标和地图级别
      map.enableScrollWheelZoom(); //启用滚动
      var loadCount = 1;
      map.addEventListener("tilesloaded", function () {
        if (loadCount == 1) {
          map.centerAndZoom(point, 10);
        }
        loadCount = 2;
      });
    },
    //根据坐标获取地区名称
    getCityName() {
      let that = this;
      let x = parseFloat(parseFloat(this.longitude).toFixed(4));
      let y = parseFloat(parseFloat(this.latitude).toFixed(4));
      var myGeo = new BMap.Geocoder();
      myGeo.getLocation(new BMap.Point(x, y), function (result) {
        ajax({
          method: "post",
          url: "http://" + pub.ip + "/subaoApi/public/api/release/releaseEq",
          data: qs.stringify({
            longitude: that.longitude,
            latitude: that.latitude,
            depth: that.depth,
            magnitude: that.magnitude,
            time: that.time.format("yyyy-MM-dd hh:mm:ss"),
            city: result.addressComponents.city, //+"自治区",
            province: result.addressComponents.district, //+"自治区",
            district: result.addressComponents.district, //+"自治区",
            intensity: that.intensity,
            street: result.addressComponents.district, //+"自治区"
          }),
          //允许携带cookie
          withCredentials: true,
        })
          .then((res) => {
            that.$Message.destroy();
            that.$Message.success("提交成功");
            console.log(res.data);
            console.log(res.data.status);
            if (res.data.status === 1) {
              let data = parseInt(res.data.data);
              if (data) {
                that.$Message.success("发布成功");
              } else {
                that.$Message.error("找不到城市");
              }
            } else {
              that.$Message.error("无111数据");
            }
          })
          .catch((err) => {
            that.$Message.destroy();
            that.$Message.error("网络错误");
            console.error(err);
          });
      });
    },
    //获取圆心点
    getGooglePoint() {
      let that = this;
      this.map.addEventListener("click", function (e) {
        addmarkerpoint(e);
      });
      function addmarkerpoint(e) {
        that.longitude = e.point.lng.toFixed(4);
        that.latitude = e.point.lat.toFixed(4);
        var icon = new BMap.Icon(
          that.circlePng,
          new BMap.Size(50, 50) // 视窗大小
        );
        let pp = new BMap.Point(e.point.lng, e.point.lat);
        let pointImg = new BMap.Marker(pp, { icon: icon });
        that.map.addControl(pointImg);
        that.map.removeEventListener("click", addmarkerpoint);
      }
    },
  },
  components: {
    // date
  },
};
</script>

<style>
.pubmap-box {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border-top: 1px #639c70 solid;
}
.pubmap-content {
  font-size: 18px;
  font-weight: 700;
  position: relative;
  width: 100%;
  height: 50px;
  /* height: 150px; */
}
.longitude {
  position: absolute;
  display: flex;
  /* top: 20%;
  left: 5%;   */
  top: 15%;
  left: 2%;
  width: 210px;
}
.longitude span{
  width: 135px;
  line-height: 32px;
}
.latitude {
  position: absolute;
  display: flex;
  /* top: 60%;
  left: 5%; */
  top: 15%;
  left: 17%;
  width: 210px;
}
.latitude span{
  width: 135px;
  line-height: 32px;
}
.magnitude {
  position: absolute;
  display: flex;
  /* top: 20%;
  left: 25%; */
  top: 15%;
  left: 32%;
  width: 265px;
}
.magnitude span{
  width: 240px;
  line-height: 32px;
}
.depth {
  position: absolute;
  display: flex;
  /* top: 60%;
  left: 25%; */
  top: 15%;
  left: 50%;
  width: 180px;
}
.depth span{
  width: 135px;
  line-height: 32px;
}
.time {
  position: absolute;
  display: flex;
  /* top: 20%;
  left: 45%; */
  top: 15%;
  left: 63%;
}
.time span{
  /* width: 135px; */
  line-height: 32px;
}
.btn {
  position: absolute;
  /* top: 40%;
  left: 70%; */
  top: 10%;
  left: 82%;
}
.pub-cho {
  height: 40px;
  width: 100px;
  padding: 0px 18px;
  text-align: center;
  display: inline-block;
  font-size: 16px !important;
  font-weight: 700 !important;
}
.pub-cho-yes {
  position: absolute;
  left: 150px;
  font-size: 18px;
}
.pubmap-box .pubmap-content .ivu-input-wrapper {
  width: 80%;
}
#seismicinfoGmap {
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border-top: 3px #639c70 solid;
}

.ivu-input-large {
  font-size: 18px !important;
}
</style>
