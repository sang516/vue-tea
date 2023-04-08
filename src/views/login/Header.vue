<template>
  <header>
    <div>
      <i class="iconfont icon-fanhui" @click="goBack"></i>
    </div>
    <div>
      <slot>
        <span>登录</span>
      </slot>
    </div>
    <div>
      <i class="iconfont icon-kefu"></i>
    </div>
  </header>
</template>

<script>
export default {
  methods:{
    goBack(){
      this.$router.back();
    }
  }
};
</script>

<style scoped lang="less">
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 44px;
  font-size: 16px;
  color: #fff;
  background-color: #b0352f;
  i {
    padding: 0 15px;
    font-size: 22px;
  }
  span {
    font-size: 16px;
    font-weight: 200;
  }
}
</style>