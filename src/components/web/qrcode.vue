<template>
    <div class="qrcode-box">
      <div id="qrcode"></div>
    </div>
</template>

<script>
import QRCode from "qrcodejs2";
export default {
  name: "qrcode",
  data() {
    return {};
  },
  mounted() {
    this.qrcode();
  },
  methods: {
    qrcode() {
      let qrcode = new QRCode("qrcode", {
        width: 300,
        height: 300,
        text: this.$store.getters.getpublishUri, // 二维码地址
        colorDark: "#000",
        colorLight: "#fff"
      });
    }
  }
};
</script>

<style>
.qrcode-box {
  background-color: #000;
  position: relative;
}
#qrcode {
  display: inline-block;
  position: absolute;
  margin-left: -150px;
  margin-top: -150px;
  left: 50%;
  top: 50%;
}
#qrcode img {
  background-color: #fff;
  padding: 6px;
}
</style>
