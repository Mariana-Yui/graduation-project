<template>
    <my-scroller ref="scroller" class="create-article-scrollbar">
        <transition name="fade" v-if="isHidden">
            <div class="fixed-button-wrapper">
                <el-button
                    class="fixed-button"
                    type="primary"
                    size="medium"
                    @click="saveAsDemo"
                    round
                >
                    草 稿
                </el-button>
                <el-button
                    class="fixed-button"
                    type="success"
                    size="medium"
                    @click="publishArticle"
                    round
                >
                    发 布
                </el-button>
            </div>
        </transition>
        <div class="create-article-wrapper">
            <div class="button-wrapper"></div>
            <div class="title-wrapper">
                <span :class="{ 'title': true, 'toggle-blue': toggle }">标题:</span>
                <el-input
                    placeholder="请输入标题"
                    v-model="article.title"
                    @focus="handleFocus"
                    @blur="handleBlur"
                ></el-input>
            </div>
            <el-row type="flex" align="middle" class="author-publishtime-wrapper">
                <el-col :span="2" class="author-name">作者:</el-col>
                <el-col :span="8">
                    <template v-if="isAdmin">
                        <el-select
                            v-model="article.author"
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
                        <el-input
                            class="default-author"
                            placeholder="请输入内容"
                            v-model="article.author"
                            :disabled="true"
                        >
                        </el-input>
                    </template>
                </el-col>
                <el-col :span="2" class="publish-time">预发布时间:</el-col>
                <el-col :span="8">
                    <el-date-picker
                        v-model="article.publishDate"
                        align="right"
                        type="date"
                        placeholder="选择日期"
                        :picker-options="pickerOptions"
                    >
                    </el-date-picker>
                </el-col>
            </el-row>
            <!-- 摘要 -->
            <slot name="abstract"></slot>
            <slot name="film"></slot>
            <tinymce-editor :height="editorHeight" ref="tinymce"></tinymce-editor>
            <slot name="music"></slot>
            <slot name="broadcast"></slot>
            <cover-cropper @success-upload="handleUploadCoverSuccess"></cover-cropper>
        </div>
    </my-scroller>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import * as _ from 'lodash';
import AdminModule from '@/store/modules/admin';
import request from '../../utils/axios';
import TinymceEditor from '@/components/common/tinymce/index.vue';
import MyScroller from '@/components/common/scrollbar.vue';
import CoverCropper from '@/components/Article/common/coverCropper.vue';

@Component({
    components: {
        TinymceEditor,
        MyScroller,
        CoverCropper
    }
})
export default class ArticleCommon extends Vue {
    @Prop() type!: string;
    /* read specfic slot */
    @Prop({ default: '' }) abstract: string;
    @Prop({ default: () => ({ name: '', quote: '' }) }) film_info: { name: string; quote: string };
    @Prop({ default: () => ({ name: '', url: '', artists: '', cover: '', album: '' }) })
    music_info: { name: string; url: string; artists: string; cover: string; album: string };
    @Prop({ default: '' }) broadcast: string;
    private admin!: AdminModule;
    private article = {
        title: '',
        author: '',
        publishDate: '',
        cover: '',
        abstract: '',
        broadcast: '',
        film_info: {},
        music_info: {}
    };
    private candidates: string[] = [];
    private toggle = false;
    private editorHeight = 700;
    private isHidden = true;
    private scheduleTime = 100;
    private max = Date.now();
    private delay = 5000;

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
                this.article.author = this.candidates[0];
            }
        } else {
            this.article.author = this.admin.userInfo.username;
        }
        this.$nextTick(() => {
            const self = this;
            ((this as any).$refs['scroller'].$el as HTMLElement)
                .getElementsByClassName('el-scrollbar__wrap')[0]
                .addEventListener(
                    'scroll',
                    _.throttle(self.checkToHide.bind(self), this.scheduleTime)
                );
            this.$notify.info({
                title: '提示',
                message: '记得定期保存草稿哦',
                duration: 2000
            });
        });
    }
    private checkToHide() {
        const bottom = ((this as any).$refs['tinymce'].$el as HTMLElement).getClientRects()[0]
            .bottom;
        if (bottom >= 165 + this.editorHeight) {
            this.isHidden = true;
        } else {
            this.isHidden = false;
        }
    }
    public handleFocus() {
        this.toggle = true;
    }
    public handleBlur() {
        this.toggle = false;
    }
    public handleUploadCoverSuccess(cover: string) {
        this.article.cover = cover;
    }
    /**节流**/
    private async throttle(resolve: Function) {
        if (Date.now() - this.max > this.delay) {
            await resolve.apply(this);
        } else {
            this.$message(
                this.$rules.message(`操作过于频繁,请${this.delay / 1000}秒后重试`, 'error')
            );
        }
    }
    public async saveAsDemo() {
        this.throttle(async function() {
            const { code, message } = await request.saveArticle(this.article, this.type, true);
            if (code === 0) {
                this.$message(this.$rules.message(message));
            } else {
                this.$message(this.$rules.message(message, 'error'));
            }
        });
    }
    public publishArticle() {
        this.throttle(async function() {
            const { code, message } = await request.saveArticle(this.article, this.type, false);
            if (code === 0) {
                this.$message(this.$rules.message(message));
            } else {
                this.$message(this.$rules.message(message, 'error'));
            }
        });
    }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/css/default.scss';

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.create-article-scrollbar {
    position: relative;
    .create-article-wrapper {
        margin: 150px auto 50px;
        width: 90%;
        box-sizing: border-box;
        color: $gray;
        font-weight: bold;
        .title-wrapper {
            width: 80%;
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
            margin: 40px 0 40px;
            padding-left: 10px;
            .default-author {
                width: 220px;
            }
        }
        .toggle-blue {
            color: $blue !important;
        }
    }
    .fixed-button-wrapper {
        position: absolute;
        z-index: 999;
        top: calc(150px / 2 - 36px / 2);
        right: 80px;
        .fixed-button {
            margin-right: 10px;
        }
    }
}
</style>
