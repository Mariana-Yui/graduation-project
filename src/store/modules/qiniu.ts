import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import request from '@/utils/axios';
import { SET_UPTOKEN, SET_UPTOKEN_SYNC } from '../types';
import utils from '@/utils/utils';

@Module({
    namespaced: true,
    name: 'qiniu'
})
export default class Qiniu extends VuexModule {
    uptoken = '';

    @Mutation
    public [SET_UPTOKEN_SYNC](uptoken: string) {
        this.uptoken = uptoken;
    }
    @Action
    public async [SET_UPTOKEN]() {
        try {
            const { upToken: uptoken } = await request.getUpToken();
            this.context.commit(SET_UPTOKEN_SYNC, uptoken);
            utils.setItem('uptoken', uptoken);
        } catch (error) {
            console.log(error);
        }
    }
}
