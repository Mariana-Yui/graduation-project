/* eslint-disable indent */
import CryptoJS from 'crypto-js';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import router from '../router';
import config from '../config/config.default';
import utils from './utils';

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
                            utils.removeItem('token', '_id', 'userInfo');
                            break;
                        }
                    }
                }
                return Promise.reject(error);
            }
        );
        this.instance = instance;
    }
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
        console.log(password);
        const { data } = await this.instance.post('/profile/checkPassword', {
            username,
            password: CryptoJS.MD5(password, config.secret_key).toString()
        });
        return data;
    }
}

const request = new Request();

export default request;
