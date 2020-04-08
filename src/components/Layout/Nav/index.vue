<template>
    <div class="nav-menu-wrapper">
        <el-menu default-active="1-4-1" class="el-article-menu-vertical" :collapse="isCollapse">
            <el-submenu index="1">
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span slot="title">导航一</span>
                </template>
                <el-menu-item-group>
                    <span slot="title">分组一</span>
                    <el-menu-item index="1-1">选项1</el-menu-item>
                    <el-menu-item index="1-2">选项2</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="分组2">
                    <el-menu-item index="1-3">选项3</el-menu-item>
                </el-menu-item-group>
                <el-submenu index="1-4">
                    <span slot="title">选项4</span>
                    <el-menu-item index="1-4-1">选项1</el-menu-item>
                </el-submenu>
            </el-submenu>
            <el-menu-item index="2">
                <i class="el-icon-menu"></i>
                <span slot="title">导航二</span>
            </el-menu-item>
            <el-menu-item index="3" disabled>
                <i class="el-icon-document"></i>
                <span slot="title">导航三</span>
            </el-menu-item>
            <el-menu-item index="4">
                <i class="el-icon-setting"></i>
                <span slot="title">导航四</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import MenuModule from '@/store/modules/menu';
@Component
export default class NavMenu extends Vue {
    private menu!: MenuModule;

    public created() {
        this.menu = getModule(MenuModule, this.$store);
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
