<template>
  <div class="detail">
    <header>
      <div class="header-returns" v-show="isShow">
        <i class="iconfont icon-fanhui" @click="goBack"></i>
        <i class="iconfont icon-shijian"></i>
      </div>
      <div class="header-bar" v-show="!isShow" :style="styleOption">
        <div>
          <i class="iconfont icon-fanhui"></i>
        </div>
        <div>
          <span>商品详情</span>
          <span>商品评价</span>
        </div>
        <div>
          <i class="iconfont icon-kefu" @click="goBack"></i>
        </div>
      </div>
    </header>
    <section ref="wrapper">
      <div>
        <div class="swiper-main">
          <swiper :options="swiperOption">
            <swiper-slide v-for="(item, index) in swiperList" :key="index">
              <img :src="item.imgUrl" alt="" />
            </swiper-slide>
          </swiper>
          <div class="swiper-pagination"></div>
        </div>
        <div class="goods-name">
          <h1>{{ goods.name }}</h1>
          <div>{{ goods.content }}</div>
        </div>
        <div class="goods-price">
          <div class="oprice">
            <span>￥</span>
            <b>{{ goods.price }}</b>
          </div>
          <div class="pprice">
            <span>价格:</span>
            <del>￥245</del>
          </div>
        </div>
      </div>
    </section>

    <footer>
      <div class="add-cart" @click="addCart">加入购物车</div>
      <div>立即购买</div>
    </footer>
  </div>
</template>

<script>
import http from "@/common/api/request";
import BetterScroll from "better-scroll";
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import { Toast } from 'mint-ui';
export default {
  data() {
    return {
      id:'',
      goods:{},
      styleOption: {},
      BetterScroll: "",
      isShow: true,
      swiperOption: {
        autoplay: 3000,
        speed: 1000,
        pagination: {
          el: ".swiper-pagination",
          type: "fraction",
        },
      },
      swiperList: [
        {
          imgUrl: "./images/goods1.jpg",
        },
        {
          imgUrl: "./images/goods2.jpg",
        },
        {
          imgUrl: "./images/goods3.jpg",
        },
      ],
    };
  },
  components: {
    swiper,
    swiperSlide,
  },
  created() {
    this.id = this.$route.query.id;
    this.getData();
  },
  mounted() {
    this.BetterScroll = new BetterScroll(this.$refs.wrapper, {
      probeType: 3,
      bounce: false,
      click: true,
    });
    this.BetterScroll.on("scroll", (pos) => {
      let posY = Math.abs(pos.y);
      let opacity = posY / 180;
      opacity = opacity > 1 ? 1 : opacity;
      this.styleOption = {
        opacity: opacity,
      };
      if (posY >= 50) {
        this.isShow = false;
      } else {
        this.isShow = true;
      }
    });
  },
  activated(){
    if(this.id != this.$route.query.id){
      this.getData();
      this.id = this.$route.query.id;
    }
  },
  methods: {
    async getData() {
      let id = this.$route.query.id;
      let res = await http.$axios({
        url: "/api/goods/id",
        params:{
          id
        },
      });
      this.goods = res;
    },
    goBack(){
      this.$router.back();
    },
    addCart(){
      let id = this.$route.query.id;
      http.$axios({
        url: "/api/addCart",
        method:'post',
        data:{
          goodsId:id
        },
        headers:{
          token:true
        }
      }).then(res=>{
        if(res.success){
          Toast(res.msg);
        }
      });
    }
  },
};
</script>

<style scoped lang="less">
.detail {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
section {
  flex: 1;
  overflow: hidden;
}
header {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 44px;
  z-index: 999;
  .header-returns {
    width: 100%;
    height: 44px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    i {
      margin: 0 20px;
      width: 34px;
      height: 34px;
      color: #fff;
      text-align: center;
      line-height: 34px;
      background-color: rgba(0, 0, 0, 0.3);
      border-radius: 50%;
      font-size: 26px;
    }
  }
  .header-bar {
    background-color: #fff;
    width: 100%;
    height: 44px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    span {
      padding: 0 10px;
    }
    i {
      padding: 0 18px;
      font-size: 22px;
    }
  }
}
.swiper-main {
  position: relative;
  width: 100%;
  height: 375px;
}
.swiper-container {
  width: 100%;
  height: 375px;
}
.swiper-pagination {
  width: 100%;
  bottom: 10px;
  text-align: right;
  color: #ffffff;
  font-size: 16px;
}
::v-deep.swiper-pagination-fraction,
.swiper-pagination-custom,
.swiper-container-horizontal > .swiper-pagination-bullets {
  left: -20px;
}
.swiper-container img {
  width: 100%;
  height: 375px;
}
.goods-name {
  padding: 20px 10px;
  border-bottom: 1px solid #cccccc;
  h1 {
    font-size: 20px;
    font-weight: 500;
  }
  div {
    padding: 3px 0;
    font-size: 14px;
    color: #999999;
  }
}
.goods-price {
  padding: 20px 10px;
  .oprice {
    color: red;
    span {
      font-size: 12px;
    }
  }
  .pprice {
    color: #999999;
    font-size: 14px;
  }
}
footer {
  display: flex;
  position: fixed;
  justify-content: center;
  align-items: center;
  bottom: 0;
  left: 0;
  height: 49px;
  width: 100%;
  border-top: 1px solid #cccccc;
  background-color: #fff;
  div {
    width: 50%;
    line-height: 49px;
    font-size: 16px;
    text-align: center;
    color: #fff;
    background-color: red;
    &.add-cart {
      background-color: #ff9500;
    }
  }
}
</style>