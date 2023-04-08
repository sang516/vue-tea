<template>
  <div class="list">
    <header v-show="isShow">
      <div class="returns">
        <i class="iconfont icon-fanhui"></i>
      </div>
      <div class="search">
        <i class="iconfont icon-fangdajing"></i>
        <span>搜你喜欢的...</span>
      </div>
      <div class="go-home">
        <img src="@/assets/images/home.png" alt="" />
      </div>
    </header>
    <section>
      <div class="list-l" ref="left">
        <ul class="l-item">
          <li
            v-for="(item, index) in leftData"
            :key="index"
            :class="{ active: index == currentIndex }"
            @click="goScroll(index)"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
      <div class="list-r" ref="right">
        <div>
          <ul v-for="(item, index) in rightData" :key="index">
            <li class="shop-list" v-for="(k, i) in item" :key="i">
              <h2>{{ k.name }}</h2>
              <ul class="r-content">
                <li v-for="(j, idx) in k.list" :key="idx">
                  <img :src="j.imgUrl" alt="" />
                  <span>{{ j.name }}</span>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>
  
<script>
import BetterScroll from "better-scroll";
import Tabbar from "@/components/common/Tabbar.vue";
import http from "@/common/api/request";
import Search from "./Search.vue";
export default {
  name: "List",
  data() {
    return {
      isShow: true,
      leftData: [],
      rightData: [],
      leftBScroll: "",
      rightBScroll: "",
      allHeight: [],
      scrollY: "", //右侧滚动距离
    };
  },
  computed: {
    currentIndex() {
      return this.allHeight.findIndex((item, index) => {
        return this.scrollY >= item && this.scrollY < this.allHeight[index + 1];
      });
    },
  },
  components: {
    Tabbar,
    Search,
  },
  async created() {
    let res = await http.$axios({
      url: "/api/goods/list",
    });
    let leftArr = [];
    let rightArr = [];
    res.forEach((element) => {
      leftArr.push({
        id: element.id,
        name: element.name,
      });
      rightArr.push(element.data);
    });
    this.leftData = leftArr;
    this.rightData = rightArr;
    this.$nextTick(() => {
      new BetterScroll(this.$refs.left, {
        click: true,
      });
      this.rightBScroll = new BetterScroll(this.$refs.right, {
        click: true,
        probeType: 3,
        bounce: false,
      });
      let height = 0;
      this.allHeight.push(height);
      let uls = this.$refs.right.getElementsByClassName("shop-list");
      Array.from(uls).forEach((v) => {
        height += v.clientHeight;
        this.allHeight.push(height);
      });
      this.rightBScroll.on("scroll", (pos) => {
        this.scrollY = Math.abs(pos.y);
        if (Math.abs(pos.y) >= 50) {
          this.isShow = false;
        } else {
          this.isShow = true;
        }
      });
    });
  },
  methods: {
    goScroll(index) {
      this.rightBScroll.scrollTo(0, -this.allHeight[index], 300);
    },
  },
};
</script>
  
  <style scoped lang="less">
.list {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  section {
    display: flex;
    flex: 1;
    overflow: hidden;
  }
}
.list-l {
  width: 93px;
  background-color: #fff;
  border-right: 1px solid #cccccc;
  overflow: hidden;
  .l-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    li {
      width: 100%;
      padding: 3px 0;
      margin: 20px 0;
      text-align: center;
      font-size: 14px;
    }
    .active {
      color: #b54f4a;
      border-left: 6px solid #b54f4a;
    }
  }
}
.list-r {
  flex: 1;
  overflow: hidden;
  .shop-list {
    text-align: center;
    h2 {
      padding: 20px 0;
      font-size: 24px;
      font-weight: 400;
    }
    .r-content {
      display: flex;
      flex-wrap: wrap;
      li {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 33.33%;
        padding: 6px 0;
        img {
          width: 53px;
          height: 53px;
        }
        span {
          font-size: 16px;
        }
      }
    }
  }
}
header {
  display: flex;
  justify-content: space-between;
  height: 44px;
  align-items: center;
  background-color: #b0352f;
  .returns {
    line-height: 44px;
    padding: 0 20px;
    i {
      color: #fff;
      font-size: 26px;
    }
  }
  .search {
    display: flex;
    align-items: center;
    flex: 1;
    padding: 6px 10px;
    background-color: #fff;
    border-radius: 24px;
    i {
      padding-right: 6px;
      color: #666;
      font-size: 18px;
    }
    span {
      color: #666;
      font-size: 14px;
    }
  }
  .go-home {
    padding: 0 10px;
    padding-top: 6px;
    line-height: 44px;
    img {
      width: 24px;
      height: 24px;
    }
  }
}
::v-deep.tabbar {
  border-top: 1px solid #cccccc;
}
</style>