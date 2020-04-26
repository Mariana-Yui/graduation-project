<template>
    <div class="editor-wrapper">
        <editor
            :id="id"
            v-model="content"
            :init="init"
            :disabled="disabled"
            @onInit="handleInit"
        ></editor>
        <upload-button @success-upload="handleSuccessUpload"></upload-button>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import tinymce from 'tinymce';
import editor from '@tinymce/tinymce-vue';
import 'tinymce/themes/silver';
import './plugin';
import UploadButton from './uploadButton.vue';
import config from '@/config/config.default';

@Component({
    components: {
        editor,
        UploadButton
    }
})
export default class TinymceEditor extends Vue {
    @Prop({ default: false }) disabled: boolean;
    @Prop({
        default: config.tinymce_plugins
    })
    plugins: string | string[];
    @Prop({
        default: config.tinymce_toolbar
    })
    toolbar: string | string[];
    @Prop({ default: 300 }) height!: number;
    private id = 'tiny-editor';
    private init = {
        language_url: '/tinymce/langs/zh_CN.js',
        language: 'zh_CN',
        skin_url: '/tinymce/skins/ui/oxide',
        content_css: '/tinymce/skins/content/default/content.css',
        height: this.height,
        plugins: this.plugins,
        toolbar: this.toolbar,
        branding: false,
        menubar: true,
        elementpath: false,
        statusbar: true,
        paste_data_images: true,
        images_upload_handler: (blobInfo: any, success: Function, failure: Function) => {
            const img = 'data:image/jpeg;base64,' + blobInfo.base64();
            success(img);
        }
    };
    private content = '';

    public created() {
        tinymce.init({});
    }
    public handleInit() {
        this.$emit('editor-inited');
    }
    public handleSuccessUpload(res: any[]) {
        res.forEach((record: any) => {
            window.tinyMCE.editors[this.id].insertContent(
                `<img src="${config.upload_domain}/${record.key}" alt="" width="50%" />`
            );
        });
    }
}
</script>
<style lang="scss" scoped>
.editor-wrapper {
    position: relative;
}
</style>
