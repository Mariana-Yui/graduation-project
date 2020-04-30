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
                        @input="handleSearchInput"
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
                <el-table-column prop="author" label="作者" width="80"></el-table-column>
                <el-table-column prop="content" label="内容"></el-table-column>
                <el-table-column label="封面">
                    <template v-slot:default="scope">
                        <div
                            class="article-cover"
                            :style="{ 'background-image': `url(${scope.row.cover})` }"
                        ></div>
                    </template>
                </el-table-column>
                <el-table-column label="数据">
                    <el-table-column prop="views" label="浏览量" width="80"></el-table-column>
                    <el-table-column prop="likes" label="点赞数" width="80"></el-table-column>
                    <el-table-column prop="collects" label="收藏数" width="80"></el-table-column>
                    <el-table-column prop="comments" label="评论数" width="80"></el-table-column>
                </el-table-column>
                <el-table-column label="时间">
                    <el-table-column label="创建时间">
                        <template v-slot:default="scope">
                            <div class="time-center-position">
                                <span>{{ scope.row.create_time[0] }}</span>
                                <br />
                                <span>{{ scope.row.create_time[1] }}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="更新时间">
                        <template v-slot:default="scope">
                            <div class="time-center-position">
                                <span>{{ scope.row.update_time[0] }}</span>
                                <br />
                                <span>{{ scope.row.update_time[1] }}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="发布时间">
                        <template v-slot:default="scope">
                            <div class="time-center-position">
                                <span>{{ scope.row.publish_time[0] }}</span>
                                <br />
                                <span>{{ scope.row.publish_time[1] }}</span>
                            </div>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column v-if="isAdmin" prop="enable" label="是否有效" width="80">
                    <template v-slot:default="scope">
                        <el-switch
                            v-model="scope.row.enable"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            @change="handleChangeStatus(scope.row._id, scope.row.enable, 'enable')"
                        >
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column v-if="isAdmin" prop="is_top" label="是否置顶" width="80">
                    <template v-slot:default="scope">
                        <el-switch
                            v-model="scope.row.is_top"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            @change="handleChangeStatus(scope.row._id, scope.row.is_top, 'is_top')"
                        >
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template v-slot:default="scope">
                        <el-button
                            @click.native="handleEditArticle(scope.row._id)"
                            type="text"
                            size="small"
                        >
                            编辑
                        </el-button>
                        <el-button
                            @click.native="openDelDialog(scope.row)"
                            type="text"
                            size="small"
                        >
                            删除
                        </el-button>
                        <div class="audit-btn">
                            <el-button
                                v-if="scope.row.status !== 1"
                                :type="
                                    scope.row.status === 4
                                        ? 'success'
                                        : scope.row.status === 3
                                        ? 'error'
                                        : 'info'
                                "
                            >
                                {{ auditStatus[scope.row.status] }}
                            </el-button>
                            <el-dropdown v-else trigger="click">
                                <el-button type="info">
                                    {{ auditStatus[scope.row.status] }}
                                    <i class="el-icon-arrow-down el-icon--right"></i>
                                </el-button>
                                <el-dropdown-menu slot="dropdown" class="my-dropdown-menu">
                                    <el-dropdown-item
                                        @click.native="handleChangeAuditStatus(scope.row, 2)"
                                    >
                                        {{ auditStatus[2] }}
                                    </el-dropdown-item>
                                    <el-dropdown-item
                                        @click.native="handleChangeAuditStatus(scope.row, 3)"
                                    >
                                        {{ auditStatus[3] }}
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog
            :visible.sync="dialogVisible"
            :width="dialogWidth"
            :show-close="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :modal="false"
            class="del-article-dialog"
        >
            <span slot="title" class="dialog-title">
                <i class="el-icon-warning-outline"></i>
                <span>确定删除该文章?</span>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleDelArticle" size="medium" plain>
                    确 定
                </el-button>
                <el-button @click="dialogVisible = false" size="medium">
                    取 消
                </el-button>
            </span>
        </el-dialog>
    </my-scroller>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { Bind, Debounce } from 'lodash-decorators';
import AdminModule from '@/store/modules/admin';
import MenuModule from '@/store/modules/menu';
import MyScroller from '../common/scrollbar.vue';
import request from '@/utils/axios';
import utils from '@/utils/utils';
import { CHANGE_CURRENT_INDEX } from '@/store/types';

type Which = 'enable' | 'is_top';

@Component({
    components: {
        MyScroller
    }
})
export default class ListCommon extends Vue {
    @Prop() type!: string;
    private admin!: AdminModule;
    private menu!: MenuModule;
    private input = '';
    private tableData: any[] = [];
    private dialogVisible = false;
    private dialogWidth = '20%';
    private curRow = { _id: '', author_info: '' };
    private auditStatus = ['草稿', '审核中', '审核成功', '审核失败', '发布中'];

