<template>
    <div class="dashboard-header">
        <el-menu menu-trigger="click" class="el-dashboard-menu" mode="horizontal">
            <el-submenu index="1">
                <template slot="name">{{ username }}</template>
                <el-menu-item index="user_info">{{ user_info_text }} </el-menu-item>
                <el-menu-item index="logout">{{ logout_text }} </el-menu-item>
            </el-submenu>
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
    private user_info_text = '个人信息';
    private logout_text = '退出';
    get username() {
        if (this.adminModule) {
            return this.adminModule.userInfo.username;
        }
        return '我是一个杀手';
    }
    public created() {
        this.adminModule = getModule(AdminModule, this.$store);
    }
}
</script>
<style lang="scss" scoped></style>
