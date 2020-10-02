// import GMap from 'google.maps'
// import Basemap from '@/assets/api/basemap'
// import centerstarPng from '@/assets/mapimg/centerStar.png'
// import centerstarTwoPng from '@/assets/mapimg/centerStarTwo.png'
// import nearCityPngThree from '@/assets/mapimg/nearCity3.png'
// import HIS_EQ_MARKER_1 from '@/assets/imgicon/tdhis1.png'
// import HIS_EQ_MARKER_2 from '@/assets/imgicon/tdhis2.png'
// import HIS_EQ_MARKER_3 from '@/assets/imgicon/tdhis3.png'

// function Googlemap(id, eqCenter, mapData, mapType) {
//   if (mapType == "TERRAIN") {
//     mapType = GMap.MapTypeId.TERRAIN
//   } else {
//     mapType = GMap.MapTypeId.HYBRID
//   }
//   this.HIS_EQ_MARKER = [HIS_EQ_MARKER_1, HIS_EQ_MARKER_2, HIS_EQ_MARKER_3];
//   this.eqCenter = eqCenter;
//   this.mapData = mapData;
//   this.gDistanceLine = [];
//   this.gmapMarkers = [];
//   this.gmap = new GMap.Map(document.getElementById(id), {
//     center: new GMap.LatLng(this.eqCenter.latitude, this.eqCenter.longitude),
//     disableDefaultUI: true,
//     zoom: 9,
//     mapTypeId: mapType,
//     scaleControl: true,
//     scaleControlOptions: {
//       position: GMap.ControlPosition.BOTTOM_LEFT
//     }
//   });
// }
// Googlemap.prototype = new Basemap();
// Googlemap.prototype.setMarker = function (data, type, showDistance) {
//   let map = this.gmap;
//   if (type == "nearCity") {
//     var points = [];
//     data.forEach(function (item, index) {
//       if (item.longtitude && item.latitude) {
//         var Marker = null;
//         //google
//         if (index != 0) {
//           var nearIcon = {
//             url: nearCityPngThree,
//             size: new GMap.Size(30, 30)
//           }
//           Marker = new GMap.Marker({
//             position: new GMap.LatLng(item.latitude, item.longtitude),
//             icon: nearIcon
//           });
//           var content = this.setContent('附近城镇信息', item, "nearCity");
//           var infowindow = new GMap.InfoWindow({
//             content: content
//           });
//           GMap.event.addListener(Marker, 'click', function () {
//             infowindow.open(map, Marker);
//           });
//           Marker.setMap(map);
//           if (showDistance) {
//             var polyline = new GMap.Polyline({
//               path: [new GMap.LatLng(this.eqCenter.latitude, this.eqCenter.longitude), new GMap.LatLng(item.latitude, item.longtitude)],
//               strokeColor: "#7b7af7",
//               strokeWeight: 2
//             });
//             this.gDistanceLine.push(polyline)
//             polyline.setMap(map);
//           }

//         }
//         if (Marker !== null) {
//           points.push(Marker);
//           this.gmapMarkers.push(Marker);
//         }
//         index++;
//       }
//     }.bind(this))
//     return points;
//   } else if (type == "EqCenter") {
//     var Icon = {
//       url: centerstarPng,
//       size: new GMap.Size(22, 22),
//       flag: "Icon",
//       anchor: new GMap.Point(12, 12)
//     }
//     var Marker = new GMap.Marker({
//       position: new GMap.LatLng(data.latitude, data.longitude),
//       icon: Icon
//     });
//     var content = this.setContent('震中信息', this.eqCenter, "EqCenter");
//     var infowindow = new GMap.InfoWindow({
//       content: content
//     });
//     GMap.event.addListener(Marker, 'click', function () {
//       infowindow.open(map, Marker);
//     });
//     Marker.setMap(map);
//     this.gmapMarkers.push(Marker);
//     //震中闪烁
//     var iconTwo = {
//       url: centerstarTwoPng,
//       size: new GMap.Size(22, 22),
//       anchor: new GMap.Point(12, 12)
//     }
//     setInterval(function () {
//       if (Marker.getIcon().flag == "Icon") {
//         Marker.setIcon(iconTwo)
//       } else {
//         Marker.setIcon(Icon)
//       }
//     }, 1000)
//   }
// }
// Googlemap.prototype.setHisMarker = function (hisEq) {
//   let map = this.gmap;
//   var points = [];
//   var index = 0;
//   for (var key in hisEq) {
//     if (hisEq.hasOwnProperty(key) && hisEq[key] !== '') {
//       var val = hisEq[key];
//       //google
//       var hisIcon = {
//         url: this.HIS_EQ_MARKER[index],
//         //size:new google.maps.Size(MAP_ICON_SIZE,MAP_ICON_SIZE)
//       }
//       var Marker = new google.maps.Marker({
//         position: new google.maps.LatLng(val.Latitude, val.Longitude),
//         icon: hisIcon
//       });
//       (function (item, Marker) {
//         var content = this.setContent('历史地震信息', item, "hisEq");
//         var infowindow = new google.maps.InfoWindow({
//           content: content
//         });
//         google.maps.event.addListener(Marker, 'click', function () {
//           infowindow.open(map, Marker);
//         });

//       }.bind(this))(val, Marker)
//       Marker.setMap(map);
//       this.gmapMarkers.push(Marker);
//       points.push(Marker);
//       index++;
//     }
//   }
//   return points;
// }
// Googlemap.prototype.panToCenter = function () {
//   if (this.mapData) {
//     var bounds = new GMap.LatLngBounds();
//     //读取标注点的位置坐标，加入LatLngBounds  
//     for (var i = 0; i < this.gmapMarkers.length; i++) {
//       bounds.extend(this.gmapMarkers[i].getPosition());
//     }
//     //调整map，使其适应LatLngBounds,实现展示最佳视野的功能  
//     this.gmap.fitBounds(bounds);
//   }
// }
// Googlemap.prototype.setCenterView = function () {
//   let center = new GMap.LatLng(this.eqCenter.latitude, this.eqCenter.longitude)
//   this.gmap.setCenter(center)
//   //this.gmap.setZoom(9)
// };
// Googlemap.prototype.showDistanceLine = function (flag) {
//   if (flag == true) {
//     for (var i = 0; i < this.gDistanceLine.length; i++) {
//       this.gDistanceLine[i].setMap(this.gmap);
//     }
//   } else if (flag == false) {
//     for (var i = 0; i < this.gDistanceLine.length; i++) {
//       this.gDistanceLine[i].setMap(null);
//     }
//   }
// };
// export default Googlemap;