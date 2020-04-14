<template>
    <div class="layout">
        <layout-header></layout-header>
        <div class="main-content">
            <layout-nav></layout-nav>
            <slot name="content"></slot>
        </div>
        <layout-footer></layout-footer>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import LayoutHeader from '@/components/Layout/Header/index.vue';
import LayoutNav from '@/components/Layout/Nav/index.vue';
import LayoutFooter from '@/components/Layout/Footer.vue';
import { getModule } from 'vuex-module-decorators';
import AdminModule from '@/store/modules/admin';
import { GET_INFO_FROM_LOCAL } from '@/store/types';

@Component({
    components: {
        LayoutHeader,
        LayoutNav,
        LayoutFooter
    }
})
export default class DashboardLayout extends Vue {
    public async created() {
        const admin = getModule(AdminModule, this.$store);
        try {
            const res = await admin[GET_INFO_FROM_LOCAL]();
        } catch (error) {
            this.$router.replace({ path: '/login' });
        }
    }
}
</script>
<style lang="scss" scoped>
.layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    .main-content {
        flex: 1;
        display: flex;
        max-height: calc(100vh - 61px - 30px);
    }
}
</style>
