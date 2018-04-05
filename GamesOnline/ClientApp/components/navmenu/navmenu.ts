import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { authService } from '../authentication/auth';
import { mapGetters } from 'vuex';

@Component({
    computed: mapGetters({
        isAuthenticated: 'isAuthenticated',
        username: 'getUsername'
    })
})
export default class NavmenuComponent extends Vue {


    logout() {
        authService.logout();
    }
}