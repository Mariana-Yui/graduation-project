<template>
    <div class="nav-menu-wrapper">
        <el-menu
            default-active="1"
            class="el-article-menu-vertical"
            :collapse="isCollapse"
            :unique-opened="true"
        >
            <el-menu-item index="1">
                <i class="el-icon-menu"></i>
                <span>首页</span>
            </el-menu-item>
            <el-submenu index="2">
                <template slot="title">
                    <i class="el-icon-s-custom"></i>
                    <span slot="title">人员管理</span>
                </template>
                <el-menu-item index="2-1">总用户列表</el-menu-item>
                <el-menu-item index="2-2">管理员列表(仅admin可见)</el-menu-item>
            </el-submenu>
            <el-submenu index="3">
                <template slot="title">
                    <i class="el-icon-document"></i>
                    <span slot="title">文章管理</span>
                </template>
                <el-submenu index="3-1">
                    <template slot="title">阅读文章管理</template>
                    <el-menu-item index="3-1-1">发布文章</el-menu-item>
                    <el-menu-item index="3-1-2">文章列表</el-menu-item>
                </el-submenu>
                <el-submenu index="3-2">
                    <template slot="title">音乐文章管理</template>
                    <el-menu-item index="3-2-1">发布文章</el-menu-item>
                    <el-menu-item index="3-2-2">文章列表</el-menu-item>
                </el-submenu>
                <el-submenu index="3-3">
                    <template slot="title">电影文章管理</template>
                    <el-menu-item index="3-3-1">发布文章</el-menu-item>
                    <el-menu-item index="3-3-2">文章列表</el-menu-item>
                </el-submenu>
                <el-submenu index="3-4">
                    <template slot="title">电台文章管理</template>
                    <el-menu-item index="3-4-1">发布文章</el-menu-item>
                    <el-menu-item index="3-4-2">文章列表</el-menu-item>
                </el-submenu>
            </el-submenu>
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
