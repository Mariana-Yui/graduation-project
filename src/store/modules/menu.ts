import { VuexModule, Module, Mutation } from 'vuex-module-decorators';
import { TOGGLE_MENU } from '../types';

@Module({
    namespaced: true,
    name: 'menu'
})
export default class Menu extends VuexModule {
    isCollapse = false;

    @Mutation
    public [TOGGLE_MENU]() {
        this.isCollapse = !this.isCollapse;
    }
}
