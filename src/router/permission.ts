import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { getModule } from 'vuex-module-decorators';
import router from '.';
import utils from '@/utils/utils';
import request from '@/utils/axios';
import { GET_INFO_FROM_LOCAL } from '@/store/types';

/**
 * TODO注释
 */
router.beforeEach(async (to, from, next) => {
    console.log(to, from);
    const token = utils.getItem('token');
    NProgress.start();
    // const whiteList = ['/login']; // 取消白名单,使用路由元信息代替
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (token != null) {
            if (from.path === '/login') {
                next();
            } else {
                try {
                    const data = await request.getToken();
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
        if (to.name == null && to.path === '/') {
            next({ path: '/login', replace: true });
        }
        if (token != null) {
            // 手动刷新 或 从localhost:8080跳转
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
});

export default router;
