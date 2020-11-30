import Vue from 'vue';
import Router from 'vue-router';
import test from '@/views/test';
import list from '@/views/list';
import seed from '@/views/seed';
import config from '@/views/config';


Vue.use(Router);


export default new Router({
    routes: [
        {
            path: '/',
            component: list
        },
        {
            path: '/test',
            component: test
        },
        {
            path: '/list',
            component: list
        },
        {
            path: '/seed',
            component: seed,
        },
        {
            path: '/config',
            component: config,
        },
    ]
});

