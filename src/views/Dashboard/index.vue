<template>
    <div class="dashboard-wrapper">
        <dashboard-layout></dashboard-layout>
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
