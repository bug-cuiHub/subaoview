<template>
  <div class="dashChat">
    <div class="dash-title">
      <!-- <span class="dash-title-text">{{ pagedata.name }}生产总值{{ pagedata.option }}亿元</span> -->
      <span class="dash-title-text">经济信息</span>
    </div>
    <div class="box">
      <chart :option="chartoption" :id="'encochart'"></chart>
    </div>
  </div>
</template>

<script>
import axios from "@/assets/api/axios";
import chart from "@/components/pubcomponent/chart.vue";

export default {
  data: function() {
    return {
      // pagedata: null,
      chartoption: null,
      scale: 1,
      rich: {
        white: {
          color: "#fff",
          align: "left",
          fontSize: 18 * 1,
          padding: [0, 0]
        }
      },
      bgImg:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAF+CAYAAADNzDlVAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAilJREFUeNrs1rENwjAURdEfC0pmQAwBDfuwE8wDDSULIGagTGEcFNHQpfPXseT0V0ryzrA/XzcRsWt3HX2fsd1XSRITc8O2JIn5RZVIdsr87mU54xT0TBL1/Sms2uPd7qPXivvp+PfKpfuGBAkStPxMf7muLXe43FiO5ViO5VjOsAoSxHIsx3Isx3Isx3KGVZAglmM5lmM5lmM5liMFQYJYjuVYjuVYjuVYTpAgQSzHcizHcizHcoZVkCCWYzmWYzmWYzmWM6yCBLEcy7Ecy7Ecy7GcIEGCWI7lWI7lWI7lDKsgQYJYjuVYjuVYjuUMqyBBLMdyLMdyLMdyLGdYBQliOZZjOZZjOZZjOUGCBLEcy7Ecy7EcyxlWQYJYjuVYjuVYjuVYzrAKEsRyLMdyLMdyLMdypCBIEMuxHMuxHMuxnGEVJEgQy7Ecy7Ecy7GcYRUkiOVYjuVYjuVYjuUMqyBBLMdyLMdyLMdyLCdIkCCWYzmWYzmWYznDKkgQy7Ecy7Ecy7EcyxlWQYJYjuVYjuVYjuVYjhQECWI5lmM5lmM5ljOsggQJYjmWYzmWYzmWM6yCBLEcy7Ecy7Ecy7GcYRUkiOVYjuVYjuVYjuUECRLEcizHcizHcixnWAUJYjmWYzmWYzmWYznDKkgQy7Ecy7Ecy7Ecy5GCIEEsx3Isx3Isx3IsJ0iQIJZjOZZjOZZjOcMqSBDLsRzLsRzL9Wy5odZqhwQJWn4+AgwApGqd0LftHcgAAAAASUVORK5CYII=",
      fillImg:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAF+CAYAAADNzDlVAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABFhJREFUeNrs3U+O1DgUgHHblUFzhb7GCCHNtnfMFUasOA9HYEWfAQlpZq6AEOIIdPcFZgMVe5L6Q6pLzQjFLZK2fpZSKbVioQ8n9b68+Dnxz39fXYYYrkIIF+Fxt5the5kagQkHhtepEZhvUCk01tLh3Gul3aZQwovxSwMwn8cfhW74+Lul66jJawgQIEB1QJfDdj1s5ZFvI8NzLsfluByX43KAlmzjKRdyTkYIEJeb6XK5JC7H5bhchculmLmcOASoAqjPGyMEiMtVuFyMhctxOS5X4XKlRC4nDgECBIjLLeVyXSnpqhQux+W43FyXi/Jy4hCgKqC+74wQIC5XkZdLKcvLcTkuV+FyOScuJw4Bmt/MlwPE5WprH4LaBy7H5WpcbvjgcuIQIECAuByXe0iXy4eJtOONXilx2NJh238PIYbpmPP9qvpc7O5YU+r351/KB9hyAl7C3WPO9+vqs3O5hkZocrn9H+PJwdP3Y87h/n9sNX24HKBFgLaesQLiclUul9Q+yMvJy1Xl5bLaB3EIUE3biVzvGSsgLjfb5Yb7ci7H5bhchcvFWLicOAQIECAux+W43P1QXcmpuWuotbyc2gdxCFBF29c+FHk5QFzOfDl5OS63jMsFtQ/iECBAgLgcl+Ny34PqcoMrot+cFkzEWIbtuN9/H0/R/yuyWFGf2zR8vBiLIHa5hTsFE3FGkcWifT4Pey63fqDt9hemsOYWSylGaM2t++P6zWUjS7KNuZGX1pdbO5S83Mqb9eXEIUC1gfV4r2GEAP08IHk5LsfluNzkcsEzVnEIULXLFS4HiMvNdrnh+uFyXI7LVbhcTN7hJQ4BqnU5eTlAXG6+y/XbjstxOS5X4XJ93nA5cQhQrcupYwXE5Wa7XLRWMJfjclUuV6wVLA4BAgSIyy3ncl0p6aoULsfluNxcl4vRM1ZxCBAgQFxuybWC25ov1+Wc2nK543tOj/tpeYxpOz9mzX3GERpd7uI4PWZcGuO8Hf82vSr07n5FfW7TZrPlcuIQoAqgL19+NUKAuFyFyw1xyDPWVbtci9dQY/Pl+o7LiUOA5rdD7cPGCAHicubLcTkut4jLmS8nDgF6CJdT+wCIy3kfK5fjcsu43HA/xOXEIUCVLnffhAYjBIjL/ZjLZevLcTkuV+Vyyfpy4hCgKqCvX58YIUBcbr7Lxd8/vb1u6Gf7hstxuZ/tcp6xikOAAAHicubLPYz2BHk5LsfluJzA+tja7hlrr/YBEJeb63Lx2cd38nJcjstVuFyyvpw4BAgQIC7H5bgcl3u0Lpd77/AShwBVNGuSAOJylS739MNf7blcSv1+uFI+LFmbT5avzbv/gOmY8/2q+lzc+ZWbqvZPK76OS9duvrNfV5/2XG4YMS4nDgECBIjLcbmHdLmGzjh5OS7H5cShxoGsLweIy1W63G/v/+FyXI7LVbic+XLiECBAgLgcl+NyXI7LrcXlYilFHAIEaH77T4ABAKzsRPWz+TQ7AAAAAElFTkSuQmCCgg",
      bgData: [],
      itemData: [],
      chartData: []
    };
  },
  created: function() {
    this.getEncData();
  },
  methods: {
    getEncData() {
      var setting = {
          method: "POST",
          url: "api/obtain/eqData"
        },
        data = {
          handel: "economic"
        };
      axios(
        res => {
          if (res.status === 1) {
            let data = res.data[0];
            // this.pagedata = this.setPeoData(data);
            this.setOption(data);
          }
        },
        { setting, data }
      );
    },
    // setPeoData(data) {
    //   return {
    //     option: data.GDP,
    //     name: data.eqtname,
    //     chart: {
    //       list: [data.FST_INDUSTRY, data.SND_INDUSTRY, data.TRD_INDUSTRY]
    //     }
    //   };
    // },
    setOption(data) {
      let that = this;
      this.chartData = [
        {
          name: "第一产业",
          value: data.FST_INDUSTRY
        },
        {
          name: "第二产业",
          value: data.SND_INDUSTRY
        },
        {
          name: "第三产业",
          value: data.TRD_INDUSTRY
        }
      ];
      // 取出每一条数据value,作为显示数据
      this.chartData.forEach(function(items, index) {
        that.itemData.push(items.value);
      });

      // 取出所有数据最大值,作为背景象形柱图数据
      this.chartData.forEach(function(items, index) {
        that.bgData.push({
          name: items.name,
          value: Math.max.apply(null, that.itemData)
        });
      });

      // 所有数据最大值
      var maxValue = Math.max.apply(null, that.itemData);
      this.chartoption = {
        tooltip: {
          formatter: "{b} : {c}"
        },
        grid: {
          left: "3%",
          right: "6%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: (function(data) {
              var arr = [];
              data.forEach(function(items) {
                arr.push(items.name);
              });
              return arr;
            })(that.chartData),

            boundaryGap: ["20%", "20%"],
            splitLine: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: {
                fontSize: 16 * this.scale,
                color: "#3fdaff"
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            splitLine: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: true,
              inside: true,
              length: 10 * this.scale,
              lineStyle: {
                color: "#0b5263"
              }
            },
            axisLabel: {
              textStyle: {
                color: "#0099FF",
                fontSize: 14 * this.scale
              }
            }
          }
        ],
        series: [
          //背景
          {
            name: "bg",
            type: "pictorialBar",
            barWidth: "45%",
            silent: true,
            label: {
              normal: {
                show: true,
                position: "top",
                distance: 20 * this.scale,
                formatter: function(params) {
                  var stuNum = 0;
                  that.chartData.forEach(function(value, index, array) {
                    if (params.name == value.name) {
                      stuNum = value.value;
                    }
                  });
                  return stuNum + "{white| 亿元}";
                },
                textStyle: {
                  color: "#ffc72b",
                  fontSize: 20 * this.scale
                },
                rich: this.rich
              }
            },
            symbol: "image://" + this.bgImg,
            symbolClip: false,
            symbolBoundingData: maxValue,
            symbolSize: [52, "100%"],
            data: this.bgData
          },
          {
            name: "数据",
            type: "pictorialBar",
            barWidth: "45%",
            barGap: "-100%",
            data: that.chartData,
            z: 3,
            symbol: "image://" + this.fillImg,
            symbolClip: true,
            symbolBoundingData: maxValue,
            symbolSize: [52, "100%"]
          }
        ]
      };
    }
  },
  components: {
    chart
  }
};
</script>

<style>
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
  top: 90px;;
  width: 100%;
  background-color: transparent;
  transition: all 0.5s linear;
}
</style>
