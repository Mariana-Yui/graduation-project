<template>
    <common-article :type="type" :abstract="abstract">
        <template v-slot:abstract>
            <div class="abstract-wrapper">
                <h3>摘要:</h3>
                <el-input
                    type="textarea"
                    :rows="rows"
                    v-model="abstract"
                    class="abstract-textarea"
                ></el-input>
            </div>
        </template>
    </common-article>
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
    private type = 'read';
    private abstract = '';
    private rows = 1;
}
</script>
<style lang="scss" scoped>
.abstract-wrapper {
    display: flex;
    align-items: center;
    padding: 0 0 40px 10px;
    h3 {
        width: 4.167%;
    }
}
</style>
