<template>
  <div class="searchList">
    <div class="headers">
      <Header></Header>
      <ul>
        <li
          v-for="(item, index) in searchList.data"
          :key="index"
          @click="changeTab(index)"
        >
          <div :class="searchList.currentIndex == index ? 'active' : ''">
            {{ item.name }}
          </div>
          <div class="search-filter" v-if="index != 0">
            <i
              class="iconfont icon-arrow_up_fat"
              :class="item.status == 1 ? 'active' : ''"
            ></i>
            <i
              class="iconfont icon-arrow_down_fat"
              :class="item.status == 2 ? 'active' : ''"
            ></i>
          </div>
        </li>
      </ul>
    </div>
    <section>
      <ul v-if="goodsList.length">
        <li v-for="(item, index) in goodsList" :key="index">
          <img v-lazy="item.imgUrl" alt="" />
          <h3>{{ item.name }}</h3>
          <div class="price">
            <div>
              <span>￥</span>
              <b>{{ item.price }}</b>
            </div>
            <div>立即购买</div>
          </div>
        </li>
      </ul>
      <h1 v-else>暂无数据...</h1>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script>
import http from "@/common/api/request";

import Header from "@/components/search/Header.vue";
import Tabbar from "@/components/common/Tabbar.vue";
export default {
  data() {
    return {
      goodsList: [],
      searchList: {
        currentIndex: 0,
        data: [
          { name: "综合", key: "zh" },
          { name: "价格", status: 0, key: "price" },
          { name: "销量", status: 0, key: "num" },
        ],
      },
    };
  },
  computed: {
    orderBy() {
      let obj = this.searchList.data[this.searchList.currentIndex];
      let val = obj.status == "1" ? "asc" : "desc";
      return {
        [obj.key]: val,
      };
    },
  },
  components: {
    Header,
    Tabbar,
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      http
        .$axios({
          url: "/api/goods/shopList",
          params: {
            searchName: this.$route.query.key,
            ...this.orderBy,
          },
        })
        .then((res) => {
          this.goodsList = res;
        });
    },
    changeTab(index) {
      this.searchList.currentIndex = index;
      // let item = this.searchList.data[index];
      this.searchList.data.forEach((v, i) => {
        if (i != index) {
          v.status = 0;
        }
      });
      if (index == this.searchList.currentIndex) {
        this.searchList.data[index].status =
          this.searchList.data[index].status == 1 ? 2 : 1;
      }
      this.getData();
    },
  },
  
  watch: {
    $route() {
      this.getData();
    },
  },
};
</script>

<style scoped lang="less">
.searchList {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  ul {
    display: flex;
    justify-content: space-around;
    padding: 20px 0;
    font-size: 16px;
    li {
      display: flex;
      align-items: center;
    }
  }
}
.headers ul li > div {
  padding: 0 3px;
}
.search-filter {
  display: flex;
  flex-direction: column;
}
section {
  flex: 1;
  overflow: hidden;
}
section h1 {
  margin-top: 50px;
  text-align: center;
  font-size: 16px;
  font-weight: 200;
}
section ul {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
section ul li {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  width: 50%;
  padding: 10px;
}
section ul li h3 {
  width: 100%;
  font-weight: 400;
  font-size: 14px;
  color: #222;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
section ul li img {
  width: 170px;
  height: 170px;
}
section ul li img[lazy="loading"] {
  background-color: #f7f7f7;
}
section ul li .price {
  display: flex;
  width: 100%;
  padding: 10px 0;
  justify-content: space-between;
  font-size: 14px;
}
section ul li .price div:first-child span {
  font-size: 16px;
  color: #b0352f;
}
section ul li .price div:first-child b {
  color: #b0352f;
  font-size: 16px;
}
section ul li .price div:last-child {
  padding: 3px 6px;
  color: #fff;
  background-color: #b0352f;
  border-radius: 6px;
}
.active {
  color: red;
}
</style>