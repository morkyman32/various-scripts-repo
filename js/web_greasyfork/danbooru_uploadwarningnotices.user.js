// ==UserScript==
// @name         Danbooru - Auto-detect rule-breaking content
// @namespace    http://tampermonkey.net/
// @version      0.65
// @description  try to take over the world!
// @author       mdpk, bipface, I_Copy_Jokes
// @match        https://danbooru.donmai.us/uploads/*/assets/*
// @match        https://danbooru.donmai.us/uploads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=donmai.us
// @grant        none
// ==/UserScript==
// Created at    2024-09-13

(function() {
    'use strict';
    // Configurations
    var play_error_sound = 1;


    // Vars
    var xp_error_audio = new Audio('https://archive.org/download/windowsxpstartup_201910/Windows%20XP%20Error.mp3');

    var myFunctions = window.myFunctions = {};
    myFunctions.generate_dtextmessage = function(forwhat,artist_name="",par1="",par2="") {
         if(forwhat=="ai-generated artist wiki page detected") return `<span>This artist is an ai-prompter, according to <a class="tag-type-1" href="/wiki_pages/${artist_name}">their wiki page (${artist_name})</a>. <br><br><b> <a class="dtext-link dtext-wiki-link tag-type-5" href="/wiki_pages/ai-generated">AI-generated</a> works are against <a class="dtext-link dtext-wiki-link" href="/wiki_pages/help%3Aupload_rules">the upload rules</a> of Danbooru.</b><br><br> Upload with caution.</span>`
         if(forwhat=="ai-assisting artist wiki page detected") return `<span>This artist creates artwork assisted by AI, according to <a class="tag-type-1" href="/wiki_pages/${artist_name}">their wiki page (${artist_name})</a>. <br><br><b> <a class="dtext-link dtext-wiki-link tag-type-5" href="/wiki_pages/ai-assisted">AI-assisted</a> works are not against <a class="dtext-link dtext-wiki-link" href="/wiki_pages/help%3Aupload_rules">the upload rules</a> of Danbooru, but they are still likely to be deleted.</b><br><br> Carefully check if this image asset could also have been fully <a class="dtext-link dtext-wiki-link tag-type-5" href="/wiki_pages/ai-generated">AI-generated</a>.<br><br> Upload with caution.</span>`
         if(forwhat=="ai-generated art metadata detected") return `<span><a class="dtext-link dtext-wiki-link tag-type-5" href="/wiki_pages/ai-generated">AI-generated</a> art metadata has been detected in this image asset. <br><br><b> <a class="dtext-link dtext-wiki-link tag-type-5" href="/wiki_pages/ai-generated">AI-generated</a> works are against <a class="dtext-link dtext-wiki-link" href="/wiki_pages/help%3Aupload_rules">the upload rules</a> of Danbooru.</b></span>`
         if(forwhat=="banned artist detected") return `<span><b><a class="tag-type-1" href="/wiki_pages/${artist_name}">${artist_name}</a> is a <a class="break-words tag-type-1" data-tag-name="banned_artist" href="/posts?tags=banned_artist">banned artist</a></b>. <br><br> Upload with caution.</span>`
         if(forwhat=="artist with high delete ratio") return `<span><a class="tag-type-1" href="/wiki_pages/${artist_name}">The artist (${artist_name})</a> has a high ratio of deleted posts <b>(${par1}% of ${par2} uploads)</b>.<br><br>Upload their works with caution.</span>`
         if(forwhat=="pixel-perfect duplicate") return `<span>This image asset is a <a class="dtext-link dtext-wiki-link tag-type-5" href="/wiki_pages/pixel-perfect_duplicate">pixel-perfect duplicate</a> of an existing post. <br><br>Upload with caution.</span>`
         if(forwhat=="possibly a photo") return `<span>This image is possibly a <a class="dtext-link dtext-wiki-link tag-type-5" href="/wiki_pages/photo_%28medium%29">photograph</a>.<br><a class="dtext-link dtext-wiki-link tag-type-5" href="/wiki_pages/off-topic">Off-topic</a> <a class="dtext-link dtext-wiki-link tag-type-5" href="/wiki_pages/photo_%28medium%29">photographs</a> are against the upload rules.<br><br><p>This image could also just be a <a class="dtext-link dtext-wiki-link tag-type-0" href="/wiki_pages/photorealistic">photorealistic</a> artwork or a <a class="dtext-link dtext-wiki-link tag-type-5" href="/wiki_pages/cosplay_photo">cosplay photo</a>, which are allowed.</p><p>Upload with caution.</p></span>`
         if(forwhat=="repost or 3rd party edit account") return `<span>The account (<a href='${par1}'>${artist_name}</a>) you're trying to upload from is possibly a <a class="dtext-link dtext-wiki-link tag-type-5" href="/wiki_pages/third-party_source">third-party repost</a> account.<br><br> <a class="dtext-link dtext-wiki-link tag-type-5" href="/wiki_pages/third-party_source">Third-party source</a> posts are not against <a class="dtext-link dtext-wiki-link" href="/wiki_pages/help%3Aupload_rules">the upload rules</a>, but they are very likely to be deleted if a first party source of that post already exists.<br><br> <b><a class="dtext-link dtext-wiki-link tag-type-5" href="/wiki_pages/third-party_edit">Third-party edits</a> are against <a class="dtext-link dtext-wiki-link" href="/wiki_pages/help%3Aupload_rules">the upload rules</a> of Danbooru.</b> <br><br>Upload with caution.</span>`;

    }

    myFunctions.intrusive_htmlmessage=function(spancontent) {
        document.querySelector(".media-asset-container").innerHTML+=`
            <div class="ai-preventer" style="width: 100%; height: 100%; background: black; position: absolute; z-index: 10; top: 0; display: flex; align-items: center; font-size: 19px; line-height: 30px; background: rgba(0, 0, 0, 0.7); padding: 25px; backdrop-filter:blur(5px); flex-direction: column;">
                ${spancontent}
                <br>
                <button name="button" type="submit" id="ai-preventer-close" onClick="document.querySelector('.ai-preventer').style.display='none'" class="ui-button ui-widget ui-corner-all sub">Ok</button>
            </div>`;
    }

    myFunctions.popup_htmlmessage=function(spancontent) {
        document.body.insertAdjacentHTML('beforeend', `<div id="uploadwarn"><form> ${spancontent} </form></div>`);
        document.getElementById('uploadwarn').firstElementChild.requestSubmit = function() {console.log('(submitting)');};
        Danbooru.Utility.dialog('⚠️ Warning', '#uploadwarn');
        document.querySelector(".ui-widget-overlay").remove()
        document.querySelector(".ui-dialog").style.position="fixed";
        document.querySelector(".ui-dialog-buttonpane").style.opacity="0";

        if (play_error_sound) xp_error_audio.play();

        //document.querySelector(".ui-dialog").style.top="0";

        setTimeout(() => {
            document.querySelector(".ui-dialog .ui-dialog-buttonpane button").remove();
            document.querySelector(".ui-dialog .ui-dialog-buttonpane button").innerHTML="Ok";
            document.querySelector(".ui-dialog .ui-dialog-buttonpane button").onclick=function() {
                setTimeout(() => {
                    document.querySelector("#uploadwarn").remove()
                }, 10);
            }
            document.querySelector(".ui-dialog .ui-dialog-titlebar-close").onclick=function() {
                setTimeout(() => {
                    document.querySelector("#uploadwarn").remove()
                }, 10);
            }
            document.querySelector(".ui-dialog-buttonpane").style.opacity="";
        }, 800);

    }

    myFunctions.generate_htmlmessage= function(spancontent) {
        myFunctions.popup_htmlmessage(spancontent)
        //myFunctions.intrusive_htmlmessage(spancontent);
    }

    var artist_name=document.querySelector(".tag-type-1");
    if(artist_name===null) artist_name="unknown artist"
    else artist_name=artist_name.innerHTML;
    console.log('https://danbooru.donmai.us/wiki_pages/${artist_name}.json')
    if (document.querySelector(".upload-ai-warning") === null) {
        fetch(`https://danbooru.donmai.us/wiki_pages/${artist_name}.json`)
            .then(response => response.json())
            .then(json => {
            if(json.body.toLowerCase().includes('ai-generated')) {
                //console.log("yes")
                myFunctions.generate_htmlmessage(myFunctions.generate_dtextmessage("ai-generated artist wiki page detected",artist_name))
            }
            if(json.body.toLowerCase().includes('ai-assisted')) {
                //console.log("yes")
                myFunctions.generate_htmlmessage(myFunctions.generate_dtextmessage("ai-assisting artist wiki page detected",artist_name))
            }
        })
    }
    else {
        myFunctions.generate_htmlmessage(myFunctions.generate_dtextmessage("ai-generated art metadata detected"))
    }

    if (document.querySelector(".upload-pixel-perfect-duplicate-warning") != null) {
        myFunctions.generate_htmlmessage(myFunctions.generate_dtextmessage("pixel-perfect duplicate",artist_name));
        document.querySelector(".similar-tab").click();
    }

    if(document.querySelector('.ai-preventer') === null) {
        fetch(`https://danbooru.donmai.us/counts/posts.json?tags=${artist_name}`)
            .then(response => response.json())
            .then(json1 => {
            console.log(json1)
            fetch(`https://danbooru.donmai.us/counts/posts.json?tags=${artist_name}+status%3Adeleted`)
                .then(response => response.json())
                .then(json2 => {
                    var del_perc=Math.round((json2.counts.posts / json1.counts.posts) * 10000) / 100;
                    var upl_cnt =json1.counts.posts;
                    if(upl_cnt > 15 && del_perc>45) {
                          myFunctions.generate_htmlmessage(myFunctions.generate_dtextmessage("artist with high delete ratio",artist_name,del_perc,upl_cnt))
                    }
            } )
        } )
        setTimeout(() => {
            if(document.querySelector("a[data-tag-name='ai-generated']") != null && document.querySelector('.ai-preventer') === null) {
                myFunctions.generate_htmlmessage(myFunctions.generate_dtextmessage("ai-generated artist wiki page detected",artist_name))
            }
            if(document.querySelector("a[data-tag-name='banned_artist']") != null && document.querySelector('.ai-preventer') === null) {
                myFunctions.generate_htmlmessage(myFunctions.generate_dtextmessage("banned artist detected",artist_name))
            }
            if(document.querySelector(".source-data-content tr a") != null && document.querySelector('.ai-preventer') === null) {
                var tmp_username=document.querySelector(".source-data-content tr a").innerHTML
                var tmp_href=document.querySelector(".source-data-content tr a").href;
                if(third_party_repost_accounts.includes(tmp_href)) {
                    myFunctions.generate_htmlmessage(myFunctions.generate_dtextmessage("repost or 3rd party edit account",tmp_username,tmp_href))
                }
            }
            if(document.querySelector("a.tag-type-5[href='/posts?tags=photo_%28medium%29']") != null &&
               document.querySelector('.ai-preventer') === null &&
              parseInt(document.querySelector("a.tag-type-5[href='/posts?tags=photo_%28medium%29']").parentElement.querySelector(".text-muted").innerHTML.replace("%","")) > 75) {
                myFunctions.generate_htmlmessage(myFunctions.generate_dtextmessage("possibly a photo"))
            }
        }, 1000);
    }
})();
