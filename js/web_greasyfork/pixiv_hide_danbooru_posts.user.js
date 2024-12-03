// ==UserScript==
// @name         Pixiv - Hide Posted Danbooru posts
// @namespace    http://tampermonkey.net/
// @version      2024-10-24
// @description  try to take over the world!
// @author       mdpakk
// @match        https://www.pixiv.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixiv.net
// @grant        GM_addStyle
// @run-at        document-start
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
    .sc-9y4be5-2:not(.sc-9y4be5-2:has(.sc-rp5asc-5.hHNegy)):has(.pisas-dummydiv a[style^="color:green"]) {
        opacity:0.5;
        filter:brightness(0.7);
        transition:opacity 0.5s, filter 0.3s;
    }
    .sc-9y4be5-2:not(.sc-9y4be5-2:has(.sc-rp5asc-5.hHNegy)):has(.pisas-dummydiv a[style^="color:green"]):hover {
        opacity:1;
        filter:brightness(1);
    }
    `);

    // Your code here...
})();
