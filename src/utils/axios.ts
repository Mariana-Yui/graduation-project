/* eslint-disable indent */
import CryptoJS from 'crypto-js';
import * as qiniu from 'qiniu-js';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import router from '../router';
import config from '../config/config.default';
import utils from './utils';
import { getModule } from 'vuex-module-decorators';
import AdminModule from '@/store/modules/admin';
import store from '@/store';
import { ADMIN_LOGOUT } from '@/store/types';
const admin = getModule(AdminModule, store);

class Request {
    private instance: AxiosInstance;
    constructor() {
        const instance: AxiosInstance = axios.create({
            baseURL: config.baseURL
        });
        instance.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
        instance.interceptors.request.use(
            (config: AxiosRequestConfig) => {
                const token = utils.getItem('token');
                if (token) {
                    config.headers['Authorization'] = `bearer ${token}`; // not default
                }
                return config;
            },
            (error: AxiosError) => {
                return Promise.reject(error);
            }
        );
        instance.interceptors.response.use(
            (res: AxiosResponse) => res,
            (error: AxiosError) => {
                if (error.response && error.response.status) {
                    switch (error.response.status) {
                        case 401: {
                            const url = error.response.config.url;
                            if (!/\/login/.test(url)) {
                                router.replace({
                                    path: '/login',
                                    query: { redirect: '/dashboard' }
                                });
                            }
                            // utils.removeItem('token', '_id', 'userInfo');
                            admin[ADMIN_LOGOUT]();
                            break;
                        }
                    }
                }
                return Promise.reject(error);
            }
        );
        this.instance = instance;
    }
    /*******************************登录页**************************************/
    public async getCaptcha() {
        const { data } = await this.instance.get('/admin/getCaptcha');
        return data;
    }
    public async getLoginBg() {
        const { data } = await this.instance.get('/admin/getLoginBg', {
            responseType: 'arraybuffer'
        });
        return data;
    }
    public async getToken(username?: string, password?: string) {
        const { data } = await this.instance.post('/admin/login', {
            username,
            password
        });
        return data;
    }
    /*******************************个人资料**************************************/
    public async checkUsername(username: string) {
        const { data } = await this.instance.get('/profile/checkUsername', {
            params: {
                username
            }
        });
        return data;
    }
    public async updateUserInfo(info: Record<string, any>) {
        const { data } = await this.instance.post('/profile/updateProfile', info);
        return data;
    }
    public async checkPassword(username: string, password: string) {
        const { data } = await this.instance.post('/profile/checkPassword', {
            username,
            password: CryptoJS.MD5(password, config.secret_key).toString()
        });
        return data;
    }
    public async updatePassword(username: string, password: string) {
        const { data } = await this.instance.post('/profile/updatePassword', {
            username,
            password: CryptoJS.MD5(password, config.secret_key).toString()
        });
        return data;
    }
    /*******************************七牛云**************************************/
    public async getUpToken() {
        const { data } = await this.instance.get('/qiniu/getUpToken');
        return data;
    }
    public async uploadFile(
        file: Blob,
        key: string,
        token: string,
        putExtra: Record<string, any> = { fname: '', params: {}, mimeType: null },
        config = { useCdnDomain: true }
    ) {
        return new Promise((resolve, reject) => {
            const observer = {
                next: (res: any) => {
                    // console.log(res.total.percent);
                },
                error: (error: any) => {
                    console.log(error.message);
                    reject(error);
                },
                complete: (res: any) => {
                    resolve(res);
                }
            };
            const observable = qiniu.upload(file, key, token, putExtra, config);
            const subscription = observable.subscribe(observer);
        });
    }
    /*******************************管理员列表**************************************/
    public async getCurrentPageList(size: number, page: number) {
        const { data } = await this.instance.get('/user/admin/getlist', {
            params: {
                size,
                page
            }
        });
        return data;
    }
    public async getTotalNumber() {
        const { data } = await this.instance.get('/user/admin/gettotal');
        return data;
    }
    public async toggleUserStatus(username: string, enable: false) {
        const { data } = await this.instance.get('/user/admin/togglestatus', {
            params: {
                username,
                enable
            }
        });
        return data;
    }
    public async getAdminByKeywords(input = '', size: number, page: number) {
        const { data } = await this.instance.get('/user/admin/getadminbykeywords', {
            params: {
                input,
                size,
                page
            }
        });
        return data;
    }
    public async createNewAdmin(info: any) {
        const { data } = await this.instance.post('/user/admin/createnewadmin', {
            info
        });
        return data;
    }
    /*******************************发布文章**************************************/
    public async getAllUsername() {
        const { data } = await this.instance.get('/article/publish/getallusername');
        return data;
    }
}

const request = new Request();

export default request;
