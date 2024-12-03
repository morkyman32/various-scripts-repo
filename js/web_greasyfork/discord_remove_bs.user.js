// ==UserScript==
// @name         Discord - Remove bullshit
// @namespace    http://tampermonkey.net/
// @version      2024-10-16
// @description  try to take over the world!
// @author       You
// @match        https://discord.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`

    .message_d5deea {min-height:0px !important;}

    li[id^="chat-messages-"] .messageContent_f9f2ca span,
    .embedDescription_b0068a span,
    .avatarDecoration_f9f2ca,
    .username_f9f2ca,
    img.avatar_f9f2ca,
    .replyAvatar_f9f2ca,
    .typing_d7ebeb,
    .newMemberBadge_ed263a,
    .reactions_ec6b19,
    .botTagCozy_f9f2ca,
    .repliedMessage_f9f2ca,
    .roleIcon_afae9f,
    .clickableSticker_a1debe,
    .inline,
    .message_d5deea:not(:has( .visualMediaItemContainer_cda674, .embed_b0068a ))

    { display:none !important; }

    `)


})();
