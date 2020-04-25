<template>
    <my-scroller class="article-list-scroller-wrapper">
        <div class="article-list-wrapper">
            <el-row type="flex" align="middle" class="article-search-wapper">
                <el-col :span="1" class="article-search-title">搜索:</el-col>
                <el-col :span="4" class="article-search-input">
                    <el-input
                        v-model="input"
                        prefix-icon="el-icon-search"
                        placeholder="请输入关键字"
                    ></el-input>
                </el-col>
                <el-col :span="2">
                    <el-button
                        class="add-article-button"
                        type="primary"
                        icon="el-icon-plus"
                        plain
                        @click="handleAddArticle"
                    >
                        Add
                    </el-button>
                </el-col>
            </el-row>
            <el-table :data="tableData" class="article-table">
                <el-table-column prop="title" label="标题"></el-table-column>
                <el-table-column prop="author" label="作者"></el-table-column>
                <el-table-column prop="content" label="内容"></el-table-column>
                <el-table-column prop="cover" label="封面"></el-table-column>
                <el-table-column label="数据">
                    <el-table-column prop="views" label="浏览量" width="80"></el-table-column>
                    <el-table-column prop="likes" label="点赞数" width="80"></el-table-column>
                    <el-table-column prop="collects" label="收藏数" width="80"></el-table-column>
                    <el-table-column prop="comments" label="评论数" width="80"></el-table-column>
                </el-table-column>
                <el-table-column label="时间">
                    <el-table-column prop="create_time" label="创建时间"></el-table-column>
                    <el-table-column prop="update_time" label="更新时间"></el-table-column>
                    <el-table-column prop="publish_time" label="发布时间"></el-table-column>
                </el-table-column>
                <el-table-column prop="enable" label="是否有效" width="80"></el-table-column>
                <el-table-column prop="is_top" label="是否置顶" width="80"></el-table-column>
                <el-table-column label="操作">
                    <!-- <template slot-scope="scope"></template> -->
                </el-table-column>
            </el-table>
        </div>
    </my-scroller>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import AdminModule from '@/store/modules/admin';
import MyScroller from '../common/scrollbar.vue';
import request from '@/utils/axios';
import utils from '@/utils/utils';

@Component({
    components: {
        MyScroller
    }
})
export default class ListCommon extends Vue {
    @Prop() type!: string;
    private admin!: AdminModule;
    private input = '';
    private tableData: any[] = [];

    get role() {
        if (this.admin) {
            return this.admin.userInfo.role || utils.getItem('userInfo').role;
        }
        return 'author';
    }
    public async created() {
        this.admin = getModule(AdminModule, this.$store);
        try {
            const _id = this.admin._id || utils.getItem('_id');
            const {
                code,
                message,
                info
            }: {
                code: number;
                message: string;
                info: Array<any>;
            } = await request.getAllTypedArticle(_id, this.type);
            if (code === 0) {
                // TODO 格式化
                this.tableData = info.map((article: any) => {
                    const {};
                });
            } else {
                throw Error(message);
            }
        } catch (error) {
            this.$message.error(`${error.message}, 请刷新重试...`);
        }
    }
    // 跳转发布文章页面
    public handleAddArticle() {
        this.$router.push({
            path: `${this.$route.path.slice(0, -6)}/write`
        });
    }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/css/default.scss';
@import '~@/assets/css/mixin.scss';

.article-list-scroller-wrapper {
    color: $gray;
    .article-list-wrapper {
        padding: 10px;
        .article-search-wapper {
            margin: 40px 0;
            .article-search-title {
                text-align: center;
                margin-right: 20px;
            }
            .article-search-input {
                margin-right: 30px;
            }
        }
    }
    ::v-deep .el-table--border,
    .el-table--group {
        border: 0;
    }
    ::v-deep .el-table__row {
        [class^='el-table_1_column'] {
            padding: 16px 0;
        }
        div.cell {
            @include addEllipsis();
        }
    }
}
</style>
