<template>
    <div class="dashboard-footer">Footer</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component
export default class App extends Vue {}
</script>
<style lang="scss" scoped>
@import '~@/assets/css/default.scss';
.dashboard-footer {
    flex: 0 0 $footer-height;
    box-sizing: border-box;
    border-top: 1px solid $lightgray;
}
</style>
