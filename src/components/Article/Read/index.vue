<template>
    <!-- 这里把keep-alive去掉,否则缓存不触发created钩子 -->
    <router-view></router-view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Read extends Vue {}
</script>
<style lang="scss" scoped></style>
