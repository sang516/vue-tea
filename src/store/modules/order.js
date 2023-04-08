import { INIT_ORDER } from './mutations.js';

export default {
    state: {
        list: [],
        order_id: localStorage.getItem('tea_orderId') || ''
    },
    getters: {},
    mutations: {
        [INIT_ORDER](state, orderId) {
            state.list = orderId;
            state.order_id = orderId[0].order_id;
            localStorage.setItem('tea_orderId', orderId[0].order_id);
        }
    },
    actions: {}
}