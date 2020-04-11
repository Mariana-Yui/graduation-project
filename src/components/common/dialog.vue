<template>
    <!-- Layout/Header/dialog.vue的抽象组件, 写header的时候没想到其他地方还要用到, 西嘛大quq, header那个有时间再用通用组件替换吧 -->
    <div class="dialog-wrapper">
        <el-dialog
            :visible.sync="dialogVisible"
            :width="dialogWidth"
            :show-close="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
        >
            <slot name="title"></slot>
            <el-form :model="elForm" class="mini-padding" ref="ruleForm" :rules="rules">
                <el-form-item label="昵称" :label-width="formLabelWidth" prop="username">
                    <el-input v-model="elForm.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" :label-width="formLabelWidth" prop="phone">
                    <el-input v-model="elForm.phone" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
                    <el-input v-model="elForm.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="个性签名" :label-width="formLabelWidth">
                    <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="elForm.description"
                        prop="sign"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item
                    label="用户类型"
                    :label-width="formLabelWidth"
                    prop="role_name"
                    v-if="isAdmin"
                >
                    <el-radio v-model="elForm.role" label="author">用户</el-radio>
                    <el-radio v-model="elForm.role" label="admin">管理员</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeDialogOnly">取 消</el-button>
                <el-button type="success" @click="triggerCloseDialog">更新资料</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import request from '@/utils/axios';

@Component
export default class ProfileDialog extends Vue {
    @Prop() form!: { username: string; email: string; phone: string; description: string };
    @Prop() dialogVisible: boolean;
    @Prop({ default: false }) isAdmin: boolean;
    private elForm = {
        username: '',
        email: '',
        phone: '',
        description: '',
        role: '',
        role_name: ''
    };
    private formLabelWidth = '80px';
    private dialogWidth = '30%';
    private rules = {
        username: [
            (this as any).$rules.name,
            (this as any).$rules.required('用户名不能为空'),
            { validator: this.validateUsername, trigger: 'blur' }
        ],
        phone: [(this as any).$rules.mobile, (this as any).$rules.required('手机号码不能为空')],
        email: [(this as any).$rules.email, (this as any).$rules.required('邮箱不能为空')],
        sign: [{ validator: this.validateSign, trigger: 'blur' }]
    };

    public created() {
        console.log(this.elForm);
        this.elForm = Object.assign({}, this.elForm, this.form);
    }
    public async validateUsername(rule: any, value: string, cb: Function) {
        if (value === this.form.username) cb();
        const { pattern, message } = (this as any).$rules.xss;
        if (pattern.test(value)) {
            return cb(new Error(message));
        }
        const data = await request.checkUsername(value);
        if (data.code !== 0) {
            cb(new Error(data.message));
        } else {
            cb();
        }
    }
    public validateSign(rule: any, value: string, cb: Function) {
        const { pattern, message } = (this as any).$rules.xss;
        if (pattern.test(value)) {
            cb(new Error(message));
        } else {
            cb();
        }
    }
    @Emit('close-dialog')
    public closeDialogOnly() {
        return '';
    }
    @Emit('close-dialog')
    public triggerCloseDialog() {
        this.elForm.role_name = this.elForm.role === 'admin' ? '管理员' : '用户';
        return this.elForm;
    }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/css/default.scss';

.dialog-wrapper {
    .mini-padding {
        padding: 0 50px !important;
    }
    ::v-deep .el-input,
    .el-textarea {
        width: 80%;
    }
}
</style>
