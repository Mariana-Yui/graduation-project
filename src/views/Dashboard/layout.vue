<template>
    <div>
        <layout-header></layout-header>
        <layout-nav></layout-nav>
        <layout-footer></layout-footer>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import LayoutHeader from '@/components/Layout/Header.vue';
import LayoutNav from '@/components/Layout/Nav.vue';
import LayoutFooter from '@/components/Layout/Footer.vue';
@Component({
    components: {
        LayoutHeader,
        LayoutNav,
        LayoutFooter
    }
})
export default class DashboardLayout extends Vue {}
</script>
<style lang="scss" scoped></style>
