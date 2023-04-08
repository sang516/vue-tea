<template>
  <div class="order container">
    <header>
      <i class="iconfont icon-fanhui" @click="$router.back()"></i>
      <span>提交订单</span>
      <i class="iconfont icon-kefu"></i>
    </header>
    <section>
      <div class="path">
        <h3 class="path-title">收货信息</h3>
        <div class="path-content" @click="goPath">
          <div>
            <span>{{ path.name }}</span>
            <span>{{ path.tel }}</span>
          </div>
          <div>
            <span>{{ path.province }}</span>
            <span>{{ path.city }}</span>
            <span>{{ path.county }}</span>
            <span>{{ path.addressDetail }}</span>
          </div>
        </div>
        <div class="payment">
          <div class="payment-title">支付方式：</div>
          <van-radio-group v-model="radioPayment">
            <van-radio name="wx">微信支付</van-radio>
            <van-radio name="ali">支付宝支付</van-radio>
          </van-radio-group>
        </div>
      </div>
      <div class="goods">
        <ul>
          <li v-for="(item, index) in goodsList" :key="index">
            <div>
              <img :src="item.goods_imgUrl" alt="" />
            </div>
            <div class="goods-content">
              <h4>{{ item.goods_name }}</h4>
              <div class="goods-total">
                <span>￥{{ item.goods_price }}</span>
                <span>x{{ item.goods_num }}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
    <footer>
      <div class="order-total">
        <span>共</span>
        <b>{{ total.num }}</b>
        <span>件，</span>
        <span>总金额：</span>
        <em>￥{{ total.price }}</em>
      </div>
      <div class="order-topay" @click="goPayment">提交订单</div>
    </footer>
  </div>
</template>
<script>
import http from "@/common/api/request";
import { mapGetters, mapMutations, mapState } from "vuex";
import { Toast } from "vant";
import qs from "qs";
import bus from "@/common/bus.js";
export default {
  data() {
    return {
      radioPayment: "wx",
      path: {},
      item: [],
      goodsList: [],
      total: {
        price: 0,
        num: 0,
      },
    };
  },
  created() {
    this.goodsList = JSON.parse(this.$route.query.goodsList);
    this.selectAddress();
  },
  activated() {
    bus.$on(
      "selectPath",
      function (data) {
        this.path = JSON.parse(data);
      }.bind(this)
    );
    this.item = JSON.parse(this.$route.query.detail);
    this.goodsList = JSON.parse(this.$route.query.goodsList);
    this.selectOrder();
  },
  methods: {
    ...mapMutations(["initData", "initOrder"]),
    selectOrder() {
      http
        .$axios({
          url: "/api/selectOrder",
          method: "post",
          headers: {
            token: true,
          },
          data: {
            order_id: this.order_id,
          },
        })
        .then((res) => {
          this.initOrder(res.data);
          this.total.price = res.data[0].goods_price;
          this.total.num = res.data[0].goods_num;
        });
    },
    selectAddress() {
      http
        .$axios({
          url: "/api/selectAddress",
          headers: {
            token: true,
          },
        })
        .then((res) => {
          this.initData(res.data);
          if (this.defaultPath.length) {
            this.path = this.defaultPath[0];
          } else {
            this.path = res.data[0];
          }
        });
    },
    goPayment() {
      if (!this.path) return Toast("请填写收货地址");
      http
        .$axios({
          url: "/api/submitOrder",
          method: "post",
          headers: {
            token: true,
          },
          data: {
            orderId: this.order_id,
            shopArr: this.selectList,
          },
        })
        .then((res) => {
          console.log(res);
          let newArr = [];
          this.goodsList.forEach((v) => {
            newArr.push(v.goods_name);
          });
          let dataOrder = {
            orderId: this.order_id,
            name: newArr.join(""),
            price: this.total.price,
          };
          if (res.success) {
            http
              .$axios({
                url: "/api/payment",
                method: "post",
                headers: {
                  token: true,
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                data: qs.stringify(dataOrder),
              })
              .then((res) => {
                if (res.success) {
                  //打开支付宝支付的页面
                  window.location.href = res.paymentUrl;
                }
              });
          }
        });
    },
    goPath() {
      this.$router.push({
        path: "/path",
        query: {
          type: "select",
        },
      });
    },
  },
  computed: {
    ...mapState({
      order_id: (state) => state.order.order_id,
      selectList: (state) => state.cart.selectList,
    }),
    ...mapGetters(["defaultPath"]),
  },
};
</script>

<style lang='less' scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 44px;
  color: #fff;
  font-size: 16px;
  background-color: #b0352f;
  i {
    padding: 0 15px;
    font-size: 22px;
  }
  span {
    font-weight: 300;
    font-size: 18px;
  }
}
section {
  background-color: #f7f7f7;
  .path-title {
    padding: 15px;
    font-size: 16px;
  }
  .path-content {
    padding: 6px 15px;
    font-size: 14px;
    background-color: #ffffff;
    span {
      padding-right: 6px;
    }
  }
  .payment {
    padding: 6px 15px;
    margin-top: 15px;
    background-color: #ffffff;
    font-size: 16px;
    .van-radio-group {
      display: flex;
      padding: 6px 0;
      .van-radio {
        padding-right: 10px;
      }
    }
  }
  .goods {
    padding: 6px 15px;
    margin-top: 15px;
    background-color: #ffffff;
    font-size: 16px;
    ul {
      width: 100%;
      li {
        display: flex;
        width: 100%;
        margin-bottom: 12px;
        img {
          height: 74px;
          width: 74px;
        }
        .goods-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding-left: 15px;
          font-size: 14px;
          .goods-total {
            color: #b0352f;
            display: flex;
            justify-content: space-between;
          }
          h4 {
            font-weight: 400;
          }
        }
      }
    }
  }
}
footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 45px;
  border-top: 1px solid #ccc;
  .order-total {
    font-size: 16px;
    span {
      padding: 0 6px;
    }
    b {
      color: #b0352f;
    }
    em {
      font-size: 18px;
      color: #b0352f;
    }
  }
  .order-topay {
    width: 120px;
    line-height: 45px;
    color: #fff;
    font-size: 16px;
    text-align: center;
    background-color: #b0352f;
  }
}
</style>