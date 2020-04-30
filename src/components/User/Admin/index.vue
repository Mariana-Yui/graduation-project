<template>
    <my-scroller class="admin-list-scrollbar">
        <div class="admin-list-wrapper">
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
                <el-col :span="2">
                    <el-button
                        type="primary"
                        icon="el-icon-plus
"
                        @click="handleNewAdmin"
                        plain
                    >
                        Add
                    </el-button>
                </el-col>
            </el-row>
            <el-row class="admin-table">
                <el-col :span="24">
                    <el-table :data="tableData" border style="width: 99.5%">
                        <el-table-column prop="avatar" label="头像" width="100">
                            <template slot-scope="scope">
                                <div
                                    class="scope-avatar"
                                    :style="{ backgroundImage: `url(${scope.row.avatar})` }"
                                ></div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="username" label="用户名"></el-table-column>
                        <el-table-column prop="role_name" label="用户类型"></el-table-column>
                        <el-table-column prop="phone" label="联系方式"></el-table-column>
                        <el-table-column label="邮箱">
                            <template v-slot:default="scope">
                                <el-popover trigger="hover" placement="top">
                                    <p>邮箱: {{ scope.row.email }}</p>
                                    <div slot="reference">
                                        {{ scope.row.email }}
                                    </div>
                                </el-popover>
                            </template>
                        </el-table-column>
                        <el-table-column prop="create_time" label="创建时间"></el-table-column>
                        <el-table-column prop="enable" width="120" label="是否有效">
                            <template slot-scope="scope">
                                <el-switch
                                    v-model="scope.row.enable"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949"
                                    @change="handleSwitchChange(scope)"
                                >
                                </el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="120" align="center">
                            <template slot-scope="scope">
                                <el-button
                                    type="primary"
                                    size="mini"
                                    icon="el-icon-edit-outline"
                                    @click="handleClick(scope)"
                                    plain
                                    round
                                >
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
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
        <common-dialog
            :dialogVisible="dialogVisible"
            :form="currentUser"
            :isAdmin="true"
            @close-dialog="handleCloseDialog"
            v-if="dialogVisible"
            dialogType="edit"
        >
            <template v-slot:title>
                <div class="slot-title">{{ currentUser.username }}的个人资料</div>
            </template>
        </common-dialog>
        <common-dialog
            :dialogVisible="dialogVisible_2"
            :isAdmin="true"
            @close-dialog="handleCloseNewifyDialog"
            v-if="dialogVisible_2"
            dialogType="create"
            :showPassInput="true"
        >
            <template v-slot:title>
                <div class="slot-title">新建用户</div>
            </template>
        </common-dialog>
    </my-scroller>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as _ from 'lodash';
import { Debounce, Bind } from 'lodash-decorators';
import request from '@/utils/axios';
import CommonDialog from '@/components/common/dialog.vue';
import MyScroller from '@/components/common/scrollbar.vue';
import utils from '@/utils/utils';
import config from '@/config/config.default';

@Component({
    components: {
        CommonDialog,
        MyScroller
    }
})
export default class AdminUser extends Vue {
    private pageSizes = [20, 50, 100, 200];
    private pageSize = 20;
    private currentPage = 1;
    private total = 0;
    private tableData: any[] = [];
    private input = '';
    private currentUser = {};
    private dialogVisible = false;
    private dialogVisible_2 = false;
    private currentIndex = 0;

    public async created() {
        const info = await request.getTotalNumber();
        if (info.code === 0) {
            this.total = info.info.total;
        }
        this.changePagination();
    }
    public async changePagination() {
        const info = await request.getCurrentPageList(this.pageSize, this.currentPage);
        if (info.code === 0) {
            this.tableData = info.info;
        }
    }
    public handleSizeChange(newSize: any) {
        this.pageSize = newSize;
        this.changePagination();
    }
    public async handleCurrentChange(curPage: any) {
        this.currentPage = curPage;
        this.changePagination();
    }
    public async handleSwitchChange(scope: any) {
        this.currentIndex = scope.$index; // 当前索引
        this.tableData[this.currentIndex].enable = scope.row.enable;
        const { username, enable } = scope.row;
        const data = await request.toggleUserStatus(username, enable);
        if (data.code === 0) {
            this.$message((this as any).$rules.message('修改用户状态成功'));
        } else {
            this.$message((this as any).$rules.message('修改用户状态失败, 请刷新重试', 'error'));
        }
    }
    public handleClick(scope: any) {
        const profile = _.pick(scope.row, ['username', 'phone', 'email', 'description', 'role']);
        this.currentUser = profile;
        this.currentIndex = scope.$index; // 当前索引
        this.dialogVisible = true;
    }
    public async handleCloseDialog(updated: any) {
        if (updated !== '') {
            delete updated.password;
            // const username = this.tableData[this.currentIndex].username;
            this.tableData.splice(this.currentIndex, 1, {
                ...this.tableData[this.currentIndex],
                ...updated
            });
            const data = await request.updateUserInfo(this.tableData[this.currentIndex]);
            if (data.code === 0) {
                this.$message((this as any).$rules.message('修改用户资料成功'));
            } else {
                this.$message(
                    (this as any).$rules.message('修改用户状态失败, 请刷新重试', 'error')
                );
            }
        }
        this.dialogVisible = false;
        // 清空当前个人资料
        this.currentUser = {};
    }
    @Bind()
    @Debounce(500)
    public async handleInputUser() {
        const data = await request.getAdminByKeywords(
            this.input.trim(),
            this.pageSize,
            this.currentPage
        );
        if (data.code === 0) {
            this.tableData = data.info;
        }
    }
    public handleNewAdmin() {
        this.dialogVisible_2 = true;
    }
    public async handleCloseNewifyDialog(newUser: any) {
        if (newUser !== '') {
            try {
                newUser.location = await this.getUserLocation();
                const data = await request.createNewAdmin(newUser);
                if (data.code === 0) {
                    this.$message((this as any).$rules.message(data.message));
                    // 这里也可以通过重新发送两次请求获取, 但是我不:D
                    this.tableData.push(data.info);
                    this.total++;
                } else {
                    this.$message((this as any).$rules.message(data.message, 'error'));
                }
            } catch (error) {
                this.$message.error(error.message);
            }
        }
        this.dialogVisible_2 = false;
    }
    // JSONP, ajax存在跨域问题
    public getUserLocation() {
        return new Promise((resolve, reject) => {
            const src = document.createElement('script');
            // avoid always wait
            const timer = setTimeout(() => {
                reject(Error('exceed time'));
            }, 5000);
            src.src = config.sohu_address_interface;
            src.onload = function() {
                clearTimeout(timer);
                const location = {
                    last_ip: window.returnCitySN.cip,
                    last_ip_location: window.returnCitySN.cname.replace(/省|市/g, '')
                };
                document.body.removeChild(document.body.lastElementChild);
                resolve(location);
            };
            document.body.appendChild(src);
        });
    }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/css/default.scss';
@import '~@/assets/css/mixin.scss';

.admin-list-scrollbar {
    .admin-list-wrapper {
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
        .search-pagination-bar {
            display: flex;
            justify-content: flex-end;
            padding-right: 30px;
            margin-top: 30px;
        }
        .admin-table {
            .scope-avatar {
                margin: 0 auto;
                @include circleImg(40px);
            }
        }
    }
    .slot-title {
        color: $gray;
        font-size: 25px;
        margin-bottom: $margin-bottom;
        text-align: center;
    }
    ::v-deep .el-dialog__body {
        padding-top: 0 !important;
    }
}
</style>
