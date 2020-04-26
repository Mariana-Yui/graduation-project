import { VuexModule, Module, Mutation } from 'vuex-module-decorators';
import { TOGGLE_MENU, CHANGE_CURRENT_INDEX } from '../types';

@Module({
    namespaced: true,
    name: 'menu'
})
export default class Menu extends VuexModule {
    isCollapse = false;
    currentIndex = '1-1';

    @Mutation
    public [TOGGLE_MENU]() {
        this.isCollapse = !this.isCollapse;
    }
    @Mutation
    public [CHANGE_CURRENT_INDEX](curIndex: string) {
        this.currentIndex = curIndex;
    }
}
