import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Game, GameCategory, GameCategoryExtended, Score, HighScore, User } from '../../models/gameModel';
import { Friend } from '../../models/profileModels';
import { mapGetters } from 'vuex';
import axios from 'axios';
import moment from 'moment';

@Component({
    computed: mapGetters({
        isAuthenticated: 'isAuthenticated',
        username: 'getUsername'
    }),
    filters: {
        formatDate(value: Date) {
            if (value) {
                return moment(String(value)).format('DD/MM/YYYY HH:mm');
            }
        }
    }
})
export default class RankingsComponent extends Vue {

    public games: Game[] = [];
    public userScores: Score[] = [];
    public gameHighScores: HighScore[] = [];
    public friendsGameHighScores: HighScore[] = [];
    public chosenGame = {} as Game;

    mounted() {
        this.getGames();
        this.getUserScores();
    }

    public getGames() {
        axios({
            method: 'get',
            url: '/api/games/getgames',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                this.games = response.data;
            })
            .catch(function (error) {
                alert(error);
            });
    }

    public chooseGame(gameid: number) {
        for (var i = 0; i < this.games.length; i++){
            if (this.games[i].id == gameid) {
                this.chosenGame = this.games[i];
                break;
            }
        }
        this.toggleDropdown();
        this.getFriendsGameHighScores(gameid);
        this.getGameHighScores(gameid);    
    }

    public getUserScores() {
        axios({
            method: 'get',
            url: '/api/rankings/userscores',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                this.userScores = response.data;
            })
            .catch(function (error) {
            });
    }

    public getGameHighScores(gameid: number) {
        axios({
            method: 'get',
            url: '/api/rankings/gamehighscores',
            params: { gameId: gameid },
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                this.gameHighScores = response.data;
            })
            .catch(function (error) {
                alert(error);
            });
    }

    public getFriendsGameHighScores(gameid: number) {
        axios({
            method: 'get',
            url: '/api/rankings/friendsgamehighscores',
            params: { gameId: gameid },
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                this.friendsGameHighScores = response.data;
            })
            .catch(function (error) {
                alert(error);
            });
    }

    public toggleDropdown() {
        var div = document.getElementById("myDropdown") as HTMLDivElement;
        div.classList.toggle("show");
    }

    public filterFunction() {
        var input, filter, ul, li, a, i;
        input = document.getElementById("myInput") as HTMLInputElement;
        filter = input.value.toUpperCase();
        var div = document.getElementById("myDropdown") as HTMLDivElement;
        a = div.getElementsByTagName("a");
        for (i = 0; i < a.length; i++) {
            if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
                a[i].style.display = "";
            } else {
                a[i].style.display = "none";
            }
        }
    }
}