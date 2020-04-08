<template>
    <div class="dashboard-wrapper">
        <dashboard-layout>
            <!-- 需要用template模板包裹 -->
            <template v-slot:content>
                <dashboard-content></dashboard-content>
            </template>
        </dashboard-layout>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import DashboardLayout from './layout.vue';
import DashboardContent from '@/components/Main/index.vue';

@Component({
    components: {
        DashboardLayout,
        DashboardContent
    }
})
export default class Dashboard extends Vue {}
</script>
<style lang="scss" scoped></style>
