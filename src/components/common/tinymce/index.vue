<template>
    <div class="editor-wrapper">
        <editor
            id="tiny-editor"
            v-model="content"
            :init="init"
            :disabled="disabled"
            @onInit="handleInit"
        ></editor>
        <upload-button></upload-button>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import tinymce from 'tinymce';
import editor from '@tinymce/tinymce-vue';
import 'tinymce/themes/silver';
import './plugin';
import UploadButton from './uploadButton.vue';

@Component({
    components: {
        editor,
        UploadButton
    }
})
export default class TinymceEditor extends Vue {
    @Prop({ default: false }) disabled: boolean;
    @Prop({
        default:
            'lists image media table wordcount code fullscreen help codesample toc insertdatetime searchreplace link charmap paste hr'
    })
    plugins: string | string[];
    @Prop({
        default: () => [
            'bold italic underline strikethrough blockquote|forecolor backcolor|formatselect |fontsizeselect | alignleft aligncenter alignright alignjustify | outdent indent |codeformat blockformats| removeformat undo redo ',
            'bullist numlist toc pastetext|codesample charmap  hr insertdatetime |lists image media table link unlink |code searchreplace fullscreen help '
        ]
    })
    toolbar: string | string[];
    @Prop({ default: 300 }) height!: number;
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
        console.log();
    }
    // public
}
</script>
<style lang="scss" scoped>
.editor-wrapper {
    position: relative;
}
</style>
