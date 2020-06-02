import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Vcharts from 'v-charts';
import App from './App.vue';
import router from './router/permission';
import store from './store';
import rules from './utils/rules';

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(Vcharts);
Vue.use(rules);

new Vue({
    router,
    store,
    render: (h) => h(App)
}).$mount('#app');
