<template>
    <common-article :type="type">
        <template v-slot:film>
            <div class="film-wrapper">
                <div class="film-name">
                    <h3>电影名称:</h3>
                    <el-input class="film-name-input" v-model="film.name"></el-input>
                </div>
                <div class="film-quote">
                    <h3>电影经典台词:</h3>
                    <el-input
                        class="film-quote-input"
                        v-model="film.quote"
                        type="textarea"
                        :rows="rows"
                    ></el-input>
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
export default class CreateFilm extends Vue {
    private type = 'film';
    private film = { name: '', quote: '' };
    private rows = 2;
}
</script>
<style lang="scss" scoped>
.film-wrapper {
    .film-name,
    .film-quote {
        h3 {
            padding-left: 10px;
        }
    }
    .film-name {
        .film-name-input {
            width: 20%;
        }
        ::v-deep .el-input__inner {
            border-radius: 0;
            border-top: 0;
            border-left: 0;
            border-right: 0;
        }
    }
    .film-quote {
        padding: 20px 0 40px;
        h3 {
            padding-bottom: 20px;
        }
    }
}
</style>
