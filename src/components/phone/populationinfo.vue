<template>
  <div class="content-container pheadmesg">
    <div class="page-option auto-center" v-if="pagedata">
      <div class="data-title">
        <span class="data-title-text">{{pagedata.name}}总人口</span>
      </div>
      <div class="data-title-content">
        <div class="data-option">
          <h2>{{pagedata.option}}</h2>
          <span class="data-int">万人</span>
        </div>
        <div class="data-icon">
          <div class="data-icon-wrapper">
            <img :src="pageicon" class="popimg">
          </div>
        </div>
      </div>
    </div>
    <div class="page-chart-wrapper" v-if="pagedata">
      <div class="peoaver-wrapper absolutenode" v-if="pagedata.AverIncome">
        <div class="peoaver-section" v-if="pagedata.AverIncome.urban_ave_income">
          <p class="peoaver-title">城镇人均收入(元)</p>
          <p class="peoaver-int">{{pagedata.AverIncome.urban_ave_income}}</p>
        </div>
        <div class="peoaver-section" v-if="pagedata.AverIncome.village_ave_income">
          <p class="peoaver-title">农村人均收入(元)</p>
          <p class="peoaver-int">{{pagedata.AverIncome.village_ave_income}}</p>
        </div>
      </div>
      <chart :option="chartoption" :id="'peochart'"></chart>
      <div class="peonum-wrapper absolutenode" v-if="pagedata.Num">
        <div class="peonum-section" v-if="pagedata.Num.town_num">
          <p class="peonum-title">行政村(个)</p>
          <p class="peonum-int">{{pagedata.Num.town_num}}</p>
        </div>
        <div class="peonum-section" v-if="pagedata.Num.village_num">
          <p class="peonum-title">乡村(个)</p>
          <p class="peonum-int">{{pagedata.Num.village_num}}</p>
        </div>
      </div>
    </div>
    <div class="page-description auto-center" v-if="desc">
      <p class="page-description-content">{{desc}}</p>
    </div>
  </div>
</template>

<script>
import pageicon from "@/assets/imgicon/peoicon.png";
import mHead from "@/components/pubcomponent/head.vue";
import axios from "@/assets/api/axios";
import chart from "@/components/pubcomponent/chart.vue";
import ChartoOption from "@/assets/api/chart";
export default {
  name: "populationinfo",
  props: {
    ok: Boolean
  },
  data: function() {
    return {
      pagedata: null,
      pageicon: pageicon,
      desc: null,
      chartoption: null
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
            this.desc = res.data[0]['people'];
            this.setOption();
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
          town_num: data.town_num,
          village_num: data.village_num
        },
        AverIncome: {
          urban_ave_income: data.urban_ave_income,
          village_ave_income: data.village_ave_income
        },
        name: data.eq_name
      };
    },
    staPercent(child, parent) {
      return ((Number(child) / Number(parent)) * 100).toFixed(2);
    },
    setOption() {
      let data = this.pagedata.chart.list;
      let Chart = new ChartoOption("Pie", data, "peochart");
      this.chartoption = Chart.getsoption();
    }
  },
  components: {
    mHead,
    chart
  }
};
</script>

<style>
.popimg {
	width: 100%;
}
.absolutenode {
  position: absolute;
}
.absolutenode div {
  background-color: transparent;
}
.absolutenode p {
  margin: 0;
}
.peoaver-wrapper {
  width: 95%;
  top: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  justify-content: space-around;
}
p.peoaver-title {
  font-size: 13px;
  font-weight: 700;
  color: #424040;
}
p.peoaver-int {
  font-size: 15px;
  font-weight: 500;
  color: red;
}
.peonum-wrapper {
  width: 27%;
  left: 50%;
  background-color: transparent;
  display: flex;
  transform: translateX(-50%) translateY(-50%);
  justify-content: space-between;
  top: 50%;
}
p.peonum-title {
  font-size: 13px;
  font-weight: 700;
  color: #424040;
}
p.peonum-int {
  font-size: 15px;
  color: red;
}
/* .pheadmesg::before {
  font-size: 24px;
  height: 22px;
  padding-left: 54px;
  padding-top: 8px;
  line-height: 17px;
  font-weight: bold;
  text-align: center;
  content: "人口信息";
  position: absolute;
} */
</style>