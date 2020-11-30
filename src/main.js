import Vue from 'vue';
import App from './App.vue';
import router from './router';
import third_api from './third_api';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import ScrollLoader from 'vue-scroll-loader';


Vue.config.productionTip = false;
Vue.use(third_api);
Vue.use(Antd);
Vue.use(ElementUI);
Vue.use(ScrollLoader);


Vue.prototype.$common = {
    key: '',
    service: '',
    __title: '',
    set_title(... ts) {
        this.__title = ts.reduce((total, i)=>(total + ' - ' + i));
        this.update_title();
    },
    update_title() {
        document.title = this.__title + ` - third[${this.key}@${this.service}]`;
    }
};


new Vue({
    router,
    render: h => h(App),
}).$mount('#app');
