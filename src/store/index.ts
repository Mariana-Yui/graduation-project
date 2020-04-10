import Vue from 'vue';
import Vuex from 'vuex';
import admin from './modules/admin';
import qiniu from './modules/qiniu';
import upload from './modules/upload';
import menu from './modules/menu';
import permission from './modules/permission';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    modules: {
        admin,
        qiniu,
        upload,
        menu,
        permission
    }
});
