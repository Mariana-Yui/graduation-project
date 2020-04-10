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
const AdminList = () => import('@/components/User/Admin/index.vue');
const AllUsers = () => import('@/components/User/All/index.vue');
const Read = () => import('@/components/Article/Read/index.vue');
const Music = () => import('@/components/Article/Music/index.vue');
const Film = () => import('@/components/Article/Film/index.vue');
const Broadcast = () => import('@/components/Article/Broadcast/index.vue');
const WriteReadArticle = () => import('@/components/Article/Read/Release/index.vue');
const WriteMusicArticle = () => import('@/components/Article/Music/Release/index.vue');
const WriteFilmArticle = () => import('@/components/Article/Film/Release/index.vue');
const WriteBroadcastArticle = () => import('@/components/Article/Broadcast/Release/index.vue');
const ReadArticleList = () => import('@/components/Article/Read/List/index.vue');
const MusicArticleList = () => import('@/components/Article/Music/List/index.vue');
const FilmArticleList = () => import('@/components/Article/Film/List/index.vue');
const BroadcastArticleList = () => import('@/components/Article/Broadcast/List/index.vue');

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
        title: '首页',
        meta: {
            requiresAuth: true,
            icon: 'el-icon-menu',
            index: '1'
        },
        children: [
            {
                path: 'index',
                name: 'index',
                component: HomePage
            }
        ]
    },
    {
        path: '/users',
        name: 'Users',
        component: Dashboard,
        title: '人员管理',
        meta: {
            requiresAuth: true,
            icon: 'el-icon-s-custom',
            index: '2'
        },
        children: [
            {
                path: 'admin_list',
                name: 'adminlist',
                component: AdminList,
                title: '管理员列表',
                meta: {
                    role: ['admin'],
                    index: '2-1'
                }
            },
            {
                path: 'all_users',
                name: 'allusers',
                component: AllUsers,
                title: '总用户列表',
                meta: {
                    role: ['admin'],
                    index: '2-2'
                }
            }
        ]
    },
    {
        path: '/article',
        name: 'Article',
        component: Dashboard,
        title: '文章管理',
        meta: {
            requiresAuth: true,
            icon: 'el-icon-document',
            index: '3'
        },
        children: [
            {
                path: 'read',
                title: '阅读文章管理',
                component: Read,
                meta: {
                    index: '3-1'
                },
                children: [
                    {
                        path: 'write',
                        title: '发布文章',
                        component: WriteReadArticle,
                        meta: {
                            index: '3-1-1'
                        }
                    },
                    {
                        path: 'list',
                        title: '文章列表',
                        component: ReadArticleList,
                        meta: {
                            index: '3-1-2'
                        }
                    }
                ]
            },
            {
                path: 'music',
                title: '音乐文章管理',
                component: Music,
                meta: {
                    index: '3-2'
                },
                children: [
                    {
                        path: 'write',
                        title: '发布文章',
                        component: WriteMusicArticle,
                        meta: {
                            index: '3-2-1'
                        }
                    },
                    {
                        path: 'list',
                        title: '文章列表',
                        component: MusicArticleList,
                        meta: {
                            index: '3-2-2'
                        }
                    }
                ]
            },
            {
                path: 'film',
                title: '电影文章管理',
                component: Film,
                meta: {
                    index: '3-3'
                },
                children: [
                    {
                        path: 'write',
                        title: '发布文章',
                        component: WriteFilmArticle,
                        meta: {
                            index: '3-3-1'
                        }
                    },
                    {
                        path: 'list',
                        title: '文章列表',
                        component: FilmArticleList,
                        meta: {
                            index: '3-3-2'
                        }
                    }
                ]
            },
            {
                path: 'broadcast',
                title: '电台文章管理',
                component: Read,
                meta: {
                    index: '3-4'
                },
                children: [
                    {
                        path: 'write',
                        title: '发布文章',
                        component: WriteBroadcastArticle,
                        meta: {
                            index: '3-4-1'
                        }
                    },
                    {
                        path: 'list',
                        title: '文章列表',
                        component: BroadcastArticleList,
                        meta: {
                            index: '3-4-2'
                        }
                    }
                ]
            }
        ]
    },
    {
        path: '*',
        redirect: '/404',
        meta: {}
    }
];
