<template>
  <div class="path-index container">
    <Header>
      <slot v-if="pathStatus">添加地址</slot>
      <slot v-else>修改地址</slot>
    </Header>
    <section>
      <section>
        <van-address-edit
          v-if="pathStatus"
          :area-list="areaList"
          show-set-default
          @save="onSave"
        />
        <van-address-edit
          v-else
          :address-info="AddressInfo"
          :area-list="areaList"
          show-delete
          show-set-default
          show-search-result
          @delete="onDelete"
          @save="onUpdate"
        />
      </section>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>
  
  <script>
import http from "@/common/api/request";
import Header from "@/components/path/Header.vue";
import Tabbar from "@/components/common/Tabbar.vue";
import { Toast } from "vant";
export default {
  data() {
    return {
      AddressInfo:{},
      pathStatus: false,
      areaList: {
        province_list: {
          110000: "北京市",
          120000: "天津市",
          130000: "广东省",
        },
        city_list: {
          110100: "北京市",
          120100: "天津市",
          130100: "广州市",
          130200: "深圳市",
          130300: "汕头市",
          130400: "潮州市",
        },
        county_list: {
          110101: "东城区",
          110102: "西城区",
          120101: "塘沽区",
          130101: "番禺区",
          130201: "南山区",
          130301: "潮阳区",
          130302: "潮南区",
          130303: "金平区",
          130401: "湘桥区",
        },
      }
    };
  },
  components: {
    Header,
    Tabbar,
  },
  created() {
    let key = JSON.parse(this.$route.params.key);
    if (key == "add") {
      this.pathStatus = true;
    }else{
      this.AddressInfo = key;
      this.AddressInfo.isDefault = this.AddressInfo.isDefault == 1 ? true:false;
    }
  },
  methods: {
    onSave(content) {
      content.isDefault = content.isDefault == true ? 1 : 0;
      http
        .$axios({
          url: "/api/addAddress",
          method: "post",
          headers: {
            token: true,
          },
          data: {
            ...content,
          },
        })
        .then((res) => {
          Toast(res.msg);
        });
    },
    onUpdate(content){
      content.isDefault = content.isDefault == true ? 1 : 0;
      http
        .$axios({
          url: "/api/updateAddress",
          method: "post",
          headers: {
            token: true,
          },
          data: {
            ...content,
          },
        })
        .then((res) => {
          Toast(res.msg);
        });
    },
    onDelete(content){
      http.$axios({
        url:'/api/deleteAddress',
        method:'post',
        headers:{
          token:true
        },
        data:{
          id:content.id
        }
      }).then(res=>{
        Toast(res.msg);
        this.$router.push('/path')
      })
    }
  },
};
</script>
  
  <style scoped lang="less">
section {
  background-color: #f7f7f7;
  .van-address-edit {
    padding: 0;
  }
  ::v-deep .van-address-edit__buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }
  ::v-deep .van-button--danger {
    width: 300px;
    height: 40px;
    background-color: #b0352f;
  }
  ::v-deep .van-button--default {
    width: 300px;
    height: 40px;
  }
}
::v-deep .tabbar {
  border-top: 2px solid #ccc;
}
</style>