<template>
    <vue-scroller class="admin-main-page">
        <el-row class="homepage">
            <el-col :span="7" class="left">
                <el-row class="admin-info">
                    <el-col :span="10">
                        <div
                            class="avatar"
                            :style="{ 'background-image': `url(${user_m.userInfo.avatar})` }"
                        ></div>
                        <div class="last-login-time-text">上次登录时间:</div>
                        <div class="last-login-location-text">上次登录地点:</div>
                        <div class="last-login-ip-text">上次登录IP:</div>
                    </el-col>
                    <el-col :span="14">
                        <div class="username">{{ user.username }}</div>
                        <div class="last-login-time">{{ user.details.last_login_time }}</div>
                        <div class="last-login-location">
                            {{ user.details.last_ip_location }}
                        </div>
                        <div class="last-login-ip">{{ user.details.last_ip }}</div>
                    </el-col>
                </el-row>
                <div class="circle-chart-wrapper">
                    <span>用户终端设备分布</span>
                    <ve-pie
                        :data="chartCircle"
                        :settings="{ radius: 80 }"
                        class="circle-chart"
                    ></ve-pie>
                </div>
            </el-col>
            <el-col :span="17" class="right">
                <div class="line-chart-wrapper">
                    <span>近7日访问量</span>
                    <ve-line
                        :data="chartLine"
                        :settings="{
                            stack: { '用户': ['访问用户'] },
                            area: true,
                            scale: [true, true]
                        }"
                    ></ve-line>
                </div>
            </el-col>
        </el-row>
    </vue-scroller>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import VueScroller from '@/components/common/scrollbar.vue';
import request from '@/utils/axios';
import { getModule } from 'vuex-module-decorators';
import UserModule from '@/store/modules/admin';
import moment from 'moment';

@Component({
    components: {
        VueScroller
    }
})
export default class Admin extends Vue {
    private user_m!: UserModule;
    private user = { details: {} };
    private chartCircle: { columns: Array<string>; rows: Array<any> } = {
        columns: ['终端', '用户数量'],
        rows: []
    };
    private chartLine: { columns: Array<string>; rows: Array<any> } = {
        columns: ['日期', '访问人数'],
        rows: []
    };

    public async created() {
        try {
            this.user_m = getModule(UserModule, this.$store);
            const { code, message, info } = await request.getAdminDetails(this.user_m._id);
            if (code === 0) {
                this.user = info.admin_info;
                this.chartCircle.rows = [
                    {
                        '终端': 'android',
                        '用户数量': info.android
                    },
                    {
                        '终端': 'ios',
                        '用户数量': info.ios
                    },
                    {
                        '终端': 'pc',
                        '用户数量': info.pc
                    },
                    {
                        '终端': 'other',
                        '用户数量': info.other
                    }
                ];
                this.chartLine.rows = [
                    {
                        '日期': moment(new Date())
                            .subtract(7, 'd')
                            .format('MM/DD'),
                        '访问人数': info.last_week[0]
                    },
                    {
                        '日期': moment(new Date())
                            .subtract(6, 'd')
                            .format('MM/DD'),
                        '访问人数': info.last_week[1]
                    },
                    {
                        '日期': moment(new Date())
                            .subtract(5, 'd')
                            .format('MM/DD'),
                        '访问人数': info.last_week[2]
                    },
                    {
                        '日期': moment(new Date())
                            .subtract(4, 'd')
                            .format('MM/DD'),
                        '访问人数': info.last_week[3]
                    },
                    {
                        '日期': moment(new Date())
                            .subtract(3, 'd')
                            .format('MM/DD'),
                        '访问人数': info.last_week[4]
                    },
                    {
                        '日期': moment(new Date())
                            .subtract(2, 'd')
                            .format('MM/DD'),
                        '访问人数': info.last_week[5]
                    },
                    {
                        '日期': moment(new Date())
                            .subtract(1, 'd')
                            .format('MM/DD'),
                        '访问人数': info.last_week[6]
                    }
                ];
                return;
            }
            throw Error(message);
        } catch (error) {
            this.$message.error(error.message);
        }
    }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/css/default.scss';

.admin-main-page {
    --gray: #303133;
    color: var(--gray);
    .homepage {
        margin: 40px;
        .left {
            .admin-info {
                padding: 15px;
                border: 1px solid $lightgray;
                border-radius: 4px;
                .avatar {
                    width: 100px;
                    height: 100px;
                    border-radius: 4px;
                    background-size: cover;
                    background-position: 50%;
                    background-repeat: no-repeat;
                }
                [class^='last-login'] {
                    font-size: 15px;
                    margin-top: 30px;
                    &:last-child {
                        margin-bottom: 20px;
                    }
                }
                .username {
                    padding: 20px 0 56px;
                    font-size: 24px;
                    color: black;
                }
            }
            .circle-chart-wrapper {
                margin-top: 50px;
                display: flex;
                justify-content: flex-end;
                span {
                    position: absolute;
                    left: 0;
                    margin-top: 5px;
                    font-weight: 500;
                    font-size: 15px;
                }
                .circle-chart {
                    width: 80% !important;
                }
            }
        }
        .right {
            padding-left: 50px;
            .line-chart-wrapper {
                span {
                    position: absolute;
                    margin-top: 5px;
                    font-weight: 500;
                    font-size: 15px;
                }
            }
        }
    }
}
</style>
