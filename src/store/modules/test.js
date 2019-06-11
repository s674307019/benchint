import { testAjax } from 'api/test'

export default {
    namespaced: true,
    state: {
        items: ['1'],
        num: 0
    },
    getters: {
    },
    mutations: {
        incrementM(state, payload) {
            const {num}=payload;
            state.num=state.num+num;
        },
        testAjaxM(state, payload) {
            testAjax(payload).then(res => {
                console.log(res);
            }).catch(err => {
                console.log('testAjaxM-Error', err);
            })
        }
    },
    actions: {
        incrementA({commit}, options) {
            commit('incrementM', options)
        },
        testAjaxA({commit}, options) {
            commit('testAjaxM', options)
        }
    }
}