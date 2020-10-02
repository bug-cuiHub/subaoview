<template>
  <div class="dashChat">
    <div class="dash-title">
      <span class="dash-title-text">中国历史地震</span>
    </div>
    <div class="box"> 
      <!-- 中国大陆地图无法在vue-echarts中加载出来，这里改用原生echarts加载 -->
      <div id="box"></div>
    </div>
  </div>
</template>

<script>
import axios from "@/assets/api/axios";
import "@/components/pubcomponent/chart.vue";
import echarts from "echarts";

export default {
  data: function() {
    return {
      chartoption: null,
      geoCoordMap: []
    };
  },
  created: function() {
    this.getEncData();
  },
  mounted() {
    this.getEncData();
  },
  methods: {
    getEncData() {
      var setting = {
          method: "POST",
          url: "api/obtain/eqData"
        },
        data = {
          handel: "chinaEq"
        };
      axios(
        res => {
          if (res.status === 1) {
            let data = res.data;
            let metroData = [];
            let eqposition = "{";
            for (let i = 0; i < data.length; i++) {
              let obj = {};
              obj.name = data[i].Position + "1" + i;
              obj.value = data[i].Magnitude;
              let arr = [];
              arr.push(obj);
              if (i + 1 == data.length) {
                let str =
                  '"' +
                  data[i].Position +
                  "1" +
                  i +
                  '":["' +
                  data[i].Longitude +
                  "," +
                  data[i].Latitude +
                  '"]';
                eqposition += str;
                break;
              }
              metroData.push(arr);
              let str =
                '"' +
                data[i].Position +
                "1" +
                i +
                '":["' +
                data[i].Longitude +
                '"' +
                ',"' +
                data[i].Latitude +
                '"],';
              eqposition += str;
            }
            eqposition += "}";
            var geoCoordMap = JSON.parse(eqposition);
            this.setOption(geoCoordMap, metroData);
          }
        },
        { setting, data }
      );
    },
    setOption(geoCoordMap, metroData) {
      var myChart = echarts.init(document.getElementById('box'));
      var outInPercentstr = [
        { color: "#FF0000", gt: 5, lte: 6 },
        { color: "#EE0000", gt: 6, lte: 7 },
        { color: "#CD0000", gt: 7, lte: 8 },
        { color: "#8B0000", gt: 8 }
      ];
      var series = [];
      [["中国", metroData]].forEach(function(item, i) {
        series.push({
          name: "中国",
          type: "map",
          center:['100%','100%'],
          geoIndex: 0,
          tooltip: {
            show: true,
            formatter: function(params) {}
          },
          data: item[1].map(function(dataItem) {
            return {
              name: dataItem.name,
              value: dataItem.value
            };
          })
        });
        var arrItem = item[1]["0"];
        for (let k = 0; k < arrItem.length; k++) {
          series.push({
            type: "effectScatter",
            coordinateSystem: "geo",
            zlevel: 2,
            rippleEffect: {
              //涟漪特效相关配置
              period: "4", //动画的时间
              scale: "4", //动画中波纹的最大缩放比例
              brushType: "stroke"
            },
            tooltip: {
              show: true,
              formatter: function(params) {
                var name = params.name.split("1")[0];
                if (
                  params.value[2] != null &&
                  params.value[2] != undefined &&
                  params.value[2] != "NaN"
                ) {
                  return name + "：" + params.value[2] + "<br>";
                } else {
                  return name;
                }
              }
            },
            // symbolSize: 8, //点大小
            symbolSize: function(value) {
              return (value[2] - 4.9) * 5;
            },
            data: item[1].map(function(dataItem) {
              return {
                name: dataItem[k].name,
                value: geoCoordMap[dataItem[k].name].concat([dataItem[k].value])
              };
            })
          });
        }
      });

      var option = {
        backgroundColor: "transparent",
        legend: { show: false },
        visualMap: {
          type: "piecewise",
          splitNumber: 5,
          calculable: true,
          itemWidth: 20,
          itemHeight: 16,
          itemGap: 5,
          align: "left",
          seriesIndex: ["1", "2", "3"],
          pieces: outInPercentstr,
          left: 60,
          bottom: 20,
          textStyle: {
            color: "#4ac7f5",
            fontSize: 14
          }
        },
        geo: [
          {
            map: "china",
            roam: true,
            left:"center",
            z: 1,
            label: {
              emphasis: {
                show: true,
                textStyle: {
                  color: "#fff"
                }
              }
            },
            zoom: 7, //缩放比例
            layoutCenter: ['50%', '50%'],   //属性定义地图中心在屏幕中的位置，一般结合layoutSize 定义地图的大小
            layoutSize: 100,
            itemStyle: {
              normal: {
                areaColor: "rgba(61,97,166,0.5)",
                borderWidth: 3,
                borderColor: "rgba(108,136,216,0.9)"
              },
              emphasis: {
                areaColor: "rgba(61,97,166,1)"
              }
            }
          },
          {
            backgroundColor: "#2b3a65",
            z: 0,
            label: {
              emphasis: {
                show: false,
                textStyle: {
                  color: "#fff"
                }
              }
            },
            roam: true, //开启缩放或者平移
            zoom: 4.85, //缩放比例
            itemStyle: {
              normal: {
                areaColor: "#2b3a65",
                borderWidth: 1,
                borderColor: "#fff"
              },
              emphasis: {
                areaColor: "transparent"
              }
            }
          }
        ],
        series: series
      };
      myChart.setOption(option);
      //调透明度
      // this.changeCanvas();
    },
    changeCanvas(){
      var dom = document.getElementById('box');
      var firstChild= dom.firstElementChild;
      firstChild.style.backgroundColor = "transparent";

    }
  }
};
</script>

<style scoped>
.dashChat {
  position: relative;
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
  background-color: transparent;
}
.dash-title {
  position: absolute;
  width: 100%;
  background-color: #fff0;
  margin: 20px auto;
  line-height: 50px;
  height: 50px;
  color: white;
}
.dash-title-text {
  font-size: 28px;
  font-weight: 800;
}
.box {
  position: relative;
  height: calc(100% - 90px);
  top: 90px;
  width: 100%;
  background-color: transparent;
  transition: all 0.5s linear;
}
#box {
  position: relative;
  height: 100%;
  top: 0px;
  width: 100%;
  background-color: transparent;
  transition: all 0.5s linear;
  vertical-align: bottom;
}
</style>
