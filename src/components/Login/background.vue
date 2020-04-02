<template>
    <div class="background-slideshow" ref="slideshow">
        <div class="slide">
            <div class="wallpaper" :style="bg1"></div>
        </div>
        <transition name="fade">
            <div class="slide" v-show="fadeout">
                <div class="wallpaper" :style="bg2"></div>
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import request from '@/utils/axios';
import utils from '@/utils/utils';
import config from '@/config/config.default';

@Component
export default class LoginBackground extends Vue {
    private bg1 = { 'background-image': '' };
    private bg2 = { 'background-image': '' };
    private fadeout = true;
    // 获取首张背景图片及第二张轮播图片
    async created() {
        const bg2Url = await this.getLoginBg();
        this.bg2['background-image'] = `url(${bg2Url})`;
        const bg1Url = await this.getLoginBg();
        this.bg1['background-image'] = `url(${bg1Url})`;
        //定时任务
        this.scheduleTask();
    }
    private async getLoginBg() {
        const buffer = await request.getLoginBg();
        const url = utils.arrayBufferToBlob(buffer);
        return url;
    }
    // 定时任务, 每过config.time轮播图片
    private scheduleTask() {
        setInterval(async () => {
            this.fadeout = false;
            setTimeout(async () => {
                const url2 = this.bg2['background-image'].slice(4, -1);
                this.bg2['background-image'] = this.bg1['background-image'];
                window.URL.revokeObjectURL(url2); // 注销图片
                this.fadeout = true;
                const url = await this.getLoginBg();
                this.bg1['background-image'] = `url(${url})`;
            }, 1000);
        }, config.time);
    }
}
</script>
<style lang="scss" scoped>
@import '@/assets/css/mixin.scss';
.fade-leave-active {
    transition: opacity 1s ease;
}
.fade-leave-to {
    opacity: 0;
}
.background-slideshow {
    .slide {
        @include forcedCenter();
        z-index: -1;
        .wallpaper {
            width: 100%;
            height: 100%;
            background-size: cover;
            background-position-x: 50%;
            background-position-y: 0;
            transition: opacity 1s ease;
            opacity: 1;
        }
    }
}
@keyframes fadeIn {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
@keyframes fadeOut {
    0% {
        opacity: 1;
    }
    100% {
        opaticy: 0;
    }
}
</style>
