import { VuexModule, Module, Mutation } from 'vuex-module-decorators';
import { SET_UPLOAD_IMAGE_URL } from '../types';

@Module({
    namespaced: true,
    name: 'upload'
})
export default class Upload extends VuexModule {
    imgUrl = '';

    @Mutation
    public [SET_UPLOAD_IMAGE_URL](url: string) {
        this.imgUrl = url;
    }
}
