import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { authService } from '../authentication/auth';
import { mapGetters } from 'vuex';
import $ from 'jquery';

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

    mounted() {
        $('.navbar-collapse a:not(.dropdown-toggle)').click(function () {
            if ($('.navbar-toggle').css("display") != "none") {
                $('.navbar-toggle').click();
            }
        });
    }
}