<template>
  <div class="login container">
    <Header>
      <span>注册</span>
    </Header>
    <section>
      <div class="login-tel">
        <input
          type="text"
          v-model="userTel"
          placeholder="请输入手机号"
          pattern="[0-9]*"
        />
      </div>
      <div class="login-code">
        <input
          type="text"
          v-model="LoginCode"
          placeholder="请输入短信验证码"
          pattern="[0-9]*"
        />
        <button @click="sendCode" :disabled="disabled">
          {{ this.codeMsg }}
        </button>
      </div>
      <div class="login-tel">
        <input type="text" v-model="userPwd" placeholder="请设置密码" />
      </div>
      <div class="login-btn" @click="register">注 册</div>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>
  
  <script>
import http from "@/common/api/request";
import Tabbar from "@/components/common/Tabbar.vue";
import Header from "@/views/login/Header.vue";
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      disabled: false,
      userTel: "",
      userPwd: "",
      rules: {
        userTel: {
          rule: /^1[3456789]\d{9}$/,
          msg: "手机号不能为空，且必须是11位",
        },
        userPwd: {
          rule: /^\w{6,12}$/,
          msg: "密码不能为空，且必须是6-12位",
        }
      },
      LoginCode: "",
      code: "",
      codeNum: 60,
      codeMsg: "获取短信验证码",
    };
  },
  components: {
    Tabbar,
    Header,
  },
  methods: {
    goUserLogin() {
      this.$router.replace("/userLogin");
    },
    sendCode() {
      if (!this.validate("userTel")) return;
      http
        .$axios({
          url: "/api/code",
          method: "POST",
          data: {
            phone: this.userTel,
          },
        })
        .then((res) => {
          if (res.success) {
            this.code = res.data;
          }
        });
      this.disabled = true;
      let timer = setInterval(() => {
        --this.codeNum;
        this.codeMsg = `重新发送 ${this.codeNum}`;
      }, 1000);
      setTimeout(() => {
        clearInterval(timer);
        this.codeNum = 6;
        this.disabled = false;
        this.codeMsg = "获取短信验证码";
      }, 60000);
    },
    register() {
      if (!this.validate("userPwd")) return;
      if (this.code == this.LoginCode) {
        http
          .$axios({
            url: "/api/register",
            method: "POST",
            data: {
              phone: this.userTel,
              pwd: this.userPwd,
            },
          })
          .then((res) => {
            if (!res.success) {
              Toast(res.msg);
            }
            else{
                Toast(res.msg)
            }
          });
      } else {
        Toast("验证码有误");
        return;
      }
    },
    validate(key) {
      let bool = true;
      if (!this.rules[key].rule.test(this[key])) {
        Toast(this.rules[key].msg);
        bool = false;
        return bool;
      }
      return bool;
    },
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
}
</style>