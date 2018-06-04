import { Component, Prop,  Vue } from 'vue-property-decorator';
import { GameRating, NewGameRating } from '../../models/gameRatingModel';
import { mapGetters } from 'vuex';
import axios from 'axios';
import moment from 'moment';


@Component({
    computed: mapGetters({
        isAuthenticated: 'isAuthenticated',
        username: 'getUsername',
        avatarPath: 'getAvatarPath'
    }),
    filters: {
        formatDate (value: Date) {
            if (value) {
                return moment(String(value)).format('DD/MM/YYYY HH:mm');
            }
        }
    }
})
export default class GameRatingsComponent extends Vue {

    @Prop()
    gameid!: number;

    public gameRatings: GameRating[] = [];
    public newGameRating = {} as NewGameRating;
    public currentRating: number = 0;

    mounted() {
        this.setRatingSystem();
        this.getGameRatings();
    }

    public setRatingSystem() {
        var self = this;
        for (var i = 1; i <= 5; i++) {
            (function () {
                var k = i;
                var starObject = document.getElementById("add-rate-" + i) as HTMLDivElement;
                if (starObject != null) {
                    starObject.onclick = function () {
                        self.currentRating = k;
                    }
                }
            }());
        }
    }

    public getGameRatings() {
        axios({
            method: 'get',
            url: '/api/games/getgameratings',
            params: { gameId: this.gameid },
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                this.gameRatings = response.data;
            })
            .catch(function (error) {
            });
    }

    public postGameRating() {
        this.newGameRating.gameId = this.gameid;
        this.newGameRating.rating = this.currentRating;
        var self = this;
        axios({
            method: 'post',
            url: '/api/games/addgamerating',
            data: this.newGameRating,
            headers: { 'Content-Type': 'application/json' }
        })
            .then(function (response) {
                self.getGameRatings();
                self.newGameRating.comment = "";
                self.newGameRating.rating = 0;
                self.currentRating = 0;
            })
            .catch(function (error) {
                alert(error);
            });
    }

    public hello() {
        alert("hello");
    }

    public deleteGameRating(ratingId: number) {
        var self = this;
        
        axios({
            method: 'post',
            url: '/api/games/deletegamerating',
            params: { ratingId: ratingId },
            headers: { 'Content-Type': 'application/json' }
        })
            .then(function (response) {
                self.getGameRatings();
            })
            .catch(function (error) {
                alert(error);
            });
        
    }

    

}