<template>
    <div class="nav-menu-wrapper">
        <el-menu
            :default-active="curIndex"
            class="el-article-menu-vertical"
            :collapse="isCollapse"
            :unique-opened="true"
        >
            <template v-if="permission.addRoutes && permission.addRoutes.length">
                <menu-item
                    v-for="route of permission.addRoutes"
                    :key="route.name"
                    :route="route"
                ></menu-item>
            </template>
        </el-menu>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import MenuModule from '@/store/modules/menu';
import PermissionModule from '@/store/modules/permission';
import MenuItem from './menuItem.vue';

@Component({
    components: {
        MenuItem
    }
})
export default class NavMenu extends Vue {
    private menu!: MenuModule;
    private permission!: PermissionModule;
    private curIndex!: string;

    get isCollapse() {
        return this.menu.isCollapse || false;
    }
    public created() {
        this.menu = getModule(MenuModule, this.$store);
        this.permission = getModule(PermissionModule, this.$store);
        this.changeCurIndex();
    }
    @Watch('$route')
    onUrlChanged(to: any, from: any) {
        this.changeCurIndex();
    }
    private changeCurIndex() {
        const pathArray = this.$route.path.split('/').filter((v: string) => v !== '');
        const addRoutes = this.permission.addRoutes;
        const index = this.getCurIndex(addRoutes, pathArray);
        this.curIndex = index;
    }
    // 递归获取index
    public getCurIndex(addRoutes: any[], pathArray: any[]): string {
        for (let i = 0, len = addRoutes.length; i < len; i++) {
            if ((addRoutes[i].path as string).indexOf(pathArray[0]) > -1) {
                pathArray.shift();
                if (
                    Array.isArray(addRoutes[i].children) &&
                    addRoutes[i].children.length > 0 &&
                    pathArray.length > 0
                ) {
                    return this.getCurIndex(addRoutes[i].children, pathArray);
                } else {
                    return addRoutes[i].meta.index;
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.el-article-menu-vertical {
    height: 100% !important;
    /* 不包括el-menu--collapse,否则fold动画失效 */
    &:not(.el-menu--collapse) {
        width: 300px;
    }
}
</style>
