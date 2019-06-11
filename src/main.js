import Vue from 'vue';

import 'stylus/main';

import router from './router/index';
import store from './store/index';

import App from 'App';

// Vue.prototype.$URL='/' // 定义请求地址(域名)-prod
// Vue.prototype.$URL='http://192.168.0.52:3333/'; // 定义请求地址(域名)-dev

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
