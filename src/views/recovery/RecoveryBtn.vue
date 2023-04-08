<template>
  <div class="login container">
    <Header>
      <span>找回密码</span>
    </Header>
    <section>
      <div class="login-tel">
        <input
          type="password"
          v-model="userPwd"
          placeholder="请输入新密码"
          pattern="[0-9]*"
        />
      </div>
      <div class="login-btn" @click="submitBtn">确认修改</div>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>
    
    <script>
import Tabbar from "@/components/common/Tabbar.vue";
import Header from "@/views/login/Header.vue";
import http from "@/common/api/request";
import { Toast } from "mint-ui";
export default {
  data() {
    return {
        userPwd:'',
      rules: {
        userPwd: {
          rule: /^\w{6,12}$/,
          msg: "密码不能为空，且必须是6-12位",
        },
      },
    };
  },
  methods: {
    submitBtn() {
        if (!this.validate("userPwd")) return;
        http
        .$axios({
          url: "/api/recovery",
          method: "POST",
          data: {
            phone:this.$route.params.phone,
            pwd: this.userPwd,
          },
        }).then(res=>{
            if(res.success){
                Toast(res.msg);
                this.$router.push({
                    path:'/login'
                })
            }
        })
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
  components: {
    Tabbar,
    Header,
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