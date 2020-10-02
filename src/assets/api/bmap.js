import Basemap from './basemap'
import BMap from 'BMap'
import centerstarPng from '../mapimg/centerStar.png'
import centerstarTwoPng from '@/assets/mapimg/centerStarTwo.png'
import nearCityPng from '@/assets/mapimg/nearCity.png'
import nearhistorylogo from "@/assets/imgicon/point_his.gif"
import checkedPng from '@/assets/mapimg/checked.png'
import nocheckedPng from '@/assets/mapimg/nochecked.png'

function Baidumap(id, eqCenter) {
  this.eqCenter = eqCenter;
  this.mapData = null;
  this.bDistanceLine = [];
  this.bmap = new BMap.Map(id);
  var centerPoint = new BMap.Point(this.eqCenter.longitude, this.eqCenter.latitude);
  this.bmap.centerAndZoom(centerPoint, 7);
  var navOpt = { type: BMAP_NAVIGATION_CONTROL_ZOOM, offset: new BMap.Size(10, 260) };
  this.bmap.addControl(new BMap.NavigationControl(navOpt));
}
Baidumap.prototype = new Basemap();  //继承Basemap
Baidumap.prototype.setMarker = function (data, type) {
  let map = this.bmap;
  if (type == "nearCity") {
    var points = [];
    data.forEach(function (item, index) {
      if (item.longitude && item.latitude) {
        //第一个点为震中，已添加
        var point = new BMap.Point(item.longitude, item.latitude);
        // var icon = new BMap.Icon(nearCityPng, new BMap.Size(20, 20));
        let icon = new BMap.Icon(nearCityPng, new BMap.Size(20, 20),{
          imageSize:new BMap.Size(20, 20)
        });
        var marker = new BMap.Marker(point, { icon: icon });
        var content = this.setContent('附近城镇信息', item, "nearCity");
        marker.addEventListener('click', function () {
          var infoWindow = new BMap.InfoWindow(content, { width: 0, height: 0 });  // 创建信息窗口对象 
          map.openInfoWindow(infoWindow, point); //开启信息窗口
        })
        map.addOverlay(marker);
        points.push(point);
        //添加折线
        var polyline = new BMap.Polyline([new BMap.Point(this.eqCenter.longitude, this.eqCenter.latitude), new BMap.Point(item.longitude, item.latitude)], { strokeColor: "blue", strokeWeight: 2, strokeOpacity: 0.5 });
        this.bDistanceLine.push(polyline)
        map.addOverlay(polyline);
        polyline.disableMassClear()
        if(item.distence.toFixed(0)!=0){
        var opts = {
          position: point,    // 指定文本标注所在的地理位置
          offset: new BMap.Size(-20, -33)    //设置文本偏移量
        }
        var label = new BMap.Label(item.distence.toFixed(0) + "公里", opts);  // 创建文本标注对象
        label.setStyle({
          color: "red",
          fontSize: "12px",
          height: "20px",
          lineHeight: "20px",
          fontFamily: "微软雅黑"
        });
        map.addOverlay(label);
        index++;
      }
    }
    }.bind(this));
    this.bmapMarkers = points
    //this.bmap.setViewport(points);
  } else if (type == "EqCenter") {
    var centerPoint = new BMap.Point(data.longitude, data.latitude)
    var icon = new BMap.Icon(centerstarPng, new BMap.Size(23, 23))
    var centerMarker = new BMap.Marker(centerPoint, { icon: icon })
    map.addOverlay(centerMarker)
    this.bmap.centerAndZoom(centerPoint, 10)
    var content = this.setContent('震中信息', this.eqCenter, "EqCenter");
    centerMarker.addEventListener('click', function () {
      var infoWindow = new BMap.InfoWindow(content, { width: 0, height: 0 });  // 创建信息窗口对象 
      map.openInfoWindow(infoWindow, centerPoint); //开启信息窗口
    })
    //震中闪烁
    var iconTwo = new BMap.Icon(centerstarTwoPng, new BMap.Size(20, 20));
    setInterval(function () {
      if (centerMarker.getIcon() == icon) {
        centerMarker.setIcon(iconTwo)
      } else {
        centerMarker.setIcon(icon)
      }
    }, 1000)
  }else if (type == "nearhistorydz") {
    var points = [];
    data.forEach(function (item, index) {
      if (item.longitude && item.latitude) {
        var point = new BMap.Point(item.longitude, item.latitude);
        // var icon = new BMap.Icon(nearCityPng, new BMap.Size(20, 20));
        let icon = new BMap.Icon(nearhistorylogo, new BMap.Size(20, 20), {
          imageSize: new BMap.Size(20, 20)
        });
        var marker = new BMap.Marker(point, {
          icon: icon
        });
        var content = this.setContent('附近历史地震信息', item, "nearhistorydz");
        marker.addEventListener('click', function () {
          var infoWindow = new BMap.InfoWindow(content, {
            width: 425,
            height: 220
          }); // 创建信息窗口对象 
          map.openInfoWindow(infoWindow, point); //开启信息窗口
        })
        // marker.setAnimation(BMAP_ANIMATION_BOUNCE);//跳动的动画
        map.addOverlay(marker);
        points.push(point);
      }
    }.bind(this));
    this.bmapMarkers = points
  }
};
Baidumap.prototype.setCounty = function (data) {
  let map = this.bmap;
  var option = {
    strokeWeight: 1,
    strokeColor: "#000",
    StrokeStyle: "dashed", //设置多边形边线样式为实线或虚线，取值 solid 或 dashed
    fillColor: 'transparent', //多边形填充色
    fillOpacity: 0 //设置多边形填充颜色透明度0-1
  }
  var bdary = new BMap.Boundary();
  data.forEach(function (item, index) {
    bdary.get(item.name, function (rs) {
      var count = rs.boundaries.length
      for (var i = 0; i < count; i++) {
        var ply = new BMap.Polygon(rs.boundaries[i], option); //建立多边形覆盖物
        map.addOverlay(ply);  //添加覆盖物
      }
    })
  })
};
Baidumap.prototype.myControlInit = function () {
  var top_left_control = new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT });// 左上角，添加比例尺
  top_left_control.setOffset(new BMap.Size(1, 2))
  this.bmap.addControl(top_left_control);
  var navOpt = { type: BMAP_NAVIGATION_CONTROL_ZOOM, offset: new BMap.Size(10, 260) };
  this.bmap.addControl(new BMap.NavigationControl(navOpt));
  var trafficLayer = new BMap.TrafficLayer();
  this.bmap.addTileLayer(trafficLayer);
  function myControl(bmap, Offset, className, innerHTML, onclick) {
    // 默认停靠位置和偏移量
    this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
    this.defaultOffset = Offset;
    this.initialize = function (bmap) {
      // 创建一个DOM元素
      var div = document.createElement("div");
      div.className = className;
      div.innerHTML = innerHTML;
      div.onclick = onclick;
      // 添加DOM元素到地图中
      bmap.getContainer().appendChild(div);
      // 将DOM元素返回
      return div;
    }
  }
  myControl.prototype = new BMap.Control();
  var bmap = this.bmap;
  var myTraffic = new myControl(this.bmap, new BMap.Size(10, 105), 'track', '<span class="track-icon" data="checked"><img src=' + checkedPng + ' style="width:1.5rem;height:1.5rem"></span><span class="track-title">路网</span>', function () {
    var _this = this;
    var parentNode = _this.childNodes[0];
    var node = parentNode.childNodes[0];
    var currentData = _this.childNodes[0].attributes[1].nodeValue;
    if (currentData === 'nochecked') {
      node.setAttribute('src', checkedPng);
      parentNode.setAttribute('data', 'checked');
      bmap.setMapStyle({
        styleJson: [{
          "featureType": "road",
          "elementType": "all",
          "stylers": {
            "visibility": "on"
          }
        }]
      });
    } else {
      node.setAttribute('src', nocheckedPng);
      parentNode.setAttribute('data', 'nochecked');
      bmap.setMapStyle({
        styleJson: [{
          "featureType": "road",
          "elementType": "all",
          "stylers": {
            "visibility": "off"
          }
        }]
      });
    }
  });
  var realTimeTraffic = new myControl(this.bmap, new BMap.Size(10, 130), 'track', '<span class="track-icon" data="checked"><img src=' + checkedPng + ' style="width:1.5rem;height:1.5rem"></span><span class="track-title">实时路况</span>', function () {
    var _this = this;
    var parentNode = _this.childNodes[0];
    var node = parentNode.childNodes[0];
    var currentData = _this.childNodes[0].attributes[1].nodeValue;
    if (currentData === 'nochecked') {
      node.setAttribute('src', checkedPng);
      parentNode.setAttribute('data', 'checked');
      trafficLayer = new BMap.TrafficLayer();
      bmap.addTileLayer(trafficLayer);
    } else {
      node.setAttribute('src', nocheckedPng);
      parentNode.setAttribute('data', 'nochecked');
      bmap.removeTileLayer(trafficLayer);
      trafficLayer = null;
    }
  })
  this.bmap.addControl(myTraffic);
  this.bmap.addControl(realTimeTraffic);
}
Baidumap.prototype.setFaultZone = function (data) {
  let map = this.bmap;
  var point = new BMap.Point(this.eqCenter.longitude, this.eqCenter.latitude); // 创建点坐标
  var centerIcon = new BMap.Icon(centerstarPng, new BMap.Size(20, 20));
  var centerMarker = new BMap.Marker(point, { icon: centerIcon });
  map.addOverlay(centerMarker);
  var opts = {
    position: point,    // 指定文本标注所在的地理位置
    offset: new BMap.Size(-80, -30)    //设置文本偏移量
  }
  var label = new BMap.Label(this.eqCenter.district + this.eqCenter.magnitude + "级地震", opts);  // 
  label.setStyle({
    color: "black",
    fontSize: "18px",
    height: "20px",
    lineHeight: "20px",
    fontFamily: "斜体",
    borderColor: 'transparent',
    backgroundColor: 'transparent'
  });
  map.addOverlay(label);
  var linePoints = new Array();
  var sub = 0;
  linePoints[sub] = new Array();
  var info = new Array();
  info[sub] = new Array();
  let lonMin = Number(this.eqCenter.longitude) - 3;
  let lonMax = Number(this.eqCenter.longitude) + 3;
  let latMin = Number(this.eqCenter.latitude) - 3;
  let latMax = Number(this.eqCenter.latitude) + 3;
  for (var i = 0; i + 1 < data.RECORDS.length; i++) {
    if (data.RECORDS[i].line == data.RECORDS[i + 1].line) {
      var point = new BMap.Point(data.RECORDS[i].baidu_X, data.RECORDS[i].baidu_Y);
      linePoints[sub].push(point);
    } else {
      var point = new BMap.Point(data.RECORDS[i].baidu_X, data.RECORDS[i].baidu_Y);
      linePoints[sub].push(point);
      if (data.RECORDS[i].name != "") {
        info[sub] = data.RECORDS[i].name;
      } else {
        info[sub].push("");
      }
      sub++;
      info[sub] = new Array()
      linePoints[sub] = new Array();
    }
  }
  for (let j = 0; j < linePoints.length; j++) {
    if (linePoints[j][0].lng < lonMax && linePoints[j][0].lng > lonMin && linePoints[j][0].lat > latMin && linePoints[j][0].lat < latMax) {
      let polyline = new BMap.Polyline(linePoints[j], { strokeColor: "red", strokeWeight: 2, strokeOpacity: 0.5 });
      let paths = polyline.getPath()
      let point = new BMap.Point(paths[parseInt(paths.length / 2)].lng, paths[parseInt(paths.length / 2)].lat)
      polyline.addEventListener('click', function () {
        var infoWindow = new BMap.InfoWindow(info[j] == "" ? "暂无信息" : info[j], { title: "断裂带名称", width: 100, height: 10 });  // 创建信息窗口对象
        map.openInfoWindow(infoWindow, point); //开启信息窗口
      }.bind(this))

      polyline.flag = "myfault";
      map.addOverlay(polyline);
    }
  }
};
Baidumap.prototype.setCenterView = function () {
  var point = new BMap.Point(this.eqCenter.longitude, this.eqCenter.latitude);
  this.bmap.centerAndZoom(point, 7.5);
};
Baidumap.prototype.showDistanceLine = function (flag) {
  if (flag == true) {
    for (var i = 0; i < this.bDistanceLine.length; i++) {
      this.bDistanceLine[i].show();
    }
  } else if (flag == false) {
    for (var i = 0; i < this.bDistanceLine.length; i++) {
      this.bDistanceLine[i].hide();
    }
  }
}

