<template>
  <div class="ad">
    <img v-for="(item,index) in adList" :key="index" :src="item.imgUrl" alt="">
  </div>
</template>

<script>
export default {
    name:'Ad',
    props:{
      adList:Array
    }
}
</script>

<style scoped>
.ad {
    width: 100%;
    /* height: 112px; */
}
.ad img {
    width: 100%;
    height: 100%;
}
</style>