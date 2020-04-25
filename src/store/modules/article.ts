import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { SET_ARTICLE_ID, SAVE_ARTICLE } from '../types';
import request from '@/utils/axios';

@Module({
    namespaced: true,
    name: 'article'
})
export default class ArticleModule extends VuexModule {
    articleId = '';

    @Mutation
    public [SET_ARTICLE_ID](id: string) {
        this.articleId = id;
    }

    @Action
    public async [SAVE_ARTICLE](articleInfo: any) {
        const {
            article,
            type,
            isDemo,
            _id
        }: { article: any; type: string; isDemo: boolean; _id: string } = articleInfo;
        const { code, message, info } = await request.saveArticle(article, type, isDemo, _id);
        if (code === 0) {
            this.context.commit(SET_ARTICLE_ID, info.article_id);
        }
        return { code, message };
    }
}