Baidumap.prototype.addfz = function (line) {
  let map = this.bmap
  var linePoints = new Array();
  var sub = 0;
  let lineName = new Array();
  lineName.push(line.RECORDS[0].name)
  // console.log(lineName)
  linePoints[sub] = new Array();
  var info = new Array();
  info[sub] = new Array();
  for (var i = 0; i + 1 < line.RECORDS.length; i++) {
    if (line.RECORDS[i].line == line.RECORDS[i + 1].line) {
      var point = new BMap.Point(line.RECORDS[i].baidu_X, line.RECORDS[i].baidu_Y);
      linePoints[sub].push(point);
    } else {
      var point = new BMap.Point(line.RECORDS[i].baidu_X, line.RECORDS[i].baidu_Y);
      linePoints[sub].push(point);
      sub++;
      lineName.push(line.RECORDS[i].name)
      linePoints[sub] = new Array();
    }
  }
  for (let j = 0; j < linePoints.length; j++) {
    let polyline = new BMap.Polyline(linePoints[j], { strokeColor: "red", strokeWeight: 2, strokeOpacity: 0.5 });
    let paths = polyline.getPath()
    let point = new BMap.Point(paths[parseInt(paths.length / 2)].lng, paths[parseInt(paths.length / 2)].lat)
    polyline.addEventListener('click', function () {
      let infoWindow = new BMap.InfoWindow(lineName[j] == "" ? "暂无信息" : lineName[j], { title: "断裂带名称", width: 100, height: 10 });  // 创建信息窗口对象
      map.openInfoWindow(infoWindow, point); //开启信息窗口
    }.bind(this))
    polyline.flag = "myfault";
    map.addOverlay(polyline);
  }
}

