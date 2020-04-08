<template>
    <div class="article-main-wrapper">Content</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component
export default class Content extends Vue {}
</script>
<style lang="scss" scoped>
.article-main-wrapper {
    flex: 1;
}
</style>
