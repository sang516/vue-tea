<template>
  <div class="login container">
    <Header></Header>
    <section>
      <div class="login-tel">
        <input type="text" v-model="userTel" placeholder="请输入手机号" pattern="[0-9]*" />
      </div>
      <div class="login-tel">
        <input type="password" v-model="userPwd" placeholder="请输入密码" />
      </div>
      <div class="login-btn" @click="login">登 录</div>
      <div class="tab">
        <span @click="goLogin">短信登录</span>
        <span @click="goRecovery">找回密码</span>
        <span @click="goRegister">快速注册</span>
      </div>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>
  
<script>
import http from '@/common/api/request';
import Tabbar from "@/components/common/Tabbar.vue";
import Header from "@/views/login/Header.vue";
import { Toast } from 'mint-ui'
import {mapMutations} from 'vuex';
export default {
  data() {
    return {
      userTel: '',
      userPwd: '',
      rules: {
        userTel: {
          rule: /^1[3456789]\d{9}$/,
          msg: "手机号不能为空，且必须是11位",
        },
        userPwd: {
          rule: /^\w{6,12}$/,
          msg: "密码不能为空，且必须是6-12位",
        },
      },
    };
  },
  components: {
    Tabbar,
    Header,
  },
  methods: {
    ...mapMutations(['USER_LOGIN']),
    login() {
      if (!this.validate("userTel")) return;
      if (!this.validate("userPwd")) return;
      http.$axios({
        url:'/api/login',
        method:'POST',
        data:{
          userTel:this.userTel,
          userPwd:this.userPwd
        }
      }).then(res=>{
        Toast(res.msg);
        if(!res.success){
          return;
        }else {
          this.USER_LOGIN(res.data)
          this.$router.push('/my');
        }
      })
    },
    goLogin() {
      this.$router.push("/login");
    },
    validate(key) {
        let bool = true;
        if(!this.rules[key].rule.test(this[key])){
            Toast(this.rules[key].msg);
            bool = false;
            return bool;
        }
        return bool;
    },
    goRegister(){
      this.$router.replace('/register');
    },
    goRecovery(){
      this.$router.replace('/recovery');
    }
  },
};
</script>
  
<style scoped lang="less">
section {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  background-color: #f5f5f5;
  div {
    margin: 10px 0;
    width: 335px;
    height: 44px;
  }
  input {
    box-sizing: border-box;
    padding: 0 10px;
    line-height: 44px;
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-radius: 6px;
  }
  .login-tel {
    margin-top: 30px;
    input {
      width: 335px;
    }
  }
  .login-btn {
    color: #fff;
    line-height: 44px;
    text-align: center;
    font-size: 18px;
    background-color: #b0352f;
    border-radius: 6px;
  }
  .tab {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
  }
}
</style>