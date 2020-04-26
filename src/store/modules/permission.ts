import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import {
    SET_DYNAMIC_ROUTES,
    SET_USER_ROLE,
    GENERATE_ROUTES,
    CLEAR_PERMISSION_ROLE
} from '../types';
import { RouteConfig } from 'vue-router';
import utils from '@/utils/utils';
import { ConstantRoutes, AsyncRoutes } from '@/router';

function hasPermission(role: string, route: RouteConfig) {
    if (
        route.meta == null ||
        route.meta.role == null ||
        (route.meta && route.meta.role.indexOf(role) > -1)
    ) {
        return true;
    }
    return false;
}

@Module({
    namespaced: true,
    name: 'permission'
})
export default class Permission extends VuexModule {
    dynamicRoutes: RouteConfig[] = [];
    addRoutes: RouteConfig[] = [];
    role = '';

    @Mutation
    public [CLEAR_PERMISSION_ROLE]() {
        this.role = '';
    }
    @Mutation
    public [SET_DYNAMIC_ROUTES](dynamicRoutes: any) {
        // 设置动态路由
        this.dynamicRoutes = ConstantRoutes.concat(dynamicRoutes);
        // 设置nav路由, 去除404
        this.addRoutes = dynamicRoutes.filter((route: any) => route.path !== '*');
    }
    @Mutation
    public [SET_USER_ROLE]() {
        return new Promise((resolve, reject) => {
            const localUserInfo = utils.getItem('userInfo');
            if (localUserInfo != null) {
                this.role = localUserInfo.role;
                resolve(this.role);
            } else {
                // reject(new Error('no userInfo'));
                reject();
            }
        });
    }
    @Action
    public [GENERATE_ROUTES]() {
        return new Promise((resolve) => {
            // 递归检验匹配路由
            const recursion = (asyncRoutesMap: any) => {
                const result: any[] = [];
                if (Array.isArray(asyncRoutesMap)) {
                    asyncRoutesMap.forEach((v: any) => {
                        if (hasPermission(this.role, v)) {
                            if (v.children && v.children.length > 0) {
                                v.children = recursion(v.children);
                            }
                            result.push(v);
                        }
                    });
                    return result;
                }
            };
            const generatedRoutes = recursion(AsyncRoutes);
            this.context.commit(SET_DYNAMIC_ROUTES, generatedRoutes);
            resolve(this.dynamicRoutes);
        });
    }
}
