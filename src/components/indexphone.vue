<template>
  <div>
    <div class="phone_bc">
      <h1 class="title_phone">地震应急响应可视化辅助平台</h1>
      <div class="all_phone">
        <div class="box_phone">
          <div class="box_in_phone">
            <label>经度:</label>
            <Input v-model="longitude" size="large" placeholder="请输入经度" class="long_input" />
          </div>
        </div>
        <div class="box_phone">
          <div class="box_in_phone">
            <label>纬度:</label>
            <Input v-model="latitude" size="large" placeholder="请输入纬度" class="lat_input" />
          </div>
        </div>
        <div class="box_phone">
          <div class="box_in_phone">
            <label>震级:</label>
            <Input v-model="magnitude" size="large" placeholder="请输入震级" class="mag_input" />
          </div>
        </div>
        <div class="box_phone">
          <div class="box_in_phone">
            <label>深度:</label>
            <Input v-model="depth" size="large" placeholder="请输入深度/km" class="dep_input" />
          </div>
        </div>
        <div class="box_phone">
          <div class="box_in_phone">
            <label>时间:</label>
            <DatePicker v-model="time" type="datetime" size="large" placeholder="自定义日期格式"></DatePicker>
          </div>
        </div>

        <div class="btn_phone box_phone">
          <Button type="primary" @click="getCityName()">确认提交</Button>
        </div>
      </div>
      <div id="seismicinfoGmap_phone"></div>
    </div>
  </div>
</template>

<script>
import circlePng from "@/assets/mapimg/circle.png";
import ajax from "axios";
import qs from "qs";
import pub from "@/assets/pubFile.json";

export default {
  name: "indexphone",
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
    this.initMap();
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
      console.log(this.time);
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
.phone_bc {
  width: 100%;
  height: 100%;
  background-color: #4240401c;
}
.all_phone {
  position: relative;
  top: 15%;
}
.title_phone {
  position: relative;
  top: 10%;
  text-align: center;
  color: rgba(12, 1, 1, 0.9);
  font-size: 25px;
  font-weight: 200;
  font-weight: 600;
}
.box_phone {
  position: relative;
  width: 85%;
  margin: 10px auto 5px auto;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.box_in_phone {
  width: 330px;
  position: absolute;
  margin: auto;
  letter-spacing: 12px;
  font-weight: 600;
}
.box_in_phone label {
  margin: 1%;
  width: 30px;
  position: relative;
  top: 2px;
  left: 0px;
  font-size: 17px;
}
.box_in_phone input {
  height: 38px;
  width: 240px;
  display: inline;
  outline: 0;
  border: 1px solid #38f;
  border-radius: 10px;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
}
#seismicinfoGmap_phone {
  width: 100%;
  height: 100%;
  display: none;
}
.btn_phone {
  top: 30px;
  left: 5px;
}
.btn_phone button {
  width: 100%;
  border: 0px;
  background-color: #63c1e2;
  border-radius: 10px;
  cursor: pointer;
  font-size: 18px;
  outline: 0px;
  color: #fff;
}
.ivu-input-wrapper {
  width: 75% !important;
}
</style>
