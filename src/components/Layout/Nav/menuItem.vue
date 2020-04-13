<template>
    <!-- 多级菜单递归组件 -->
    <div ref="wrapper" class="el-submenu-wrapper">
        <!-- 这里外层mounted之后要unwrap否则element-ui样式出错, 也可以重写样式,但是我不:D -->
        <el-menu-item
            v-if="
                route.name === 'Dashboard' ||
                    !route.children ||
                    (route.children && !route.children.length)
            "
            :index="route.meta && route.meta.index"
        >
            <router-link tag="div" :to="{ path: absolutePath }" class="el-menu-item-div">
                <i v-if="route.name === 'Dashboard'" :class="route.meta && route.meta.icon"></i>
                <span>{{ route.title }}</span>
            </router-link>
        </el-menu-item>
        <el-submenu
            v-if="route.name !== 'Dashboard' && route.children && route.children.length"
            :index="route.meta && route.meta.index"
        >
            <template slot="title">
                <i :class="route.meta && route.meta.icon"></i>
                <span slot="title">{{ route.title }}</span>
            </template>
            <menu-item
                v-for="r of route.children"
                :path="absolutePath"
                :key="r.name"
                :route="r"
            ></menu-item>
        </el-submenu>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { RouteConfig } from 'vue-router';
import utils from '../../../utils/utils';

@Component
export default class MenuItem extends Vue {
    @Prop() route!: RouteConfig;
    @Prop({ default: '' }) path!: string;

    get absolutePath() {
        return (
            this.path +
            (this.route.path.indexOf('/') > -1 ? this.route.path : '/' + this.route.path) +
            ''
        );
    }

    public mounted() {
        this.$nextTick(() => {
            // unwrap div
            const el: HTMLElement = this.$refs['wrapper'] as HTMLElement;
            const parent = el.parentNode;
            while (el.firstChild) parent.insertBefore(el.firstChild, el);
            parent.removeChild(el);
        });
    }
}
</script>
<style lang="scss" scoped></style>
