<template>
    <div class="dashboard-header">
        <el-menu menu-trigger="click" class="el-dashboard-menu" mode="horizontal">
            <div class="logo">
                <img :src="imgPath" class="logo-img" alt="" />
                <div class="logo-text">
                    <!-- <span class="logo-text-1">YUI</span> -->
                    <span class="logo-text-2">文章管理系统</span>
                </div>
            </div>
            <i :class="iconClass" @click="toggleMenu"></i>
            <el-submenu index="2" class="right">
                <template slot="title">{{ username }}</template>
                <el-menu-item index="profile" @click="handleOpenDialog">
                    {{ profile_text }}
                </el-menu-item>
                <el-menu-item index="logout" @click="handleLogout">{{ logout_text }} </el-menu-item>
            </el-submenu>
            <div class="avatar" :style="avatar"></div>
        </el-menu>
        <div class="line"></div>
        <profile-dialog ref="profileDialog"></profile-dialog>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import AdminModule from '@/store/modules/admin';
import MenuModule from '@/store/modules/menu';
import PermissionModule from '@/store/modules/permission';
import { ADMIN_LOGOUT, TOGGLE_MENU, CLEAR_PERMISSION_ROLE } from '@/store/types';
import ProfileDialog from './dialog.vue';
@Component({
    components: {
        ProfileDialog
    }
})
export default class DashboardHeader extends Vue {
    private admin: AdminModule;
    private menu: MenuModule;
    private permission: PermissionModule;
    private profile_text = '个人资料';
    private logout_text = '退出';
    private imgPath = require('@/assets/img/logo.png');
    private dialogFormVisible = false;
    get username() {
        return this.admin.userInfo.username || '';
    }
    get avatar() {
        return {
            'background-image': `url(${this.admin.userInfo.avatar})`
        };
    }
    get iconClass() {
        return this.menu.isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold';
    }
    public created() {
        this.admin = getModule(AdminModule, this.$store);
        this.menu = getModule(MenuModule, this.$store);
        this.permission = getModule(PermissionModule, this.$store);
    }
    public handleLogout() {
        this.admin[ADMIN_LOGOUT]();
        this.permission[CLEAR_PERMISSION_ROLE]();
        this.$router.push({ path: '/login' });
    }
    public handleOpenDialog() {
        (this.$refs['profileDialog'] as any).dialogFormVisible = true;
    }
    public toggleMenu() {
        this.menu[TOGGLE_MENU]();
    }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/css/font.scss';

.dashboard-header {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    flex-shrink: 0;
    flex-grow: 0;
    .logo {
        float: left;
        height: 60px;
        margin-left: 20px;
        display: flex;
        align-items: center;
        outline-style: none;
        cursor: pointer;
        .logo-img {
            height: 50px;
            margin-right: 10px;
        }
        .logo-text {
            .logo-text-1 {
                /* font-family: 'MamaLove'; */
                /* font-size: 30px; */
                display: inline-block;
                margin-top: 10px;
            }
            .logo-text-2 {
                font-family: 'MaShanZheng';
                font-size: 30px;
            }
        }
    }
    ::v-deep .el-icon-s-unfold,
    .el-icon-s-fold {
        font-size: 30px;
        margin-left: 15px;
        padding: 15px 15px;
        cursor: pointer;
        outline-style: none;
    }
    .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50% 50%;
        margin-top: 10px;
        background-size: cover;
    }
    ::v-deep .el-submenu__title {
        padding-left: 10px !important;
        padding-right: 40px !important;
        border-bottom: 0 !important;
    }
    .right,
    .avatar {
        float: right;
    }
}
</style>
