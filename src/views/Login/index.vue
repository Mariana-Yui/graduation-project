<template>
    <div class="login">
        <!-- 登录页面轮播背景 -->
        <login-background></login-background>
        <login-form></login-form>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import LoginBackground from '@/components/Login/background.vue';
import LoginForm from '@/components/Login/form.vue';

@Component({
    components: {
        LoginBackground,
        LoginForm
    }
})
export default class Login extends Vue {}
</script>
