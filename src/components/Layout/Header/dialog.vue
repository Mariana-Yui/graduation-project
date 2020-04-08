<template>
    <div class="dialog-wrapper">
        <el-dialog title="个人信息" :visible.sync="dialogFormVisible" :width="dialogWidth">
            <el-form :model="form" class="mini-padding" ref="ruleForm" :rules="rules">
                <div class="profile-avatar">
                    <span>头像</span>
                    <img :src="form.avatar" alt="avatar" />
                    <!-- TODO avatar -->
                    <el-button
                        type="primary"
                        icon="el-icon-upload2"
                        @click="openUploadFileDialog"
                        plain
                    >
                        更换头像
                    </el-button>
                </div>
                <el-form-item label="昵称" :label-width="formLabelWidth" prop="username">
                    <el-input v-model="form.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" :label-width="formLabelWidth" prop="phone">
                    <el-input v-model="form.phone" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
                    <el-input v-model="form.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="个性签名" :label-width="formLabelWidth">
                    <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="form.description"
                        prop="sign"
                    >
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="openPasswordModifiedDialog" plain
                    >修改密码</el-button
                >
                <el-button type="success" @click="triggerCloseDialog">更新资料</el-button>
            </div>
        </el-dialog>
        <inner-dialog
            ref="innerDialog"
            :formLabelWidth="formLabelWidth"
            :username="form.username"
        ></inner-dialog>
        <upload-dialog ref="uploadDialog" @uploadSuccess="openImageCropper">
            <image-cropper ref="imageCropper" @changeAvatar="handleChangeAvatar"></image-cropper>
        </upload-dialog>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import * as _ from 'lodash';
import request from '@/utils/axios';
import { getModule } from 'vuex-module-decorators';
import AdminModule from '@/store/modules/admin';
import UploadModule from '@/store/modules/upload';
import { UPDATE_ADMIN_INFO, SET_UPLOAD_IMAGE_URL } from '@/store/types';
import InnerDialog from './innerDialog.vue';
import UploadDialog from '@/components/common/upload.vue';
import ImageCropper from '@/components/common/imageCropper.vue';

@Component({
    components: {
        InnerDialog,
        UploadDialog,
        ImageCropper
    }
})
export default class ProfileDialog extends Vue {
    private upload: UploadModule;
    private admin: AdminModule;
    private dialogWidth = '30%';
    private form = { username: '', email: '', phone: '', avatar: '', description: '' };
    private formLabelWidth = '80px';
    private dialogFormVisible = false;
    private innerVisible = true;
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
        this.admin = getModule(AdminModule, this.$store);
        this.form = _.pick(this.admin.userInfo, [
            'username',
            'email',
            'phone',
            'avatar',
            'description'
        ]) as any;
        this.upload = getModule(UploadModule, this.$store);
    }
    public async validateUsername(rule: any, value: string, cb: Function) {
        if (value === this.admin.userInfo.username) cb();
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
    public triggerCloseDialog() {
        (this.$refs['ruleForm'] as any).validate(async (valid: boolean) => {
            if (valid) {
                // 写入本地及vuex
                const message = await this.admin[UPDATE_ADMIN_INFO](this.form);
                if (message) {
                    this.$message((this as any).$rules.message(message));
                }
                this.dialogFormVisible = false;
            } else {
                this.$message((this as any).$rules.message('请填写有效信息', 'error'));
            }
        });
    }
    public openPasswordModifiedDialog() {
        (this.$refs['innerDialog'] as any).innerVisible = true;
    }
    public openUploadFileDialog() {
        (this.$refs['uploadDialog'] as any).dialogVisible = true;
    }
    // 打开图片裁剪dialog
    public openImageCropper(url: string) {
        (this.$refs['imageCropper'] as any).dialogVisible = true;
        this.upload[SET_UPLOAD_IMAGE_URL](url);
    }
    public handleChangeAvatar(avatar_url: string) {
        this.form.avatar = avatar_url;
    }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/css/default.scss';

.dialog-wrapper {
    .mini-padding {
        padding: 0 50px !important;
    }
    .profile-avatar {
        display: flex;
        align-items: center;
        margin-bottom: $margin-bottom;
        span {
            box-sizing: border-box;
            width: $width;
            font-size: 14px;
            text-align: right;
            padding: 0 12px 0 0;
        }
        img {
            margin: 0 32px 0 20px;
            width: 60px;
            height: 60px;
            border-radius: 50% 50%;
            background-position: 50%;
            background-size: cover;
        }
        ::v-deep .el-button {
            padding: 6px 10px;
            margin-top: 30px;
            span {
                margin-left: 0 !important;
            }
        }
    }
    ::v-deep .el-input,
    .el-textarea {
        width: 80%;
    }
}
</style>
