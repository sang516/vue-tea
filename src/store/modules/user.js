import { USER_LOGIN, INIT_USER, LOGIN_OUT } from './mutations.js'
import { Dialog } from 'vant';

export default {
    state: {
        loginStatus: false,
        token: null,
        userInfo: {}
    },
    getters: {

    },
    mutations: {
        [USER_LOGIN](state, user) {
            state.loginStatus = true;
            state.token = user.token;
            state.userInfo = {...user, pwd: '' };
            localStorage.setItem('userInfo', JSON.stringify(user));
        },
        [INIT_USER](state) {
            let userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (userInfo) {
                state.loginStatus = true;
                state.token = userInfo.token;
                state.userInfo = userInfo;
            }
        },
        [LOGIN_OUT](state) {
            Dialog.confirm({
                message: '确定要退出吗？',
            }).then(() => {
                state.loginStatus = false;
                state.token = null;
                state.userInfo = {};
                localStorage.removeItem('userInfo');
            });
        }
    },
    actions: {

    }
}