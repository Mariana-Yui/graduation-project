import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { getModule } from 'vuex-module-decorators';
import router, { ConstantRoutes, AsyncRoutes } from '.';
import utils from '@/utils/utils';
import request from '@/utils/axios';
import AdminModule from '@/store/modules/admin';
import PermissionModule from '@/store/modules/permission';
import store from '@/store';
import {
    GET_INFO_FROM_LOCAL,
    ADMIN_LOGOUT,
    SET_USER_ROLE,
    SET_DYNAMIC_ROUTES
} from '@/store/types';

const admin = getModule(AdminModule, store);
const permission = getModule(PermissionModule, store);

async function addDynamicRoutes() {
    try {
        const role = await permission[SET_USER_ROLE]();
        permission[SET_DYNAMIC_ROUTES]();
    } catch (error) {
        // 本地没有userInfo, 重新登录
        console.log(error);
        admin[ADMIN_LOGOUT]();
        router.push({ path: '/login' });
    }
}

/**
 * TODO 注释
 */
router.beforeEach(async (to, from, next) => {
    console.log(to, from);
    const token = utils.getItem('token');
    NProgress.start();
    const whiteList = ['/login']; // 免验证白名单
    // 不在路由中的统一跳转404
    if (whiteList.indexOf(to.path) === -1) {
        // 首次进入或手动刷新时重新添加动态路由
        if (permission.role === '') {
            await addDynamicRoutes();
        }
        if (token != null) {
            if (from.path === '/login') {
                next();
            } else {
                try {
                    const data = await request.getToken();
                    if (to.matched.some((record) => record.meta.requiresAuth)) {
                        next({ ...to, replace: true }); // 当前导航被中断,from实际上没有变
                    }
                    next();
                } catch (error) {
                    console.log(error);
                    next({ path: '/login', replace: true });
                }
            }
        } else {
            next({ path: '/login', replace: true });
        }
    } else {
        // if (to.name == null && to.path === '/') {
        //     next({ path: '/login', replace: true });
        // }
        if (token != null) {
            // 手动刷新
            if (from.name == null && from.path === '/') {
                try {
                    const data = await request.getToken();
                    next({ path: '/dashboard', replace: true });
                } catch (error) {
                    // console.log(error);
                }
            }
        } else {
            next();
        }
    }
});

router.afterEach((to, from) => {
    NProgress.done(true);
    NProgress.remove();
});

export default router;