Baidumap.prototype.showWorldHisEq = function (points) {
  let map = this.bmap
  for (let i = 0; i < points.length; i++) {
    let point = new BMap.Point(points[i].Longitude, points[i].Latitude);
    let colors = ["#cecace", "#f0ef49", "#0001ff", "#ff3600"];
    let sizes = [6, 8, 10, 12];
    let size = sizes[0];
    let color = colors[0];
    let date = new Date(points[i].EarthquakeDate)
    if (date.getFullYear() == 2016) {
      color = colors[1]
    }
    else if (date.getFullYear() == 2017) {
      color = colors[2]
    } else if (date.getFullYear() == 2018) {
      color = colors[3]
    }

    if (points[i].Magnitude >= 7 && points[i].Magnitude < 8) {
      size = sizes[1]
    } else if (points[i].Magnitude >= 8 && points[i].Magnitude < 9) {
      size = sizes[2]
    } else if (points[i].Magnitude >= 9 && points[i].Magnitude < 10) {
      size = sizes[3]
    }

    let symbol = new BMap.Symbol(BMap_Symbol_SHAPE_CIRCLE, {
      fillColor: color,
      fillOpacity: 1,
      strokeColor: "#000000",
      scale: size,
      strokeWeight: 1
    })
    var marker = new BMap.Marker(point, { icon: symbol });
    let content = this.setContent('历史地震信息', points[i], "hisEq");
    marker.addEventListener('click', function () {
      var infoWindow = new BMap.InfoWindow(content, { width: 0, height: 0 });  // 创建信息窗口对象 
      map.openInfoWindow(infoWindow, point); //开启信息窗口
    })
    map.addOverlay(marker);
  }

};
Baidumap.prototype.setWorldView = function () {
  var point = new BMap.Point(this.eqCenter.longitude, this.eqCenter.latitude);
  this.bmap.centerAndZoom(point, 3);
}

export default Baidumap;