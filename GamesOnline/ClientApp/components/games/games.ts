import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import axios from 'axios';
import { Game, GameCategory, GameCategoryExtended } from '../../models/gameModel';

@Component
export default class GamesComponent extends Vue { 

    public games: Game[] = [];
    public categories: GameCategoryExtended[] = [];
    public countAll: number = 0;
    public categoryToShow: number = 0;

    public getCategories(): Promise<number> {
        return axios({
            method: 'get',
            url: '/api/games/getgamecategories',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                this.categories = response.data;
                return response.status;
            })
            .catch(function (error) {
                return error.response.status;
            });
    }

    public getGames(): Promise<number> {
        return axios({
            method: 'get',
            url: '/api/games/getgames',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                this.games = response.data;
                return response.status;
            })
            .catch(function (error) {
                return error.response.status;
            });
    }

    public countGames() {
        var cat_len = this.categories.length;
        var i, j;
        for (i = 0; i < cat_len; i++) {
            this.categories[i].count = 0;
        }
        
        var game_len = this.games.length;
        this.countAll = game_len;
        for (i = 0; i < game_len; i++) {
            for (j = 0; j < cat_len; j++) {
                if (this.games[i].gameCategoryId == this.categories[j].id) {
                    this.categories[j].count = this.categories[j].count + 1;
                }
            }
        }
    }

    changeCategory(id: number) {
        this.categoryToShow = id;
    }

    roundHalf(num: number): number {
        return Math.round(num * 2) / 2;
    }

    mounted() {
        var p1 = this.getCategories();
        var p2 = this.getGames();

        p1.then(response => response as number)
            .then(result => {
                if (result == 200) {
                    p2.then(response => response as number)
                        .then(result => {
                            if (result == 200) {
                                this.countGames();
                            }
                        })
                }
            })
    }
}