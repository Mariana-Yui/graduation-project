<template>
    <common-list :type="type"></common-list>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CommonList from '@/components/Article/commonList.vue';

@Component({
    components: {
        CommonList
    }
})
export default class FilmList extends Vue {
    private type = 'film';
}
</script>
<style lang="scss" scoped></style>
