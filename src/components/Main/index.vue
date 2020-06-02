<template>
    <component :is="currentRole"></component>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AdminPage from './role/admin.vue';
import AuthorPage from './role/author.vue';
import { getModule } from 'vuex-module-decorators';
import AdminModule from '@/store/modules/admin';

@Component({
    components: {
        AdminPage,
        AuthorPage
    }
})
export default class HomePage extends Vue {
    private currentRole!: string;

    public created() {
        const admin = getModule(AdminModule, this.$store);
        this.currentRole = admin.userInfo.role === 'admin' ? 'AdminPage' : 'AuthorPage';
    }
}
</script>
<style lang="scss" scoped></style>
