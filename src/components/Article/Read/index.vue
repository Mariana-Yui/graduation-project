<template>
    <keep-alive>
        <router-view></router-view>
    </keep-alive>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Read extends Vue {}
</script>
<style lang="scss" scoped></style>
