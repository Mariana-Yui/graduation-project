<template>
    <my-scroller class="create-article-scrollbar">
        <div class="fixed-button-wrapper">
            <el-button class="fixed-button" type="primary" size="medium" round>草 稿</el-button>
            <el-button class="fixed-button" type="success" size="medium" round>发 布</el-button>
        </div>
        <div class="create-article-wrapper">
            <div class="button-wrapper"></div>
            <div class="title-wrapper">
                <span :class="{ 'title': true, 'toggle-blue': toggle }">标题:</span>
                <el-input
                    placeholder="请输入标题"
                    v-model="title"
                    @focus="handleFocus"
                    @blur="handleBlur"
                ></el-input>
            </div>
            <el-row type="flex" align="middle" class="author-publishtime-wrapper">
                <el-col :span="2" class="author-name">作者:</el-col>
                <el-col :span="8">
                    <template v-if="isAdmin">
                        <el-select
                            v-model="author"
                            placeholder="请选择"
                            v-if="candidates && candidates.length"
                        >
                            <el-option
                                v-for="(user, key) of candidates"
                                :key="key"
                                :label="user"
                                :value="user"
                            >
                            </el-option>
                        </el-select>
                    </template>
                    <template v-else>
                        <el-input placeholder="请输入内容" v-model="author" :disabled="true">
                        </el-input>
                    </template>
                </el-col>
                <el-col :span="2" class="publish-time">发布时间:</el-col>
                <el-col :span="8">
                    <el-date-picker
                        v-model="publishDate"
                        align="right"
                        type="date"
                        placeholder="选择日期"
                        :picker-options="pickerOptions"
                    >
                    </el-date-picker>
                </el-col>
            </el-row>
            <tinymce-editor :height="600"></tinymce-editor>
        </div>
    </my-scroller>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import AdminModule from '@/store/modules/admin';
import request from '../../utils/axios';
import TinymceEditor from '@/components/common/tinymce/index.vue';
import MyScroller from '@/components/common/scrollbar.vue';

@Component({
    components: {
        TinymceEditor,
        MyScroller
    }
})
export default class ArticleCommon extends Vue {
    private admin!: AdminModule;
    private author = '';
    private candidates: string[] = [];
    private title = '';
    private toggle = false;
    private publishDate = '';
    private pickerOptions = {
        disabledDate(time: Date) {
            return time.getTime() < Date.now() - 3600 * 24 * 1000;
        },
        shortcuts: [
            {
                text: '今天',
                onClick(picker: any) {
                    picker.$emit('pick', new Date());
                }
            },
            {
                text: '明天',
                onClick(picker: any) {
                    const date = new Date();
                    date.setTime(date.getTime() + 3600 * 1000 * 24);
                    picker.$emit('pick', date);
                }
            },
            {
                text: '一周后',
                onClick(picker: any) {
                    const date = new Date();
                    date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', date);
                }
            }
        ]
    };

    get isAdmin() {
        return this.admin.userInfo.role === 'admin' ? true : false;
    }
    public created() {
        this.admin = getModule(AdminModule, this.$store);
    }
    public async mounted() {
        if (this.isAdmin) {
            const data = await request.getAllUsername();
            if (data.code === 0) {
                this.candidates = data.info.user;
                this.author = this.candidates[0];
            }
        } else {
            this.author = this.admin.userInfo.username;
        }
    }
    public handleFocus() {
        this.toggle = true;
    }
    public handleBlur() {
        this.toggle = false;
    }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/css/default.scss';

.create-article-scrollbar {
    position: relative;
    .create-article-wrapper {
        margin: 150px auto 0;
        width: 90%;
        box-sizing: border-box;
        color: $gray;
        font-weight: bold;
        .title-wrapper {
            width: 70%;
            .title {
                display: block;
                padding: 10px;
                transition: color 0.2s linear;
            }
            ::v-deep .el-input__inner {
                border-top: 0;
                border-left: 0;
                border-right: 0;
                border-radius: 0;
            }
        }
        .author-publishtime-wrapper {
            margin: 30px 0 40px;
            padding-left: 10px;
        }
        .toggle-blue {
            color: $blue !important;
        }
    }
    .fixed-button-wrapper {
        position: absolute;
        z-index: 999;
        top: calc(150px / 2 - 36px / 2);
        right: 20px;
        .fixed-button {
            margin-right: 10px;
        }
    }
}
</style>
