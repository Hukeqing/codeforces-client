let basic = require('./basic')
let request = require('request')
let cheerio = require('cheerio')

module.exports = {
    startSession: function (callback) {
        let opts = {
            url: basic.url,
            method: 'GET',
            headers: {
                'User-Agent': basic.userAgent
            }
        }
        try {
            request(opts, (e, r, b) => {
                try {
                    const $ = cheerio.load(b)
                    const userCheerio = cheerio.load($('div[class="lang-chooser"]').html())
                    let smallCheerio = cheerio.load(userCheerio(userCheerio('div')[1]).html())
                    let user = smallCheerio('a')
                    callback(false, $('meta[name="X-Csrf-Token"]').prop('content'),
                        [smallCheerio(user[0]).attr('href'),
                            smallCheerio(user[0]).text(),
                            smallCheerio(user[1]).attr('href')]
                    )
                } catch (e) {
                    console.log('connection error')
                    callback(true, 0)
                }
            })
        } catch (e) {
            console.log('connection error')
            callback(true, 0)
        }
    },

    getLoginCookie: function (cookie, xCsrfToken, email, password, callback) {
        let data = {
            handleOrEmail: email,
            password: password,
            action: 'enter',
            csrf_token: xCsrfToken,
            ftaa: '',
            bfaa: '',
        };

        let opts = {
            url: basic.url + 'enter',
            method: 'POST',
            headers: {
                'User-Agent': basic.userAgent,
                // 删了一大堆东西
            },
            form: data
        }

        try {
            // eslint-disable-next-line no-unused-vars
            request(opts, (e, r, b) => {
                try {
                    callback(e)
                } catch (e) {
                    console.log('login error')
                    callback(true)
                }
            })
        } catch (e) {
            console.log('login error')
            callback(true, 0)
        }
    }
}
