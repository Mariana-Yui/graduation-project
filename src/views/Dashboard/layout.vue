<template>
    <div>
        <layout-header></layout-header>
        <layout-nav></layout-nav>
        <layout-footer></layout-footer>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import LayoutHeader from '@/components/Layout/Header/index.vue';
import LayoutNav from '@/components/Layout/Nav.vue';
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
<style lang="scss" scoped></style>
