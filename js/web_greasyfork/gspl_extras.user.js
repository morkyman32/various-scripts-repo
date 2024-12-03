// ==UserScript==
// @name         LPSG動画+
// @namespace    http://tampermonkey.net/
// @version      0.16
// @description  LPSG YES
// @author       You
// @match        https://www.lpsg.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lpsg.com
// @grant        GM_addStyle
// @run-at        document-start
// @license MIT
// ==/UserScript==

// Enables a couple more features for LPSG:
// -

/*function GM_addStyle(css) {
  const style = document.getElementById("GM_addStyleBy8626") || (function() {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.id = "GM_addStyleBy8626";
    document.head.appendChild(style);
    return style;
  })();
  style.innerHTML+=css;
  return 0;
  const sheet = style.sheet;
  sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
}*/

(function() {
    'use strict';

    GM_addStyle(`
    .bbWrapper {
        color: rgba(0, 0, 0, 0.0);
        user-select: none;
    }
    .bbImage {
        max-height: 200px;
        max-width: 200px;
        object-fit:cover;
        margin:10px;
    }

    .username,
    .avatar,
    .reactionsBar,
    div[data-widget-key="forum_overview_members_online"],
    div[data-widget-key="lpsg_latestThreads"],
    div[data-widget-key="lpsg_newProfilePosts"],
    article.message:not(:has(.message-attachments, .bbMediaWrapper)),
    .bbWrapper br
    { display:none !important; }

    .message-cell--user, .reaction-sprite, .smilie, .message-attribution-user--top, .reactionsBar, .message-actionBar, .bbCodeBlock {display:none;}

    div.menu.is-active[data-href="/account/alerts-popup"] .username, div.menu.is-active[data-href="/account/alerts-popup"] .username,
    div.menu.is-active[data-href="/account/alerts-popup"] .username, div.menu.is-active[data-href="/account/alerts-popup"] .avatar {
         display:none !important;
    }
    `);

    if( /lpsg\.com\/threads/.test(window.location.href) ) {

        document.addEventListener("DOMContentLoaded", (event) => {

            console.log("DOM fully loaded and parsed");

            /*document.querySelectorAll(".message-cell--user, .reaction-sprite, .smilie, .message-attribution-user--top, .reactionsBar, .message-actionBar, .bbCodeBlock").forEach(node => node.remove())
            document.querySelectorAll("article").forEach(node =>
                                                         {
                if(!node.querySelector("img, video")) node.remove()
            })

            for(let i=0;i<3;i++) {
                document.querySelectorAll(".bbWrapper").forEach(node => {
                    node.childNodes.forEach(cnode => {
                        if(!cnode.innerHTML) cnode.remove()
                        else if(!cnode.innerHTML.includes("img")) cnode.remove()
                    })
                })
            }*/

            document.querySelector("head style").innerHTML=document.querySelector("head style").innerHTML.replace(/\.lbContainer \{.*\}/,"")


            Array.from(document.getElementsByClassName('bbMediaWrapper')).forEach(function(tempix) {
                Array.from(tempix.getElementsByTagName('img')).forEach(function(vgn){
                    var htmlix="";
                    var videourl1=vgn.src.replaceAll('attachments/posters','video').replaceAll('.jpg','.mp4');
                    var videourl2=vgn.src.replaceAll('attachments/posters','video').replaceAll('.jpg','.mov');
                    var videourl3=vgn.src.replaceAll('attachments/posters','video').replaceAll('.jpg','.m4v');
                    htmlix+="<video controls height='360' style='width:100%; object-fit:contain'> <source src='"+videourl1+"' type='video/mp4'> <source src='"+videourl2+"' type='video/mp4'> <source src='"+videourl1+"' type='video/mp4'> <source src='"+videourl3+"' type='video/mp4'> </video>"
                    tempix.innerHTML=htmlix;
                    //https://cdn-videos.lpsg.com/data/attachments/posters/96689/96689401-08eafd4138f5223a9baa111250811dbc.jpg
                    //https://cdn-videos.lpsg.com/data/video/97093/97093021-14491058b48aa3d7974e171ae88e66a1.mp4
                })

            })

        });

    }

    

})();
