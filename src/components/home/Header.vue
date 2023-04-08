<template>
  <header>
    <h1>
        <img src="@/assets/images/logo.png" alt="">
    </h1>
    <div class="search" @click="goSearch">
        <i class="iconfont icon-fangdajing"></i>
        <span>
            搜您喜欢的......
        </span>
    </div>
    <div class="kefu">
        <i class="iconfont icon-kefu"></i>
    </div>
  </header>
</template>

<script>
export default {
    methods:{
        goSearch(){
            this.$router.push('/search');
        }
    }
}
</script>

<style scoped>
    header {
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 100%;
        height: 60px;
        background-color: #b0352f;
    }
    header h1 {
        padding: 0 10px;
        width: 120px;
        height: 50px;
    }
    header h1 img {
        width: 100%;
        height: 100%;
    }
    .search {
        display: flex;
        align-items: center;
        /* width: 200px; */
        flex: 1;
        height: 30px;
        background-color: #FFFFFF;
        border-radius: 12px;
    }
    .search i {
        padding: 0 6px;
        color: #ccc;
    }
    .search span {
        font-size: 14px;
        color: #ccc;
    }
    .kefu i{
        font-size: 36px;
        color: #fff;
    }
</style>