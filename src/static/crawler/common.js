let basic = require('./basic')
let request = require('request')
let cheerio = require('cheerio')

module.exports = {
    getXCsrfToken: function (callback) {
        if (basic.xCsrfToken !== '') {
            callback(false, basic.xCsrfToken)
            return
        }
        let opts = {
            url: basic.url + 'enter',
            method: 'GET',
            headers: {
                'User-Agent': basic.userAgent
            }
        }
        try {
            request(opts, (e, r, b) => {
                try {
                    const $ = cheerio.load(b)
                    let xCsrfToken = $('meta[name="X-Csrf-Token"]').prop('content');
                    callback(false, xCsrfToken)
                    console.log(xCsrfToken)
                } catch (e) {
                    console.log('connection error')
                }
            })
        } catch (e) {
            console.log('connection error')
            callback(true, 0)
        }
    },

    getLoginCookie: function (xCsrfToken, email, password, callback) {
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
            },
            form: data
        }

        try {
            // eslint-disable-next-line no-unused-vars
            request(opts, (e, r, b) => {
                try {
                    const $ = cheerio.load(b)
                    // update xCsrfToken
                    basic.xCsrfToken = $('meta[name="X-Csrf-Token"]').prop('content')
                    console.log(basic.xCsrfToken)

                    const userCheerio = cheerio.load($('div[class="lang-chooser"]').html())
                    let smallCheerio = cheerio.load(userCheerio(userCheerio('div')[1]).html())
                    let user = smallCheerio('a')
                    callback(e,
                        [smallCheerio(user[0]).attr('href'),
                            smallCheerio(user[0]).text(),
                            smallCheerio(user[1]).attr('href')]
                    )
                } catch (e) {
                    console.log('login error')
                    callback(true, 0)
                }
            })
        } catch (e) {
            console.log('login error')
            callback(true, 0)
        }
    },

    logout: function (logoutUrl, callback) {
        let opts = {
            url: basic.url + logoutUrl,
            method: 'GET',
            headers: {
                'User-Agent': basic.userAgent,
            },
        }
        try {
            // eslint-disable-next-line no-unused-vars
            request(opts, (e, r, b) => {
                callback(false)
            })
        } catch (e) {
            console.log('logout error')
            callback(true)
        }
    }
}
