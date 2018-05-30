import axios from 'axios';
import moment from 'moment';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters, mapMutations } from 'vuex';

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
    },
    methods: mapMutations([
        'changeAvatarPath'
        ])
})
export default class ProfileComponent extends Vue {

    public image = {} as File;

    mounted() {
        var img = document.getElementById('profile-avatar') as HTMLImageElement;
        img.src = img.src + "?" + new Date().getTime();
    }

    public onPhotoChange(event: any) {
        var fd = new FormData();
        this.image = event.target.files[0];
        fd.append('image', this.image, this.image.name);
        axios({
            method: 'post',
            url: '/api/account/ChangePhoto/',
            data: fd,
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(response => {
                var img = document.getElementById('profile-avatar') as HTMLImageElement;
                img.src = response.data.avatarPath + "?" + new Date().getTime();
                this.$store.commit('changeAvatarPath', response.data.avatarPath);
            })
            .catch(function (error) {
                alert(error);
            });
    }
}