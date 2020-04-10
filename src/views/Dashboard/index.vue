<template>
    <div class="dashboard-wrapper">
        <dashboard-layout>
            <!-- 需要用template模板包裹 -->
            <template v-slot:content>
                <router-view class="content-wrapper"></router-view>
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
<style lang="scss" scoped>
@import '~@/assets/css/default.scss';
.content-wrapper {
    flex: 1;
    margin: 10px 10px 0;
    padding: 10px 10px 0;
    border: 1px solid $lightgray;
    border-radius: 4px;
}
</style>
