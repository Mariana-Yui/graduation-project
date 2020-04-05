<template>
    <div class="inner-dialog-wrapper">
        <!-- 修改密码内层弹窗 -->
        <el-dialog
            :width="dialogWidth"
            :title="dialogTitle"
            :visible.sync="innerVisible"
            :close-on-click-modal="false"
            :destroy-on-close="true"
            :show-close="false"
        >
            <el-form :model="form" class="mini-padding" ref="ruleForm" :rules="rules">
                <el-form-item label="原密码" :label-width="formLabelWidth" prop="password">
                    <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码" :label-width="formLabelWidth" prop="newPassword">
                    <el-input
                        type="password"
                        v-model="form.newPassword"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="确认密码" :label-width="formLabelWidth" prop="confirmPassword">
                    <el-input
                        type="password"
                        v-model="form.confirmPassword"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeInnerDialog">取 消</el-button>
                <el-button type="success" @click="handleModifyPassword">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import request from '@/utils/axios';

@Component
export default class InnerDialog extends Vue {
    @Prop() formLabelWidth!: string;
    @Prop() username!: string;
    private dialogWidth = '20%';
    private dialogTitle = '修改密码';
    private innerVisible = false;
    // form字段和rules字段保持一致
    private form = {
        password: '',
        newPassword: '',
        confirmPassword: ''
    };
    private rules = {
        password: [
            (this as any).$rules.required('请输入旧密码'),
            { validator: this.validatePassword, trigger: 'blur' }
        ],
        newPassword: [
            (this as any).$rules.required('请输入新密码'),
            { validator: this.validateNewPassword, trigger: 'blur' }
        ],
        confirmPassword: [
            (this as any).$rules.required('请输入确认密码'),
            { validator: this.validateConfirmPassword, trigger: 'blur' }
        ]
    };
    public async validatePassword(rule: any, value: string, cb: Function) {
        const data = await request.checkPassword(this.username, value);
        if (data.code !== 0) {
            cb(new Error('密码不正确'));
        }
        cb();
    }
    public validateNewPassword(rule: any, value: string, cb: Function) {
        const { pattern, message } = (this as any).$rules.password;
        if (value === this.form.password) {
            cb(new Error('新密码不能与旧密码相同'));
        } else if (!pattern.test(value)) {
            cb(new Error(message));
        }
        cb();
    }
    public validateConfirmPassword(rule: any, value: string, cb: Function) {
        if (value !== this.form.newPassword) {
            cb(new Error('两次输入的密码不相同'));
        }
        cb();
    }
    public closeInnerDialog() {
        this.form = {
            password: '',
            newPassword: '',
            confirmPassword: ''
        };
        this.innerVisible = false;
    }
    public handleModifyPassword() {
        (this.$refs['ruleForm'] as any).validate(async (valid: boolean) => {
            if (valid) {
                const data = await request.updatePassword(this.username, this.form.newPassword);
                if (data.code === 0) {
                    this.$message((this as any).$rules.message(data.message));
                } else {
                    this.$message((this as any).$rules.message(data.message, 'error'));
                }
            } else {
                this.$message((this as any).$rules.message('请填写正确密码', 'error'));
            }
        });
    }
}
</script>
<style lang="scss" scoped>
.inner-dialog-wrapper {
    ::v-deep .el-dialog {
        margin-top: 20vh !important;
    }
    ::v-deep .el-input {
        width: 80% !important;
    }
    ::v-deep .el-dialog__body {
        padding-bottom: 0 !important;
    }
    ::v-deep .el-dialog__footer {
        padding-top: 0 !important;
    }
}
</style>
