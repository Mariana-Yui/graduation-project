import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

interface VueRouterWithMatch extends VueRouter {
    matcher: any;
    $addRoutes: Function;
}

Vue.use(VueRouter);

// 路由懒加载
const Login = () => import('@/views/Login/index.vue');
const Dashboard = () => import('@/views/Dashboard/index.vue');
const HomePage = () => import('@/components/Main/index.vue');
const NotFound = () => import('@/components/404/index.vue');
const AdminList = () => import('@/components/User/admin.vue');
const AllUsers = () => import('@/components/User/total.vue');
const ReadArticle = () => import('@/components/Article/Publish/read.vue');
const MusicArticle = () => import('@/components/Article/Publish/music.vue');
const FilmArticle = () => import('@/components/Article/Publish/film.vue');
const BroadcastArticle = () => import('@/components/Article/Publish/broadcast.vue');
const ArticleLists = () => import('@/components/Article/List/index.vue');

export const ConstantRoutes = [
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/404',
        name: 'notfound',
        component: NotFound
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: ConstantRoutes
}) as VueRouterWithMatch;

router.$addRoutes = function(params: RouteConfig[]) {
    this.matcher = (new VueRouter({ mode: 'history' }) as VueRouterWithMatch).matcher;
    this.addRoutes(params);
};

export default router;

export const AsyncRoutes = [
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        redirect: '/dashboard/index',
        meta: {
            requiresAuth: true
        },
        children: [
            {
                path: 'index',
                name: 'index',
                component: HomePage
            },
            {
                path: 'admin_list',
                name: 'adminlist',
                component: AdminList
            },
            {
                path: 'all_users',
                name: 'allusers',
                component: AllUsers
            },
            {
                path: 'create_read_article',
                name: 'createreadarticle',
                component: ReadArticle
            },
            {
                path: 'create_music_article',
                name: 'createmusicarticle',
                component: MusicArticle
            },
            {
                path: 'create_film_article',
                name: 'createfilmarticle',
                component: FilmArticle
            },
            {
                path: 'create_broadcast_article',
                name: 'createbroadcastarticle',
                component: BroadcastArticle
            },
            {
                path: /[read|music|film|broadcast]_article_list/,
                name: 'articlelist',
                component: ArticleLists
            }
        ]
    },
    {
        path: '*',
        redirect: '/404',
        meta: {}
    }
];
