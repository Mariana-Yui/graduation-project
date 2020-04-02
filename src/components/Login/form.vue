<template>
    <div class="form">
        <h1 class="nickname">{{ nickname }}</h1>
        <el-form
            :model="ruleForm"
            status-icon
            :rules="rules"
            ref="ruleForm"
            class="ruleForm"
            label-width="60px"
        >
            <el-form-item label="用户名" prop="username">
                <el-input v-model="ruleForm.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
            </el-form-item>
            <div class="captcha-wrapper">
                <el-form-item label="验证码" prop="captcha">
                    <el-input v-model="ruleForm.captcha" class="chapcha-text"></el-input>
                </el-form-item>
                <div class="svg-captcha" ref="captcha"></div>
            </div>
            <el-form-item>
                <el-button type="primary" @click="submitForm">提交</el-button>
                <el-button @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts">
const MINLENGTH = 5;
import { Component, Vue } from 'vue-property-decorator';
// import { Mutation, Action } from 'vuex-class';
import request from '@/utils/axios';
import config from '@/config/config.default';
import { LOGIN_PASSPORT } from '@/store/types';
import { getModule } from 'vuex-module-decorators';
import AdminModule from '@/store/modules/admin';

@Component
export default class LoginForm extends Vue {
    private ruleForm = {
        username: '',
        password: '',
        captcha: ''
    };
    private rules = {
        username: [{ validator: this.validateUsername, trigger: 'blur' }],
        password: [
            { validator: this.validatePassword, trigger: 'blur' },
            (this as any).$rules.min(MINLENGTH)
        ]
    };
    private captcha = {
        text: '',
        data: ''
    };
    private nickname = config.nickName;
    private adminModule: AdminModule;

    async created() {
        this.showCaptcha();
        this.adminModule = getModule(AdminModule, this.$store);
        this.$nextTick(() => {
            const self = this;
            (this.$refs['captcha'] as Element).addEventListener('click', function(ev) {
                self.showCaptcha();
            });
        });
    }
    private async showCaptcha() {
        this.captcha = await request.getCaptcha();
        (this.$refs['captcha'] as Element).innerHTML = this.captcha.data;
    }
    private validateUsername(rule: any, value: string, cb: Function) {
        const nameRules = (this as any).$rules;
        if (this.ruleForm.username === '') {
            cb(new Error(nameRules.isEmpty('用户名').message));
        } else if (!nameRules.name.pattern.test(this.ruleForm.username)) {
            cb(new Error(nameRules.name.message));
        } else {
            cb();
        }
    }
    private validatePassword(rule: any, value: string, cb: Function) {
        const passRules = (this as any).$rules;
        if (this.ruleForm.password === '') {
            cb(new Error(passRules.isEmpty('密码').message));
        } else {
            cb();
        }
    }
    public submitForm() {
        const _this = this as any;
        (this.$refs['ruleForm'] as any).validate(async (valid: any) => {
            // 帐号/密码格式正确
            if (valid) {
                // 验证码
                if (
                    String(this.captcha.text).toLowerCase() === this.ruleForm.captcha.toLowerCase()
                ) {
                    const data = await this.adminModule[LOGIN_PASSPORT](this.ruleForm);
                    if (data.code !== 0) {
                        this.$message(_this.$rules.message(data.message, 'error'));
                        this.showCaptcha();
                    } else {
                        this.$message(_this.$rules.message('登录成功, 正在跳转...'));
                        const redirect: string =
                            (this.$route.query.redirect as string) || '/dashboard';
                        this.$router.push({ path: redirect });
                    }
                } else {
                    this.$message(_this.$rules.message('验证码错误', 'error'));
                    this.showCaptcha();
                }
            } else {
                this.$message(_this.$rules.message('用户名/密码格式错误', 'error'));
            }
        });
    }
    public resetForm() {
        (this.$refs['ruleForm'] as any).resetFields();
    }
}
</script>
<style lang="scss" scoped>
@import '@/assets/css/font.scss';
@import '@/assets/css/default.scss';
.form {
    width: 364px;
    margin: 20vh auto 0;
    padding: 40px 0 38px;
    border-radius: 4px;
    background-color: rgba($color: $white, $alpha: 0.92);
    .nickname {
        font-family: 'MamaLove';
        font-size: 80px;
        letter-spacing: 5px;
        text-align: center;
        color: $lightblue;
    }
    .ruleForm {
        width: 300px;
        margin: 0 auto;
        .captcha-wrapper {
            display: flex;
            .svg-captcha {
                flex: 1;
                margin-left: 10px;
                height: 41px;
            }
        }
    }
}
</style>
