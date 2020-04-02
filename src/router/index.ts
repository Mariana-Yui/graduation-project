import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

// 路由懒加载
const Login = () => import('@/views/Login/index.vue');
const Dashboard = () => import('@/views/Dashboard/index.vue');

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: {
            requiresAuth: true
        }
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router;
