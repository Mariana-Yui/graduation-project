import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import CryptoJS from 'crypto-js';
import util from '@/utils/utils';
import request from '@/utils/axios';
import { WRITE_INFO_INTO_LOCAL, LOGIN_PASSPORT, GET_INFO_FROM_LOCAL } from '../types';
import config from '@/config/config.default';

@Module({
    namespaced: true,
    name: 'admin'
})
export default class Test extends VuexModule {
    token = '';
    _id = '';
    userInfo = {
        username: '',
        avatar: '',
        description: '',
        role: '',
        role_name: '',
        create_time: '',
        id: ''
    };
    @Mutation
    [WRITE_INFO_INTO_LOCAL](info: Record<string, any>) {
        const { token, _id, ...userInfo } = info;
        this.token = token;
        this._id = _id;
        this.userInfo = userInfo as any;
        // 写入localStorage
        util.setItem({ token, _id, userInfo });
    }
    @Mutation
    [GET_INFO_FROM_LOCAL]() {
        return new Promise((resolve, reject) => {
            if (this.userInfo.username.length > 0) {
                resolve(true);
                return;
            }
            const userInfo = util.getItem('userInfo');
            const token = util.getItem('token');
            const _id = util.getItem('_id');
            if (userInfo && token && _id) {
                this.userInfo = userInfo;
                this.token = token;
                this._id = _id;
                resolve(true);
            } else {
                reject(new Error('localStorage不存在userInfo'));
            }
        });
    }
    @Action
    async [LOGIN_PASSPORT](account: Record<string, any>) {
        const { username, password } = account;
        const key = config.secret_key;
        const encrypto = CryptoJS.MD5(password, key).toString();
        const data = await request.getToken(username, encrypto);
        data.code === 0 && this.context.commit(WRITE_INFO_INTO_LOCAL, data.info);
        return data;
    }
}
