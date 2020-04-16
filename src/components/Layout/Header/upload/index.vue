<template>
    <div class="upload-dialog-wrapper">
        <el-dialog
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :width="dialogWidth"
        >
            <el-upload
                class="upload"
                action="xxx"
                drag
                :auto-upload="false"
                :file-list="fileList"
                accept=".jpg, .png"
                :on-change="handleUploadFile"
            >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过1MB</div>
            </el-upload>
        </el-dialog>
        <!-- image-cropper插槽 -->
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import utils from '@/utils/utils';

@Component
export default class UploadDialog extends Vue {
    @Prop({ default: '21%' }) dialogWidth: string;
    private fileList: Array<Record<string, any>> = [];
    private threshold: number = 1 * 1024 * 1024;
    private dialogVisible = false;
    public handleUploadFile(file: any, fileList: any) {
        this.fileList = fileList;
        this.checkFileSize();
    }
    private checkFileSize() {
        if (this.fileList[0].size > this.threshold) {
            this.$message((this as any).$rules.message('图片大小不得超过1MB', 'error'));
        } else {
            const blob_url = utils.fileToBlob(this.fileList[0].raw);
            this.$emit('uploadSuccess', blob_url);
            this.dialogVisible = false;
        }
        this.fileList = [];
    }
}
</script>
<style lang="scss" scoped></style>
