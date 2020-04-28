import Vue from 'vue';

declare module '*.vue' {
    export default Vue;
}

// 全局方法声明
declare module 'vue/types/vue' {
    interface Vue {
        $rules: any;
    }
}

declare global {
    interface Window {
        tinyMCE: any;
        mePlayer: any;
        returnCitySN?: {
            cip: string;
            cid: string;
            cname: string;
        };
    }
}
