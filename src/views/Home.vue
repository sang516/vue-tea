<template>
  <div class="home">
    <div class="headers">
      <div class="headers-main">
        <Header></Header>
        <ly-tab
          v-model="selectedId"
          :items="items"
          :options="options"
          @change="changeTab"
        ></ly-tab>
      </div>
    </div>
    <section ref="wrapper">
      <div>
        <div v-for="(item, index) in newData" :key="index">
          <Swiper
            v-if="item.type == 'swiperList'"
            :swiperList="item.data"
          ></Swiper>
          <div @touchstart="touchStart" @touchend="touchEnd">
            <Icons
              v-if="item.type == 'iconsList'"
              :iconsList="item.data"
            ></Icons>
            <Recommend
              v-if="item.type == 'recommendList'"
              :recommendList="item.data"
            ></Recommend>
            <Ad v-if="item.type == 'adList'" :adList="item.data"></Ad>
            <Like v-if="item.type == 'likeList'" :likeList="item.data"></Like>
          </div>
        </div>
      </div>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script>
import BetterScroll from "better-scroll";
import http from '@/common/api/request';

import Header from "@/components/home/Header";
import Tabbar from "@/components/common/Tabbar";
import Swiper from "@/components/home/Swiper";
import Icons from "@/components/home/Icons";
import Recommend from "@/components/home/Recommend";
import Like from "@/components/home/Like";
import Ad from "@/components/home/Ad";
export default {
  props: {
    delta: {
      type: Number,
      default: 50,
    },
  },
  data() {
    return {
      selectedId: 0,
      items: [],
      newData: [],
      oBetterScroll: "",
      tBetterScroll: "",
      touchStartX: 0,
      touchStartY: 0,
      options: {
        activeColor: "#b0352f",
      },
    };
  },
  name: "Home",
  components: {
    Tabbar,
    Header,
    Swiper,
    Icons,
    Recommend,
    Like,
    Ad,
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      let res = await http.$axios({
        url:'/api/index_list/0/data/1',
      });
      this.items = Object.freeze(res.topBar);
      this.newData = Object.freeze(res.data);
      this.$nextTick(() => {
        this.oBetterScroll = new BetterScroll(this.$refs.wrapper, {
          movable: true,
          zoom: true,
          click:true
        });
      });
    },
    async addData(index) {
      let res = await http.$axios({
        url: "/api/index_list/" + index + "/data/1",
      });
      if (res.constructor != Array) {
        this.newData = res.data;
      } else {
        this.newData = res;
      }

      this.$nextTick(() => {
        this.tBetterScroll = new BetterScroll(this.$refs.wrapper, {
          movable: true,
          zoom: true,
          click:true
        });
      });
    },
    changeTab(item, index) {
      this.addData(index);
      this.selectedId = index;
    },
    touchStart(e) {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
    },
    touchEnd(e) {
      let deltaX = e.changedTouches[0].clientX - this.touchStartX;
      let deltaY = e.changedTouches[0].clientY - this.touchStartY;
      if (
        Math.abs(deltaX) > this.delta &&
        Math.abs(deltaX) > Math.abs(deltaY)
      ) {
        if (deltaX >= 0) {
          if (this.selectedId <= 0) return;
          // this.selectedId = this.selectedId <= 0 ? this.selectedId : this.selectedId - 1;
          this.selectedId -= 1;
          this.addData(this.selectedId);
        } else {
          if (this.selectedId >= 2) return;
          // this.selectedId = this.selectedId >= 2 ? this.selectedId : this.selectedId + 1;
          this.selectedId += 1;
          this.addData(this.selectedId);
        }
      }
    },
  },
};
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.headers {
  width: 100%;
  height: 108px;
}
.headers-main {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
}
section {
  flex: 1;
  overflow: hidden;
}
::v-deep .ly-tabbar {
  box-shadow: none;
  border-bottom: none;
}
</style>