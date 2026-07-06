// ==UserScript==
// @name         Krunker Game.js Grabber
// @namespace    https://github.com/levifrsn63/embarkdev-internal
// @version      1.0.0
// @description  Intercepts and downloads Krunker's game.js for deobfuscation
// @author       embarkdev
// @match        *://krunker.io/*
// @match        *://*.browserfps.com/*
// @exclude      *://krunker.io/social*
// @exclude      *://krunker.io/editor*
// @exclude      *://krunker.io/viewer*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @run-at       document-start
// @noframes
// ==/UserScript==

(function() {
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.tagName === 'SCRIPT' && node.src && node.src.includes('/static/index-')) {
                    observer.disconnect();
                    const scriptUrl = node.src;
                    console.log('🎯 Found game script:', scriptUrl);
                    fetch(scriptUrl).then(r => r.text()).then(code => {
                        const blob = new Blob([code], { type: 'text/javascript' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'krunker_game_obfuscated.js';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        console.log('✅ Downloaded! Now paste into https://webcrack.netlify.app/');
                    }).catch(e => console.error('Failed:', e));
                    return;
                }
            }
        }
    });
    observer.observe(document, { childList: true, subtree: true });
})();
