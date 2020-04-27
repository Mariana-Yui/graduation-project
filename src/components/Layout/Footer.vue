<template>
    <div class="dashboard-footer">&copy;CopyRight 2020-2020 Design by Mariana</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component
export default class App extends Vue {}
</script>
<style lang="scss" scoped>
@import '~@/assets/css/default.scss';
@import '~@/assets/css/font.scss';

.dashboard-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 0 0 $footer-height;
    font-size: $smaller-font-size;
    color: $gray;
    font-family: 'Lobster';
    box-sizing: border-box;
    border-top: 1px solid $lightgray;
}
</style>
