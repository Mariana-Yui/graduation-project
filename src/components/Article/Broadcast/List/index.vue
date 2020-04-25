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
export default class BroadcastList extends Vue {
    private type = 'broadcast';
}
</script>
<style lang="scss" scoped></style>
