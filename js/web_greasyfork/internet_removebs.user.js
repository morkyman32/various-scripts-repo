// ==UserScript==
// @name         Internet - Disable bullshit
// @namespace    http://tampermonkey.net/
// @version      2024-11-02
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=donmai.us
// @grant        GM_addStyle
// @run-at        document-start
// ==/UserScript==

(function() {
    'use strict';

    var block_sites_based_on_hostaddress=1;
    var block_sites_based_on_hostkeywords=0;
    var redirect_link="https://mdpakk.github.io/my-scripts-repo/html/internet_addiction_notice.html";
    //var redirect_link=atob(`aHR0cHM6Ly9tZHBha2suZ2l0aHViLmlvL215LXNjcmlwdHMtcmVwby9odG1sL2ludGVybmV0X2FkZGljdGlvbl9ub3RpY2UuaHRtbA`);

    var host_keywords_to_block=["xxx","hentai","porn","yaoi","anime","manga","booru","xnxx"]

    var hosts_to_block=[
        // Anime, manga, hentai community and forum sites
        "danbooru.donmai.us",
        "safebooru.donmai.us",
        "sonohara.donmai.us",
        "testbooru.donmai.us",
        "cdn.donmai.us",
        "mdpakk.github.io/internet-start-page/hubs/danbooru/index.html",
        "baramangaonline.com",
        "gelbooru.com",
        "e-hentai.org",
        "aethy.com",
        "baraag.com",
        "aibooru.online",
        "osu.ppy.sh",
        "pixiv.net",
        "kemono.su",
        "cat.yupdates.art",
        "yupdates.art",
        "myanimelist.net",
        "safebooru.org",
        "rule34.xxx",
        "tbib.org",
        "rule34.paheal.net",
        "nozomi.la",
        "e621.net",
        "anime-pictures.net",
        "booru.vineshroom.net",
        "yande.re",
        "konachan.com",
        "zerochan.net",
        "derpibooru.org",
        "twibooru.org",
        "e-shuushuu.net",
        "imhentai.xxx",
        "baraag.net",
        "pawoo.net",
        "misskey.io",
        "deviantart.com",
        "archiveofourown.org",
        "onlyhentaistuff.com",
        "danbooru.pw",
        "fanlore.org",
        "myreadingmanga.info",
        "yaoimangaonline.com",
        "animenewsnetwork.com",
        "mangaplus.shueisha.co.jp",
        "crunchyroll.com",
        "cbr.com",
        "animeuknews.net",
        "animecorner.me",
        "comicbook.com",
        "otakumode.com",
        "newgrounds.com",
        "allthefallen.moe",
        "allthefallen.org",
        "danbooru.iqdb.org",
        "iqdb.org",
        "en.touhouwiki.net",

        // Game sites
        "gamebanana.com",
        "gamemaps.com",
        "combineoverwiki.net",
        "developer.valvesoftware.com",
        "pcgamingwiki.com",
        "theportalwiki.com",
        "store.steampowered.com",
        "steamcommunity.com",
        "steamdb.info",
        "help.steampowered.com",
        "steamdeck.com",
        "sbox.game",
        "sboxcommunity.com",
        "namu.wiki",

        // News sites
        "windowscentral.com",
        "kurir.rs",
        "informer.rs",
        "balkanist.ru",
        "balkanist.rs",

        // Forum sites
        "gagadaily.com",
        "fandom.com",
        "wikia.com",

        // Porn sites
        "theporndude.com",
        "pornhub.com",
        "xvideos.com",
        "toppornsites.com",
        "xhamster.com",
        "xnxx.com",
        "xnxx.tv",
        "xnxx2.com",
        "xnxx.llc",

        // AI Porn sites
        "civitai.com",
        "civitai.green",
        "huggingface.co",
        "tensor.art",
        "wonderaiartgenerator.com",
        "pixai.art",
        "stablediffusionaigenerator.com",
        "arthub.ai",
        "starryai.com",
        "creator.nightcafe.studio",

        // Gay porn sites
        "lpsg.com",
        "gaybooru.app",
        "mygaysites.com",
        "fairytalepolicehoedepartment.com",
        "boyfriendtv.com",
        "gaymaletube.com",
        "adonismale.com",
        "gaytor.rent",
        "gay-torrents.net",
        "gay-torrents.org",

        // Social Networkin Sites
        "x.com",
        "twitter.com",
        "facebook.com",
        "instagram.com",
        "app.element.io",
        //"youtube.com",
        "tiktok.com",
        "bsky.app",
        "discord.com",
        "discordstatus.com",
        "discord.js.org",
        "reddit.com",
        "tumblr.com",
        "threads.net",
        "pinterest.com",
        "vk.com",
        "twitch.tv",
    ]

    if(window.location.host=="www.youtube.com" || window.location.host=="m.youtube.com") {
        if(window.location.href.includes("youtube.com/shorts")) {
            window.location.replace("https://www.youtube.com");
        }
        if(window.location.href==("https://www.youtube.com/")) {
            window.location.replace("https://www.youtube.com/feed/channels");
        }
        if(window.location.href==("https://m.youtube.com/")) {
            window.location.replace("https://m.youtube.com/feed/channels");
        }

        GM_addStyle(`
            #player-ads,
            #related,
            #owner-sub-count,
            #search,
            #voice-search-button,
            .ytd-topbar-menu-button-renderer:has(.yt-icon-button[aria-label="Create"]),
            .ytd-notification-topbar-button-renderer,
            .ytd-rich-grid-renderer,
            #shorts-container,
            .yt-simple-endpoint[title="Shorts"],
            .yt-simple-endpoint[title="Home"],
            .yt-simple-endpoint[title="Trending"],
            .yt-simple-endpoint[title="Music"],
            .yt-simple-endpoint[title="Gaming"],
            .yt-simple-endpoint[title="Sports"],
            .yt-simple-endpoint[title="Podcasts"],
            .ytd-reel-shelf-renderer,
            .pivot-bar-item-tab.pivot-shorts,
            ytm-item-section-renderer:has(a[href="/feed/history"]),
            ytm-item-section-renderer:has(a[href="/feed/playlists"]),
            a[href^="/feed/storefront"],
            a[href^="/premium"],
            ytm-related-chip-cloud-renderer,
            ytd-watch-next-secondary-results-renderer
            {
                 display:none !important;
                 pointer-events:none;
            }

            .rich-item-single-standard-column,
            .rich-section-content,
            .YtmVideoPreviewHost,
            ytm-feed-filter-chip-bar-renderer,
            .icon-button[aria-label="Search YouTube"],
            ytm-media-item {
                 opacity:0 !important;
                 pointer-events:none !important;
            }

        `);
    }

    if(block_sites_based_on_hostaddress) {
        hosts_to_block.forEach(host => {

            if(window.location.host.includes(host) || window.location.host==host || window.location.host=="www."+host) {
                GM_addStyle(`body {display:none}`);
                //alert(`loc:${window.location.host}, host:${host}`);
                window.location.replace(redirect_link);
            }

            GM_addStyle(`

             a[href*="${host}"],
             a[href*="${'www.'+host}"],
             img[src*="${host}"],
             img[src*="${'www.'+host}"],
             *[data-lpage*="${host}"],
             *[data-lpage*="${'www.'+host}"]
             {
                    opacity:0.6;
                    filter:saturate(0) blur(10px);
                    pointer-events:none;
                    text-decoration:line-through;
                    display:none !important;
             }

        `);

        })
    }

    if(block_sites_based_on_hostkeywords) {

        host_keywords_to_block.forEach(hostkeyword => {

            if(window.location.host.includes(hostkeyword)) {window.location.replace(redirect_link);}

            GM_addStyle(`

             a[href*=${hostkeyword}],
             *[data-lpage*="${hostkeyword}"],
             {
                    opacity:1;
                    filter:saturate(0) blur(10px);
                    pointer-events:none;
                    text-decoration:line-through;
             }

        `);

        })
    }

    if(window.location.href==redirect_link) {
        GM_addStyle(`body {background:black;}`)
    }



})();