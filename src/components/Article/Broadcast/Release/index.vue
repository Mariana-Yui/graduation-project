<template>
    <common-article :type="type" :broadcast="broadcast">
        <template v-slot:broadcast>
            <div class="broadcast-upload-wrapper">
                <div class="broadcast-title">电台板块设置:</div>
                <div class="broadcast-upload-area">
                    <el-upload
                        class="upload-broadcast"
                        drag
                        action="#"
                        :auto-upload="false"
                        :on-change="handleChangeFile"
                        :file-list="fileList"
                        accept="audio/*"
                        v-show="beforeUpload"
                        :show-file-list="false"
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">
                            只能上传audio/音频文件，且不超过30MB
                        </div>
                    </el-upload>
                    <div class="broadcast-player" v-show="!beforeUpload"></div>
                </div>
            </div>
        </template>
    </common-article>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import QiniuModule from '@/store/modules/qiniu';
import '@/components/common/meplayer/js/main';
import '@/components/common/meplayer/dist/meplayer.min.css';
import CommonArticle from '@/components/Article/commonArticle.vue';
import utils from '@/utils/utils';
import request from '@/utils/axios';
import config from '@/config/config.default';
import { SET_UPTOKEN } from '@/store/types';

@Component({
    components: {
        CommonArticle
    }
})
export default class CreateBroadcast extends Vue {
    private type = 'broadcast';
    private broadcast = '';
    private threshold = 30 * 1024 * 1024;
    private fileList: any[] = [];
    private beforeUpload = true;
    private uploading = false;
    private MePlayer = window.mePlayer;
    private qiniu!: QiniuModule;

    public created() {
        this.qiniu = getModule(QiniuModule, this.$store);
    }
    public checkFileSize(file: any) {
        if (file.size > this.threshold) {
            this.$message.error('文件大小不能超过30MB');
        } else {
            return true;
        }
    }
    public async handleChangeFile(file: any, fileList: any) {
        if (this.checkFileSize(file)) {
            this.$message.info('文件正在上传, 请稍等...');
            this.uploading = true;
            this.fileList = fileList;
            try {
                if (!utils.getItem('uptoken')) {
                    await this.qiniu[SET_UPTOKEN]();
                }
                const suffix = file.name.slice(-3);
                const fileRandomName = utils.getRandomUploadName(suffix);
                // 赋值随机生成url
                this.broadcast = `${config.upload_domain}/${fileRandomName}`;
                const blob = utils.fileToBlob(file.raw, false) as Blob;
                const hash = await request.uploadFile(
                    blob,
                    fileRandomName,
                    utils.getItem('uptoken')
                );
                this.$message.success('自定义音频文件上传成功');
                this.beforeUpload = false;
                // 生成播放器
                this.generatePlayer();
            } catch (error) {
                console.log(error);
                utils.removeItem('uptoken');
                this.handleChangeFile(file, fileList);
            }
            this.uploading = false;
        }
    }
    private generatePlayer() {
        this.MePlayer({
            target: '.broadcast-player',
            music: {
                src: this.broadcast
            }
        });
    }
}
</script>
<style lang="scss" scoped>
.broadcast-upload-wrapper {
    .broadcast-title {
        padding: 40px 0;
    }
    .broadcast-upload-area {
        font-weight: normal;
        .broadcast-player {
            width: 40%;
        }
    }
}
</style>
