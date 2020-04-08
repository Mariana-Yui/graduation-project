<template>
    <div class="dashboard-wrapper">
        <dashboard-layout>
            <!-- 需要用template模板包裹 -->
            <template v-slot:content>
                <router-view></router-view>
            </template>
        </dashboard-layout>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import DashboardLayout from './layout.vue';

@Component({
    components: {
        DashboardLayout
    }
})
export default class Dashboard extends Vue {}
</script>
<style lang="scss" scoped></style>
