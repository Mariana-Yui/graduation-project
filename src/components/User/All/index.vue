<template>
    <my-scroller class="all-users-scroller-wrapper">
        <div class="all-users-wrapper">
            <el-row class="search-input-suffix" type="flex" align="middle">
                <el-col :span="1" class="search-text">搜索:</el-col>
                <el-col :span="4" class="search-input">
                    <el-input
                        placeholder="请输入关键字"
                        prefix-icon="el-icon-search"
                        v-model="input"
                        @input="handleInputUser"
                    >
                    </el-input>
                </el-col>
            </el-row>
            <el-table :data="tableData" class="all-users-table">
                <el-table-column label="头像">
                    <template v-slot:default="scope">
                        <div
                            class="user-cover-img"
                            :style="{ 'background-image': `url(${scope.row.avatar})` }"
                        ></div>
                    </template>
                </el-table-column>
                <el-table-column prop="username" label="用户名"></el-table-column>
                <el-table-column prop="phone" label="联系方式"></el-table-column>
                <el-table-column label="邮箱">
                    <template v-slot:default="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>邮箱: {{ scope.row.email }}</p>
                            <div slot="reference" class="email-reference">
                                {{ scope.row.email }}
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="上次登录IP">
                    <template v-slot:default="scope">
                        {{ scope.row.details.last_ip }}
                    </template>
                </el-table-column>
                <el-table-column label="上次登录城市">
                    <template v-slot:default="scope">
                        {{ scope.row.details.last_ip_location }}
                    </template>
                </el-table-column>
                <el-table-column label="创建时间">
                    <template v-slot:default="scope">
                        <div class="user-create-time">
                            <span>{{ scope.row.create_time[0] }}</span>
                            <br />
                            <span>{{ scope.row.create_time[1] }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="created"
                    label="发布图文数"
                    :width="numberWidth"
                ></el-table-column>
                <el-table-column label="收藏">
                    <el-table-column label="阅读文章" :width="numberWidth">
                        <template v-slot:default="scope">
                            {{ scope.row.collected.read_article }}
                        </template>
                    </el-table-column>
                    <el-table-column label="音乐文章" :width="numberWidth">
                        <template v-slot:default="scope">
                            {{ scope.row.collected.music_article }}
                        </template>
                    </el-table-column>
                    <el-table-column label="影视文章" :width="numberWidth">
                        <template v-slot:default="scope">
                            {{ scope.row.collected.film_article }}
                        </template>
                    </el-table-column>
                    <el-table-column label="电台文章" :width="numberWidth">
                        <template v-slot:default="scope">
                            {{ scope.row.collected.broadcast_article }}
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="是否有效" v-if="isAdmin">
                    <template v-slot:default="scope">
                        <el-switch
                            v-model="scope.row.enable"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            @change="handleChangeStatus(scope.row)"
                        >
                        </el-switch>
                    </template>
                </el-table-column>
            </el-table>
            <el-row>
                <el-col :span="24">
                    <el-pagination
                        class="search-pagination-bar"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="pageSizes"
                        :page-size="pageSize"
                        :total="total"
                        layout="total, sizes, prev, pager, next"
                    >
                    </el-pagination>
                </el-col>
            </el-row>
        </div>
    </my-scroller>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Debounce, Bind } from 'lodash-decorators';
import MyScroller from '@/components/common/scrollbar.vue';
import utils from '@/utils/utils';
import request from '@/utils/axios';

@Component({
    components: {
        MyScroller
    }
})
export default class AllUsers extends Vue {
    private tableData: any[] = [];
    private input = '';
    private pageSizes = [20, 50, 100, 200];
    private pageSize = 20;
    private currentPage = 1;
    private total = 0;
    private numberWidth = 80;

    // beforeEnter时已作判断, 所以判断可以省去
    get isAdmin() {
        return utils.getItem('userInfo').role === 'admin';
    }

    public async created() {
        try {
            const { code, message, info } = await request.getTotalNumber();
            if (code === 0) {
                this.total = info.total;
            } else {
                throw Error(message);
            }
            this.changePagination();
        } catch (error) {
            this.$message.error(`${error.message}, 请刷新重试...`);
        }
    }
    public async changePagination() {
        try {
            const { code, message, info } = await request.getUserDetailsByKeywords(
                this.pageSize,
                this.currentPage,
                this.input
            );
            if (code === 0) {
                // 规范json格式
                this.tableData = (info as Array<any>).map((user: any) => {
                    const {
                        read_article,
                        music_article,
                        film_article,
                        broadcast_article
                    } = user.details.collected;
                    return Object.assign({}, user, {
                        create_time: user.create_time.split(/\s/),
                        created: Object.values(user.details.created).reduce((prev, cur) => {
                            return (prev as number) + (cur as Array<string>).length;
                        }, 0),
                        collected: {
                            read_article: read_article.length,
                            music_article: music_article.length,
                            film_article: film_article.length,
                            broadcast_article: broadcast_article.length
                        }
                    });
                });
            } else {
                throw Error(message);
            }
        } catch (error) {
            this.$message.error(`${error.message}, 请刷新重试...`);
        }
    }
    @Bind()
    @Debounce(500)
    public async handleInputUser() {
        await this.changePagination();
    }
    public async handleSizeChange(newSize: any) {
        this.pageSize = newSize;
        await this.changePagination();
    }
    public async handleCurrentChange(curPage: any) {
        this.currentPage = curPage;
        await this.changePagination();
    }
    public async handleChangeStatus(row: any) {
        const { username, enable } = row;
        const data = await request.toggleUserStatus(username, enable);
        if (data.code === 0) {
            this.$message((this as any).$rules.message('修改用户状态成功'));
        } else {
            this.$message((this as any).$rules.message('修改用户状态失败, 请刷新重试', 'error'));
        }
    }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/css/default.scss';
@import '~@/assets/css/mixin.scss';

.all-users-scroller-wrapper {
    .all-users-wrapper {
        padding: 10px;
        .search-input-suffix {
            margin: 50px 0;
            .search-text {
                color: $gray;
                text-align: center;
                margin-right: 20px;
            }
            .search-input {
                margin-right: 30px;
            }
        }
        .all-users-table {
            .user-cover-img {
                margin: 0 auto;
                @include circleImg(40px);
            }
            .user-create-time {
                display: block;
                text-align: center;
            }
            .email-reference {
                @include addEllipsis();
            }
        }
        .search-pagination-bar {
            display: flex;
            justify-content: flex-end;
            padding-right: 30px;
            margin-top: 30px;
        }
        ::v-deep .el-table__row {
            /* [class^='el-table_1_column'] {
                padding: 16px 0;
            } */
            div.cell {
                @include addEllipsis();
            }
        }
    }
}
</style>
