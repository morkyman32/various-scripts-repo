// ==UserScript==
// @name         Twitter - Remove bullshit
// @namespace    http://tampermonkey.net/
// @version      2024-10-16
// @description  No more reading bullshit on Twitter!
// @author       You
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        GM_addStyle
// @run-at        document-start
// ==/UserScript==

(function() {
    'use strict';
    var hide_tweet_text=true;
    var blur_notsoliked_accounts=true;
    var blur_verified_accounts=false;
    var hide_trending=true;
    var notsoliked_accounts=["PopBase"]
    var annoying_ad_accounts=["HeroWarsWeb","XDevelopers","duconspace"]

    // Selector variables
         // Ad tweets contain the text "Ad" right next to the hamburger button. This string must not be empty or invalid.
         var tweets_that_have_ads=`article[data-testid="tweet"]:has(div[class="css-175oi2r r-1kkk96v"] span)`

         // Verified tweets have a yellow checkmark next to their username
         var tweets_from_yellow_verified_accounts=`article[data-testid="tweet"]:has(svg[data-testid="icon-verified"]):has(linearGradient)`

         var tweets_from_any_verified_accounts=`article[data-testid="tweet"]:has(svg[data-testid="icon-verified"])`

    GM_addStyle(`

    aside[role="complementary"],
    ${tweets_that_have_ads},
    a[href="/i/premium_sign_up"],
    a[href="/jobs"],
    a[href="/i/grok"],
    a[href="/messages"],
    a[href="/i/verified-orgs-signup"],
    a[href="/i/monetization"],
    a[href="https://ads.x.com/?ref=gl-tw-tw-twitter-ads-rweb"],
    a[href="/follower_requests"] {
         display:none;
    }

    `)

    if(blur_verified_accounts) {
    GM_addStyle(`

    ${tweets_from_yellow_verified_accounts},
    ${tweets_from_any_verified_accounts} {
         filter:blur(15px);
         opacity:0.85;
    }

    ${tweets_from_yellow_verified_accounts}:hover,
    ${tweets_from_any_verified_accounts}:hover {
         filter:blur(0px);
         opacity:1;
    }

    `)
    }

    if(hide_trending) { GM_addStyle(`div[class="css-175oi2r r-kemksi r-1kqtdi0 r-1867qdf r-1phboty r-rs99b7 r-1ifxtd0 r-1udh08x"]:has(div[aria-label="Timeline: Trending now"]) {display:none;}`) }

    if(hide_tweet_text) {
        GM_addStyle(`
        article.css-175oi2r div[data-testid="tweetText"] span.css-1jxf684.r-qvutc0,
        article.css-175oi2r div[data-testid="tweetText"] img,
        div[data-testid="cardPoll"],
        aarticle[data-testid="tweet"] :has(div[dir="ltr"][class="css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-16dba41"])
        {display:none;}
        `);
    }

    if(blur_notsoliked_accounts) {
         notsoliked_accounts.forEach(notsoliked_account => {
              GM_addStyle(`
              article[data-testid="tweet"] :has(a[href^="/${notsoliked_account}"]) {
                  filter:blur(15px);
                  opacity:0.85;
              }

              article[data-testid="tweet"] :has(a[href^="/${notsoliked_account}"]):hover {
                  filter:blur(0px);
                  opacity:1;
              }


              `);
         })
    }

    annoying_ad_accounts.forEach(notsoliked_account => {
        GM_addStyle(`
              article[data-testid="tweet"] :has(div[data-testid="User-Name"] a[href="/${notsoliked_account}"]) {
                  display:none;
              }
              `);
    })


})();
