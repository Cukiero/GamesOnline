import axios from 'axios';
import moment from 'moment';
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
    computed: mapGetters({
        isAuthenticated: 'isAuthenticated',
        username: 'getUsername',
        avatarPath: 'getAvatarPath'
    }),
    filters: {
        formatDate(value: Date) {
            if (value) {
                return moment(String(value)).format('DD/MM/YYYY HH:mm');
            }
        }
    } 
})
export default class ProfileComponent extends Vue {

    public image = {} as File;

    public onPhotoChange(event: any) {
        var fd = new FormData();
        this.image = event.target.files[0];
        alert(this.image.name);
        fd.append('image', this.image, this.image.name);
        axios({
            method: 'post',
            url: '/api/account/ChangePhoto/',
            data: fd,
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(response => {
                alert(JSON.stringify(response.data))
            })
            .catch(function (error) {
                alert(error);
            });
    }
}