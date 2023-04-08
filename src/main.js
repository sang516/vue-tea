import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import MintUI from 'mint-ui'
import store from "./store"

import '@/assets/css/common.css'
import '@/assets/css/iconfont.css'
import 'mint-ui/lib/style.css'

Vue.use(MintUI)

import LyTab from 'ly-tab'
Vue.use(LyTab)

//淘宝无线适配
import '@/assets/js/flexible'

//全局引入vant 
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);

import fastclick from 'fastclick'
fastclick.attach(document.body);

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')