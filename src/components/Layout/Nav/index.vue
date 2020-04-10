<template>
    <div class="nav-menu-wrapper">
        <el-menu
            default-active="1"
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
import { Component, Vue } from 'vue-property-decorator';
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

    public created() {
        this.menu = getModule(MenuModule, this.$store);
        this.permission = getModule(PermissionModule, this.$store);
    }

    get isCollapse() {
        return this.menu.isCollapse || false;
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
