<template>
    <div class="upload-dialog-wrapper">
        <el-upload class="upload-demo" drag :auto-upload="false" :file-list="fileList">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过1MB</div>
        </el-upload>
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component
export default class App extends Vue {}
</script>
<style lang="scss" scoped></style>
