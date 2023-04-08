<template>
  <div class="search-index container">
    <Header></Header>
    <section>
      <div class="search-history">
        <h2>
          <i class="iconfont icon-shijian"></i>
          <span>历史搜索</span>
          <span @click="deleteStorage">清空历史记录</span>
        </h2>
        <ul v-if="searchArr.length != 0">
          <li v-for="(item, index) in searchArr" :key="index" @click="goSearchList(item)">{{ item }}</li>
        </ul>
        <div v-else>暂无搜索记录</div>
      </div>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script>
import Tabbar from "@/components/common/Tabbar";
import Header from "@/components/search/Header";
import { MessageBox } from "mint-ui";
export default {
  data() {
    return {
      searchArr: [],
    };
  },
  components: {
    Tabbar,
    Header,
  },
  created() {
    this.searchArr = JSON.parse(localStorage.getItem('searchList')) || [];
  },
  methods: {
    deleteStorage() {
      MessageBox({
        title: "提示",
        message: "确定删除?",
        showCancelButton: true,
      }).then((res) => {
        if (res == 'confirm') {
          localStorage.removeItem('searchList');
          this.searchArr = [];
        }
      });
    },
    goSearchList(item) {
      this.$router.push({
        name:"list",
        query:{
          key:item
        }
      })
    }
  },
};
</script>

<style scoped>
.search-index {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
section {
  flex: 1;
  background-color: #f5f5f5;
  overflow: hidden;
}
.search-history div {
  padding: 10px 20px;
  font-size: 12px;
  font-weight: 200;
}
.search-history h2 {
  position: relative;
  padding: 20px;
  font-size: 14px;
  font-weight: 400;
}
.search-history h2 span:last-child {
  position: absolute;
  right: 20px;
}
.search-history h2 i {
  color: red;
  padding-right: 3px;
  font-size: 18px;
}
.search-history ul {
  display: flex;
  flex-wrap: wrap;
  padding: 0 10px;
}
.search-history ul li {
  font-size: 12px;
  margin: 10px;
  padding: 3px 6px;
  border: 1px solid #ccc;
}
</style>