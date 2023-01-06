// ==UserScript==
// @name         outchain
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  显示论坛上的音乐外链播放器
// @author       Aozaki
// @match        https://*.keyfc.net/bbs/showtopic*
// @match        https://*.keyfc.com/bbs/showtopic*
// @grant        none
// ==/UserScript==

function checkURL(url) {
    let url_list = ["//music.163.com/outchain", "music.163.com/outchain", "https://music.163.com/outchain",
        "https://music.163.com/#/song?", "https://music.163.com/song?", "https://y.music.163.com/m/song?",
        "https://music.163.com/#/playlist?", "https://music.163.com/playlist?", "https://y.music.163.com/m/playlist?",
        "https://music.163.com/#/album?", "https://music.163.com/album?", "https://y.music.163.com/m/album?",
        "https://music.163.com/#/djradio?", "https://music.163.com/djradio?", "https://y.music.163.com/m/djradio?"]
    if (typeof (url) == "string") {
        if (url.includes("music")) {
            for (let i = 0; i < url_list.length; i++) {
                if (url.indexOf(url_list[i]) == 0) {
                    if (i < 3) { return 17 }
                    if (i < 6) { return 2 }
                    if (i < 9) { return 0 }
                    if (i < 12) { return 1 }
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

function create_iframe(url, t) {
    let iframe = ''
    if (t == 17) {
        let height = parseInt(searchURL(url, "height")) + 20
        iframe = `<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width="100%" height="` + height + `" src="` + url + `"></iframe>`
    }
    else {
        let id = searchURL(url, "id")
        let height = (t == 2) ? 66 : 430;
        iframe = `<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width="100%" height="` + (parseInt(height) + 20) + `" src="//music.163.com/outchain/player?type=` + t + `&id=` + id + `&auto=1&height=` + height + `"></iframe>`
    }
    return iframe
}

(function () {
    let msg_list = document.getElementsByClassName("t_msgfont")

    for (let i = 0; i < msg_list.length; i++) {
        let id_list = []
        let obj_list = msg_list[i].getElementsByTagName("object")
        for (let j = 0; j < obj_list.length; j++) {
            let url = obj_list[j].firstChild.value
            let t = checkURL(url)
            if (t >= 0) {
                let iframe = create_iframe(url, t)
                let id = searchURL(url, "id")
                id_list.push(id)
                obj_list[j].innerHTML = iframe
            }
        }

        let a_list = msg_list[i].getElementsByTagName("a")
        for (let j = 0; j < a_list.length; j++) {
            let url = a_list[j].href
            let t = checkURL(url)
            if (t >= 0 && !id_list.includes(searchURL(url, "id"))) {
                let iframe = create_iframe(url, t)
                a_list[j].innerHTML += iframe
            }
        }
    }
})();