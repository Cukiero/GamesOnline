import Vue from 'vue';
import axios from 'axios';
import { Registration } from '../../models/registrationModel';
import { Credentials } from '../../models/credentialsModel';
import { Component } from 'vue-property-decorator';
import { VueRouter } from 'vue-router/types/router';
import  store  from '../../boot';

export default class AuthService extends Vue {

    private static instance: AuthService;
    
    public register(registration: Registration): Promise<number> {
        return axios({
            method: 'post',
            url: '/api/account/register',
            data: registration,
            headers: { 'Content-Type': 'application/json' }
        })
            .then(function (response) {
                return response.status;
            })
            .catch(function (error) {
                return error.response.status;
            });
    };

    public login(credentials: Credentials): Promise<number> {
        return axios({
            method: 'post',
            url: '/api/account/login',
            data: credentials,
            headers: { 'Content-Type': 'application/json' }
        })
            .then(function (response) {
                store.state.isAuthenticated = true;
                store.state.username = response.data.userName;
                store.state.avatarPath = response.data.avatarPath;
                return response.status;
            })
            .catch(function (error) {
                return error.response.status;
            });
    };

    public isLoggedIn() {
        return axios({
            method: 'post',
            url: '/api/account/isloggedin'
        })
            .then(function (response) {
                store.state.isAuthenticated = true;
                store.state.username = response.data.userName;
                store.state.avatarPath = response.data.avatarPath;
            })
            .catch(function (error) {
                store.state.isAuthenticated = false;
                store.state.username = "";
                store.state.avatarPath = "";
            });
    }

    public logout() {
        return axios({
            method: 'post',
            url: '/api/account/logout'
        })
            .then(function (response) {
                store.state.isAuthenticated = false;
                store.state.username = "";
                store.state.avatarPath = "";
            })
    }

    public static get Instance() {
        return this.instance || (this.instance = new this());
    };
}

export const authService = AuthService.Instance;