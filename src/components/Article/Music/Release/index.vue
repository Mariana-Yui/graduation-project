<template>
    <common-article :type="type">
        <template v-slot:music>
            <div class="music-wrapper">
                <div class="music-title">音乐板块设置:</div>
                <div class="main-music">
                    <el-autocomplete
                        popper-class="my-autocomplete"
                        v-model="state"
                        :fetch-suggestions="querySearch"
                        placeholder="请输入歌曲名称"
                        @select="handleSelect"
                    >
                        <template slot-scope="{ item }">
                            <div class="name">{{ item.value }}</div>
                            <span class="addr">{{ item.address }}</span>
                        </template>
                    </el-autocomplete>
                </div>
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
export default class CreateMusic extends Vue {
    private type = 'music';
    private songs: any[] = [];
    private music_info = {};
    private state = '';

    public querySearch(qs: string, cb: Function) {
        console.log(qs);
    }
    public handleSelect(item: any) {}
}
</script>
<style lang="scss" scoped>
.music-wrapper {
    .music-title {
        padding-bottom: 40px;
    }
}
</style>
