// ==UserScript==
// @name        Global configs
// @namespace   Violentmonkey Scripts
// @match        *://*/*
// @grant       none
// @version     1.0
// @author      -
// @description 11/29/2024, 8:29:50 AM
// @run-at      document-start
// @grant    GM_addStyle
// ==/UserScript==

(() => {
    if (window.location.host=="discord.com") {
        GM_addStyle(`
                @import url(https://xyzenix.github.io/XYZenixThemes/DTM-08-V2/dtm-08-v2.css);
        `);
    }
})();
