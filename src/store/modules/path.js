import { INIT_DATA } from './mutations.js';

export default {
    state: {
        list: []
    },
    getters: {
        defaultPath(state) {
            return state.list.filter(v => {
                return v.isDefault == 1;
            })
        }
    },
    mutations: {
        [INIT_DATA](state, arr) {
            state.list = arr;
        }
    },
    actions: {}
}