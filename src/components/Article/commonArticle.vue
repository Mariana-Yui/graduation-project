<template>
    <div class="create-article-wrapper">
        <el-row type="flex" align="middle" justify="center" class="title-wrapper">
            <el-col :span="2" class="title">标题:</el-col>
            <el-col :span="18">
                <el-input placeholder="请输入标题" v-model="title" clearable></el-input>
            </el-col>
        </el-row>
        <el-row type="flex" align="middle" justify="center" class="author-publishtime-wrapper">
            <el-col :span="2" class="author-name">作者:</el-col>
            <el-col :span="8">
                <template v-if="isAdmin">
                    <el-select
                        v-model="author"
                        placeholder="请选择"
                        v-if="candidates && candidates.length"
                    >
                        <el-option
                            v-for="(user, key) of candidates"
                            :key="key"
                            :label="user"
                            :value="user"
                        >
                        </el-option>
                    </el-select>
                </template>
                <template v-else>
                    <el-input placeholder="请输入内容" v-model="author" :disabled="true">
                    </el-input>
                </template>
            </el-col>
            <el-col :span="2" class="publish-time">发布时间:</el-col>
            <el-col :span="8">
                <el-date-picker
                    v-model="value2"
                    align="right"
                    type="date"
                    placeholder="选择日期"
                    :picker-options="pickerOptions"
                >
                </el-date-picker>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import AdminModule from '@/store/modules/admin';
import request from '../../utils/axios';

@Component
export default class ArticleCommon extends Vue {
    private admin!: AdminModule;
    private author!: string;
    private candidates: string[] = [];
    private title = '';

    get isAdmin() {
        return this.admin.userInfo.role === 'admin' ? true : false;
    }
    public created() {
        this.admin = getModule(AdminModule, this.$store);
    }
    public async mounted() {
        if (this.isAdmin) {
            const data = await request.getAllUsername();
            if (data.code === 0) {
                this.candidates = data.info.user;
                this.author = this.candidates[0];
            }
        } else {
            this.author = this.admin.userInfo.username;
        }
    }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/css/default.scss';

.create-article-wrapper {
    margin: 30px auto 0;
    width: 90%;
    box-sizing: border-box;
    color: $gray;
    .title-wrapper {
        .title {
            text-align: center;
        }
    }
    .author-publishtime-wrapper {
        margin-top: 30px;
        .author-name,
        .publish-time {
            text-align: center;
        }
    }
}
</style>
