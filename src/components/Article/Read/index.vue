<template>
    <div class="read-article-wrapper">
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Read extends Vue {}
</script>
<style lang="scss" scoped></style>
