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
                <el-button type="success">确认上传</el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="dialogVisible_2">
            <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class UploadButton extends Vue {
    private fileList: any[] = [];
    private dialogVisible = false;
    private dialogVisible_2 = false;
    private dialogImageUrl = '';
    private acceptMine = '.jpg, .png';

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
}
</script>
<style lang="scss" scoped>
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
}
</style>
