import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import axios from 'axios';
import { Game, GameCategory, GameCategoryExtended } from '../../models/gameModel';


@Component
export default class GameViewComponent extends Vue { 


    getDocHeight(doc: HTMLDocument) {
        doc = doc || document;
        // stackoverflow.com/questions/1145850/
        var body = doc.body, html = doc.documentElement;
        var height = Math.max(body.scrollHeight, body.offsetHeight,
            html.clientHeight, html.scrollHeight, html.offsetHeight);
        return height;
    }

    getDocWidth(doc: HTMLDocument) {
        doc = doc || document;
        // stackoverflow.com/questions/1145850/
        var body = doc.body, html = doc.documentElement;
        var width = Math.max(body.scrollWidth, body.offsetWidth,
            html.clientWidth, html.scrollWidth, html.offsetWidth);
        return width;
    }

    setIframeHeight() {
        var id = "gameframe";
        var ifrm = document.getElementById(id) as HTMLIFrameElement;
        var doc = ifrm.contentDocument ? ifrm.contentDocument :
            ifrm.contentWindow.document;
        ifrm.style.visibility = 'hidden';
        ifrm.style.height = "10px"; // reset to minimal height ...
        // IE opt. for bing/msn needs a bit added or scrollbar appears
        ifrm.style.height = this.getDocHeight(doc) + 4 + "px";
        ifrm.style.width = "10px"; // reset to minimal height ...
        // IE opt. for bing/msn needs a bit added or scrollbar appears
        ifrm.style.width = this.getDocWidth(doc) + 4 + "px";
        ifrm.style.visibility = 'visible';
    }

    setIframeSize() {
        var ifrm = document.getElementById("gameframe") as HTMLIFrameElement;
        var doc = ifrm.contentDocument ? ifrm.contentDocument :
            ifrm.contentWindow.document;
        if (this.getDocHeight(doc) < 400) {
            ifrm.style.width = "80%";
            ifrm.style.height = (ifrm.offsetWidth * 9 / 16).toString() + "px";
            window.addEventListener("resize", function (e) {
                var mapElement = document.getElementById("gameframe") as HTMLIFrameElement;
                mapElement.style.height = (mapElement.offsetWidth * 9 / 16).toString() + "px";
            });
        } else {
            this.setIframeHeight();
        }
    }

}