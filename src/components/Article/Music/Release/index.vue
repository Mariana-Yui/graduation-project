<template>
    <common-article :type="type" :music_info="selectedSong">
        <template v-slot:music>
            <div class="music-wrapper">
                <div class="music-title">音乐板块设置:</div>
                <div class="main-music player-parent">
                    <el-autocomplete
                        class="music-input"
                        popper-class="my-autocomplete"
                        v-model="state"
                        :fetch-suggestions="querySearch"
                        :trigger-on-focus="true"
                        placeholder="请输入歌曲名称"
                        @select="handleSelect"
                        @focus="handleFocus"
                        @blur="handleBlur"
                    >
                        <template slot-scope="{ item }">
                            <div class="music-item">
                                <div class="music-name">{{ item.name }}</div>
                                <span class="music-suffix">
                                    {{ item.artists + (item.album ? '-' : '') + item.album }}
                                </span>
                            </div>
                        </template>
                    </el-autocomplete>
                    <div class="meplayer player-child"></div>
                </div>
                <div :class="{ 'plain-placeholder': true, 'higher': focus }"></div>
            </div>
        </template>
    </common-article>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import '@/components/common/meplayer/js/main';
import '@/components/common/meplayer/dist/meplayer.min.css';
import CommonArticle from '@/components/Article/commonArticle.vue';
import request from '@/utils/axios';
import config from '@/config/config.default';

@Component({
    components: {
        CommonArticle
    }
})
export default class CreateMusic extends Vue {
    private type = 'music';
    private songs: any[] = [];
    private selectedSong = {};
    private state = ''; // 搜索框value
    private prev: string | number = -1; // 缓存上次搜索内容, 默认是number,这样和string就一定不相等
    private focus = false;
    private MePlayer = window.mePlayer;

    private formatSongs(songs: any[]) {
        return songs.slice(0, 6).map((song: any) => {
            const {
                id,
                name,
                ar,
                al: { name: album, picUrl: cover }
            } = song;
            const artists = (ar as Array<any>)
                .reduce((prev, cur) => {
                    return prev + cur.name + '/';
                }, '')
                .slice(0, -1);
            const resizeCover = cover ? cover + '?param=100y100' : config.default_cover; //默认佚名图片
            return {
                id,
                name,
                artists,
                cover: resizeCover,
                album
            };
        });
    }
    // cb(result)
    public async querySearch(keywords: string, cb: Function) {
        if (keywords !== '' && keywords !== this.prev) {
            if (this.prev !== -1) this.prev = -1;
            const { code, info } = await request.searchMusicByKeywords(keywords);
            if (code === 0) {
                this.songs = this.formatSongs(info);
                cb(this.songs);
            } else {
                this.$message.error('搜索好像出了点问题，请重新搜索');
            }
        } else {
            const { code, info } = await request.getMusicByDefaultKeywords();
            if (code === 0) {
                this.songs = this.formatSongs(info);
                cb(this.songs);
            } else {
                this.$message.error('搜索好像出了点问题，请重新搜索');
            }
        }
    }
    public handleFocus() {
        this.focus = true;
    }
    public handleBlur() {
        this.focus = false;
        this.prev = this.state;
    }
    public async handleSelect(song: any) {
        // TODO 获取lyric 先不获取了quq
        const { code, info } = await request.getSpecificSongUrls(song.id);
        if (code === 0) {
            song.urls = info;
            delete song.id;
            this.selectedSong = song;
            this.MePlayer({
                target: '.music-player',
                music: {
                    src: song.urls[0],
                    title: song.name,
                    author: song.artists,
                    cover: song.cover
                    // lrc: ''
                },
                autoplay: false
            });
        } else {
            this.$message.error('暂时获取不到歌曲链接，请选择其他歌曲');
        }
    }
}
</script>
<style lang="scss" scoped>
.music-wrapper {
    margin-top: 40px;
    .music-title {
        padding-bottom: 40px;
    }
    .main-music {
        .music-input {
            width: 20%;
        }
    }
    .player-parent {
        position: relative;
        .player-child {
            position: absolute;
            width: 40%;
            top: -25px;
            left: 30%;
        }
    }
    .plain-placeholder {
        height: 0;
        transition: height 0.3s ease-in-out;
        &.higher {
            height: 200px;
        }
    }
}
</style>
