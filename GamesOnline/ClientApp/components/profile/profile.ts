import axios from 'axios';
import moment from 'moment';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters, mapMutations } from 'vuex';
import { Friend, FriendInvite, UserInvite, User } from '../../models/profileModels';

@Component({
    computed: mapGetters({
        isAuthenticated: 'isAuthenticated',
        username: 'getUsername',
        avatarPath: 'getAvatarPath'
    }),
    filters: {
        formatDate(value: Date) {
            if (value) {
                return moment(String(value)).format('DD/MM/YYYY');
            }
        }
    },
    methods: mapMutations([
        'changeAvatarPath'
        ])
})
export default class ProfileComponent extends Vue {

    public image = {} as File;
    public friends: Friend[] = [];
    public friendInvites: FriendInvite[] = [];
    public userInvites: UserInvite[] = [];
    public users: User[] = [];
    public sidePanelData: string = "history";

    mounted() {
        var img = document.getElementById('profile-avatar') as HTMLImageElement;
        img.src = img.src + "?" + new Date().getTime();
        this.getFriends();
        this.getFriendInvites();
        this.getUserInvites();
        this.getUsers();
    }

    public viewHistory() {
        this.sidePanelData = "history";
    }

    public viewInvites() {
        this.sidePanelData = "invites";
    }

    public inviteUser(userId: string, event: Event) {
        var el = event.target as HTMLSpanElement;
        axios({
            method: 'post',
            url: '/api/friends/invitefriend',
            params: { friendId: userId },
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                el.innerText = "Invitation Sent";
            })
            .catch(function (error) {
                alert(error);
            });
    }

    public isFriend(userId: string): boolean {

        for (let friend of this.friends) {
            if (friend.userFriend.userId == userId) {
                return true;
            }
        }
        return false;
    }

    public isInvited(userId: string): boolean {

        for (let invite of this.userInvites) {
            if (invite.userInvited.userId == userId) {
                return true;
            }
        }
        return false;
    }

    public acceptInvite(inviteId: number) {
        axios({
            method: 'post',
            url: '/api/friends/acceptfriendinvite',
            params: { inviteId: inviteId },
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                this.removeInviteFromList(inviteId);
                this.friends.unshift(response.data);
            })
            .catch(function (error) {
                alert(error);
            });
    }

    public removeFriend(friendId: string) {
        axios({
            method: 'post',
            url: '/api/friends/removefriend',
            params: { friendId: friendId },
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                this.removeFriendFromList(friendId)
            })
            .catch(function (error) {
                alert(error);
            });
    }

    public removeFriendFromList(friendId: string) {
        this.friends.forEach((friend, index) => {
            if (friend.userFriend.userId == friendId) {
                this.friends.splice(index, 1);
            }
        })
    }

    public removeInviteFromList(inviteId: number) {
        this.friendInvites.forEach((invite, index) => {
            if (invite.id == inviteId) {
                this.friendInvites.splice(index, 1);
            }
        })
    }

    public getUsers() {
        axios({
            method: 'get',
            url: '/api/friends/getusers',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                this.users = response.data;
            })
            .catch(function (error) {
                alert(error);
            });
    }

    public getFriends() {
        axios({
            method: 'get',
            url: '/api/friends/getfriends',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                this.friends = response.data;
            })
            .catch(function (error) {
                alert(error);
            });
    }

    public getFriendInvites() {
        axios({
            method: 'get',
            url: '/api/friends/getfriendinvites',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                this.friendInvites = response.data;
            })
            .catch(function (error) {
                alert(error);
            });
    }

    public getUserInvites() {
        axios({
            method: 'get',
            url: '/api/friends/getmyinvites',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                this.userInvites = response.data;
            })
            .catch(function (error) {
                alert(error);
            });
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

    public toggleUsersDropdown() {
        var div = document.getElementById("usersDropdown") as HTMLDivElement;
        div.classList.toggle("show");
    }

    public filterUsers() {
        var input, filter, ul, li, a, i;
        input = document.getElementById("userNameInput") as HTMLInputElement;
        filter = input.value.toUpperCase();
        var div = document.getElementById("usersDropdown") as HTMLDivElement;
        a = div.getElementsByTagName("a");
        for (i = 0; i < a.length; i++) {
            if (a[i].innerHTML.toUpperCase().indexOf(filter) == 0) {
                a[i].style.display = "";
            } else {
                a[i].style.display = "none";
            }
        }
    }
}