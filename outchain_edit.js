// ==UserScript==
// @name         outchain edit
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  编辑音乐外链
// @author       Aozaki
// @match        https://*.keyfc.net/bbs/postreply.aspx?*
// @match        https://*.keyfc.net/bbs/editpost.aspx?*
// @match        https://*.keyfc.com/bbs/postreply.aspx?*
// @match        https://*.keyfc.com/bbs/editpost.aspx?*
// @grant        none
// ==/UserScript==

function checkURL(url) {
    let url_list = ['//music.163.com/outchain', 'music.163.com/outchain', 'https://music.163.com/outchain',
        'https://music.163.com/#/song?', 'https://music.163.com/song?', 'https://y.music.163.com/m/song?',
        'https://music.163.com/#/playlist?', 'https://music.163.com/playlist?', 'https://y.music.163.com/m/playlist?', 'https://music.163.com/#/my/m/music/playlist?',
        'https://music.163.com/#/album?', 'https://music.163.com/album?', 'https://y.music.163.com/m/album?',
        'https://music.163.com/#/djradio?', 'https://music.163.com/djradio?', 'https://y.music.163.com/m/djradio?']
    if (typeof url == 'string') {
        if (url.includes('music')) {
            for (let i = 0; i < url_list.length; i++) {
                if (url.indexOf(url_list[i]) == 0) {
                    if (i < 3) { return 17 }
                    if (i < 6) { return 2 }
                    if (i < 10) { return 0 }
                    if (i < 13) { return 1 }
                    return 4
                }
            }
        }
    }
    return -1
}

function searchURL(url, param) {
    let searchParams = new URLSearchParams(url.split('?')[1])
    return searchParams.get(param)
}

function addMusic() {
    let url = prompt('歌曲网址')
    let t = checkURL(url)
    if (t >= 0) {
        let name = prompt('歌曲名')
        let id = searchURL(url, 'id')
        let height = (t == 2) ? 66 : 430;
        let outchain = 'https://music.163.com/outchain/player?type=' + t + '&id=' + id + '&auto=1&height=' + height
        switch (t) {
            case 2: url = 'https://music.163.com/#/song?id=' + id; break;
            case 0: url = 'https://music.163.com/#/playlist?id=' + id; break;
            case 1: url = 'https://music.163.com/#/album?id=' + id; break;
            case 4: url = 'https://music.163.com/#/djradio?id=' + id; break;
        }
        if (name == '' || name == null) { alert('[url]' + url + '[/url][flash]' + outchain + '[/flash]') }
        else { alert('[url=' + url + ']' + name + '[/url][flash]' + outchain + '[/flash]') }
    }
}

(function () {
    document.getElementById('moreconf').innerHTML += '<a href="javascript:;" id="addmusic">添加音乐</a>'
    document.getElementById('addmusic').addEventListener('click', addMusic, false)
})();