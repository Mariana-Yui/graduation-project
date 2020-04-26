<template>
    <div class="cover-img-wrapper">
        <div class="cover-img-title">封面图片设置:</div>
        <div class="vue-cover-cropper-wrapper">
            <div class="vue-cover-cropper-father" v-if="cropping">
                <vue-cropper
                    class="vue-cover-cropper"
                    ref="cropper"
                    :img="imgUrl"
                    :outputSize="options.outputSize"
                    :outputType="options.outputType"
                    :autoCropWidth="options.autoCropWidth"
                    :autoCropHeight="options.autoCropHeight"
                    :info="options.info"
                    :canScale="options.canScale"
                    :autoCrop="options.autoCrop"
                    :fixed="options.fixed"
                    :fixedNumber="options.fixedNumber"
                    :full="options.full"
                    :fixedBox="options.fixedBox"
                    :canMove="options.canMove"
                    :canMoveBox="options.canMoveBox"
                    :centerBox="options.centerBox"
                    :high="options.high"
                    :mode="options.mode"
                    :infoTrue="options.infoTrue"
                    :origin="options.origin"
                    @real-time="handlePreview"
                ></vue-cropper>
            </div>
            <div :class="{ 'preview-cover-wrapper': true, 'add-margin': cropping }">
                <span class="preview-title" v-if="cropping">预览:</span>
                <div class="preview-square-cover" ref="previewCover"></div>
            </div>
        </div>
        <div class="upload-button-wrapper">
            <el-upload
                class="upload-img"
                action=""
                :on-change="handleChange"
                :auto-upload="false"
                :file-list="fileList"
                :show-file-list="false"
                accept=".jpg, .png"
            >
                <el-button size="small" type="primary" icon="el-icon-upload2">
                    {{ uploadText }}
                </el-button>
                <!-- <div slot="tip" class="el-upload__tip normalize_font_weight">
                    只能上传jpg/png文件，且不超过2MB
                </div> -->
            </el-upload>
            <el-button
                size="small"
                type="primary"
                icon="el-icon-check"
                :loading="loading"
                v-if="cropping"
                @click="handleUploadCover"
            >
                确 定
            </el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { VueCropper } from 'vue-cropper';
import { getModule } from 'vuex-module-decorators';
import QiniuModule from '@/store/modules/qiniu';
import config from '@/config/config.default';
import utils from '@/utils/utils';
import request from '@/utils/axios';
import { SET_UPTOKEN } from '../../../store/types';

@Component({
    components: {
        VueCropper
    }
})
export default class CoverCropper extends Vue {
    @Prop() coverUrl: string;
    private qiniu!: QiniuModule;
    private options = Object.assign(config.cropper_options(), {
        autoCropWidth: 200,
        autoCropHeight: 100,
        fixedNumber: [2, 1]
    });
    private loading = false;
    private cropping = false;
    private fileList: any[] = [];
    private imgUrl = '';
    private threshold = 2 * 1024 * 1024;

    get uploadText() {
        return this.cropping ? '重新上传' : '点击上传';
    }

    @Watch('coverUrl')
    onLoadedCoverUrlChanged(newVal: string) {
        this.$nextTick(() => {
            (this.$refs['previewCover'] as HTMLElement).style.paddingTop = '50%';
            (this.$refs['previewCover'] as HTMLElement).style.backgroundImage = `url(${newVal})`;
        });
    }

    public created() {
        this.qiniu = getModule(QiniuModule, this.$store);
    }
    private checkFileSize(file: any) {
        if (file.size > this.threshold) {
            this.$message(
                this.$rules.message(
                    `封面图片大小不得超过${this.threshold / 1024 / 1024}MB`,
                    'error'
                )
            );
            return false;
        }
        return true;
    }
    public handleChange(file: any, fileList: any[]) {
        // 清除旧图片资源
        if (this.imgUrl !== '') {
            window.URL.revokeObjectURL(this.imgUrl);
        }
        // 检测图片大小
        if (this.checkFileSize(file)) {
            this.fileList = fileList;
            const blob = utils.fileToBlob(file.raw) as string;
            this.imgUrl = blob;
            this.cropping = true;
        }
    }
    public handlePreview() {
        (this as any).$refs['cropper'].getCropData((base64: string) => {
            (this.$refs['previewCover'] as HTMLElement).style.backgroundImage = `url(${base64})`;
            (this.$refs['previewCover'] as HTMLElement).style.paddingTop = '50%';
        });
    }
    public handleUploadCover() {
        this.loading = true;
        this.$message((this as any).$rules.message('图片正在上传, 请稍等...', 'info'));
        ((this as any).$refs['cropper'] as any).getCropBlob(async (blob: Blob) => {
            try {
                if (!utils.getItem('uptoken')) {
                    await this.qiniu[SET_UPTOKEN]();
                }
                const imgName = utils.getRandomUploadName();
                const res = await request.uploadFile(blob, imgName, utils.getItem('uptoken'));
                const cover_url = `${config.upload_domain}/${imgName}`;
                this.$emit('success-upload', cover_url);
                this.$message((this as any).$rules.message('文章封面图片上传成功'));
                // toggle flag
                this.cropping = false;
                this.loading = false;
            } catch (error) {
                // uptoken 过期
                console.log(error);
                utils.removeItem('uptoken');
                if (error.isRequestError && error.code === 401) {
                    this.handleUploadCover();
                } else {
                    this.$message((this as any).$rules.message(error.message, 'error'));
                }
            }
        });
    }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/css/mixin.scss';
@import '~@/assets/css/default.scss';

.cover-img-wrapper {
    margin-top: 40px;
    .cover-img-title {
        padding-bottom: 20px;
    }
    .vue-cover-cropper-wrapper {
        width: 100%;
        display: flex;
        .vue-cover-cropper-father {
            @include equalWidthHeightFather(40%, 20%);
            margin-bottom: 20px;
            .vue-cover-cropper {
                @include equalWidthHeightChild();
                ::v-deep .crop-point {
                    background-color: $gray !important;
                    border-radius: 0 !important;
                }
            }
        }
        .preview-cover-wrapper {
            &.add-margin {
                margin-left: 10%;
            }
            width: 20%;
            margin-bottom: 20px;
            .preview-title {
                display: block;
                padding-bottom: 20px;
            }
            .preview-square-cover {
                width: 100%;
                background-repeat: no-repeat;
                background-position-x: 50%;
                background-size: cover;
            }
        }
    }
    .upload-button-wrapper {
        display: flex;
        .upload-img {
            margin-right: 30px;
        }
        /* .normalize_font_weight {
            font-weight: normal;
        } */
    }
}
</style>
