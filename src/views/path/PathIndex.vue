<template>
  <div class="path-index container">
    <Header>
      <slot>我的地址</slot>
    </Header>
    <section>
      <ul v-if="list.length">
        <li @click="goList(item)" v-for="(item, index) in list" :key="index">
          <div>
            <span>{{ item.name }}</span>
            <span>{{ item.tel }}</span>
          </div>
          <div>
            <span class="active" v-if="item.isDefault == 1">[默认]</span>
            <span
              >{{ item.privice }} {{ item.city }} {{ item.county }}
              {{ item.addressDetail }}</span
            >
          </div>
        </li>
      </ul>
      <div class="a" v-else>暂无数据</div>
      <div class="add-path" @click="goList('add')">添加地址</div>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script>
import http from "@/common/api/request";
import Header from "@/views/login/Header.vue";
import Tabbar from "@/components/common/Tabbar.vue";
import { mapState, mapMutations } from "vuex";
import bus from '@/common/bus.js';
export default {
  data(){
    return {
      pathStatus:false
    }
  },
  components: {
    Header,
    Tabbar,
  },
  created() {
    if(this.$route.query.type == 'select'){
      this.pathStatus = true
    }
    this.getData();
  },
  computed: {
    ...mapState({
      list: (state) => state.path.list,
    }),
  },
  methods: {
    ...mapMutations(["initData"]),
    goList(option) {

      if(this.pathStatus){
        bus.$emit('selectPath',JSON.stringify(option));
        this.$router.back();
        return;
      }

      this.$router.push({
        name: "path-list",
        params:{
          key:JSON.stringify(option)
        }
      });
    },
    getData() {
      http
        .$axios({
          url: "/api/selectAddress",
          headers: {
            token: true,
          },
        })
        .then((res) => {
          this.initData(res.data);
        });
    },
  },
};
</script>

<style scoped lang="less">
section {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f7f7f7;
  ul {
    width: 100%;
    display: flex;
    flex-direction: column;
    li {
      padding: 10px 15px;
      margin: 6px 0;
      background-color: #ffffff;
      span {
        padding-right: 15px;
        font-size: 16px;
        font-weight: 300;
      }
    }
  }
  .add-path {
    margin-top: 30px;
    width: 120px;
    height: 40px;
    font-size: 16px;
    text-align: center;
    line-height: 40px;
    border-radius: 8px;
    color: #ffffff;
    background-color: #b0352f;
  }
  .active {
    color: #b0352f;
  }
  .a {
    margin-top: 20px;
    width: 120px;
    height: 45px;
    font-size: 16px;
    color:#b6b2b2;
    line-height: 45px;
    text-align: center;
  }
}
::v-deep .tabbar {
  border-top: 2px solid #ccc;
}
</style>