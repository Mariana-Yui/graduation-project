<template>
    <div class="inner-dialog-wrapper">
        <!-- 修改密码内层弹窗 -->
        <el-dialog :width="dialogWidth" :title="dialogTitle" :visible.sync="innerVisible">
            <el-form :model="form" class="mini-padding" ref="ruleForm" :rules="rules">
                <el-form-item label="原密码" :label-width="formLabelWidth" prop="password">
                    <el-input
                        type="password"
                        v-model="form.old_password"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="新密码" :label-width="formLabelWidth" prop="newPassword">
                    <el-input
                        type="password"
                        v-model="form.new_password"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="确认密码" :label-width="formLabelWidth" prop="confirmPassword">
                    <el-input
                        type="password"
                        v-model="form.comfirm_password"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
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
    private form = {
        old_password: '',
        new_password: '',
        comfirm_password: ''
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
        if (!pattern.test(value)) {
            cb(new Error(message));
        }
        cb();
    }
    public validateConfirmPassword(rule: any, value: string, cb: Function) {
        if (value !== this.form.new_password) {
            cb(new Error('两次输入的密码不相同'));
        }
        cb();
    }
    public handleModifyPassword() {
        (this.$refs['ruleForm'] as any).validate((valid: boolean) => {
            if (valid) {
                // TODO update password
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
