<template>
  <header>
    <div class="search-return" @click="goBack">
      <i class="iconfont icon-fanhui"></i>
    </div>
    <div class="search-main">
      <i class="iconfont icon-fangdajing"></i>
      <form action="" onsubmit="return false">
        <input type="search" placeholder="搜索您喜欢的产品......" v-model="searchVal" autofocus ref="myInput"/>
      </form>
    </div>
    <div class="search-btn" @click="goSearchList" @keyup.enter="goSearchList">搜索</div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      searchVal: this.$route.query.key || '',
      searchArr: []
    }
  },
  mounted(){
    window.addEventListener("touchmove",this.myTouchMove,true);
  },
  methods:{
    myTouchMove(){
      this.$refs.myInput.blur();
    },
    goBack(){
      this.$router.back();
    },
    goSearchList(){
      if(this.searchVal == '') return;
      if(!localStorage.getItem('searchList')){
        localStorage.setItem('searchList','[]');
      }else{
        this.searchArr = JSON.parse(localStorage.getItem('searchList'));
      }
      this.searchArr.unshift(this.searchVal);
      let newArr = new Set(this.searchArr);
      localStorage.setItem('searchList',JSON.stringify(Array.from(newArr)));
      if(this.searchVal === this.$route.query.key) return;
      this.$router.push({
        name:"list",
        query:{
          key:this.searchVal
        }
      })
    }
  }
};
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 44px;
  color: #fff;
  background-color: #b0352f;
}
.search-return,
.search-btn {
  padding: 0 10px;
}
.search-return i {
  font-size: 22px;
}
.search-btn {
  font-size: 16px;
}
.search-main {
  display: flex;
  align-items: center;
  width: 260px;
  height: 30px;
  border-radius: 12px;
  background-color: #FFFFFF;
}
.search-main form {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.search-main form input {
  width: 100%;
  font-size: 13px;
  color: #000;
}
.search-main i {
  padding: 0 10px;
  color: #666666;
}
</style>