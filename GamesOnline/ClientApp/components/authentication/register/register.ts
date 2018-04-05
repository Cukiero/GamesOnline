import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Registration } from '../../../models/registrationModel';
import { authService } from '../auth';
import '../auth.css';
import VeeValidate from 'vee-validate';
Vue.use(VeeValidate);

@Component
export default class RegisterComponent extends Vue {

    public user = {} as Registration;
    public password_confirm: string = "";
    public message: string = "";

    public submit() {
        this.$validator.validateAll().then(result => {
            if (result) {
                authService.register(this.user).then(status => {
                    if (status == 201) {
                        this.$router.push('/authentication/login');
                    } else {
                        this.user.Username = "";
                        this.user.Email = "";
                        this.password_confirm = "";
                        this.user.Password = "";
                        if (status == 409) {
                            this.message = "User already exists.";
                        } else {
                            this.message = "Wrong data.";
                        }
                    }
                });
            } else {
                this.message = "Validation unssuccesfull.";
            }
        });
    }
}