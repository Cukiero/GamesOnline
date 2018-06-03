import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Credentials } from '../../../models/credentialsModel';
import { authService } from '../auth';
import '../auth.css';
import VeeValidate from 'vee-validate'
Vue.use(VeeValidate);

@Component
export default class LoginComponent extends Vue {

    public user = {} as Credentials;
    public message: string = "";

    public submit() {
        this.$validator.validateAll().then(result => {
            if (result) {
                authService.login(this.user).then(status => {
                    if (status == 200) {
                        this.user.Username = "";
                        this.user.Password = "";
                        this.$router.push('/');
                    } else {
                        this.user.Password = "";
                        if (status == 404) {
                            this.message = "Incorrect login or password.";
                        }else {
                            this.message = "Wrong data." + JSON.stringify(status);
                        }
                    }
                });
            }
        });
    }
}
