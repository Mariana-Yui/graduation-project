<template>
    <!-- WDNMD noresize老子信了你的邪设置成true, scrollbar直接不显示,我TM还以为哪里样式有问题搞了老子半天 -->
    <el-scrollbar :native="false" :noresize="false" class="scroller">
        <slot></slot>
    </el-scrollbar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class MyScrollbar extends Vue {}
</script>
<style lang="scss" scoped>
@import '~@/assets/css/default.scss';

.scroller {
    width: 100%;
    max-height: calc(100vh - 61px - 30px);
}
::v-deep .el-scrollbar__wrap {
    overflow-x: hidden;
}
/* ::v-deep .el-scrollbar__bar.is-vertical {
    width: 10px !important;
    transition: background-color 0.3s;
    .el-scrollbar__thumb {
        background-color: $lightgray;
    }
} */
</style>
