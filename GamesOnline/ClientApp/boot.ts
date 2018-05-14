import './css/site.css';
import 'bootstrap';
import { authService } from './components/authentication/auth';
import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
Vue.use(VueRouter);
Vue.use(Vuex);

const routes = [
    { path: '/', component: require('./components/home/home.vue.html') },
    { path: '/counter', component: require('./components/counter/counter.vue.html') },
    { path: '/fetchdata', component: require('./components/fetchdata/fetchdata.vue.html') },
    { path: '/authentication/login', component: require('./components/authentication/login/login.vue.html') },
    { path: '/authentication/register', component: require('./components/authentication/register/register.vue.html') },
    { path: '/authentication/account-settings', component: require('./components/authentication/account-settings/account-settings.vue.html') },
    { path: '/games', component: require('./components/games/games.vue.html') },
    { path: '/rankings', component: require('./components/rankings/rankings.vue.html') },
    { path: '/profile', component: require('./components/profile/profile.vue.html') },
    { path: '/gameview', component: require('./components/gameview/gameview.vue.html') }
];

const router = new VueRouter({
    mode: 'history',
    routes: routes
});

router.beforeEach((to, from, next) => {
    authService.isLoggedIn();
    next();
});

const store = new Vuex.Store({
    state: {
        isAuthenticated: false,
        username: ""
    },
    getters: {
        isAuthenticated: state => state.isAuthenticated,
        getUsername: state => state.username
    },
    mutations: {
        logIn(state) {
            state.isAuthenticated = true;
        },
        logOut(state) {
            state.isAuthenticated = false;
        }
    }
});

new Vue({
    el: '#app-root',
    store,
    router: router,
    render: h => h(require('./components/app/app.vue.html'))
});

export default store;