<template>
  <div class="dashChat">
    <div class="dash-title">
      <!-- <span class="dash-title-text">震中海拔{{pagedata.option}}米</span> -->
      <span class="dash-title-text">海拔信息</span>
    </div>
    <div class="box">
      <chart :option="chartoption" :id="'envirchart'"></chart>
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
      xAxisMonth: [],
      barData: [],
      lineData: []
    };
  },
  created: function() {
    this.getEnvData();
  },
  methods: {
    getEnvData() {
      var setting = {
          method: "POST",
          url: "api/obtain/eqData"
        },
        data = {
          handel: "environment"
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
    //     option: parseInt(data.altitudeCenter) || parseInt(data.altitudeAverage),
    //     chart: {
    //       list: [
    //         parseInt(data.altitudeL),
    //         parseInt(data.altitudeAverage),
    //         parseInt(data.altitudeH)
    //       ]
    //     }
    //   };
    // },
    setOption(chartdata) {
      let that = this;
      let data = {
        chart: [
          {
            month: "最低海拔",
            value: chartdata.min_altitude
          },

          {
            month: "平均海拔",
            value: chartdata.ave_altitude
          },

          {
            month: "最高海拔",
            value: chartdata.max_altitude
          }
        ]
      };
      for (let i = 0; i < data.chart.length; i++) {
        that.xAxisMonth.push(data.chart[i].month);
        that.barData.push({
          name: that.xAxisMonth[i],
          value: data.chart[i].value
        });
        that.lineData.push({
          name: that.xAxisMonth[i]
        });
      }
      this.chartoption = {
        // backgroundColor: "#020d22",
        backgroundColor: "rgba(0,0,0,0)",
        title: "",
        grid: {
          top: "24%",
          left: "7%",
          bottom: "6%",
          containLabel: true
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "none"
          },
          formatter: function(params) {
            return (
              params[0]["data"].name +
              "<br/>" +
              params[1]["data"].value +
              "米" +
              "<br/>"
            );
          }
        },
        xAxis: [
          {
            type: "category",
            show: false,
            data: ["最低海拔", "平均海拔", "最高海拔"],
            axisLabel: {
              textStyle: {
                color: "#b6b5ab"
              }
            }
          },
          {
            type: "category",
            position: "bottom",
            data: that.xAxisMonth,
            boundaryGap: true,
            // offset: 40,
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: "#b6b5ab"
              }
            }
          }
        ],
        yAxis: [
          {
            show: true,
            offset: 52,
            splitLine: {
              show: false,
              lineStyle: {
                color: "rgba(255,255,255,0.2)"
              }
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: true
            },
            axisLabel: {
              show: true,
              color: "#b6b5ab"
            }
          },
          {
            show: false,
            type: "value",
            // name: "合格率(%)",
            nameTextStyle: {
              color: "#ccc"
            },
            axisLabel: {
              color: "#ccc"
            },
            splitLine: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            }
          }
        ],
        color: ["#e54035"],
        series: [
          {
            name: "海拔",
            type: "pictorialBar",
            xAxisIndex: 1,
            barCategoryGap: "-35%",
            // barCategoryGap: '-5%',
            symbol: 'path://d="M150 50 L130 130 L170 130  Z"',
            itemStyle: {
              normal: {
                color: function(params) {
                  let colorList = [
                    "rgba(13,177,205,0.8)",
                    "rgba(29,103,182,0.6)",
                    "rgba(13,177,205,0.8)",
                    "rgba(29,103,182,0.6)",
                    "rgba(13,177,205,0.8)",
                    "rgba(29,103,182,0.6)"
                  ];
                  return colorList[params.dataIndex];
                }
              },
              emphasis: {
                opacity: 1
              }
            },
            data: that.barData
          },
          {
            symbol:
              "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAvCAYAAABzJ5OsAAAGDUlEQVRogbWaPWxcRRDHf/fO92Ffgk2MrXygBEJACCiQkCgQcoPSIAVXoYCKFBRIKegpQJHSBokehIgoiBBFrEiAQuEKgoQiPiIQEIRANnFI7ODYvvP5fBQ74zdvb/e9y9keafV27+3Hf2ZnZmf2XYlulx2kClAFVqS9V57LO7mIUmmb4H2wO90/l7YLfru0LWYGAd8A1oF2dM4wFS1UB8oFc3sLbV/yMbD9kF1cd6EDNPtbuBh8BUiAVmacP09+21+kqN0XDSL5UuQZ+w2y4LqRp18fwalPVIWGckBWvIE+yJJXz2PKAg3VtV0y9TbOBgYCnwSA+4ATD7zPSAj8pgFui+1XokDqrlOx2oQkbIEnpsQYUICb5rkZ+C2kUnWp9xixL/kKbqu0Ywh44pWy97SMPQ78A9w2ADsGfEf6bRqwm/KbqlHTMJAhX/INUleVB7xsypCpPwncBO6QlbyCfQyYkz6dQMnbhULw2Xdx4EOmPCiLLRtGtK8u3hVwG15pm7plwNqFZaAsfYC4wYY8iwVeMeUO7nBpSFsZ0HEKXMG3cafoOnAMuAEsBDBYVQqS9SiNAAMxqU8CR3G6OIzzyS8DM8B9wMPAi8DzwCjwEHAROCnrjMi4FeB+w7Rv+BYLGKn74Ne9jpYBX+qTOCkq8HEB+ouA7QA/AX8BYzJmBjgF7DEMNHH6XyVVw5DnslSX+YI6H5K4gq4CNbISfwd4Hxe7q4dQr6WeZEOE0wLWgNPA18Cn0j6M80i/Sz+1Aav/yFM1ZCXvkFJGfJVRJurA2x7IESMZH3wLJ+khATkNXJL3i2S9loJWDFbC69KHEt2uH1P7qlI2gI+JhEZw278fp7Mdaasuqxoo+LYAX5N17uK807LU7wKr8r5Ferpa9+mHEwzJQr6+W10Lucgq8BZwXvo0BHxjCg6/Ac895YyWFqx/AVffhW9uOAkjoNoilBeAT2TeI8BvZFXXlzy43W0mIomiAEwZmDcMPC3jEplseAqOnIOTChygBtUT8Ox5eIV0Z4bdKxrAa6QqM0q+sWYoyXvpTXKY7A58Rurra0DtLJyouV3poQMwftoxXMP1qeJs4XtS9bxJ2FVaPCDhS0Ka4cc6an0f2Z24gjlpp+DgWHwuAI7DE2ZMWcCfM4CXcoD3UEzyscGx8Lc0FgmeLHXDYfQlD/CeAgxK5YTwnUroSP6B1OI/Bm6Zdnepj7yzFI7nIeBJIhgypMYWIj/LOYQzqC7wAc7oEiSwmoW5ecdQlL6Ea/QGYl8FGOorN02QozaHAS0jwIQsOIPb1iGcx2kBrTPweSt1uxm6DnPvwVXpq4FZGzhLNqL8L4cB+1snoTfV8iWuWz0vE6vkTgHP4NSlCazNwp9vwoUf4Q+dYAmWL8KVl5yq6UG0Jq+Pk4bFe4ED5BxKhurgJGd1VWMTO1CP6n9xJ+EIqdSmgcuYUGAWrs/C3+SfsGsyZp+Zaz9O7fpRoQrQ1MCsTjb102KzJQ3KxmWBhpRDpL69n9hmlTREWJGiO9I0zKhd6M6rcLeoKDCzybKfCWnGdAv4ELiAixSbEfDrMt/rAvYMaSyjgP10sAewJfXzvpvzt82CXyQb3t4GvsPlp9pnSfotSn0Jl3FtAI8C35JKegJ4hGwYHFIZrW8lTbEcNi+L0gjzKE5aa0h4gDO6j6RcJk1SpoFXSb1My5QJYXKBXumHdmDrMsyCt7e/NrrUE9Hqv2ZTkzjjrJLGOf3msJM4r+TreCgJj0g4BR+L64tuDypeu5/bg3Gc3i9wb7cHUfC973qZiN3bPAAcBH41fWxsMopTj2uGiXu9t6mRvakOgq+TJguD3piN4/z2z4QNfzNQt8At6B5dzwOvurtqgPsMWFvY7bvKKPV7P18KPEPhbSwDsmBit8Qh16ifeoLfrIoOKT15bdhgSS9KLWD/6YP36yEp+7cFQSqSfOh6OQ9k6LcYsCLQhTToBzUfXFG7KNGw7dA3sAiI/sHXSCPE7ByD00CSUyq6PbDUQm6qAgD6yYDyjLNC70VvIW3nO2zRx+Rdp536fB/9bhShHWF8t/574P/bY1d26X/PtooMr/p/9AAAAABJRU5ErkJggg==",
            symbolSize: 42,
            name: "海拔",
            type: "line",
            yAxisIndex: 1,
            data: that.lineData,
            itemStyle: {
              normal: {
                borderWidth: 5,
                color: {
                  colorStops: [
                    {
                      offset: 0,
                      color: "#821eff"
                    },
                    {
                      offset: 1,
                      color: "#204fff"
                    }
                  ]
                }
              }
            }
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

