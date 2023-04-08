import { Indicator, Toast } from 'mint-ui';
import axios from 'axios';
import store from '@/store'
import router from '@/router';

export default {
    common: {
        method: 'GET',
        data: {},
        params: {},
        headers: {}
    },
    $axios(options) {
        options.timeout = 10 * 1000;
        options.method = options.method || this.common.method;
        options.data = options.data || this.common.data;
        options.params = options.params || this.common.params;
        options.headers = options.headers || this.common.headers;
        Indicator.open('加载中...');

        if (options.headers.token) {
            options.headers.token = store.state.user.token;
            if (!options.headers.token) {
                router.push('/login');
            }
        }
        return axios(options).then(v => {
            let data = v.data.data;
            // if (data.code == 1000) {
            //     Indicator.close();
            //     return router.push('/login');
            // }
            return new Promise((res, rej) => {
                if (!v) return rej();
                Indicator.close();
                res(data);
            })
        }, err => {
            if (err.request.readyState == 4 && err.request.status == 0) {
                Indicator.close();
                Toast("请求超时!");
            }
        });
    }
}