    get isAdmin() {
        if (this.admin) {
            return (this.admin.userInfo.role || utils.getItem('userInfo').role) === 'admin';
        }
        return false;
    }

    private formatTableData(info: Array<any>) {
        this.tableData = info.map((article: any) => {
            const {
                _id,
                author_info,
                title,
                author,
                content,
                cover_img: cover,
                create_time,
                pre_release_time: update_time,
                publish_time,
                enable,
                is_top,
                views,
                likes,
                collects,
                status,
                comment: comments
            } = article;
            return {
                _id,
                author_info,
                title,
                author,
                content: content.replace(/<.*?\/?>/g, ''), // 取出html标签
                cover,
                create_time: create_time.split(' '),
                update_time: update_time.split(' '),
                publish_time: publish_time.split(' '),
                enable,
                is_top,
                views,
                likes,
                collects,
                status,
                comments: comments.length
            };
        });
    }
    public async created() {
        this.admin = getModule(AdminModule, this.$store);
        this.menu = getModule(MenuModule, this.$store);
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
            } = await request.searchArticleByKeywords(_id, '', this.type);
            if (code === 0) {
                this.formatTableData(info);
            } else {
                throw Error(message);
            }
        } catch (error) {
            this.$message.error(`${error.message}, 请刷新重试...`);
        }
    }
    @Bind()
    @Debounce(500)
    public async handleSearchInput() {
        try {
            const _id = this.admin._id || utils.getItem('_id');
            const { code, message, info } = await request.searchArticleByKeywords(
                _id,
                this.input,
                this.type
            );
            if (code === 0) {
                this.formatTableData(info);
            } else {
                throw Error(message);
            }
        } catch (error) {
            this.$message.error(`${error.message}, 请刷新重试...`);
        }
    }
    // 跳转发布文章页面
    public handleAddArticle() {
        this.menu[CHANGE_CURRENT_INDEX](`${this.menu.currentIndex.slice(0, -2)}-1`);
        this.$router.push({
            path: `${this.$route.path.slice(0, -5)}/write`
        });
    }
    public handleEditArticle(_id: string) {
        this.menu[CHANGE_CURRENT_INDEX](`${this.menu.currentIndex.slice(0, -2)}-1`);
        this.$router.push({
            path: `${this.$route.path.slice(0, -5)}/write`,
            query: {
                _id,
                type: this.type
            }
        });
    }
    public openDelDialog(row: any) {
        this.dialogVisible = true;
        this.curRow = row;
    }
    // 不要吧dialog放在插槽中, scope获取有问题
    public async handleDelArticle() {
        const { _id: article_id, author_info: author_id } = this.curRow;
        try {
            const { code, message } = await request.delTypedArticle(
                article_id,
                author_id,
                this.type
            );
            if (code === 0) {
                this.$message.success(`删除id:${article_id}文章成功!`);
                // 从表格中删除, 不重新请求
                this.tableData = this.tableData.filter(
                    (article: any) => article._id !== article_id
                );
            } else {
                throw Error(message);
            }
        } catch (error) {
            this.$message.error(`删除id:${article_id}文章失败, 请刷新重试...`);
        }
        this.dialogVisible = false;
    }
    public async handleChangeStatus(article_id: string, status: boolean, which: Which) {
        try {
            const { code, message } = await request.toggleArticleStatus(
                article_id,
                status,
                which,
                this.type
            );
            if (code !== 0) {
                throw Error(message);
            }
        } catch (error) {
            this.$message.error(error.message);
        }
    }
    public async handleChangeAuditStatus(row: any, status: number) {
        row.status = status;
        try {
            const { code, message, info } = await request.changeAuditStutus(
                row._id,
                status,
                this.type
            );
            if (code !== 0) {
                throw Error(message);
            }
        } catch (error) {
            this.$message.error(error.message);
        }
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
        .article-table {
            .article-cover {
                background-position-x: 50%;
                background-size: cover;
                background-repeat: no-repeat;
                height: 62.5px;
            }
            .time-center-position {
                text-align: center;
            }
            .audit-btn {
                ::v-deep .el-button {
                    width: 80px !important;
                    padding: 6px 0 !important;
                    text-align: center;
                    opacity: 0.7;
                    .el-icon--right {
                        margin-left: 0 !important;
                    }
                }
            }
            ::v-deep .el-dialog {
                -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
                .dialog-title {
                    font-size: $larger-font-size;
                }
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
    ::v-deep .el-dialog__body {
        padding: 10px 0 0 !important;
    }
}
</style>
