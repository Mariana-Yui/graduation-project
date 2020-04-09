import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import { SET_DYNAMIC_ROUTES, SET_USER_ROLE } from '../types';
import { RouteConfig } from 'vue-router';
import utils from '@/utils/utils';

@Module({
    namespaced: true,
    name: 'permission'
})
export default class Permission extends VuexModule {
    dynamicRouter: RouteConfig[] = [];
    role = '';

    @Mutation
    public [SET_DYNAMIC_ROUTES]() {
        // TODO 设置动态路由
    }
    @Mutation
    public [SET_USER_ROLE]() {
        return new Promise((resolve, reject) => {
            const localUserInfo = utils.getItem('userInfo');
            if (localUserInfo != null) {
                this.role = localUserInfo.role;
                resolve(this.role);
            } else {
                reject(new Error('no userInfo'));
            }
        });
    }
}
