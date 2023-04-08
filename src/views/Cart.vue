<template>
  <div class="cart container">
    <header>
      <i class="iconfont icon-fanhui" @click="$router.back()"></i>
      <span>购物车</span>
      <span @click="isNavBar" v-text="isNavStatus ? '完成' : '编辑'"></span>
    </header>
    <section v-if="list.length">
      <div class="cart-title">
        <van-checkbox :value="isCheckedAll" @click="checkAllFn"></van-checkbox>
        <span>商品</span>
      </div>
      <ul>
        <li v-for="(item, index) in list" :key="index">
          <div class="check">
            <van-checkbox
              v-model="item.checked"
              @click="CHECK_ITEM(index)"
            ></van-checkbox>
          </div>
          <h2>
            <img :src="item.goods_imgUrl" alt="" />
          </h2>
          <div class="goods">
            <div class="goods-title">
              <span>{{ item.goods_name }}</span>
              <i
                class="iconfont icon-lajitong"
                @click="delGoodsFn(item.id)"
              ></i>
            </div>
            <div class="goods-price">¥{{ item.goods_price }}</div>
            <van-stepper
              @change="changeNum($event, item)"
              v-model="item.goods_num"
              integer
            />
          </div>
        </li>
      </ul>
    </section>
    <section v-else class="isNull">
      <div class="cue">购物车空空如也~</div>
      <router-link class="toHome" to="/home">点我去逛逛~</router-link>
    </section>
    <footer v-if="list.length">
      <div class="radio">
        <van-checkbox :value="isCheckedAll" @click="checkAllFn"></van-checkbox>
      </div>
      <div class="total" v-show="!isNavStatus">
        <div>
          共有 <span class="total-active">{{ total.num }}</span> 件商品
        </div>
        <div>
          <span>总计: </span>
          <span class="total-active"
            >￥{{ total.price.toFixed(2) }} + 0茶币</span
          >
        </div>
      </div>
      <div class="order" v-if="isNavStatus" @click="delGoodsFn">删除</div>
      <div class="order" v-else @click="goOrder">去结算</div>
    </footer>
  </div>
</template>
  
<script>
import http from "@/common/api/request";
import { mapMutations, mapGetters, mapState, mapActions } from "vuex";
import { Toast } from "mint-ui";
export default {
  name: "Cart",
  data() {
    return {
      isNavStatus: false,
    };
  },
  computed: {
    ...mapState({
      list: (state) => state.cart.list,
      selectList: (state) => state.cart.selectList,
    }),
    ...mapGetters(["isCheckedAll", "total"]),
    goodsList(){
      return this.selectList.map(id=>{
        return this.list.find(v=>v.id==id);
      })
    }
  },
  created() {
    this.getData();
  },
  methods: {
    ...mapMutations(["CART_LIST", "CHECK_ITEM","initOrder"]),
    ...mapActions(["checkAllFn", "delGoodsFn"]),
    async getData() {
      let res = await http.$axios({
        url: "/api/selectCart",
        headers: {
          token: true,
        },
      });
      if (res.success) {
        res.data.forEach((v) => {
          v["checked"] = true;
        });
        this.CART_LIST(res.data);
      } else {
        Toast(res.msg);
      }
    },
    isNavBar() {
      this.isNavStatus = !this.isNavStatus;
    },
    changeNum(value, item) {
      http
        .$axios({
          url: "/api/updateNum",
          method: "post",
          headers: {
            token: true,
          },
          data: {
            id: item.id,
            num: value,
          },
        })
        .then((res) => {
          if (!res.success) {
            Toast(res.msg);
          }
        });
    },
    goOrder() {
      if (!this.selectList.length) {
        Toast("至少选择一件商品");
        return;
      }

      let newList = [];
      this.list.forEach(item => {
        this.selectList.filter(
          (v => {
            if(v == item.id) {
              newList.push(item);
            }
          })
        );
      });

      http
        .$axios({
          url: "/api/addOrder",
          method: "post",
          headers: {
            token: true,
          },
          data: {
            arr: newList,
          },
        })
        .then((res) => {
          if(!res.success) return;
          this.initOrder(res.data);
          this.$router.push({
            path: "/order",
            query: {
              detail: JSON.stringify(this.selectList),
              goodsList:JSON.stringify(this.goodsList)
            },
          });
        });
    },
  },
};
</script>
  
<style scoped lang="less">
header {
  display: flex;
  justify-content: space-between;
  height: 44px;
  align-items: center;
  color: #fff;
  background-color: #b0352f;
  i {
    font-size: 22px;
    padding: 0 15px;
  }
  span {
    padding: 0 15px;
    font-size: 16px;
  }
}
section {
  background-color: #f5f5f5;
  .cart-title {
    display: flex;
    padding: 20px;
    span {
      padding: 0 15px;
      font-weight: 500;
      font-size: 18px;
    }
  }
  ul {
    display: flex;
    flex-direction: column;
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 20px;
      margin: 8px 0;
      background-color: #fff;
      .check {
        padding-right: 4px;
      }
      .goods {
        position: relative;
        display: flex;
        flex: 1;
        flex-direction: column;
        padding-left: 15px;
        font-size: 12px;
        .goods-title {
          display: flex;
          i {
            position: absolute;
            right: 0px;
            font-size: 22px;
          }
        }
        .goods-price {
          padding: 3px 0;
          color: #b0352f;
        }
        ::v-deep .van-stepper {
          text-align: right;
        }
      }
      img {
        width: 74px;
        height: 74px;
      }
    }
  }
}
.isNull {
  font-size: 14px;
  padding: 124px 35%;
  color: #a9a8a8;
  .cue {
    margin-bottom: 20px;
    width: 120px;
    height: 45px;
    line-height: 45px;
    text-align: center;
  }
  .toHome {
    border: 1px solid #ccc;
    font-size: 16px;
    border-radius: 10px;
    color: #000;
    background-color: greenyellow;
    display: block;
    text-align: center;
    line-height: 45px;
    width: 120px;
    height: 45px;
  }
}
footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 48px;
  border-top: 2px solid #ccc;
  .radio {
    padding: 0 15px;
  }
  .total {
    flex: 1;
    font-size: 12px;
    .total-active {
      color: #b0352f;
    }
  }
  .order {
    width: 3.2rem;
    line-height: 1.28rem;
    color: #fff;
    text-align: center;
    font-size: 0.426666rem;
    background-color: #b0352f;
  }
}
</style>