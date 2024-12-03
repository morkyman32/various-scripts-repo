// ==UserScript==
// @name         Danbooru - Easy Pre-tagging manager
// @namespace    http://tampermonkey.net/
// @version      2024-11-04
// @description  Save and manage tags on unposted uploads
// @author       mdpk
// @match        https://danbooru.donmai.us/*
// @match        https://aibooru.online/*
// @match        https://gaybooru.app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=donmai.us
// @grant        none
// ==/UserScript==

// Before using the plugin type:
// localStorage.setItem("danbooru_savedtags_json", `[]`);
// into your JavaScript console
// created at 2024-09-02

(function() {
    'use strict';

    if(!JSON.parse(localStorage.getItem(`danbooru_savedtags_json_(${window.location.host})`))) {localStorage.setItem(`danbooru_savedtags_json_(${window.location.host})`, `[]`);}
    if(!JSON.parse(localStorage.getItem(`danbooru_savedtags_imglinks_(${window.location.host})`))) {localStorage.setItem(`danbooru_savedtags_imglinks_(${window.location.host})`, `[]`);}

    if(window.location.href.startsWith(`https://${window.location.host}/uploads/new`) || /\/users\/\d+\/uploads/.test(window.location.href) || /\/uploads\/\d+\/assets/.test(window.location.href) ) {
        document.querySelector("#subnav-all-uploads").outerHTML+=`
        <li id="subnav-all-uploads"><a id="subnav-all-uploads-link" href="/pretagged_uploads">Pre-tagged uploads</a></li>
        `
    }

    if(  /\/users\/\d+\/uploads/.test(window.location.href) || /\/uploads\/\d+\/assets/.test(window.location.href) ) {
        var danbooru_savedtags_json=JSON.parse(localStorage.getItem(`danbooru_savedtags_json_(${window.location.host})`));
        (document.querySelectorAll(".media-asset-preview a")).forEach(item => {
            var existing_upload=danbooru_savedtags_json.find((element) => element.loc == `${item.href.replace(`https://${window.location.host}/uploads/`,"")}`);
            //console.log( existing_upload===undefined )
            if(existing_upload!=undefined) {
                item.style.display="relative";
                item.innerHTML+="<div style='overflow:hidden; color:white; background:green; opacity:0.7; width:100%; height:15px; bottom:0; right:0; position:absolute; font-size:14px'>Pretagged</div>"
            }
            else if(item.href.endsWith("assets")) {
                var existing_upload=danbooru_savedtags_json.find((element) => element.loc.split("/")[0] == item.href.split("/")[4]);
                if(existing_upload!=undefined) {
                    item.style.display="relative";
                    item.innerHTML+="<div style='overflow:hidden; color:white; background:green; opacity:0.7; width:100%; height:15px; bottom:0; right:0; position:absolute; font-size:14px'>Contains pretagged</div>"
                }
            }


        })
    }

    if(window.location.href.startsWith(`https://${window.location.host}/pretagged_uploads`)) {
        var myFunctions = window.myFunctions = {};
        document.title="DB | Pretagged uploads";

        myFunctions.removeUploadedImageAssets = function() {
            var danbooru_savedtags_json=JSON.parse(localStorage.getItem(`danbooru_savedtags_json_(${window.location.host})`));
            danbooru_savedtags_json=danbooru_savedtags_json.sort((a, b) => b.loc.localeCompare(a.loc));
            console.log(danbooru_savedtags_json)
            var delayact=300;
            danbooru_savedtags_json.forEach(item => {


                setTimeout(function() {
                    fetch(`/uploads/${item.loc}.json`,{
                        credentials: "same-origin"
                    })
                        .then(response => response.json())
                        .then(data => {
                        var media_asset_id=undefined
                        if(data.upload_media_assets) media_asset_id=data.upload_media_assets[0].media_asset_id
                        if(data.media_asset_id) media_asset_id=data.media_asset_id
                        //console.log(media_asset_id)
                        fetch(`/media_assets/${media_asset_id}.json`)
                            .then(response => response.json())
                            .then(data2 => {
                            //console.log(`${data2.md5}`)
                            fetch(`/posts.json?tags=md5:${data2.md5}`)
                                .then(response => response.json())
                                .then(data3 => {
                                if(data3.length>0) {
                                    danbooru_savedtags_json=danbooru_savedtags_json.filter(tofilter => tofilter.loc !== item.loc);
                                    document.querySelector(`#pretag-item-${item.loc.replaceAll("/","-")}`).remove();
                                    localStorage.setItem(`danbooru_savedtags_json_(${window.location.host})`, JSON.stringify(danbooru_savedtags_json));
                                    console.log(danbooru_savedtags_json.length)
                                }
                            })
                        })
                    })
                },delayact)
                delayact+=300;

            })
        }

        myFunctions.pasteDBSTJ = function() {
            danbooru_savedtags_json=JSON.parse(localStorage.getItem(`danbooru_savedtags_json_(${window.location.host})`));
            console.log(
                JSON.stringify(danbooru_savedtags_json).split("").reverse().join("")
            )
        }

        myFunctions.removePretagsFor = function(locix) {
            console.log(locix);
            if (confirm(`Are you sure about deleting your saved tags for ${locix}? Only delete saved tags if the asset was already uploaded or is a duplicate.`) == true) {
                var existing_upload=danbooru_savedtags_json.find((element) => element.loc == `${locix}`);
                let index = danbooru_savedtags_json.indexOf(existing_upload);
                if(index!=-1) {
                    danbooru_savedtags_json.splice(index, 1);
                    localStorage.setItem(`danbooru_savedtags_json_(${window.location.host})`, JSON.stringify(danbooru_savedtags_json));
                }
                document.querySelector(`#pretag-item-${locix.replaceAll("/","-")}`).remove();
            } else {
                //text = "You canceled!";
            }
        }

        myFunctions.getColorFromScore = function(score) {
            var maxVal=30;
            score = Math.max(0, Math.min(maxVal, score));

            const percentage = (score / maxVal) * 100;

            const red = Math.floor(255 - (percentage / 100) * 255);
            const green = Math.floor((percentage / 100) * 255);

            const hex = `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}00`;

            return hex;
        }

        var danbooru_savedtags_json=JSON.parse(localStorage.getItem(`danbooru_savedtags_json_(${window.location.host})`));
        document.querySelector("#a-not-found").innerHTML=`
           <div id="pretagged-posts" class="user-favorites recent-posts">
   <a><h2 onclick="myFunctions.removeUploadedImageAssets()" rel="nofollow" class="recent-posts-header">Remove Uploaded Image Assets</h2></a>
   <h2 onclick="myFunctions.pasteDBSTJ()" class="recent-posts-header">Pre-tagged posts</h2>`;

        var timeout_slp=50;
        danbooru_savedtags_json=danbooru_savedtags_json.sort((a, b) => b.loc.localeCompare(a.loc));
        danbooru_savedtags_json.forEach(item => {
              var tag_count=item.tagstr.replaceAll("\n"," ").split(" ").length;
              var tag_count_bg=myFunctions.getColorFromScore(tag_count);
              document.querySelector("#pretagged-posts").innerHTML+=`<div id="pretag-item-${item.loc.replaceAll("/","-")}" style="width:150px; height:190px; float:left; margin:3px; position:relative;">
              <div onclick="myFunctions.removePretagsFor('${item.loc}')" class="delete-butt" style="background-color:red; border-radius:3px; width:25px; height:25px; position:absolute; right:0; opacity:0.5; z-index:90"></div>
      <a class="post-preview-link" draggable="false" href="/uploads/${item.loc}">
         <picture>
            <img src="https://cdn.donmai.us/180x180/41/55/41553d2ffa946482b91fb0cd51bc59ab.jpg" style="width:145px;height:145px;object-fit:contain;" class="post-preview-image">
         </picture>
      </a>

      <div class="post-preview-score text-sm text-center mt-1">
         <span onclick="console.log(\`${item.tagstr}\`)" class="post-score inline-block text-center whitespace-nowrap align-middle min-w-4">
           ${item.loc}</span><br>
           <span style="background: linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)), linear-gradient(${tag_count_bg},${tag_count_bg}); padding: 0px 4px 1px 4px; border-radius:2px; border:1px solid white;">${tag_count} tags</span>
      </div>

   </div>

  </div>`;

            var danbooru_imgpaths_json=JSON.parse(localStorage.getItem(`danbooru_savedtags_imglinks_(${window.location.host})`));
            if(danbooru_imgpaths_json.find(imgpathrow=>imgpathrow.media_asset_id==item.loc)) {
                document.querySelector(`#pretag-item-${item.loc.replaceAll("/","-")} img`).src=(danbooru_imgpaths_json.find(imgpathrow=>imgpathrow.media_asset_id==item.loc)).thumbnail_url;
                console.log("yes")
            }
            else {
                setTimeout(function() {
                    fetch(`/uploads/${item.loc}.json`,{
                        credentials: "same-origin"
                    })
                        .then(response => response.json())
                        .then(
                        json => {
                            //console.log(JSON.stringify(json))
                            if(item.loc.includes("/assets/")) {
                                fetch(`/media_assets/${json.media_asset_id}.json`,{
                                    credentials: "same-origin"
                                })
                                    .then(response => response.json())
                                    .then(json2 => {
                                    //console.log(JSON.stringify(json2))
                                    document.querySelector(`#pretag-item-${item.loc.replaceAll("/","-")} img`).src=json2.variants[0].url;
                                    var danbooru_imgpaths_json=JSON.parse(localStorage.getItem(`danbooru_savedtags_imglinks_(${window.location.host})`));
                                    console.log("fetching...")
                                    if(!danbooru_imgpaths_json.find(imgpathrow=>imgpathrow.media_asset_id==item.loc)) danbooru_imgpaths_json.push({media_asset_id:item.loc, thumbnail_url:`${json2.variants[0].url}`})
                                    localStorage.setItem(`danbooru_savedtags_imglinks_(${window.location.host})`, `${JSON.stringify(danbooru_imgpaths_json)}`);
                                })
                            }
                            else {
                                document.querySelector(`#pretag-item-${item.loc.replaceAll("/","-")} img`).src=json.upload_media_assets[0].media_asset.variants[0].url;
                            }
                        }
                    )
                }, timeout_slp);
                timeout_slp+=200;
            }

        })
    }

    if(/(\/uploads\/\d+$)|(\/uploads\/\d+\/assets\/\d+$)/.test(window.location.href)) {
        var myFunctions = window.myFunctions = {};

        myFunctions.getUploadItemLocationPath = function() {
            return window.location.href.replace(`https://${window.location.host}/uploads/`,"").replaceAll(/\?.*/g,'');
        }

        myFunctions.loadSavedTagstr = function() {
            var upload_loc=myFunctions.getUploadItemLocationPath();
            var danbooru_savedtags_json=JSON.parse(localStorage.getItem(`danbooru_savedtags_json_(${window.location.host})`));
            var existing_upload=danbooru_savedtags_json.find((element) => element.loc == `${upload_loc}`);
            if(existing_upload!=undefined) {
                document.querySelector("#post_tag_string").value=existing_upload.tagstr;
            }
        }

        myFunctions.saveTagString = function() {
            var upload_loc=myFunctions.getUploadItemLocationPath();
            var danbooru_savedtags_json=JSON.parse(localStorage.getItem(`danbooru_savedtags_json_(${window.location.host})`));
            var existing_upload=danbooru_savedtags_json.find((element) => element.loc == `${upload_loc}`);
            console.log(upload_loc)
            if(existing_upload!=undefined) {
                existing_upload.tagstr=document.querySelector("#post_tag_string").value;
            }
            else {
                existing_upload={loc:`${upload_loc}`, tagstr:document.querySelector("#post_tag_string").value};
                danbooru_savedtags_json.push(existing_upload);
            }
            localStorage.setItem(`danbooru_savedtags_json_(${window.location.host})`, JSON.stringify(danbooru_savedtags_json));
            console.log(danbooru_savedtags_json);
        }

        myFunctions.updateGUI = function () { console.log("hi") };

        document.querySelector(".mb-4").outerHTML='<input type="submit" onclick="preventDefault();" id="btn-pass-tags" style="float: left; margin-right: 6px;" type="button" value="Save tags" class="button-primary button-sm">'+document.querySelector(".mb-4").outerHTML;
        document.querySelector("#btn-pass-tags").addEventListener("click", function(ev) {
            ev.preventDefault();
            myFunctions.saveTagString();
            console.log(myFunctions.getUploadItemLocationPath());
            localStorage.setItem("somecuterandomstring", myFunctions.getUploadItemLocationPath());
        });

        myFunctions.loadSavedTagstr();

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const pretagged_tags = urlParams.get('pretagged_tags')
        if(pretagged_tags!=null) {
            document.querySelector("#post_tag_string").value+=" "+pretagged_tags
        }

    }

})();
