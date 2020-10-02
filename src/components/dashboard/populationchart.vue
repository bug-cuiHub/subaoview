<template>
  <div class="dashChat">
    <div class="dash-title">
      <!-- <span class="dash-title-text">{{pagedata.name}}总人口{{pagedata.option}}万人</span> -->
      <span class="dash-title-text">人口信息</span>
    </div>
    <div class="box">
      <chart :option="chartoption" :id="'popchart'"></chart>
    </div>
  </div>
</template>
<script>
import ECharts from "vue-echarts/components/ECharts.vue";
import axios from "@/assets/api/axios";
import chart from "@/components/pubcomponent/chart.vue";
import ChartoOption from "@/assets/api/chart";
export default {
  data: function() {
    return {
      pagedata: null,
      chartoption: null,
      color: ["#fb734e", "#e32f46", "#94d96c", "#0bbcb7", "#1a9bfc", "#7049f0"],
      dataStyle: {
        normal: {
          label: {
            show: false
          },
          labelLine: {
            show: false
          },
          shadowBlur: 40,
          borderWidth: 10,
          shadowColor: "rgba(0, 0, 0, 0)" //边框阴影
        }
      }
    };
  },
  created: function() {
    this.getPeoData();
  },
  methods: {
    getPeoData() {
      let setting = {
          method: "POST",
          url: "api/obtain/eqData"
        },
        data = {
          handel: "population"
        };
      axios(
        res => {
          if (res.status === 1) {
            let data = res.data[0];
            this.pagedata = this.setPeoData(data);
            this.setOption(this.pagedata);
          }
        },
        { setting, data }
      );
    },
    setPeoData(data) {
      return {
        option: data.POP_ALL,
        chart: {
          POP_COUNTRYSIDE: data.POP_COUNTRYSIDE,
          POP_TOWN: data.POP_TOWN,
          list: [data.POP_TOWN, data.POP_COUNTRYSIDE]
        },
        Num: {
          townNum: data.town_num,
          villageNum: data.village_num
        },
        AverIncome: {
          urbanAverIncome: data.urban_ave_income,
          villageAverIncom: data.village_ave_income
        },
        name: data.eq_name
      };
    },
    staPercent(child, parent) {
      return ((Number(child) / Number(parent)) * 100).toFixed(2);
    },
    setOption(datas) {
      let data = this.pagedata.chart.list;
      let Chart = new ChartoOption("Pie", data, "peochart");
      this.chartoption = {
        backgroundColor: "rgba(32, 32, 35, 0)",
        // backgroundColor: "#fff0",
        title: {
          text: "人口比例分析",
          x: "center",
          y: "center",
          textStyle: {
            fontWeight: "normal",
            fontSize: 24,
            color: "#fff"
          }
        },
        tooltip: {
          trigger: "item",
          show: true,
          formatter: "{b} : <br/>{d}%",
          //   backgroundColor: "rgba(0,0,0,0)", // 背景
          padding: [8, 10], //内边距
          extraCssText: "box-shadow: 0 0 3px rgba(255, 255, 255, 0.4);" //添加阴影
        },
        legend: {
          orient: "vertical",
          // icon: 'circle',
          left: "left",
          fontSize: 50,
          top: "20",
          itemGap: 20,
          data: [
            datas.chart.list[0]
              ? "城市人口 " + datas.chart.list[0] + " 万人"
              : "",
            datas.chart.list[1]
              ? "乡村人口 " + datas.chart.list[1] + " 万人"
              : "",
            datas.Num.townNum ? "行政村 " + datas.Num.townNum + " 个" : "",
            datas.Num.villageNum ? "乡村 " + datas.Num.villageNum + " 个" : "",
            datas.AverIncome.urbanAverIncome
              ? "城市收入 " + datas.AverIncome.urbanAverIncome + " 亿元"
              : "",
            datas.AverIncome.villageAverIncom
              ? "乡村收入 " + datas.AverIncome.villageAverIncom + " 亿元"
              : "",
            "01",
            "02",
            "03",
            "04",
            "05",
            "06"
          ],
          textStyle: {
            color: "#fft"
          }
        },
        series: [
          {
            name: "人口比例",
            type: "pie",
            clockWise: false,
            radius: [186, 200],
            center: ["50%", "50%"],
            itemStyle: this.dataStyle,
            hoverAnimation: false,
            startAngle: 90,
            label: {
              borderRadius: "10"
            },
            data: [
              {
                value: datas.chart.list[0],
                name: "城市人口 " + datas.chart.list[0] + " 万人",
                tooltip: {
                  show: datas.chart.list[0] != ""
                },
                itemStyle: {
                  normal: {
                    color: new ECharts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: this.color[0]
                      }
                    ])
                  }
                }
              },
              {
                value: datas.chart.list[1],
                name: "乡村人口 " + datas.chart.list[1] + " 万人",
                tooltip: {
                  show: datas.chart.list[1] != ""
                },
                itemStyle: {
                  normal: {
                    color: new ECharts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: this.color[1]
                      }
                    ])
                  }
                }
              }
            ]
          },
          {
            name: "城乡比例",
            type: "pie",
            clockWise: false,
            radius: [146, 160],
            center: ["50%", "50%"],
            itemStyle: this.dataStyle,
            hoverAnimation: false,
            startAngle: 90,
            data: [
              {
                value: datas.Num.townNum,
                name: "行政村 " + datas.Num.townNum + " 个",
                tooltip: {
                  show: datas.Num.townNum != ""
                },
                itemStyle: {
                  normal: {
                    color: new ECharts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: this.color[2]
                      }
                    ])
                  }
                }
              },
              {
                value: datas.Num.villageNum,
                name: "乡村 " + datas.Num.villageNum + " 个",
                tooltip: {
                  show: datas.Num.villageNum != ""
                },
                itemStyle: {
                  normal: {
                    color: new ECharts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: this.color[3]
                      }
                    ])
                  }
                }
              }
            ]
          },
          {
            name: "收入比例",
            type: "pie",
            clockWise: false,
            radius: [106, 120],
            center: ["50%", "50%"],
            itemStyle: this.dataStyle,
            hoverAnimation: false,
            startAngle: 90,
            data: [
              {
                value: 30,
                name: datas.AverIncome.urbanAverIncome
                  ? "城市收入 " + datas.AverIncome.urbanAverIncome + " 亿元"
                  : "",
                tooltip: {
                  show: datas.AverIncome.urbanAverIncome != ""
                },
                itemStyle: {
                  normal: {
                    color: new ECharts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: this.color[4]
                      }
                    ])
                  }
                }
              },
              {
                value: datas.AverIncome.villageAverIncom,
                name: datas.AverIncome.villageAverIncom
                  ? "乡村收入 " + datas.AverIncome.villageAverIncom + " 亿元"
                  : "",
                tooltip: {
                  show: datas.AverIncome.villageAverIncom != ""
                },
                itemStyle: {
                  normal: {
                    color: new ECharts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: this.color[5]
                      }
                    ])
                  }
                }
              }
            ]
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
  top: 90px;
  width: 100%;
  background-color: transparent;
  transition: all 0.5s linear;
}
</style>


