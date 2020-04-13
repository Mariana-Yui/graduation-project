<template>
    <common-article></common-article>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CommonArticle from '@/components/Article/commonArticle.vue';

@Component({
    components: {
        CommonArticle
    }
})
export default class CreateRead extends Vue {}
</script>
<style lang="scss" scoped></style>
