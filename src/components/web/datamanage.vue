<template>
  <div class="webBox">
    <div style="padding: 20px;width: 1254px;">
      <Card :bordered="false">
        <div slot="title" style="height: 40px;line-height: 40px;">
          <Icon type="ios-construct" size="30" />
          <span style="font-size:20px;margin-left:20px;font-weight:900;">数据管理</span>
        </div>
        <div class="data_table mainAll">
          <Col span="1" style="margin-left: 200px;position: absolute;top: 20px;">
            <DatePicker
              @on-change="te()"
              v-model="time"
              type="daterange"
              placement="bottom-end"
              placeholder="选择日期"
              style="width: 350px"
              size="large"
            ></DatePicker>
          </Col>
          <div @click="getPushData()" style="position: absolute;top: 16px;right: 35px;">
            <Button type="info" ghost>全部数据</Button>
          </div>
          <Table border :columns="columns1" :data="showPushData" @on-row-click="changeProvInfo"></Table>
          <div style="position: absolute;bottom: -5px;height: 50px;width: 100%;">
            <nav style="text-align: center;">
              <Page
                :total="this.num_data"
                show-total
                :page-size="page_size"
                @on-change="changePage"
              />
            </nav>
          </div>
        </div>
      </Card>
    </div>
    <div style="margin-left: -15px;">
      <div style="padding: 20px;width: 454px;margin-top: 0px;">
        <Card :bordered="false">
          <div slot="title" style="height: 40px;line-height: 40px;">
            <span style="font-size:20px;margin-left:20px;font-weight:900;">{{position}}地震统计</span>
          </div>
          <div style="height: 290px">
            <p
              style="font-size: 18px;font-weight:500;line-height:35px;letter-spacing: 1px"
            >&nbsp;&nbsp;&nbsp;&nbsp;2019年里，{{position}}共发生3级以上地震{{total_data_1.now_time_all}}次，其中3.0到3.9级共{{total_data_1.now_time_3}}次，4.0到4.9级共{{total_data_1.now_time_4}}次，5.0到5.9级共{{total_data_1.now_time_5}}次，6.0到6.9级共{{total_data_1.now_time_6}}次，7.0级以上共{{total_data_1.now_time_7}}次。</p>
            <p
              style="font-size: 18px;font-weight:500;line-height:35px;letter-spacing: 1px"
            >&nbsp;&nbsp;&nbsp;&nbsp;2020年里，{{position}}共发生3级以上地震{{total_data_1.past_time_all}}次，其中3.0到3.9级共{{total_data_1.past_time_3}}次，4.0到4.9级共{{total_data_1.past_time_4}}次，5.0到5.9级共{{total_data_1.past_time_5}}次，6.0到6.9级共{{total_data_1.past_time_6}}次，7.0级以上共{{total_data_1.past_time_7}}次。</p>
          </div>
        </Card>
      </div>
      <div style="padding: 20px;width: 454px;margin-top: 3px;">
        <Card :bordered="false">
          <div slot="title" style="height: 40px;line-height: 40px;">
            <span style="font-size:20px;margin-left:20px;font-weight:900;">全国地震统计</span>
          </div>
          <div style="height: 290px">
            <p
              style="font-size: 18px;font-weight:500;line-height:35px;letter-spacing: 1px"
            >&nbsp;&nbsp;&nbsp;&nbsp;2019年里，全国共发生3级以上地震{{total_data_2.now_time_all}}次，其中3.0到3.9级共{{total_data_2.now_time_3}}次，4.0到4.9级共{{total_data_2.now_time_4}}次，5.0到5.9级共{{total_data_2.now_time_5}}次，6.0到6.9级共{{total_data_2.now_time_6}}次，7.0级以上共{{total_data_2.now_time_7}}次。</p>
            <p
              style="font-size: 18px;font-weight:500;line-height:35px;letter-spacing: 1px"
            >&nbsp;&nbsp;&nbsp;&nbsp;2020年里，全国共发生3级以上地震{{total_data_2.past_time_all}}次，其中3.0到3.9级共{{total_data_2.past_time_3}}次，4.0到4.9级共{{total_data_2.past_time_4}}次，5.0到5.9级共{{total_data_2.past_time_5}}次，6.0到6.9级共{{total_data_2.past_time_6}}次，7.0级以上共{{total_data_2.past_time_7}}次。</p>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
