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
                            :style="{ 'background-image': `url${scope.row.cover}` }"
                        ></div>
                    </template>
                </el-table-column>
                <el-table-column prop="username" label="用户名"></el-table-column>
                <el-table-column prop="phone" label="联系方式"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="" label="上次登录IP"></el-table-column>
                <el-table-column prop="" label="上次登录城市"></el-table-column>
                <el-table-column label="创建时间"></el-table-column>
                <el-table-column label="发布图文数"></el-table-column>
                <el-table-column label="收藏">
                    <el-table-column label="阅读文章"></el-table-column>
                    <el-table-column label="音乐文章"></el-table-column>
                    <el-table-column label="影视文章"></el-table-column>
                    <el-table-column label="电台文章"></el-table-column>
                </el-table-column>
                <el-table-column label="是否有效" v-if="isAdmin"></el-table-column>
            </el-table>
        </div>
    </my-scroller>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MyScroller from '@/components/common/scrollbar.vue';

@Component({
    components: {
        MyScroller
    }
})
export default class AllUsers extends Vue {}
</script>
<style lang="scss" scoped>
@import '~@/assets/css/default.scss';

.all-users.scroller-wrapper {
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
    }
}
</style>
