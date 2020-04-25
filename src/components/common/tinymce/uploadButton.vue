<template>
    <div class="upload-wrapper">
        <el-button
            type="primary"
            class="inner-upload-button"
            size="small"
            @click="openUploadDialog"
        >
            上传图片
        </el-button>
        <el-dialog
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
            class="upload-dialog"
        >
            <div class="slot-title">选择图片并插入文章</div>
            <el-upload
                action="#"
                list-type="picture-card"
                :auto-upload="false"
                :on-change="handleUploadChanged"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :file-list="fileList"
                :accept="acceptMine"
            >
                <i class="el-icon-plus"></i>
            </el-upload>
            <div slot="footer" class="bottom-button-wrapper">
                <el-button type="primary" @click="handleCancel" plain>取 消</el-button>
                <el-button
                    type="success"
                    :disabled="disabled"
                    :icon="uploadIcon"
                    @click="handleUploadClick"
                >
                    确认上传
                </el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="dialogVisible_2">
            <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import utils from '@/utils/utils';
import request from '@/utils/axios';
import { getModule } from 'vuex-module-decorators';
import QiniuModule from '@/store/modules/qiniu';
import { SET_UPTOKEN } from '../../../store/types';

@Component
export default class UploadButton extends Vue {
    private qiniu!: QiniuModule;
    private fileList: any[] = [];
    private dialogVisible = false;
    private dialogVisible_2 = false;
    private dialogImageUrl = '';
    private acceptMine = '.jpg, .png';
    private uploading = false;

    get disabled() {
        return this.uploading;
    }
    get uploadIcon() {
        return this.uploading ? 'el-icon-loading' : '';
    }

    public created() {
        this.qiniu = getModule(QiniuModule, this.$store);
    }
    public openUploadDialog() {
        this.dialogVisible = true;
    }
    public handleCancel() {
        this.dialogVisible = false;
    }
    public handleUploadChanged(file: any, fileList: any[]) {
        this.fileList = fileList;
    }
    public handlePictureCardPreview(file: any) {
        this.dialogVisible_2 = true;
        this.dialogImageUrl = file.url;
    }
    public handleRemove(file: any, fileList: any[]) {
        this.fileList = fileList;
    }
    public async handleUploadClick() {
        this.uploading = true;
        this.$message((this as any).$rules.message('图片正在上传,请稍等...', 'info'));
        const { uploadFile } = request;
        try {
            if (utils.getItem('uptoken') === null) {
                await this.qiniu[SET_UPTOKEN]();
            }
            const blobs = this.fileList.map((file: any) => {
                const blob = utils.fileToBlob(file.raw, false) as Blob;
                const key = utils.getRandomUploadName(file.name.slice(-3));
                return uploadFile(blob, key, utils.getItem('uptoken'));
            });
            // 要加await, 否则catch捕获不到quq
            await Promise.all(blobs).then((res: any[]) => {
                this.$emit('success-upload', res);
                this.uploading = false;
                this.dialogVisible = false;
                this.$message((this as any).$rules.message('上传成功,正在插入文章...'));
            });
        } catch (error) {
            console.log(error);
            this.uploading = false;
            utils.removeItem('uptoken');
            if (error.isRequestError && error.code === 401) {
                this.handleUploadClick();
            } else {
                this.$message((this as any).$rules.message(error.message, 'error'));
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/css/default.scss';

.upload-wrapper {
    // 父元素z-index会覆盖子元素
    .inner-upload-button {
        position: absolute;
        z-index: 1;
        top: 4px;
        right: 10px;
    }
    .upload-dialog {
        ::v-deep .el-dialog {
            width: 34.3% !important;
        }
    }
    .slot-title {
        color: $gray;
        font-size: 25px;
        margin-bottom: $margin-bottom;
        text-align: center;
        font-weight: normal;
        padding-bottom: 10px;
    }
    .bottom-button-wrapper {
        display: flex;
        justify-content: center;
    }
    ::v-deep .el-dialog__body {
        padding-top: 0 !important;
    }
}
</style>
