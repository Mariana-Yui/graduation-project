<template>
    <common-article @save-as-demo="handleSaveAsDemo" @publish="handlePublish"></common-article>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CommonArticle from '@/components/Article/commonArticle.vue';

@Component({
    components: {
        CommonArticle
    }
})
export default class CreateRead extends Vue {
    public handleSaveAsDemo() {}
    public handlePublish() {}
}
</script>
<style lang="scss" scoped></style>
