<template>
    <el-dialog
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :width="dialogWidth"
        class="image-cropper-upload"
    >
        <div class="image-cropper-wrapper">
            <div class="vue-cropper-father">
                <vue-cropper
                    class="vue-cropper"
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
            <div class="preview-image-wrapper">
                <h2>预览</h2>
                <div ref="squareImage" class="square-image"></div>
                <div ref="circleImage" class="circle-image"></div>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="success" @click="handleUpload">
                上 传<i :class="loadingIcon"></i>
            </el-button>
        </div>
    </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { VueCropper } from 'vue-cropper';
import { getModule } from 'vuex-module-decorators';
import UploadModule from '@/store/modules/upload';
import QiniuModule from '@/store/modules/qiniu';
import AdminModule from '@/store/modules/admin';
import { SET_UPTOKEN, UPDATE_ADMIN_INFO } from '@/store/types';
import utils from '@/utils/utils';
import request from '@/utils/axios';
import config from '@/config/config.default';

@Component({
    components: {
        VueCropper
    }
})
export default class ImageCropper extends Vue {
    @Prop({ default: '30%' }) dialogWidth: string;
    private dialogVisible = false;
    private loading = false;
    private upload!: UploadModule;
    private qiniu!: QiniuModule;
    private admin!: AdminModule;
    private options = config.cropper_options();

    get imgUrl() {
        return this.upload.imgUrl;
    }
    get loadingIcon() {
        return this.loading ? 'el-icon-loading' : '';
    }

    public created() {
        this.admin = getModule(AdminModule, this.$store);
        this.upload = getModule(UploadModule, this.$store);
        this.qiniu = getModule(QiniuModule, this.$store);
        const timer = setInterval(() => {
            if ((this as any).$refs['cropper']) {
                this.previewImage();
                clearInterval(timer);
            }
        }, 300);
    }
    public previewImage() {
        const self = this;
        (self as any).$refs['cropper'].getCropData((base64: string) => {
            (self.$refs['squareImage'] as HTMLElement).style.backgroundImage = `url(${base64})`;
            (self.$refs['circleImage'] as HTMLElement).style.backgroundImage = `url(${base64})`;
        });
    }
    public handlePreview() {
        this.previewImage();
    }

    public async handleUpload() {
        const self = this;
        this.loading = true;
        try {
            // get uptoken
            if (utils.getItem('uptoken') == null) {
                await this.qiniu[SET_UPTOKEN]();
            }
            (this as any).$refs['cropper'].getCropBlob(async (blob: Blob) => {
                try {
                    const imgName = utils.getRandomUploadName();
                    const res = await request.uploadFile(blob, imgName, utils.getItem('uptoken'));
                    const avatar_url = `${config.upload_domain}/${imgName}`;
                    this.admin[UPDATE_ADMIN_INFO]({
                        username: this.admin.userInfo.username,
                        avatar: avatar_url
                    });
                    self.$message((self as any).$rules.message('更换头像成功'));
                    this.$emit('changeAvatar', avatar_url);
                } catch (error) {
                    // uptoken 过期
                    console.log(error);
                    utils.removeItem('uptoken');
                    if (error.isRequestError && error.code === 401) {
                        this.handleUpload();
                    } else {
                        self.$message((self as any).$rules.message(error.message, 'error'));
                    }
                }
                this.loading = false;
                // close dialog
                this.dialogVisible = false;
            });
        } catch (error) {
            console.log(error);
        }
    }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/css/mixin.scss';
@import '~@/assets/css/default.scss';

.image-cropper-upload {
    .image-cropper-wrapper {
        display: flex;
        .vue-cropper-father {
            @include equalWidthHeightFather(45%, 45%);
            margin-right: 10%;
            .vue-cropper {
                @include equalWidthHeightChild();
            }
        }
        .preview-image-wrapper {
            flex: 1;
            h2 {
                color: $gray;
                font-size: $font-size;
                padding-bottom: 30px;
            }
            .square-image,
            .circle-image {
                display: inline-block;
                width: $width;
                height: $width;
                background-color: #fff;
                background-repeat: no-repeat;
                background-position-x: 50%;
                background-size: cover;
            }
            .circle-image {
                border-radius: 50% 50%;
                margin-left: 40px;
            }
        }
    }
    ::v-deep .el-dialog__footer {
        padding-top: 0 !important;
    }
}
</style>
