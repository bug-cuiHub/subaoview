<template>
  <div>
    <div class="his-list-box">
      <ul>
        <li class="main-articles-item" v-for="item in lists">
          <h2>
            <a>{{ item.address }}</a>
          </h2>
          <section class="main-articles-items-des">
            <p>
              <span>发布时间：{{ item.time }}</span>
              <!-- <span>发布时间：{{ item.time }}</span>
              <span>发布时间：{{ item.time }}</span> -->
            </p>
          </section>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: "hisList",
  data() {
    return {
      lists: [
        {
          time: 1976,
          address: "云南盈江"
        },
        {
          time: 1976,
          address: "青海杂多"
        },
        {
          time: 1976,
          address: "云南盈江"
        },
        {
          time: 1976,
          address: "青海杂多"
        },
        {
          time: 1976,
          address: "云南盈江"
        },
        {
          time: 1976,
          address: "青海杂多"
        },
        {
          time: 1976,
          address: "云南盈江"
        },
        {
          time: 1976,
          address: "青海杂多"
        },
        {
          time: 1976,
          address: "云南盈江"
        },
        {
          time: 1976,
          address: "青海杂多"
        },
        {
          time: 1976,
          address: "云南盈江"
        },
        {
          time: 1976,
          address: "青海杂多"
        }
      ]
    };
  }
};
</script>

<style scoped>
.his-list-box {
    position: absolute;
    left: 50%;
    top: 10%;
    margin-left: -250px;
}
.main-articles-item {
  list-style: none;
  width: 500px;
  height: 80px;
  border: 1px solid #c0c0c0;
  padding: 10px;
  margin-bottom: 10px;
  overflow: hidden;
}
.main-articles-item h2 {
  margin: 0;
  font-weight: normal;
  font-size: 24px;
  line-height: 40px;
}
.main-articles-items-des span {
  padding-right: 8px;
  color: #333;
  font-size: 14px;
}
@keyframes move {
  from {
    transform: translate(0px, 0);
  }
  to {
    transform: translate(50px, 0);
  }
}
.main-articles-item:hover {
  animation: move 1.8s;
  animation-fill-mode: forwards;
}
</style>