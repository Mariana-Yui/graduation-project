<template>
    <div class="dashboard-header">
        <el-menu menu-trigger="click" class="el-dashboard-menu" mode="horizontal">
            <div class="logo">
                <img :src="imgPath" class="logo-img" alt="" />
                <div class="logo-text">
                    <span class="logo-text-1">YUI</span>
                    <span class="logo-text-2">:文章管理系统</span>
                </div>
            </div>
            <el-submenu index="2" class="right">
                <template slot="title">{{ username }}</template>
                <el-menu-item index="profile">{{ profile_text }} </el-menu-item>
                <el-menu-item index="logout">{{ logout_text }} </el-menu-item>
            </el-submenu>
            <div class="avatar"></div>
        </el-menu>
        <div class="line"></div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import AdminModule from '@/store/modules/admin';
@Component
export default class DashboardHeader extends Vue {
    private adminModule: AdminModule;
    private profile_text = '个人信息';
    private logout_text = '退出';
    private imgPath = require('@/assets/img/logo.png');
    get username() {
        return this.adminModule.userInfo.username || '我是一个杀手';
    }
    public created() {
        this.adminModule = getModule(AdminModule, this.$store);
    }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/css/font.scss';
.dashboard-header {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    .logo {
        float: left;
        height: 60px;
        margin-left: 20px;
        display: flex;
        align-items: center;
        .logo-img {
            height: 50px;
            margin-right: 10px;
        }
        .logo-text {
            .logo-text-1 {
                font: 30px 'MamaLove';
                display: inline-block;
                margin-top: 10px;
            }
            .logo-text-2 {
                font: 30px 'LongCang';
            }
        }
    }
    .avatar {
        width: 30px;
        height: 30px;
        border-radius: 50% 50%;
        background-color: #000;
        margin-top: 15px;
    }
    ::v-deep .el-submenu__title {
        padding-left: 10px !important;
        padding-right: 40px !important;
    }
    .right,
    .avatar {
        float: right;
    }
}
</style>
