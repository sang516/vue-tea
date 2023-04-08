<template>
  <div class="login container">
    <Header></Header>
    <section>
      <div class="login-tel">
        <input type="text" v-model="userTel" placeholder="请输入手机号" pattern="[0-9]*" />
      </div>
      <div class="login-code">
        <input type="text" v-model="LoginCode" placeholder="请输入短信验证码" pattern="[0-9]*"/>
        <button @click="sendCode" :disabled="disabled">{{ this.codeMsg }}</button>
      </div>
      <div class="login-btn" @click="login">登 录</div>
      <div class="tab">
        <span @click="goUserLogin">密码登录</span>
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
  data(){
    return {
      disabled:false,
      userTel:'',
      rules: {
        userTel: {
          rule: /^1[3456789]\d{9}$/,
          msg: "手机号不能为空，且必须是11位",
        }
      },
      LoginCode:'',
      code:'',
      codeNum:60,
      codeMsg:'获取短信验证码'
    }
  },
  components: {
    Tabbar,
    Header,
  },
  methods:{
    ...mapMutations(['USER_LOGIN']),
    goUserLogin(){
        this.$router.replace('/userLogin')
    },
    sendCode(){
      if (!this.validate("userTel")) return;
      http.$axios({
        url:'/api/code',
        method:'POST',
        data:{
          phone:this.userTel
        }
      }).then((res)=>{
        if(res.success){
          this.code = res.data;
        }
      })

      this.disabled = true;
      let timer = setInterval(()=>{
        --this.codeNum;
        this.codeMsg = `重新发送 ${this.codeNum}`
      },1000);
      setTimeout(()=>{
        clearInterval(timer);
        this.codeNum = 60;
        this.disabled = false;
        this.codeMsg = '获取短信验证码';
      },60000)
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
    login(){
      if (!this.validate("userTel")) return;
      if(this.code == this.LoginCode && this.code != ''){
        http.$axios({
          url:'/api/addUser',
          method:'POST',
          data:{
            phone:this.userTel
          }
        }).then(res=>{
          Toast(res.msg);
          if(!res.success) return;
          this.USER_LOGIN(res.data);
          this.LoginCode = '';
          this.userTel = '';
          this.$router.push('/my');
        })
      } 
    },
    goRegister(){
      this.$router.replace('/register');
    }
  }
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
  .login-code {
    display: flex;
    input {
      flex: 1;
    }
    button {
      padding: 0 20px;
      line-height: 44px;
      background-color: #b0352f;
      border: 0;
      color: #fff;
      border-radius: 6px;
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