import ajax from "axios";
import pub from "@/assets/pubFile.json";
export default {
  name: "datamanage",
  data: function () {
    return {
      time: null,
      num_data: 151,
      totalPushData: [],
      showPushData: [],
      page_size: 13,
      position: "",
      total_data_1: {
        now_time_all: "",
        now_time_3: "",
        now_time_4: "",
        now_time_5: "",
        now_time_6: "",
        now_time_7: "",
        past_time_all: "",
        past_time_3: "",
        past_time_4: "",
        past_time_5: "",
        past_time_6: "",
        past_time_7: "",
      },
      total_data_2: {
        now_time_all: "",
        now_time_3: "",
        now_time_4: "",
        now_time_5: "",
        now_time_6: "",
        now_time_7: "",
        past_time_all: "",
        past_time_3: "",
        past_time_4: "",
        past_time_5: "",
        past_time_6: "",
        past_time_7: "",
      },
      columns1: [
        {
          title: "发震时刻",
          key: "eq_time",
          width: 290,
          align: "center",
        },
        {
          title: "纬度(°)",
          key: "latitude",
          width: 100,
          align: "center",
        },
        {
          title: "经度(°)",
          key: "longitude",
          width: 100,
          align: "center",
        },
        {
          title: "震级(M)",
          key: "magnitude",
          width: 100,
          align: "center",
        },
        {
          title: "深度(千米)",
          key: "depth",
          width: 130,
          align: "center",
        },
        {
          title: "位置",
          key: "fullName",
          width: 360,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "div",
                {
                  attrs:{
                    style:"text-align: left",
                  },
                },
                this.showPushData[params.index]["fullName"]
              ),
            ]);
          },
        },
        {
          title: "操作",
          key: "operation",
          align: "center",
          width: 100,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    size: "default",
                    type: "info",
                    ghost: "",
                  },
                  on: {
                    click: () => {
                      this.goWeb(params.index);
                    },
                  },
                },
                "查看"
              ),
            ]);
          },
        },
      ],
    };
  },
  mounted() {
    this.getPushData();
  },
  methods: {
    changeProvInfo(res){
      console.log(res)
      this.analysisPushData(res["ID"])
    },
    te() {
      let d1 = new Date(this.time[0]);
      let datetime1 =
        d1.getFullYear() + "-" + (d1.getMonth() + 1) + "-" + d1.getDate();
      let d2 = new Date(this.time[1]);
      let datetime2 =
        d2.getFullYear() + "-" + (d2.getMonth() + 1) + "-" + d2.getDate();
      ajax({
        method: "post",
        url: "http://" + pub.ip + "/subaoApi/public/api/obtain/query_date",
        data: {
          start: datetime1,
          end: datetime2,
        },
      })
        .then((res) => {
          console.log(res.data);
          this.num_data = res.data.length;
          this.totalPushData = res.data;
          let indexPushData = [];
          this.totalPushData.map((data, index) => {
            if(data["eq_time"]){
              data["eq_time"] = data["eq_time"].substring(0,4)+"年"+data["eq_time"].substring(5,7)+"月"+data["eq_time"].substring(8,10)+"日 "+data["eq_time"].substring(11,13)+"时"+data["eq_time"].substring(14,16)+"分"+data["eq_time"].substring(17,19)+"秒"
            }
          });
          this.totalPushData.slice(0, this.page_size).map((data, index) => {
            data["latitude"] = parseFloat(data["latitude"]).toFixed(2);
            data["longitude"] = parseFloat(data["longitude"]).toFixed(2);
            indexPushData.push(data);
          });
          // indexPushData.map((data, index) => {
          //   data["eq_time"] = data["eq_time"].substring(0,4)+"年"+data["eq_time"].substring(5,7)+"月"+data["eq_time"].substring(8,10)+"日 "+data["eq_time"].substring(11,13)+"时"+data["eq_time"].substring(14,16)+"分"+data["eq_time"].substring(17,19)+"秒"
          // });
          this.showPushData = indexPushData;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //获取推送的数据
    getPushData() {
      ajax({
        method: "get",
        url: "http://" + pub.ip + "/subaoApi/public/api/obtain/getPushData",
      })
        .then((res) => {
          this.num_data = res.data.length;
          this.totalPushData = res.data;
          let indexPushData = [];
          this.totalPushData.map((data, index) => {
            if(data["eq_time"]){
              data["eq_time"] = data["eq_time"].substring(0,4)+"年"+data["eq_time"].substring(5,7)+"月"+data["eq_time"].substring(8,10)+"日 "+data["eq_time"].substring(11,13)+"时"+data["eq_time"].substring(14,16)+"分"+data["eq_time"].substring(17,19)+"秒"
            }
          });
          this.totalPushData.slice(0, this.page_size).map((data, index) => {
            data["latitude"] = parseFloat(data["latitude"]).toFixed(2);
            data["longitude"] = parseFloat(data["longitude"]).toFixed(2);
            indexPushData.push(data);
          });
          // indexPushData.map((data, index) => {
          //   data["eq_time"] = data["eq_time"].substring(0,4)+"年"+data["eq_time"].substring(5,7)+"月"+data["eq_time"].substring(8,10)+"日 "+data["eq_time"].substring(11,13)+"时"+data["eq_time"].substring(14,16)+"分"+data["eq_time"].substring(17,19)+"秒"
          // });
          this.showPushData = indexPushData;
          console.log(this.showPushData)
          this.analysisPushData(this.showPushData[0]["ID"]);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //分页——切换页面
    changePage(index) {
      let start_index = (index - 1) * this.page_size;
      let end_index = index * this.page_size;
      let indexPushData = [];
      this.totalPushData.slice(start_index, end_index).map((data, index) => {
        data["latitude"] = parseFloat(data["latitude"]).toFixed(2);
        data["longitude"] = parseFloat(data["longitude"]).toFixed(2);
        indexPushData.push(data);
      });
      console.log(this.totalPushData.slice(start_index, end_index))
      // indexPushData.map((data, index) => {
      //   data["eq_time"] = data["eq_time"].substring(0,4)+"年"+data["eq_time"].substring(5,7)+"月"+data["eq_time"].substring(8,10)+"日 "+data["eq_time"].substring(11,13)+"时"+data["eq_time"].substring(14,16)+"分"+data["eq_time"].substring(17,19)+"秒"
      // });
      this.showPushData = indexPushData;
    },
    //查看跳转
    goWeb(index) {
      let routeUrl = this.$router.resolve({
        path: "/webHome/" + this.showPushData[index]["ID"] + "/cthd",
      });
      window.open(routeUrl.href, "_blank");
    },
    //发布数据统计
    analysisPushData(param_id) {
      let id = param_id;
      ajax({
        method: "post",
        url:
          "http://" + pub.ip + "/subaoApi/public/api/obtain/analysisPushData",
        data: {
          ID: id,
        },
      })
        .then((res) => {
          this.position = res.data[0];
          this.total_data_1.now_time_all = res.data[1]["past"]["time_all"];
          this.total_data_1.now_time_3 = res.data[1]["past"]["time_3"];
          this.total_data_1.now_time_4 = res.data[1]["past"]["time_4"];
          this.total_data_1.now_time_5 = res.data[1]["past"]["time_5"];
          this.total_data_1.now_time_6 = res.data[1]["past"]["time_6"];
          this.total_data_1.now_time_7 = res.data[1]["past"]["time_7"];
          this.total_data_1.past_time_all = res.data[1]["now"]["time_all"];
          this.total_data_1.past_time_3 = res.data[1]["now"]["time_3"];
          this.total_data_1.past_time_4 = res.data[1]["now"]["time_4"];
          this.total_data_1.past_time_5 = res.data[1]["now"]["time_5"];
          this.total_data_1.past_time_6 = res.data[1]["now"]["time_6"];
          this.total_data_1.past_time_7 = res.data[1]["now"]["time_7"];
          this.position = res.data[0];
          this.total_data_2.now_time_all = res.data[2]["past"]["time_all"];
          this.total_data_2.now_time_3 = res.data[2]["past"]["time_3"];
          this.total_data_2.now_time_4 = res.data[2]["past"]["time_4"];
          this.total_data_2.now_time_5 = res.data[2]["past"]["time_5"];
          this.total_data_2.now_time_6 = res.data[2]["past"]["time_6"];
          this.total_data_2.now_time_7 = res.data[2]["past"]["time_7"];
          this.total_data_2.past_time_all = res.data[2]["now"]["time_all"];
          this.total_data_2.past_time_3 = res.data[2]["now"]["time_3"];
          this.total_data_2.past_time_4 = res.data[2]["now"]["time_4"];
          this.total_data_2.past_time_5 = res.data[2]["now"]["time_5"];
          this.total_data_2.past_time_6 = res.data[2]["now"]["time_6"];
          this.total_data_2.past_time_7 = res.data[2]["now"]["time_7"];
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  components: {},
};
</script>

<style>
.webBox {
  position: relative;
  width: 100%;
  height: 100%;
  background: #efedf3;
  display: flex;
}
.data_table {
  height: 725px;
  /* font-size: 18px; */
}
.mainAll /deep/ * {
  font-size: 18px !important;
  font-weight: 500;
}
</style>