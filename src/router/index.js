import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

/**
 * 路由懒加载
 * component: () => import('Organization/Login')
 * 其中 webpackChunkName: 'login' ---> Webpack 会将任何一个异步模块与相同的块名称组合到相同的异步块中
 */

// import Login from 'Organization/Login';

export default new Router({
    // mode: 'history',
    scrollBehavior: () => ({x: 0, y: 0}),
    linkActiveClass: 'activeStyle',
    routes: [
        {
            path: '/test',
            name: 'test',
            component: () => import(/* webpackChunkName: 'view' */ 'View/Test'),
            meta: {
                title: 'test'
            }
        },
        {
            path: '/',
            redirect: '/test'
        }
    ]
});
