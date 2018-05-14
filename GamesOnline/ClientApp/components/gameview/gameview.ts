import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Game } from '../../models/gameModel';
import axios from 'axios';

@Component
export default class GameViewComponent extends Vue { 

    gamepath: string = "";
    gameid: number = 0;
    game = {} as Game;

    mounted() {
        this.gameid = +this.$route.params.gameid
        this.getGame(this.gameid).then(result => {
            this.gamepath = this.game.path;
        })
    }

    public getGame(id: number): Promise<Game> {
        return axios({
            method: 'get',
            url: '/api/games/getgame/',
            params: {id: id},
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                this.game = response.data;
                return response.status;
            })
            .catch(function (error) {
                return error.response.status;
            });
    }

    public getDocHeight(doc: HTMLDocument) {
        doc = doc || document;
        // stackoverflow.com/questions/1145850/
        var body = doc.body, html = doc.documentElement;
        var height = Math.max(body.scrollHeight, body.offsetHeight,
            html.clientHeight, html.scrollHeight, html.offsetHeight);
        return height;
    }

    public getDocWidth(doc: HTMLDocument) {
        doc = doc || document;
        // stackoverflow.com/questions/1145850/
        var body = doc.body, html = doc.documentElement;
        var width = Math.max(body.scrollWidth, body.offsetWidth,
            html.clientWidth, html.scrollWidth, html.offsetWidth);
        return width;
    }

    public setIframeHeight() {
        var id = "gameframe";
        var ifrm = document.getElementById(id) as HTMLIFrameElement;
        var doc = ifrm.contentDocument ? ifrm.contentDocument :
            new HTMLDocument;
        ifrm.style.visibility = 'hidden';
        ifrm.style.height = "10px"; // reset to minimal height ...
        // IE opt. for bing/msn needs a bit added or scrollbar appears
        ifrm.style.height = this.getDocHeight(doc) + 10 + "px";
        ifrm.style.width = "10px"; // reset to minimal height ...
        // IE opt. for bing/msn needs a bit added or scrollbar appears
        ifrm.style.width = this.getDocWidth(doc) + 10 + "px";
        ifrm.style.visibility = 'visible';
    }

    public setIframeSize() {
        if (this.gamepath != "") {
            var ifrm = document.getElementById("gameframe") as HTMLIFrameElement;
            if (this.game.windowType == 0) {
                this.setIframeHeight();
            } else {
                ifrm.style.width = "80%";
                ifrm.style.height = (ifrm.offsetWidth * 9 / 16).toString() + "px";
                ifrm.addEventListener("resize", function (e) {
                    var mapElement = document.getElementById("gameframe") as HTMLIFrameElement;
                    mapElement.style.height = (mapElement.offsetWidth * 9 / 16).toString() + "px";
                });
            }
        }
    }

}